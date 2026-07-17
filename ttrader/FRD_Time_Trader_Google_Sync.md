# Functional Requirements Document — Time Trader: Google Calendar/Tasks Productivity Sync

**Version:** 1.0 (Draft)
**Date:** 2026-07-17
**Owner:** Lord
**Status:** Pre-development — for task tracking during build

---

## 1. Purpose

Extend the existing hour-block task tracker (`index.html`) so that hour-block assignments and completions sync with the user's real Google Calendar and Google Tasks. The end goal: at the end of any day, the user can see planned hours vs. completed hours and get a productivity percentage, computed from live Google data — not from anything stored in the browser.

## 2. Goals

1. Eliminate data loss on cookie/cache clear — Google account becomes the sole source of truth.
2. Let the user create, resize, and complete hour-blocks from the webpage and see those changes reflected in the real Google Calendar / Google Tasks apps, and vice versa.
3. Produce an accurate daily/weekly productivity report (planned vs. completed hours).
4. Ship Phase 1 with **no backend and no database** — client-only, calling Google APIs directly from the browser.

## 3. Scope

### In scope — Phase 1 (client-only)
- Google Sign-In from the browser (no server).
- Creating linked Calendar Event + Google Task pairs for each hour-block.
- Reading back Calendar Events + Tasks on load and on a refresh interval, merging them client-side.
- Computing productivity metrics at runtime (nothing persisted except an optional local cache for speed).
- Reassigning/deleting hour-blocks reflected as real Calendar event patches/deletes.
- Marking complete in the webpage reflected as a real Google Task status change.

### Out of scope — Phase 1 (deferred to Phase 2, needs a backend)
- Refresh-token persistence (silent login across days without re-consent).
- Real-time push via Calendar webhooks (`events.watch`) — Phase 1 uses polling only.
- Server-stored historical analytics / trends beyond what's visible from Google's own data at query time.
- Multi-device conflict resolution beyond "last write wins."

## 4. Assumptions & Constraints

- User has a Google account and grants `calendar.events` and `tasks` OAuth scopes.
- Without a refresh token (not available to public/client-only OAuth apps), the user may need to re-authenticate (often silently, sometimes with a click) when the access token expires (~1 hour) or the browser session ends.
- Google Tasks API does not support custom/extended properties or push notifications — this shapes the linking and sync design below.
- Single-user, single-account tool — no multi-tenant concerns.

## 5. Key Architecture Decisions (locked in for Phase 1)

| # | Decision | Rationale |
|---|---|---|
| D1 | Auth via Google Identity Services token client (`initTokenClient`), not classic OAuth code flow | No backend available to hold a client secret or refresh token |
| D2 | One Calendar Event per hour-block (not one event per task) | Matches existing drag/drop-a-single-block UI; makes reassignment a single event patch |
| D3 | Task ↔ Event linked by storing Task ID in event's `extendedProperties.private`, and Event ID inside the Task's `notes` field | Calendar supports extended properties; Tasks doesn't, so the reverse pointer has to live in a visible-but-marked field |
| D4 | Dedicated Google Tasks list (e.g. "Time Trader") created once via `tasklists.insert` | Keeps the app's tasks isolated from the user's personal Google Tasks |
| D5 | All app-created events tagged `appSource=time-trader` in extended properties | Lets `events.list` filter server-side instead of pulling the full calendar |
| D6 | Two-way sync = polling for both Calendar and Tasks in Phase 1 (no webhook) | Tasks API has no push support at all; Calendar webhooks need a public server we don't have yet |
| D7 | Refresh triggers: page load, tab regains visibility, network regained, after any local edit, and a 30–60s interval while open | Keeps data fresh without a backend push mechanism |
| D8 | Productivity calc distinguishes upcoming / in-progress / done / missed, not just done/not-done | A block scheduled later today isn't "missed" yet |
| D9 | Optional `localStorage` cache is stale-while-revalidate only, never authoritative | Preserves the "cookie clear = no real data loss" guarantee |

## 6. Success Metrics (product-level)

