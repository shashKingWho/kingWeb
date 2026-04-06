import { quizData } from './quizData.js';

/* ─────────────────────────────────────────
   GRAIN CANVAS
───────────────────────────────────────── */
(function initGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function draw() {
    const img  = ctx.createImageData(w, h);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener('resize', resize);
})();

/* ─────────────────────────────────────────
   PANEL PALETTES
───────────────────────────────────────── */
const PANEL_PALETTES = [
  { from: '#0d0b08', to: '#1a1208' },
  { from: '#08090d', to: '#0c0d18' },
  { from: '#0d0808', to: '#1a0c0c' },
  { from: '#070d09', to: '#0c1810' },
  { from: '#0d0b0d', to: '#160c1a' },
];

/* ─────────────────────────────────────────
   BUILD PANELS
───────────────────────────────────────── */
const track   = document.getElementById('storyTrack');
const answers = new Array(quizData.length).fill(null);
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

quizData.forEach((q, idx) => {
  const palette = PANEL_PALETTES[idx % PANEL_PALETTES.length];
  const panel   = document.createElement('section');
  panel.className = 'panel';
  panel.setAttribute('aria-labelledby', `q-title-${idx}`);
  panel.dataset.index = idx;

  panel.innerHTML = `
    <div class="panel__background">
      <div class="panel__bg-texture" style="
        background: radial-gradient(ellipse 80% 80% at 30% 40%, ${palette.to} 0%, ${palette.from} 100%);
        position:absolute; inset:0;
      "></div>
      <div class="panel__bg-texture">
        <img src="assets/bg-${idx + 1}.jpg" alt="" loading="lazy" decoding="async" />
      </div>
    </div>

    <div class="panel__scanlines" aria-hidden="true"></div>

    <div class="panel__progress" aria-hidden="true">
      <div class="panel__progress-fill"></div>
    </div>

    <div class="panel__side-label" aria-hidden="true">
      DHURANDHAR FAN QUIZ BY SHASHKING // Q${String(idx + 1).padStart(2, '0')} OF ${String(quizData.length).padStart(2, '0')}
    </div>

    <div class="panel__content">
      <p class="panel__eyebrow">Question ${String(idx + 1).padStart(2, '0')} / ${String(quizData.length).padStart(2, '0')}</p>
      <p class="panel__question js-classified-panel" id="q-title-${idx}">${q.question}</p>
      <div class="panel__options" role="group" aria-label="Answer options">
        ${q.options.map((opt, i) => `
          <label class="option-item" data-letter="${LETTERS[i]}" data-qi="${idx}" data-oi="${i}">
            <input type="radio" name="q${idx}" value="${i}" />
            ${opt}
          </label>
        `).join('')}
      </div>
    </div>
  `;

  track.appendChild(panel);
});

/* ─────────────────────────────────────────
   OPTION INTERACTION
   Selection only — results revealed on finishBtn
───────────────────────────────────────── */
track.addEventListener('click', (e) => {
  const label = e.target.closest('.option-item');
  if (!label) return;

  const qi = Number(label.dataset.qi);
  const oi = Number(label.dataset.oi);

  answers[qi] = oi;

  label.closest('.panel').querySelectorAll('.option-item').forEach(opt => {
    opt.classList.remove('selected');
  });
  label.classList.add('selected');
});

/* ─────────────────────────────────────────
   CLASSIFIED LINE BUILDER  (no SplitText)

   Strategy:
   1. Wrap every word in a temp <span>.
   2. Read each span's getBoundingClientRect().top to find visual lines.
   3. Group words that share the same top into lines.
   4. Replace element content with .classified-line wrappers.

   Key points:
   - Works with any font / size / wrapping behaviour.
   - Uses xPercent (translate) not scaleX — no layout reflow.
   - Each line gets its own independent mask → stagger looks correct.
───────────────────────────────────────── */
function buildClassifiedLines(element) {
  const originalText = element.textContent.trim();
  if (!originalText) return null;

  /* Step 1 — inject word spans so browser lays them out */
  const words = originalText.split(/\s+/);
  element.innerHTML = words.map(w => `<span class="cl-word">${w} </span>`).join('');

  /* Step 2 — force layout, then read vertical positions */
  element.offsetHeight; // eslint-disable-line no-unused-expressions
  const wordSpans = Array.from(element.querySelectorAll('.cl-word'));

  const lineMap = new Map(); // rounded top-px → accumulated text
  wordSpans.forEach(span => {
    const top = Math.round(span.getBoundingClientRect().top);
    lineMap.set(top, (lineMap.get(top) || '') + span.textContent);
  });

  const lines = Array.from(lineMap.keys())
    .sort((a, b) => a - b)
    .map(key => lineMap.get(key).trimEnd());

  /* Step 3 — rebuild with classified wrappers */
  element.innerHTML = '';

  lines.forEach(lineText => {
    const raw = document.createElement('div');
    raw.className = 'classified-raw-line';

    const wrapper = document.createElement('div');
    wrapper.className = 'classified-line';

    const inner = document.createElement('div');
    inner.className = 'classified-line__inner';
    inner.textContent = lineText;

    const mask = document.createElement('div');
    mask.className = 'classified-line__mask';

    wrapper.appendChild(inner);
    wrapper.appendChild(mask);
    raw.appendChild(wrapper);
    element.appendChild(raw);
  });

  return {
    inners: element.querySelectorAll('.classified-line__inner'),
    masks:  element.querySelectorAll('.classified-line__mask'),
  };
}

