import { quizData } from './quizData.js';

/* ─────────────────────────────────────────
   GRAIN CANVAS
───────────────────────────────────────── */
(function initGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, frame;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function draw() {
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    frame = requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener('resize', resize);
})();



/* ─────────────────────────────────────────
   PANEL BACKGROUND COLOURS (per-panel atmosphere)
───────────────────────────────────────── */
const PANEL_PALETTES = [
  { from: '#0d0b08', to: '#1a1208' },   // amber-tinted
  { from: '#08090d', to: '#0c0d18' },   // cold blue-black
  { from: '#0d0808', to: '#1a0c0c' },   // deep red-black
  { from: '#070d09', to: '#0c1810' },   // forest-tinted
  { from: '#0d0b0d', to: '#160c1a' },   // violet-tinted
];

/* ─────────────────────────────────────────
   BUILD PANELS FROM quizData
───────────────────────────────────────── */
const track = document.getElementById('storyTrack');
const answers = new Array(quizData.length).fill(null);
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

quizData.forEach((q, idx) => {
  const palette = PANEL_PALETTES[idx % PANEL_PALETTES.length];
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.setAttribute('aria-labelledby', `q-title-${idx}`);
  panel.dataset.index = idx;

  panel.innerHTML = `
    <!-- background gradient layer -->
    <div class="panel__background">
      <div class="panel__bg-texture" style="
        background: radial-gradient(ellipse 80% 80% at 30% 40%, ${palette.to} 0%, ${palette.from} 100%);
        position:absolute; inset:0;
      "></div>
      <div class="panel__bg-texture">
  <img src="assets/bg-${idx + 1}.jpg" alt="" loading="lazy" decoding="async" />
</div>
    </div>

    <!-- scanlines -->
    <div class="panel__scanlines" aria-hidden="true"></div>

    <!-- giant chapter prop -->
    <!-- <div class="panel__chapter-prop" aria-hidden="true">${String(idx + 1).padStart(2, '0')}</div> -->

    <!-- progress bar -->
    <div class="panel__progress" aria-hidden="true">
      <div class="panel__progress-fill" style="transform: scaleX(${(idx + 1) / quizData.length})"></div>
    </div>

    <!-- side label -->
    <div class="panel__side-label" aria-hidden="true">
      <!-- DHURANDHAR FAN QUIZ BY SHASHKING // Q${String(idx + 1).padStart(2)} OF ${String(quizData.length).padStart(2)} -->
      DHURANDHAR FAN QUIZ BY SHASHKING // Q${String(idx + 1).padStart(2)} OF ${String(quizData.length).padStart(2)}
    </div>

    <!-- content -->
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
    OPTION INTERACTION (Selection Only)
───────────────────────────────────────── */
track.addEventListener('click', (e) => {
  const label = e.target.closest('.option-item');
  if (!label) return;

  const qi = Number(label.dataset.qi);
  const oi = Number(label.dataset.oi);

  // Allow re-selection if the finish button hasn't been clicked yet
  // Or keep it as is if you want one-time choice:
  // if (answers[qi] !== null) return; 

  answers[qi] = oi;

  // Visuals: Remove 'selected' from siblings, add to this one
  const panel = label.closest('.panel');
  panel.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  label.classList.add('selected');
});

/* ─────────────────────────────────────────
   CLASSIFIED LINE BUILDER (No-Plugin Version)
───────────────────────────────────────── */
function buildClassifiedLines(element) {
  // We wrap the text in the "Classified" structure manually 
  // so we don't trigger the GSAP membership/trial errors.
  const content = element.innerHTML;
  element.innerHTML = ''; 

  const wrapper = document.createElement('div');
  wrapper.className = 'classified-line';

  const inner = document.createElement('div');
  inner.className = 'classified-line__inner';
  inner.innerHTML = content;

  const mask = document.createElement('div');
  mask.className = 'classified-line__mask';

  wrapper.appendChild(inner);
  wrapper.appendChild(mask);
  element.appendChild(wrapper);

  // We return these as arrays to keep your existing GSAP staggers working
  return {
    inners: [inner], 
    masks: [mask],
  };
}

/* ─────────────────────────────────────────
   GSAP INIT 
───────────────────────────────────────── */
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Note: We REMOVED the duplicate buildClassifiedLines call here 
  // because initIntroAnimation() handles it below.

  // Force focus so the iframe captures keyboard/scroll events immediately
  window.focus();

 
/* ── SCROLL TO STORY ── */
const target = document.getElementById('storySection');
  if (target) {
    const targetPosition = target.offsetTop;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // CRITICAL: Tell ScrollTrigger to recount the page height 
    // after the smooth scroll starts
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
});



  
  initHorizontalStory();
  initIntroAnimation();

  // NEW: Force a refresh after 500ms to account for itch.io loading lag
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});


/* ─────────────────────────────────────────
   HORIZONTAL STORY ENGINE
───────────────────────────────────────── */
function initHorizontalStory() {
  // ScrollTrigger.getAll().forEach(t => t.kill());
  ScrollTrigger.getAll().forEach(t => t.kill(true)); // force cleanup
  gsap.killTweensOf("*"); // kill all tweens safely
  ScrollTrigger.refresh(true);

  const story = document.getElementById('storySection');
  const track = document.getElementById('storyTrack');
  const panels = gsap.utils.toArray('.panel');
  if (!panels.length) return;

  /* ── track sizing ── */
  track.style.width = `${panels.length * 100}vw`;
  panels.forEach((p, i) => gsap.set(p, { left: `${i * 100}vw` }));

  /* ── initial states for parallax layers ── */
  panels.forEach((p) => {
    const bg = p.querySelector('.panel__bg-texture');
    const prop = p.querySelector('.panel__chapter-prop');

    if (bg) gsap.set(bg, { xPercent: -8, scale: 1.1 });
    if (prop) gsap.set(prop, { xPercent: 12, yPercent: 4 });
  });

  /* ── horizontal travel ── */
  const travel = (panels.length - 1) * window.innerWidth;
  const scrollPace = 1.4; //1.4;

const horizontalTween = gsap.to(track, {
  x: -travel,
  ease: 'none',
  scrollTrigger: {
    trigger: story,
    start: 'top top',
    end: () => `+=${travel * 1.5}`, // Use a function for 'end' so it's dynamic
    scrub: 1,
    pin: true, 
    anticipatePin: 1,
    invalidateOnRefresh: true,
    // Add this to help mobile/itch.io browsers
    fastScrollEnd: true, 
    preventOverlaps: true
  }
});

  /* ── per-panel parallax + classified reveal ── */
  panels.forEach((panel, idx) => {
    const bg = panel.querySelector('.panel__bg-texture');
    const prop = panel.querySelector('.panel__chapter-prop');
    // const question = panel.querySelector('.panel__question');
    const question = panel.querySelector('.js-classified-panel');
    const options = panel.querySelectorAll('.option-item');
    const progFill = panel.querySelector('.panel__progress-fill');

    const content = panel.querySelector('.panel__content'); // Target the text block

    /* ── PARALLAX timeline (scrubbed, containerAnimation) ── */
    const parallaxTL = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        containerAnimation: horizontalTween,
        start: 'left right',
        end: 'right left',
        scrub: true,
      }
    });

    if (bg) parallaxTL.to(bg, { xPercent: 8, scale: 1.03, ease: 'none' }, 0);
    if (prop) parallaxTL.to(prop, { xPercent: -6, yPercent: -2, ease: 'none' }, 0);

    // 3. TEXT CONTENT moves at a different speed (foreground)
  // This creates the "Right-to-Left" drift you are looking for
  if (content) {
    parallaxTL.fromTo(content, 
      { x: 150 }, // Starts pushed to the right
      { x: -650, ease: 'none' }, // Ends pushed to the left
      0
    );
  }


    /* ── Progress bar fill: animate when panel enters ── */
    if (progFill) {
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: horizontalTween,
        start: 'left 60%',
        onEnter() {
          gsap.to(progFill, { scaleX: (idx + 1) / panels.length, duration: 0.8, ease: 'power2.out' });
        }
      });
    }

    /* ── CLASSIFIED QUESTION REVEAL ── */
    if (question) {
      const built = buildClassifiedLines(question);
      if (built) {
        const { inners, masks } = built;

        // 1. Initial State (Static)
        gsap.set(inners, { yPercent: 40, opacity: 0 });
        gsap.set(masks, { scaleX: 1, transformOrigin: "right center" });
        if (options) gsap.set(options, { opacity: 0, y: 10 });

        // 2. Create the Reveal Timeline
        const revealTl = gsap.timeline({ paused: true });
        revealTl
          .to(masks, { scaleX: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.1 })
          .to(inners, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "<0.1")
          .to(options, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, "-=0.2");

        // 3. Attach ScrollTrigger with Smooth Toggle Actions
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: 'left 70%',
          // play: when entering from right
          // reverse: when scrolling back past the start point
          // none: do nothing when leaving forward
          // reset: reset when scrolling way back
          toggleActions: "play reverse none reset",
          onEnter: () => revealTl.play(),
          onLeaveBack: () => revealTl.reverse(), // This makes it smooth!
        });
      }
    }
  });

  /* ── OUTRO: tally score when story ends ── */
  ScrollTrigger.create({
    trigger: story,
    start: 'bottom bottom',
    // onEnter: showOutro,
    onEnter() {
      // show hint instead of auto reveal
      gsap.to("#finishBtn", {
        scale: 1.1,
        repeat: 2,
        yoyo: true,
        duration: 0.4
      });
    },
    once: true,
  });

  ScrollTrigger.refresh();
}

/* ─────────────────────────────────────────
   OUTRO / SCORE
───────────────────────────────────────── */
function showOutro() {
  /*
    SAFETY CHECKS (Important)
  
  Before calculating score:
  */
  console.log("Answers:", answers);
  console.log("Quiz:", quizData);
  const retryBtn = document.getElementById("mag1");

  //
  const score = answers.reduce((acc, ans, i) => acc + (ans === quizData[i].correctIndex ? 1 : 0), 0);
  const total = quizData.length;
  const outro = document.getElementById('outro');
  const numEl = document.getElementById('outroScore');
  const denomEl = document.getElementById('outroTotal');
  const verdict = document.getElementById('outroVerdict');

  denomEl.textContent = `/ ${total}`;

  const ratio = score / total;
  if (ratio === 1) verdict.textContent = "Perfect score! You must HAVE REALLY seen it 4 times.";
  else if (ratio >= 0.7) verdict.textContent = "Not bad, but rewatch is recommended.";
  else if (ratio >= 0.4) verdict.textContent = "Friend... you missed all the details. Return to the field!";
  else verdict.textContent = "Were you on your phone during the movie? Retry mission now!";

  outro.removeAttribute('aria-hidden');

  // animate score count-up
  // gsap.fromTo(
  //   { val: 0, y:40 },
  //   { val: score, y:0, duration: 1.4, ease: 'power2.out',
  //     onUpdate() { numEl.textContent = Math.round(this.targets()[0].val); }
  //   }
  // );
  const counter = { val: 0 };

  gsap.set(numEl, { y: 40, opacity: 0 });

  gsap.to(numEl, {
    y: 0,
    opacity: 1,
    duration: 0.6
  });

  gsap.to(counter, {
    val: score,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate() {
      numEl.textContent = Math.round(counter.val);

    },
    onComplete() {
      // 🎬 reveal retry AFTER score finishes
      gsap.to(retryBtn, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        pointerEvents: "auto"
      });
    }
  });
}



function resetExperience() {
  ScrollTrigger.getAll().forEach(t => t.kill(true));
  gsap.killTweensOf("*");

  // 1. Reset Data
  answers.fill(null); 
  
  // 2. Reset UI
  const track = document.getElementById('storyTrack');
  track.style.pointerEvents = 'auto'; // Re-enable clicking
  
  document.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.remove('selected', 'correct', 'wrong');
    opt.style.pointerEvents = 'auto';
  });

  // 3. Reset Finish Button
  const finishBtn = document.getElementById('finishBtn');
  finishBtn.disabled = false;
  finishBtn.textContent = "CHECK MY SCORE →";
  finishBtn.style.opacity = "1";

  // --- NEW: RESTORE START BUTTON ---
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    gsap.set(startBtn, { 
      opacity: 1, 
      y: 0, 
      pointerEvents: "auto" 
    });
  }

  // 4. Scroll back to Intro
  window.scrollTo({ top: 0, behavior: "instant" });

  setTimeout(() => {


    location.reload();
  }, 50);
}
document.addEventListener("click", (e) => {

  if (e.target.closest("#mag1")) {
    resetExperience();
  }

});




document.addEventListener("click", (e) => {
  const btn = e.target.closest("#finishBtn");
  if (!btn) return;

  btn.disabled = true;
  btn.textContent = "INTEL PROCESSED";

  // --- NEW: HIDE START BUTTON ---
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    gsap.to(startBtn, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      pointerEvents: "none" // Prevents the user from clicking the invisible area
    });
  }

  // ------------------------------
  // LOCK THE ENTIRE TRACK - No more clicking or hovering anywhere in the quiz
  const track = document.getElementById('storyTrack');
  if (track) track.style.pointerEvents = 'none';

  quizData.forEach((q, i) => {
    const userChoice = answers[i];
    // Even if skipped, we want to find the options for that question index
    const allOptions = document.querySelectorAll(`.option-item[data-qi="${i}"]`);
    
    // Disable each individual option just to be safe for keyboard users
    allOptions.forEach(opt => {
      opt.style.cursor = 'default';
    });

    if (userChoice !== null) {
      const correct = q.correctIndex;
      const selectedElement = document.querySelector(`.option-item[data-qi="${i}"][data-oi="${userChoice}"]`);

      if (selectedElement) {
        selectedElement.classList.remove('selected');
        if (userChoice === correct) {
          selectedElement.classList.add('correct');
        } else {
          selectedElement.classList.add('wrong');
        }
      }
    }
  });

  // 2. Transition to Outro
  setTimeout(() => {
    showOutro();
    // Scroll to the very bottom where the Retry button is
    document.getElementById('outro').scrollIntoView({ behavior: 'smooth' });
  }, 800);
});


/*
function initIntroAnimation() {
  const introElements = document.querySelectorAll('.intro__content .js-classified');
  
  introElements.forEach(el => {
    const built = buildClassifiedLines(el); // Your existing helper function
    if (built) {
      const { inners, masks } = built;
      
      // Set initial state
      gsap.set(inners, { opacity: 0, y: 10 });
      gsap.set(masks, { scaleX: 1, backgroundColor: "#0a0a0a" }); // Match --ink

      // Animate immediately on load
      const tl = gsap.timeline({ delay: 0.5 });
      tl.to(masks, { 
        scaleX: 0, 
        duration: 1, 
        ease: "power4.inOut", 
        stagger: 0.2,
        transformOrigin: "right center" 
      })
      .to(inners, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2 
      }, "-=0.8");
    }
  });
}
*/



function initIntroAnimation() {
  const introElements = document.querySelectorAll('.intro__content .js-classified');
  
  // 1. We create one master timeline for all intro elements
  // This ensures the Title, Subtitle, and Body reveal one after another (staggered)
  const masterTl = gsap.timeline({ delay: 0.8 });

  introElements.forEach((el, index) => {
    const built = buildClassifiedLines(el);
    if (built) {
      const { inners, masks } = built;
      
      // Set initial state: Mask fully covers text, text is slightly shifted
      gsap.set(inners, { opacity: 0, y: 15 });
      gsap.set(masks, { scaleX: 1, backgroundColor: "#0a0a0a" }); 

      // 2. Add animations to the master timeline
      // Slowed duration to 1.6s and increased stagger to 0.4s for a "gradual" feel
      masterTl.to(masks, { 
        scaleX: 0, 
        duration: 1.6,            // Much slower reveal
        ease: "expo.inOut",       // Starts slow, speeds up, ends slow
        stagger: 0.4,             // More delay between each line of text
        transformOrigin: "right center" 
      }, index * 0.5)             // Offsets the start of the next block (Subtitle vs Title)
      
      .to(inners, { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power2.out",
        stagger: 0.4 
      }, "<0.3");                 // Starts shortly after the mask begins moving
    }
  });
}



