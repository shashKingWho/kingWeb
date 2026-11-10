# Claude Progress Log — kingWeb

This file is maintained by Claude Code across sessions to track ongoing work on this
website project. Distinct from `PROGRESS.md` (the user's own commit-message log), this
file logs: progress notes, file modifications, asset updates, decisions made, and task
history, so future sessions have full context without re-deriving it.

Newest entries go on top.

(Renamed from `CLAUDE_PROGRESS.md` to `New_PROGRESS.md` on 2026-11-10 at the user's
request — same file, same purpose, just the new name going forward.)

---

## 2026-11-11 (14) — em-dash cleanup across site text + Enmeshment→Project Lyari swap

- User asked to find/replace " — " (em-dash) throughout the site's text with
  "something better... like ... or :-" — 220 instances total across `games.html`
  (44), `index.html` (12), `vr-ar.html` (6), and `public/blog/lyari-posts.js`
  (158, since that's almost entirely the user's own long-form devlog prose which
  leans heavily on em-dashes stylistically).
- Did this with a small Node script (not committed, scratch only) rather than
  by hand given the volume, using an ordered rule set: (1) markdown table
  placeholder cells (`| — |`) → `| - |`; (2) blockquote attribution lines
  (`> — shashking, developer`) → plain hyphen; (3) known title-suffix patterns
  (`— Updated`, `— Version 1/2`, `— Extended Mix`) → parenthetical
  (`(Updated)`, `(Version 1)`, etc.); (4) short paired-dash asides
  (`word — aside — word`) → parenthetical (`word (aside) word`); (5) every
  remaining single `—` → `, ` if the following clause opens with a conjunction
  (because/but/and/so/while/until/etc.), else `: `.
- **Caught and fixed two bugs the automated pass introduced** — flagging this
  so a future session doesn't trust a bulk script like this blindly:
  - A markdown table row with two adjacent placeholder cells
    (`| Knife | — | — | ... |`) got mangled into `| Knife | - |: | ... |`
    because the table regex only matches non-overlapping `| — |` pairs, so the
    second cell's leading `|` had already been consumed by the first match and
    fell through to the generic single-dash rule instead. Fixed by hand.
  - `"...Chamkila Dhaba among them — alongside mobile AR games..."` (in both
    `games.html`'s about-dev bio and the matching paragraph on `index.html`)
    became `"...among them: alongside..."` — grammatically broken, since a
    colon can't sensibly introduce "alongside." Fixed by hand to a comma.
  - After those two fixes, spot-checked all 10 Lyari blog titles, the Gerabill/
    Enmeshment devlog title lists, and the bio paragraphs on both pages — all
    read correctly. Did not re-read every one of the ~150 in-body replacements
    in `lyari-posts.js` line by line; the rule set is sound for ordinary prose
    em-dashes, but if something reads oddly in there later, that's why.
- Also, mid-task, user asked to swap the **Enmeshment** card on `index.html`'s
  Games grid for **Project Lyari** (title, description, and a Google Play link)
  — done; `games.html`'s own library still keeps Enmeshment as its own entry,
  only `index.html`'s homepage grid changed.

---

## 2026-11-11 (13) — index.html: Games collage redone as a floated clip, not a side-by-side split

- User pushed back hard on the previous round's layout: a rigid 2-column grid
  (text | image) read as "shoved to the side," not a collage woven into the text,
  and nothing was clickable through to `games.html` where the dev journal
  actually lives.
- Reworked `.games-feature` from a CSS grid into a single flowing text column;
  `.games-collage` moved from a sibling column into the text flow itself
  (inserted right after the `<h3>`, before the paragraphs) and changed from
  `float: right` *dividing* the layout to `float: right` *within* the paragraph
  flow — text now genuinely wraps around it (magazine/collage style) instead of
  sitting in a separate lane. `clear: both` added to `.icon-links` so the link
  list still drops cleanly below once the floated image's height clears.
- Added a `.collage-chip` — shashKing's portrait, circular, rotated, intentionally
  overflowing the frame's bottom-right corner (`.games-collage` now
  `overflow: visible` at the outer level with a new nested `.collage-inner`
  holding the `overflow: hidden` mosaic/ribbon/lower-third) — a small collage-like
  "breaking the frame" detail per the complaint that it wasn't collaged enough.
- Click-through: the entire `.games-collage` is now a single `<a href="games.html">`
  wrapping the ribbon, mosaic, lower-third, and portrait chip — clicking anywhere
  on the visual (including any individual image inside it) now takes the user to
  `games.html`, where the Project Lyari dev journal actually lives, per the user's
  explicit ask ("if clicked or images clicked... taken to Game.html").
- Removed the leftover duplicate `.games-collage` block that was accidentally left
  in place after the restructure (same markup had been both moved and left behind
  — caught and cleaned up before finishing).

---

## 2026-11-10 (12) — index.html: Games section gets a collage + icon links + lower-third

- User asked for the index page's Games section text to get icons, an image
  collage, and the same "lower third and everything" treatment used on
  `games.html`'s Project Lyari featured hero — using the images already cached
  from `EXTRA/Project-Lyari` (via `public/blog/lyari/`).
- Restructured the old centered `.games-intro` text block into a two-column
  `.games-feature` (text left, `.games-collage` media right):
  - Text side: same bio/narrative copy, now with small colored `.icon-dot`
    bullets (circle/circle/square, cycling b1/b2/b3) in front of each link
    instead of plain `<br><br>`-separated links.
  - Media side: a 6-image Bauhaus mosaic grid (`recruit.png`, `civilians.png`,
    `molotov.png`, `gandhigiri.jpg`, `victory-at-low-hp.jpg`,
    `hafta-vasooli.jpg` — the same Project Lyari icon set already cached for the
    blog digest) in an asymmetric CSS grid (one large tile + five smaller ones),
    with a diagonal pulsing "Now Building" corner ribbon and a slide-in
    lower-third ("Project Lyari — Gang-war simulation, 8 months deep") — ported
    directly from `games.html`'s `.featured-ribbon`/`.lower-third` component
    (same keyframes, renamed with a `collage-` prefix since index.html is a
    separate file with its own `<style>` block, no shared CSS between pages).
  - Reused the already-cached Project Lyari images rather than re-fetching or
    re-copying from `EXTRA/` — they already live under `public/blog/lyari/` from
    the games.html blog work, so just referenced from there.
- Did not touch the 3 `proj-card` game entries (Do You Popcorn, Enmeshment,
  Dinosaur Day) below this block, or the Music section — scoped to the Games
  section intro only, as asked.

---

## 2026-11-10 (11) — index.html: album art + track duration on the Music cards

- Looked up official metadata via the public iTunes Search API
  (`itunes.apple.com/search?term=...&entity=song`) to get exact track duration and
  high-res cover art for both "Lauki Mil Gayi Saste Mein" releases, matched against
  the Apple Music collection IDs already linked on the site (`6775575658` for the
  original, `6826776075` for the Extended Mix) to make sure I grabbed the right
  release — there were two different unrelated search results both named "Lauki
  Mil Gayi Saste Mein" with different collection IDs; only trusted the one whose
  `collectionId` matched the existing link.
  - Original: 35,600 ms → displayed as `0:36`.
  - Extended Mix: 186,760 ms → displayed as `3:07`.
  - Artwork fetched at `600x600bb.jpg` (the standard iTunes artwork upscale trick:
    swap the `100x100bb.jpg` suffix on `artworkUrl100` for a larger size) and
    cached locally to `public/music/lauki-original.jpg` /
    `public/music/lauki-extended.jpg`.
- Replaced the old plain-link `proj-card`s and the dark `.music-release-banner`
  with a unified `.music-tracks` → `.track-card` component (album art + title +
  duration pill + blurb + platform links), one card per release, side by side.
  The Extended Mix keeps the dark "featured" treatment the banner had.
- Removed the now-unused `.music-release-banner`/`.music-release-links` CSS rules
  that this replaced.
- Did not add art/duration to the embedded Spotify playlist section — that's
  Spotify's own embed widget and already shows per-track art/duration/canvas
  natively, nothing to add there.

---

## 2026-11-10 (10) — index.html: Music section rebuilt (playlists, Spotify embed, extended mix)

- The existing `#music` section (index.html) only covered one single's original
  release across 3-4 platform links. User wanted it to actually show where to
  find shashKing's music broadly (playlists, artist/channel pages), a featured
  Spotify playlist that uses Spotify's animated canvas cover art on some tracks
  (e.g. "De Dastak"), and a highlight for a new Extended Mix release.
- Added, in order: a `.music-platforms` link row (Spotify playlist, JioSaavn
  artist page, YouTube Music channel, Amazon Music artist page, Apple Music
  artist page) → an embedded Spotify playlist iframe (`.music-playlist-feature`,
  standard `open.spotify.com/embed/playlist/<id>` embed — Spotify's own player
  renders canvas video covers when a track has one, nothing on this site needs to
  fake that) → a dark `.music-release-banner` highlighting "Lauki Mil Gayi Saste
  Mein — Extended Mix" with its 4 platform links → kept the original 3 `proj-card`s
  (original single + about) unchanged below.
- Did not touch `games.html`/`vr-ar.html` this round — this was index.html only.

---

## 2026-11-10 (9) — vr-ar.html: XR Fundamentals Challenge feature card

- Fetched `https://shashking.itch.io/xr-fundamentals-challenge` (same `curl` + UA
  technique) and added a new "XR Research" section to `vr-ar.html` for it — the
  game is an educational AR/VR spatial-computing quiz built for the Games for
  Change initiative, submitted to Flexible Jam 2025, which didn't fit cleanly into
  the existing binary VR/AR sections so it got its own.
- New `.xr-feature-card` component (cover image + body: status pill, description,
  a pull-quote from the game's "Invisible Button Study" blurb, tag list, itch.io
  link). Cover image cached to `public/vr-ar/xr-fundamentals.png` (same
  cache-locally pattern as the games.html work).
- Did not touch the two existing placeholder VR cards (Copps Donut Know, Adventure
  of Cihlo) — they still link to the generic itch.io root. Noticed while fetching
  shashKing's full itch.io profile that there are ~20 more published games not yet
  reflected anywhere on this site (dark-hunch-vr, lino-adventures-vr,
  xombie-vr-help-wanted, sheru-comic-ar, hiddenwars-space-crush, cage-of-stars,
  climbandgo, dishoom, godmen, mahashakti, etc.) — flagging this as a known gap,
  not acted on since it wasn't asked for this turn.

---

## 2026-11-10 (8) — bio/metadata pass: games.html, index.html, sitemap.xml, JSON-LD

- User supplied a personal bio (shashKing / Shashaank Singh — indie game developer,
  technical product manager, XR architect, multimedia creator) plus a narrative:
  since watching *Dhurandhar Part 1*, he's been almost entirely devoted to Project
  Lyari, pausing other work including the AR games, with only a couple of game
  jams taken as a creative break (mainly to keep promoting his own "QWERTY Game
  Genre" / K Board concept) before returning to Lyari.
- Added this (as original prose, not the bullet-list phrasing verbatim) in the two
  places asked for:
  - `games.html` — new `.about-dev` panel at the bottom of the `#platforms`
    section (portrait + two paragraphs + CTA links: Deez Gunz on itch.io, "Play
    Project Lyari" reusing the existing `data-open-game` hook, and a `#blog` anchor
    to the dev journal).
  - `index.html` — two new paragraphs added to the existing `.games-intro` block
    in the `#games` section (same copy, no portrait — that section is text-only).
  - Confirmed `Deez Gunz` is a real published game (`shashking.itch.io/deezgunz`)
    by checking shashKing's full itch.io profile before linking it — profile
    scrape also surfaced ~20 other published titles not yet on this site (see next
    entry).
- Added structured data (JSON-LD) to `games.html`'s `<head>`: a `Person` block
  (name, alternateName "shashKing", jobTitle, bio description, `sameAs` socials)
  and a `Blog` block listing all 10 Project Lyari posts as `BlogPosting` entries —
  this is the "metadata" half of the ask. Followed the existing JSON-LD convention
  already in this repo (`dhurandar-fan-quiz/index_toFix.html`) for `@type: Person`
  shape.
- Created `sitemap.xml` at the project root (none existed before) covering all main
  pages plus the 10 Project Lyari blog posts as `games.html#row-lyari-N` anchor
  URLs, using `https://shashking.com/` as the canonical domain (found in
  `index.html`'s existing `og:url`/`twitter:url` meta tags). Flagged in the entry
  itself: URL fragments aren't reliably indexed as separate pages by most search
  engines — satisfies "list them in the sitemap" and gives shareable anchors, but
  real per-post SEO later would need real separate routes, not anchors.

---

## 2026-11-10 (7) — sitemap.xml created, Project Lyari blog posts included

- No `sitemap.xml` or `robots.txt` existed in the repo before this. Created
  `sitemap.xml` at the project root (standard sitemap protocol) covering the site's
  main pages (`/`, `games.html`, `vr-ar.html`, `company.html`, `art-inquiry.html`,
  `skills/`, `ttrader/`, `videos/`, `privacy-policy.html`) using the canonical
  domain `https://shashking.com/` (found in `index.html`'s `og:url`/`twitter:url`
  meta tags — this repo has no other domain reference, confirm before changing if
  the real deploy target differs).
- Per the user's ask, also added the 10 Project Lyari blog entries as individual
  `<url>` entries, `https://shashking.com/games.html#row-lyari-1` through `-10`
  (matching the `id="row-lyari-N"` on each accordion row). Flagging a caveat for
  future reference: URL fragments are not reliably treated as separately-indexed
  pages by most search engines (Google in particular generally ignores `#` in
  sitemap `<loc>` and indexes `games.html` as one page) — this satisfies "list them
  in the sitemap" literally and gives each post a stable, linkable/shareable anchor
  URL, but if real per-post SEO (each post ranking on its own) is the actual goal
  later, that would need each post to be its own route/page, not an anchor.
- Did not create `robots.txt` (wasn't asked for one) — the sitemap works standalone
  and can be submitted directly to Search Console; add a `robots.txt` with a
  `Sitemap:` line later if that becomes relevant for this deploy target.

---

## 2026-11-10 (6) — games.html: Dev Blog section (single post + Project Lyari digest)

### Progress
- Added a "Dev Blog" section to `games.html`, between Game Library and Game of the
  Day, with two cards: a single-post card linking out to an itch.io devlog, and a
  digest card holding an accordion list of 10 Project Lyari dev-blog entries sourced
  from `EXTRA/Project-Lyari/Blogs2026.md`.
- User gave a placeholder title ("QWERTY as a genre") for the first post and asked
  for something better that plays up shashKing being both designer and developer.
  Fetched the actual devlog (`curl` + UA trick again) to read real content before
  titling it — landed on "K Board Was Never a One-Off: The Designer in shashKing
  Built a Genre, the Developer Had to Ship It," which reflects the devlog's actual
  arc (K Board won an Innovation Award in one jam → shashKing-the-designer wants it
  to become a genre → shashKing-the-developer has to build the next instance of it,
  Chamkila Dhaba, for the next Brackeys Game Jam).

### Modifications
- `games.html`: new `#blog` section, `.blog-cards`/`.blog-card`/`.blog-digest` CSS,
  and a `.blog-row`/`.blog-row-head` accordion reusing the existing generic
  `.drawer-wrap`/`.drawer-inner` grid-rows trick (just added a
  `.blog-row.is-open .drawer-wrap` rule alongside the existing `.game-row` one).
  Added `mdInline()`/`mdLite()` — a small hand-rolled markdown-subset renderer
  (bold/italic, `>` blockquotes, `-` bullet lists, `|` tables with a `---` header
  separator) so the Lyari posts can stay as near-verbatim markdown in the data file
  instead of hand-converted HTML.
- New external data file `public/blog/lyari-posts.js` (`window.BLOG_LYARI = [...]`,
  loaded via a `<script src>` before the main inline script) holds the 10 Project
  Lyari entries verbatim from `Blogs2026.md` (titles kept as-is, including the
  file's two revision pairs — "Updated" and "Version 1/Version 2" — treated as
  separate dated entries rather than merged). Kept this content in its own file
  rather than inline in `games.html` to keep that file's size/diff sane.
- Note for future edits to this content: `Blogs2026.md`'s markdown `` `code spans` ``
  were converted to literal `<code>...</code>` HTML directly in the stored
  `bodyMd` strings (only articles 8 and 9 had any) — this was necessary because the
  data file uses JS template literals (backticks) to hold the body text, so a
  literal backtick in the source would have terminated the string early. If more
  Lyari posts get added later with inline code spans, convert them to `<code>` the
  same way before pasting into `lyari-posts.js`.

### Asset updates
- Cached locally (not hotlinked) rather than left in `EXTRA/`, since `EXTRA/` isn't
  guaranteed to ship in whatever the production deploy of this site turns out to be
  — copied from `EXTRA/Project-Lyari/` into `public/blog/lyari/` with clearer
  filenames: `recruit.png`, `molotov.png`, `civilians.png`, `medkit-x2.jpg`
  (from "Jo Bhi La Rahe Ho, Do Lana"), `gandhigiri.jpg` (from "Pappi Jhappi
  Gandhigiri-icon"), `victory-at-low-hp.jpg` (from "Dar Ke Aage Jeet Hai"),
  `hafta-vasooli.jpg`, `instant-redeath.jpg` (from "Ye Toh Shuru Hote Hi Khatam Ho
  Gaya!"), `subject-not-dead.jpg`, `shashking-portrait.jpg`. One image per blog
  entry, picked for rough thematic fit (e.g. civilians.png → the crowd/fear
  article, molotov.png → the combat-rebalance article) rather than strict 1:1
  correctness — two source icons (`Qabar Ka Kirayedaar`, `Sheikh Chilli Ka Ilaaj`)
  went unused, several near-duplicate "Pappi Jhappi Gandhigiri" filename variants
  existed in the source folder and only one was picked.
- `public/blog/chamkila-dhaba.png` — the itch.io cover image for the Chamkila Dhaba
  devlog, fetched via its `og:image` meta tag the same way as the earlier itch
  icon/screenshot work.
- `recruit.png` is ~1MB (1125×944) — no image-compression tool was available in
  this environment (the only `convert` on PATH resolves to Windows' own
  FAT↔NTFS disk-conversion utility at `C:\WINDOWS\system32\convert.exe`, **not**
  ImageMagick — do not run it expecting image conversion). Left uncompressed;
  revisit if page weight becomes a concern.

### Decisions made
- Kept the 10 Lyari entries as a flat list rather than trying to deduplicate the
  file's "Updated"/"Version 2" revisions into their originals — each revision is
  framed as its own post in the source material, so each got its own accordion row.
- Stored Lyari devlog content as an external `public/blog/lyari-posts.js` data file
  instead of inline in `games.html`. Why: ~4,000 words of source text inline would
  have made `games.html` unwieldy to keep editing; an external data file keeps
  content changes isolated from markup/logic changes.

---

## 2026-11-10 (5) — games.html: Project Lyari featured hero spotlight

## 2026-11-10 (5) — games.html: Project Lyari featured hero spotlight

- User gave a specific YouTube video for Project Lyari
  (`youtu.be/J09sV_r8aSI`) and asked for it to be used as a "hero page with
  Bauhaus animations." Fetched metadata via YouTube's oEmbed endpoint
  (`https://www.youtube.com/oembed?url=...&format=json`) to confirm it's landscape
  16:9 (width/height ratio in the response) before embedding — reusable trick for
  getting a video's title/aspect without a browser tool.
- User clarified the "Bauhaus animation" direction with "frame, banners or lower
  thirds" — built it as a literal interpretation: a bordered video `.featured-frame`,
  a diagonal corner `.featured-ribbon` ("Featured Project", color-pulses b1↔b2 every
  3s), and a broadcast-style `.lower-third` (striped Bauhaus accent bar + title/
  subtitle) that slides in on load.
- New `.featured-section` sits directly below the page's main hero and above
  Platforms — full-width dark (`--b4`) band, video on one side, copy + two CTAs
  (`Play on Google Play`, `More Details ↓`) on the other.
- `More Details` button (`[data-open-game="project-lyari"]`) opens that game's
  accordion row further down the page and scrolls to it — reuses the existing
  drawer open/close class rather than duplicating markup. General pattern: any
  future "feature game X up top with a link to its full drawer" ask can reuse this
  `data-open-game="<library id>"` hook as-is.
- Project Lyari's own `LIBRARY` entry was deliberately left without a `video` field
  (kept just `screenshot`) to avoid double-embedding the same iframe on the page.

---

## 2026-11-10 (4) — games.html: itch.io cover images as icons too

- User asked why the itch-only games had no thumbnail, pointing out itch.io also
  exposes an icon/cover image. Fetched each itch page's `og:image` (same `curl` +
  browser-UA trick, works fine for itch.io too — note itch sometimes orders the
  `<meta>` attributes as `content="..." property="og:image"`, i.e. don't assume
  `property` always comes first when grepping itch pages) and cached them:
  `public/games/do-you-popcorn-icon.png` (630×500 capsule image), `enmeshment-icon.png`
  (124×124, itch's actual small game icon), `dhurandhar-quiz-icon.jpg` (630×500).
- Added `icon:` to all 3 itch-only `LIBRARY` entries (Do You Popcorn, Enmeshment,
  Dhurandhar Movie Quiz) — row header now shows a real thumbnail for every game in
  the library, Play Store or itch.io, with the colored dot fallback no longer used
  anywhere currently (kept in CSS in case a future game has neither).

---

## 2026-11-10 (3) — games.html: full Play Store catalog pulled in, real descriptions + screenshots

### Progress
- User pointed at `https://play.google.com/store/apps/developer?id=shashking` as the
  source of truth and asked to grab real descriptions + screenshots from it. Static
  `WebFetch`/web-fetch-subagent on Play Store URLs had previously failed (JS-rendered,
  returns empty skeleton HTML) — solved by using `curl` directly with a desktop Chrome
  `User-Agent` header, which returns the full server-rendered HTML (~1MB/page) including
  embedded meta tags and the screenshot carousel markup. This is the reusable technique
  for any future "pull real data from a Play Store listing" ask on this site.
- Discovered the developer account actually has **9 published apps**, not the 3 that
  were in `games.html`: Gerabill, Dinosaur Day, Dinosaur Day AR, Banana Kicks, Project
  Lyari, Indradhanush AR, Shashking Who, Bats and Wolves, Shera. Added all 6 missing
  ones as full library entries (`games.html` LIBRARY array now has 12 total: 9 Play
  Store + 3 itch.io-only jam games).
- Replaced placeholder/short blurbs for Gerabill, Dinosaur Day, Banana Kicks with the
  real official Play Store descriptions (verbatim, `**bold**` markdown converted to
  `<strong>` at render time via a regex in `renderGameRow`).

### Modifications
- `games.html`:
  - `LIBRARY` array: added `icon` field (small app-icon image) and, for games without
    a video, a `screenshot` field, for every Play Store game.
  - Game Library row header: replaced the flat color swatch with the real app icon
    (`.game-icon-thumb`, 36px rounded) when `game.icon` is set, falling back to a
    colored dot (`.game-swatch-dot`) for itch-only entries with no icon. The accent
    color moved to a `border-left` stripe on the row (`--accent` CSS var set inline),
    so both the icon and the dot variants still carry the per-game Bauhaus color.
  - Drawer: added `.drawer-icon` (56px rounded icon, floated next to the blurb text)
    shown whenever `game.icon` is present, in addition to (not instead of) the
    video/screenshot block.
  - `renderGameRow`: blurb text now runs through
    `blurb.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')` before insertion, so the
    Play Store descriptions' markdown-style emphasis renders instead of showing
    literal asterisks.

### Asset updates
- Extraction technique: `curl -A "<chrome UA>" <play store url>` → saved HTML →
  regex-parsed (see scratch script, not committed) for: `<title>` (app name),
  `<meta itemprop="description">` (short blurb), the `data-g-id="description"` div
  (full description, keeps `<br>`/`**bold**`), `<meta property="og:image">` (icon,
  strip the `=s0-br30` size suffix), and `data-screenshot-index="N"` img `srcset`
  entries (screenshot gallery, in display order).
- Downloaded + cached locally (not hotlinked) into `public/games/`, one icon
  (`=w160`) and one screenshot (`=w800`, proportional — several AR games' native
  screenshots are portrait phone shots so came back narrower, e.g. 720×1600) per
  Play Store game:
  `gerabill-icon.png`, `dinosaur-day[-icon].png`, `dinosaur-day-ar[-icon].png`,
  `banana-kicks[-icon].png`, `project-lyari[-icon].png`, `indradhanush-ar[-icon].png`,
  `shashking-who[-icon].png`, `bats-and-wolves[-icon].png`, `shera[-icon].png`.
  Portrait AR screenshots land ~1-1.4MB as PNG — acceptable for a lazy-loaded drawer
  image on a personal site, but worth revisiting (convert to webp/compress) if load
  time on `games.html` ever becomes a concern.

### Decisions made
- Used a spoofed browser `User-Agent` with plain `curl` instead of a JS-executing
  browser tool (none was available this session) to get real data off Play Store.
  Why: Play Store serves a fully-populated HTML document to a normal browser UA on
  first load (hydration data is already inline) — a JS-executing browser isn't
  actually required, only a UA string that isn't flagged as a bot/empty-UA client.
  Keep this in mind before assuming "Play Store needs a real browser" in future asks.
- Kept Gerabill's rich itch.io-flavored devlog blurb as the primary narrative and
  layered the official store description in as an update to match reality, rather
  than fully replacing one with the other — the devlog content (treasure chests,
  arrow markers) and the store blurb (torch-as-clock, dragon) are complementary
  descriptions of the same shipped game, both worth keeping.
- Project Lyari and the AR titles were not asked for by name — included anyway
  because the user's instruction was "use [the developer page] to update and grab
  their descriptions and screenshots," i.e., treat the dev page as the full roster.

### Task history
1. Fetched the developer page (`curl` + UA trick) → extracted the 9 unique
   `details?id=...` app ids.
2. Fetched each of the 9 app detail pages the same way.
3. Wrote a scratch Node script to regex-extract title/shortDesc/fullDesc/icon/
   screenshots per app into `extracted.json` for review.
4. Wrote a second scratch script to download icon (`=w160`) + first screenshot
   (`=w800`) per app straight into `public/games/` via `fetch()`.
5. Rewrote the `LIBRARY` array in `games.html` with real data for the 3 existing
   Play Store games and 6 new ones; added icon-aware row-header rendering and the
   `**bold**` → `<strong>` blurb conversion.
6. Verified JS syntax (`node --check` on the extracted `<script>` block — no DOM, so
   only a syntax check, not a behavior check) and confirmed all new `public/games/*`
   paths 200 on the running Vite dev server. Did not visually confirm in a real
   browser this round either (same no-browser-tool limitation as the prior entry).

---

## 2026-11-10 (2) — games.html rebuild: smart drawers + library screenshots

### Progress
- Rebuilt `games.html`'s Bauhaus theme into a real "Game Library" accordion: every
  game now expands into a smart drawer (full blurb, links, devlogs, video/screenshot)
  instead of the page being just a repetitive clock hero + flat platform cards.
- Replaced the hero "clock" tile's abrupt 9→0 countdown with a soft two-layer
  crossfade that shuffles through the 10 Bauhaus digit-patterns (1.1s fade,
  ~2.6s interval) — addressed the "repetitive" complaint while keeping the motif.
- Game of the Day section now sources from the same `LIBRARY` array instead of a
  separate duplicate list.

### Modifications
- `games.html` — full rewrite of the `<style>` + body + script. Added: `.library-list`
  / `.game-row` accordion (CSS `grid-template-rows: 0fr → 1fr` trick for smooth
  height animation, no JS height measuring), `.drawer-video-frame` (vertical 9:16
  by default, `.is-landscape` variant for 16:9 embeds), `.drawer-screenshot`,
  `.play-banner` (Bauhaus-bordered CTA box), `.devlog-list`. `LIBRARY` JS array now
  holds 6 games: Gerabill, Dinosaur Day, Banana Kicks, Do You Popcorn, Enmeshment,
  Dhurandhar Movie Quiz.
- Gerabill entry: itch.io + Google Play + DeviantArt links, published date
  (Sep 4, 2016), vertical YouTube Short embed (`96Zvq92YDcM`), 4 devlog links,
  "Download now on Google Play" banner.
- Enmeshment entry: added itch.io link, landscape YouTube gameplay video
  (`J_FsKgrSLNw`), and all 7 devlog links (fetched live from
  shashking.itch.io/enmeshment + its /devlog index since the user only gave titles
  + dates, not URLs).
- Do You Popcorn / Dhurandhar Movie Quiz: added a cached local screenshot (see
  Asset updates) since they have no video.

### Asset updates
- Added `public/games/do-you-popcorn.png` and `public/games/dhurandhar-quiz.jpg` —
  downloaded from each game's itch.io screenshot gallery (`img.itch.zone` CDN,
  `/original/` full-res path) and cached locally rather than hotlinked, per user
  instruction ("cache them"). Referenced in `games.html` as
  `public/games/<file>` — matches this repo's existing convention of referencing
  the `public/` prefix literally in markup (see `favicon.ico` references
  elsewhere); confirmed both the `public/...` path and bare root path 200 on the
  Vite dev server.
- Did **not** add screenshots for Dinosaur Day / Banana Kicks — Google Play listing
  pages are JS-rendered, so a static fetch returned no image URLs. Left without a
  drawer image rather than guess a URL. Revisit if the user wants these filled in
  (would need a real browser/JS-executing fetch, or user-supplied URLs).

### Decisions made
- Used the CSS `grid-template-rows: 0fr/1fr` transition for the drawer open/close
  instead of JS height measurement — smoother and avoids recalculating on content
  change. Why: modern browsers support it and this is a personal portfolio site,
  no legacy browser constraint mentioned.
- Cache/download third-party-hosted screenshots locally instead of hotlinking.
  Why: explicit user instruction ("the links have screenshots to call into the
  website and cache them"). Applies to any future "pull imagery from an external
  game page" request on this site — download to `public/games/` (or a similarly
  named local dir), don't hotlink.
- Kept video embed aspect configurable per game (`video.aspect: "9/16" | "16/9"`)
  rather than assuming all embeds are vertical shorts, after Enmeshment's video
  turned out to be a normal landscape YouTube video.

### Task history
1. Modernized `games.html` Bauhaus theme into drawer-based Game Library (see above).
2. User asked to add Enmeshment's itch.io link + several devlog titles/dates but
   no URLs — fetched `shashking.itch.io/enmeshment` (+ `/devlog` index) via a
   web-fetch subagent to resolve exact devlog URLs, then added all 7.
3. User supplied Enmeshment's gameplay video (`youtube.com/watch?v=J_FsKgrSLNw`) —
   added it, and generalized the video embed CSS to support landscape as well as
   vertical (Gerabill's case).
4. User said screenshots could be pulled from the game pages and cached — fetched
   screenshot CDN URLs for the two video-less itch.io games (Do You Popcorn,
   Dhurandhar Movie Quiz) via web-fetch subagents, downloaded them with `curl` into
   `public/games/`, and wired them into the drawers. Google Play screenshot fetch
   for Dinosaur Day / Banana Kicks failed (JS-rendered listing pages) — left as a
   known gap.
5. Verified via local Vite dev server (`npx vite --port 5183`) that both the new
   script renders without obvious errors and the cached image paths return 200.
   No live browser-automation tool was available this session (no Claude in Chrome
   enabler, built-in browser can't reach localhost) — visual QA was not done by
   Claude; opened the page in the user's default OS browser for them to check.

---

## 2026-11-10

### Context snapshot (uncommitted working tree at session start)
- Modified: `art-inquiry.html`, `company.html`, `css/art-style.css`, `index.html`,
  `skills/index.html`, `ttrader/index.html`, `videos/index.html`
- Deleted: `skills/index copy.html`, `videos/index copy.html` (stray duplicate files)
- New/untracked: `games.html`, `vr-ar.html`
- No action taken yet on these changes this session — logged for reference only.

### Task history
- Located existing `EXTRA/PROGRESS.md` (user's commit-log style file, last entry "JULY 17").
- Created this file (`EXTRA/CLAUDE_PROGRESS.md`) per user request, for Claude's own
  ongoing tracking of progress/modifications/asset updates/decisions/task history.

### Decisions made
- Keep this log separate from `EXTRA/PROGRESS.md` — that file is the user's own
  commit-message journal; this one is Claude's working log and can be more granular
  (file-level changes, asset notes, rationale), updated proactively during sessions.

---

<!--
Template for new entries:

## YYYY-MM-DD

### Progress
- What was accomplished this session.

### Modifications
- file/path — what changed and why.

### Asset updates
- New/changed images, fonts, scripts, third-party libs, etc.

### Decisions made
- Decision — why — alternatives considered (if relevant).

### Task history
- Chronological log of what was done, in order.
-->