/* ─────────────────────────────────────────
   GSAP INIT
───────────────────────────────────────── */
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);
  window.focus();

  initIntroAnimation();
  initHorizontalStory();

  setTimeout(() => ScrollTrigger.refresh(), 500);

  document.getElementById('startBtn')?.addEventListener('click', () => {
    document.getElementById('storySection').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   INTRO ANIMATION
───────────────────────────────────────── */
function initIntroAnimation() {
  const elements = document.querySelectorAll('.intro__content .js-classified');
  const masterTl = gsap.timeline({ delay: 0.8 });

  elements.forEach((el, index) => {
    const built = buildClassifiedLines(el);
    if (!built) return;

    const { inners, masks } = built;

    gsap.set(inners, { opacity: 0, y: 15 });
    // Mask slides LEFT off the text to reveal (origin: right)
    gsap.set(masks, { xPercent: 0, transformOrigin: 'right center' });

    masterTl
      .to(masks, {
        xPercent: -100,
        duration: 1.4,
        ease: 'expo.inOut',
        stagger: 0.3,
      }, index * 0.45)
      .to(inners, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        stagger: 0.3,
      }, '<0.25');
  });
}

/* ─────────────────────────────────────────
   HORIZONTAL STORY ENGINE
───────────────────────────────────────── */
function initHorizontalStory() {
  ScrollTrigger.getAll().forEach(t => t.kill(true));
  gsap.killTweensOf('*');
  ScrollTrigger.refresh(true);

  const story  = document.getElementById('storySection');
  const track  = document.getElementById('storyTrack');
  const panels = gsap.utils.toArray('.panel');
  if (!panels.length) return;

  /* track sizing */
  track.style.width = `${panels.length * 100}vw`;
  panels.forEach((p, i) => gsap.set(p, { left: `${i * 100}vw` }));

  /* initial parallax states */
  panels.forEach(p => {
    const bg   = p.querySelector('.panel__bg-texture');
    const prop = p.querySelector('.panel__chapter-prop');
    if (bg)   gsap.set(bg,   { xPercent: -8, scale: 1.1 });
    if (prop) gsap.set(prop, { xPercent: 12, yPercent: 4 });
  });

  const travel = (panels.length - 1) * window.innerWidth;

  const horizontalTween = gsap.to(track, {
    x: -travel,
    ease: 'none',
    scrollTrigger: {
      trigger: story,
      start:   'top top',
      end:     () => `+=${travel * 1.5}`,
      scrub:   1,
      pin:     true,
      anticipatePin:       1,
      invalidateOnRefresh: true,
      fastScrollEnd:       true,
      preventOverlaps:     true,
    }
  });

  /* per-panel */
  panels.forEach((panel, idx) => {
    const bg       = panel.querySelector('.panel__bg-texture');
    const prop     = panel.querySelector('.panel__chapter-prop');
    const content  = panel.querySelector('.panel__content');
    const question = panel.querySelector('.js-classified-panel');
    const options  = panel.querySelectorAll('.option-item');
    const progFill = panel.querySelector('.panel__progress-fill');

    /* parallax layers */
    const parallaxTL = gsap.timeline({
      scrollTrigger: {
        trigger: panel, containerAnimation: horizontalTween,
        start: 'left right', end: 'right left', scrub: true,
      }
    });
    if (bg)      parallaxTL.to(bg,      { xPercent: 8,  scale: 1.03,  ease: 'none' }, 0);
    if (prop)    parallaxTL.to(prop,    { xPercent: -6, yPercent: -2, ease: 'none' }, 0);
    if (content) parallaxTL.fromTo(content, { x: 120 }, { x: -500, ease: 'none' }, 0);

    /* progress bar */
    if (progFill) {
      ScrollTrigger.create({
        trigger: panel, containerAnimation: horizontalTween,
        start: 'left 60%',
        onEnter() {
          gsap.to(progFill, {
            scaleX: (idx + 1) / panels.length,
            duration: 0.8, ease: 'power2.out',
          });
        }
      });
    }

    /* classified question reveal */
    if (question) {
      /*
        Build lines at init time (fonts loaded, panel in DOM, layout stable).
        getBoundingClientRect is accurate here even for off-screen panels
        because position:absolute panels are still measured by the browser.
      */
      const built = buildClassifiedLines(question);
      if (!built) return;

      const { inners, masks } = built;

      /* initial hidden state */
      gsap.set(inners,  { yPercent: 40, opacity: 0 });
      gsap.set(masks,   { xPercent: 0,  transformOrigin: 'right center' });
      gsap.set(options, { opacity: 0, y: 10 });

      /* paused reveal timeline */
      const revealTl = gsap.timeline({ paused: true });
      revealTl
        .to(masks, {
          xPercent: -100,             // mask slides LEFT off → reveals text
          duration: 0.8,
          ease: 'power3.inOut',
          stagger: 0.12,
        })
        .to(inners, {
          yPercent: 0, opacity: 1,
          duration: 0.55, stagger: 0.12,
        }, '<0.1')
        .to(options, {
          opacity: 1, y: 0,
          duration: 0.4, stagger: 0.06, ease: 'power2.out',
        }, '-=0.15');

      if (idx === 0) {
        /* First panel — already in view, auto-play */
        revealTl.delay(1.0).play();
      } else {
        /* All others — play/reverse on horizontal containerAnimation */
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: 'left 70%',
          toggleActions: 'play reverse none reset',
          onEnter:     () => revealTl.play(),
          onLeaveBack: () => revealTl.reverse(),
        });
      }
    }
  });

  /* pulse finish button when last panel is fully in view */
  ScrollTrigger.create({
    trigger: story,
    start: 'bottom bottom',
    onEnter() {
      gsap.to('#finishBtn', { scale: 1.08, repeat: 2, yoyo: true, duration: 0.4 });
    },
    once: true,
  });

  ScrollTrigger.refresh();
}