| Metric | Target | How verified |
|---|---|---|
| Data survivability | 0% data loss after clearing all browser storage and reloading | Manual test: clear storage, reload, confirm all tasks/events/completions reappear from Google |
| Sync latency (webpage → Google) | Change visible in real Google Calendar/Tasks app within 5s of the in-app action | Manual timing test on block create/edit/complete |
| Sync latency (Google → webpage) | Change made directly in Google apps visible in webpage within one poll cycle (≤60s) or on next page focus | Manual test: edit in Google Calendar app, switch back to tab, confirm update |
| Productivity calc accuracy | Matches manual hand-count of a test day's events/tasks, 100% match | Spot-check against 3+ test days with mixed done/missed/upcoming blocks |
| Load performance (cached) | Visible UI in <1s using local cache before background refresh completes | Browser timing / manual observation |
| Load performance (cold, no cache) | Full Google fetch + first render in <3s on normal broadband | Manual timing test |
| API quota safety | Stays under Google's free daily quota for expected single-user daily usage | Track request count per session during testing; keep well under documented quota |
| Auth friction | Silent re-auth succeeds (no visible popup) in the common case of an active Google browser session | Manual test across a few days of normal use |

## 7. Functional Requirements & Task Tracker

Status values: **Not Started / In Progress / Blocked / Done**. Priority: **P0** = required for Phase 1 launch, **P1** = should-have, **P2** = nice-to-have, **Backlog** = Phase 2 (needs backend).

### 7.0 Baseline (already built, pre-Google-sync)

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-0.1 | Hour-block pool, mint/allocate blocks to tasks | P0 | Done | Existing app behavior verified working |
| FR-0.2 | Task ledger: create, complete, delete, reorder via drag | P0 | Done | Existing app behavior verified working |
| FR-0.3 | Per-task session countdown + alarm | P1 | Done | Existing app behavior verified working |
| FR-0.4 | LocalStorage persistence of local-only state | P1 | Done | Refresh does not lose in-progress local state |

### 7.1 Authentication

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-1.1 | Integrate Google Identity Services token client; "Sign in with Google" button | P0 | Not Started | User obtains a valid access token after consent, scopes = calendar.events + tasks |
| FR-1.2 | Silent token renewal on expiry (`prompt: ''`) with graceful fallback to visible consent | P0 | Not Started | Token refresh works without popup when Google session is active; falls back cleanly otherwise |
| FR-1.3 | Sign-out control that revokes/clears the in-memory token | P1 | Not Started | After sign-out, no further API calls are made until re-auth |
| FR-1.4 | Restrict OAuth client to minimal scopes and set Authorized JS origins | P0 | Not Started | Google Cloud Console config verified; no broader scopes requested than needed |

### 7.2 Setup / One-Time Provisioning

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-2.1 | On first sign-in, check for/create dedicated "Time Trader" Google Tasks list | P0 | Not Started | Tasklist exists in user's account after first run; not recreated on subsequent runs |
| FR-2.2 | Store the tasklist ID for the session (memory or cache, not authoritative) | P0 | Not Started | Correct tasklist targeted for all Task API calls in session |

### 7.3 Hour-Block ↔ Google Create/Link

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-3.1 | Creating an hour-block creates a linked Google Task (status `needsAction`) in the dedicated list | P0 | Not Started | New Task visible in real Google Tasks app immediately |
| FR-3.2 | Creating an hour-block creates a Calendar Event with correct start/end and `appSource` + `taskId` extended properties | P0 | Not Started | New Event visible in real Google Calendar immediately with correct time slot |
| FR-3.3 | Event ID written back into the linked Task's `notes` field as a hidden marker | P0 | Not Started | Reverse lookup (task → event) succeeds in merge logic |
| FR-3.4 | Rollback/cleanup if Event creation fails after Task creation succeeds | P1 | Not Started | No orphan Tasks left without a linked Event after a simulated failure |

### 7.4 Reassignment / Editing

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-4.1 | Dragging/resizing an hour-block patches the linked Event's start/end via `events.patch` | P0 | Not Started | Change reflected in real Google Calendar within 5s |
| FR-4.2 | Deleting an hour-block deletes the linked Event and Task | P0 | Not Started | Both removed from real Google account |
| FR-4.3 | Renaming a task updates the linked Event summary and Task title | P1 | Not Started | Both titles match after edit |