/* ─────────────────────────────────────────
   FINISH BUTTON
───────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#finishBtn');
  if (!btn || btn.disabled) return;

  btn.disabled = true;
  btn.textContent = 'INTEL PROCESSED';

  const startBtn = document.getElementById('startBtn');
  if (startBtn) gsap.to(startBtn, { opacity: 0, y: -20, duration: 0.4, pointerEvents: 'none' });

  const trackEl = document.getElementById('storyTrack');
  if (trackEl) trackEl.style.pointerEvents = 'none';

  quizData.forEach((q, i) => {
    const userChoice = answers[i];
    document.querySelectorAll(`.option-item[data-qi="${i}"]`).forEach(opt => {
      opt.style.cursor = 'default';
    });
    if (userChoice !== null) {
      const sel = document.querySelector(`.option-item[data-qi="${i}"][data-oi="${userChoice}"]`);
      if (sel) {
        sel.classList.remove('selected');
        sel.classList.add(userChoice === q.correctIndex ? 'correct' : 'wrong');
      }
    }
  });

  setTimeout(() => {
    showOutro();
    document.getElementById('outro').scrollIntoView({ behavior: 'smooth' });
  }, 800);
});

/* ─────────────────────────────────────────
   OUTRO / SCORE
───────────────────────────────────────── */
function showOutro() {
  const score    = answers.reduce((acc, ans, i) =>
    acc + (ans === quizData[i].correctIndex ? 1 : 0), 0);
  const total    = quizData.length;
  const outro    = document.getElementById('outro');
  const numEl    = document.getElementById('outroScore');
  const denomEl  = document.getElementById('outroTotal');
  const verdict  = document.getElementById('outroVerdict');
  const retryBtn = document.getElementById('mag1');

  denomEl.textContent = `/ ${total}`;

  const ratio = score / total;
  if      (ratio === 1)  verdict.textContent = 'Perfect score! You must HAVE REALLY seen it 4 times. 🔥';
  else if (ratio >= 0.7) verdict.textContent = 'Not bad, but a rewatch is recommended. 👀';
  else if (ratio >= 0.4) verdict.textContent = 'Friend… you missed all the details. Return to the field! 📂';
  else                   verdict.textContent = 'Were you on your phone during the movie? Retry mission now! 😅';

  outro.removeAttribute('aria-hidden');

  gsap.set(numEl, { y: 40, opacity: 0 });
  gsap.to(numEl,  { y: 0, opacity: 1, duration: 0.6 });

  const counter = { val: 0 };
  gsap.to(counter, {
    val: score,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate() { numEl.textContent = Math.round(counter.val); },
    onComplete() {
      gsap.to(retryBtn, {
        opacity: 1, y: 0, duration: 0.6,
        ease: 'power3.out', pointerEvents: 'auto',
      });
    }
  });
}

/* ─────────────────────────────────────────
   RESET
───────────────────────────────────────── */
function resetExperience() {
  ScrollTrigger.getAll().forEach(t => t.kill(true));
  gsap.killTweensOf('*');
  answers.fill(null);

  const trackEl = document.getElementById('storyTrack');
  if (trackEl) trackEl.style.pointerEvents = 'auto';

  document.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.remove('selected', 'correct', 'wrong');
    opt.style.pointerEvents = 'auto';
  });

  const finishBtn = document.getElementById('finishBtn');
  if (finishBtn) {
    finishBtn.disabled = false;
    finishBtn.textContent = 'CHECK MY SCORE →';
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(() => location.reload(), 50);
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#mag1')) resetExperience();
});