### 7.5 Completion Sync

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-5.1 | Marking complete in webpage sets linked Task `status: completed` | P0 | Not Started | Task shows checked in real Google Tasks app |
| FR-5.2 | Un-marking complete in webpage reverts Task `status: needsAction` | P1 | Not Started | Task shows unchecked in real Google Tasks app |
| FR-5.3 | Task completed directly in Google Tasks app is detected on next poll and reflected in webpage UI | P0 | Not Started | Webpage checkbox updates within one poll cycle without manual refresh |

### 7.6 Fetch, Merge & Refresh

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-6.1 | Fetch today's/date-range Events filtered by `privateExtendedProperty=appSource=time-trader` | P0 | Not Started | Only app-created events returned, not user's unrelated calendar entries |
| FR-6.2 | Fetch Tasks from the dedicated tasklist | P0 | Not Started | Only app-created tasks returned |
| FR-6.3 | Merge Events + Tasks client-side using the two-way ID link | P0 | Not Started | Every event correctly paired with its task (and vice versa) in test data |
| FR-6.4 | Refresh triggers: page load, edit, tab visibility regain, network regain, 30–60s interval | P0 | Not Started | All five triggers verified to cause a fetch in manual testing |
| FR-6.5 | In-flight request guard (skip overlapping fetches) | P1 | Not Started | No duplicate/overlapping API calls observed under rapid trigger firing |
| FR-6.6 | Incremental fetch using Calendar `syncToken` and Tasks `updatedMin` after first full load | P1 | Not Started | Payload size drops after first load; verified via network inspection |

### 7.7 Productivity Calculation

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-7.1 | Classify each block as upcoming / in-progress / done / missed based on current time + completion status | P0 | Not Started | Correct classification verified against test cases spanning all four states |
| FR-7.2 | Compute planned hours, completed hours, and productivity % per day, excluding upcoming/in-progress from the "missed" penalty | P0 | Not Started | Matches manual hand-calculation for test days |
| FR-7.3 | Display daily productivity summary (e.g., "4h planned, 2h done, 50%") in the webpage UI | P0 | Not Started | Summary visible and updates on refresh |
| FR-7.4 | Weekly/rolling view aggregating multiple days | P2 | Not Started | Correct multi-day aggregation verified against test data |

### 7.8 Performance & Resilience

| ID | Task | Priority | Status | Success Metric |
|---|---|---|---|---|
| FR-8.1 | Stale-while-revalidate cache in `localStorage` for instant render before live fetch completes | P1 | Not Started | UI populates in <1s from cache, then updates silently once fetch resolves |
| FR-8.2 | Graceful error/empty states if Google API call fails (offline, quota, revoked access) | P1 | Not Started | UI shows a clear message instead of breaking, on simulated API failure |
| FR-8.3 | `fields` parameter used on all API calls to limit response payload | P2 | Not Started | Verified reduced payload size vs. unfiltered calls |

### 7.9 Phase 2 — Backlog (requires backend)

| ID | Task | Priority | Status |
|---|---|---|---|
| FR-9.1 | Backend OAuth code flow with refresh-token storage (no re-consent needed) | Backlog | Not Started |
| FR-9.2 | Calendar `events.watch` webhook for real push updates | Backlog | Not Started |
| FR-9.3 | Server-side database for historical analytics beyond live Google data | Backlog | Not Started |
| FR-9.4 | Multi-device conflict handling | Backlog | Not Started |

## 8. Risks & Open Questions

| Risk/Question | Notes |
|---|---|
| Silent re-auth may fail in browsers with strict third-party cookie blocking (Safari) | May need a visible "Session expired, click to continue" prompt as fallback |
| No refresh token means the app can't do anything while the tab is closed | Acceptable for Phase 1 given "no backend" constraint; revisit in Phase 2 |
| Google API quota under sustained 30–60s polling | Needs monitoring during real usage; sync tokens (FR-6.6) mitigate this |
| Task notes marker could be visible/confusing if user opens the Task in the real Google Tasks app | Consider a low-visibility format for the embedded event-ID marker |

---

*This document tracks Phase 1 build status. Update the Status column per row as work progresses; re-derive the overall Phase 1 "done" state from the P0 rows in sections 7.1–7.7.*
