// Shared behaviour for index.html and the case-study pages.
// Loaded at the end of <body>, so the DOM is already parsed.
//
// Section fade-in is handled entirely in CSS (the fadeUp keyframe), not here.
// Nothing in this file is allowed to control whether content is visible: if it
// fails to load, the pages must still render.

// ── NAV DROPDOWN ("Projects") ──
const closeAllDropdowns = () => {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => {
    d.classList.remove('open');
    const t = d.querySelector('.nav-dropdown-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
};

document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const trigger = dropdown.querySelector('.nav-dropdown-trigger');
  if (!trigger) return;

  // Set from script rather than in the markup: without the JS the menu never
  // opens, so advertising it as a popup would be a lie.
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  // Escape closes the menu and puts focus back on the trigger, so keyboard
  // users are not dropped at the top of the document.
  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      closeAllDropdowns();
      trigger.focus();
    }
  });
});

document.addEventListener('click', closeAllDropdowns);

// ── LIGHTBOX for case study and about-page images ──
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

// Shared across every page, so skip rather than throw if a page has no lightbox
// markup — an exception here would take the rest of this file down with it.
if (lightboxOverlay && lightboxImg && lightboxCaption && lightboxClose) {
  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Where focus came from, so it can be handed back on close.
  let lastFocused = null;

  const isOpen = () => lightboxOverlay.classList.contains('active');

  const openLightbox = (src, alt, caption) => {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    // Both the class and the attribute: the class drives the CSS, the
    // attribute keeps the dialog out of the accessibility tree while closed.
    lightboxOverlay.hidden = false;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!isOpen()) return;
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  };

  // Case-study figures only. The index hero polaroid (.about-photo-frame) is
  // deliberately left out: it is a portrait, not a screenshot someone needs to
  // zoom into, so it stays a plain image with no control affordances.
  // :not([alt=""]) skips decorative art — the persona-map avatar is already
  // described by the diagram around it and is nothing to enlarge.
  document.querySelectorAll(
    '.cs-figure img, .sidebar-img-real img, .cs-slide-figure img:not([alt=""]), .cs-slide-annot img'
  ).forEach(img => {
    // These images are controls, not decoration: give them a role, put them in
    // the tab order, and name them. Done here rather than in the markup so the
    // promise disappears along with the script if it fails to load.
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    if (!img.hasAttribute('aria-label')) {
      const label = img.getAttribute('alt');
      img.setAttribute('aria-label', label ? `View larger: ${label}` : 'View larger image');
    }

    // Wrap the image so it can carry a visible zoom affordance. A cursor alone
    // says nothing on a touch screen, where most of these get read, so the
    // corner glyph is always on rather than hover-only. Built here for the
    // same reason as the attributes above: if this script never runs, no
    // affordance appears and nothing has been promised.
    if (!img.parentElement.classList.contains('zoom-wrap')) {
      const wrap = document.createElement('span');
      wrap.className = 'zoom-wrap';
      img.replaceWith(wrap);
      wrap.appendChild(img);

      const hint = document.createElement('span');
      hint.className = 'zoom-wrap-hint';
      // Decorative: the image beside it already carries the accessible name.
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML = '<svg viewBox="0 0 24 24" focusable="false">'
        + '<path d="M9.5 3.5h-6v6M3.5 3.5l7 7M14.5 20.5h6v-6M20.5 20.5l-7-7"/></svg>';
      wrap.appendChild(hint);
    }

    const open = () => {
      const figure = img.closest('.cs-figure-col') || img.closest('.cs-slide-figure') || img.closest('.cs-figure') || img.closest('.sidebar-img-real') || img.closest('.about-photo-card');
      const captionEl = figure ? figure.querySelector('.cs-figure-caption, .sidebar-img-real-caption, .about-photo-caption, figcaption') : null;
      openLightbox(img.src, img.alt, captionEl ? captionEl.textContent : '');
    };

    img.addEventListener('click', open);
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        open();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Keep Tab inside the dialog while it is open, so focus cannot wander into
  // the page behind the overlay.
  lightboxOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !isOpen()) return;
    const items = Array.from(lightboxOverlay.querySelectorAll(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// ── "THE DETAILS" CAROUSEL (case study 04) ──
// The track scrolls and snaps by itself in CSS. Everything here is an
// enhancement on top of that: the prev/next buttons, the arrow keys, and the
// position readout. If this never runs, the track is still a swipeable,
// scrollable row and all six slides stay reachable.
const carousel = document.querySelector('.cs-carousel');
const carouselTrack = carousel && carousel.querySelector('.cs-carousel-track');
const carouselSlides = carouselTrack
  ? Array.from(carouselTrack.querySelectorAll('.cs-slide'))
  : [];

if (carouselTrack && carouselSlides.length) {
  const readout = carousel.querySelector('[data-carousel-count]');
  const buttons = Array.from(carousel.querySelectorAll('[data-carousel-dir]'));
  const total = carouselSlides.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Position is a division by the slide pitch — slide width plus the gap
  // between slides. Taken from the distance between the first two slides
  // rather than assumed, so it survives any change to that gap in CSS.
  // Measured once per layout rather than per scroll event: reading it back on
  // every frame of a swipe would force a synchronous layout each time.
  let step = 0;
  let padY = 0;
  const measure = () => {
    const first = carouselSlides[0].getBoundingClientRect();
    step = total > 1
      ? carouselSlides[1].getBoundingClientRect().left - first.left
      : first.width;
    padY = parseFloat(getComputedStyle(carouselTrack).paddingTop) * 2 || 0;
  };

  const indexNow = () => {
    if (!step) return 0;
    return Math.min(Math.max(Math.round(carouselTrack.scrollLeft / step), 0), total - 1);
  };

  // Narrow screens stack each slide, which leaves them wildly different
  // heights; a track sized to the tallest strands the short ones above a
  // screenful of nothing. So the track follows what is actually on screen.
  // Sized to the taller of the two slides a swipe sits between, never just the
  // settled one — otherwise the incoming card is clipped for the first half of
  // every swipe. On mobile the card fills the viewport, so the reflow this
  // causes below the fold is not something the reader can see.
  const stacked = window.matchMedia('(max-width: 760px)');
  let lastHeight = null;

  const syncHeight = () => {
    if (!stacked.matches || !step) {
      if (lastHeight !== null) {
        carouselTrack.style.height = '';
        lastHeight = null;
      }
      return;
    }
    const pos = carouselTrack.scrollLeft / step;
    const clamp = (n) => Math.min(Math.max(n, 0), total - 1);
    const from = carouselSlides[clamp(Math.floor(pos))];
    const to = carouselSlides[clamp(Math.ceil(pos))];
    const height = Math.round(Math.max(
      from.getBoundingClientRect().height,
      to.getBoundingClientRect().height
    ) + padY);
    // Only written when it actually changes, so a swipe does not restyle the
    // track on every single scroll event.
    if (height !== lastHeight) {
      carouselTrack.style.height = height + 'px';
      lastHeight = height;
    }
  };

  let current = -1;
  // While a programmatic glide is in flight, it already knows where it is
  // going; readings taken off scrollLeft mid-animation would flip the counter
  // to the slide being passed and then back, announcing a position the reader
  // never lands on.
  let settleBy = 0;

  const applyIndex = (index) => {
    if (index === current) return;
    current = index;

    // Only written when the index actually changes: this is a live region,
    // and a swipe would otherwise announce every intermediate frame.
    if (readout) readout.textContent = index + 1 + ' / ' + total;

    buttons.forEach(button => {
      const spent = button.dataset.carouselDir === 'prev'
        ? index === 0
        : index === total - 1;
      // Disabling the focused button would drop focus to the body, so hand it
      // to its opposite number first.
      if (spent && document.activeElement === button) {
        const other = buttons.find(b => b !== button);
        if (other) other.focus();
      }
      button.disabled = spent;
    });
  };

  // Derives the index from the track's actual position. Used for gestures and
  // native scrolling, where nothing else knows where the reader has got to.
  const render = () => {
    if (Date.now() < settleBy) return;
    applyIndex(indexNow());
  };

  const goTo = (index) => {
    const clamped = Math.min(Math.max(index, 0), total - 1);
    const smooth = !reduceMotion.matches;
    // Claim the readout for the length of the glide, then update it straight
    // away: a smooth scroll reports its old position for as long as it is
    // animating, and on some engines a programmatic scroll fires no scroll
    // event at all — either way the counter must not wait for one.
    settleBy = smooth ? Date.now() + 600 : 0;
    carouselTrack.scrollTo({
      left: clamped * step,
      behavior: smooth ? 'smooth' : 'auto'
    });
    applyIndex(clamped);
  };

  // ── SWIPE: one gesture, one slide ──
  // scroll-snap-stop is the CSS answer to "don't fly past a card", but WebKit
  // does not honour it, so on iOS a hard flick still crosses several slides.
  // Rather than fight the platform's inertia, take the horizontal gesture over
  // outright: `touch-action: pan-y pinch-zoom` (set in CSS alongside
  // .is-enhanced) stops the browser panning this track natively, so there is no
  // momentum to cancel — we move it ourselves and land on exactly one step.
  // Vertical drags are left entirely alone so the page still scrolls, and
  // pinch-zoom is preserved.
  let swipeX = 0, swipeY = 0, swipeFrom = 0, swipeAxis = null, swiping = false;
  let snapRestore = null;

  // Snapping has to be off mid-drag: with it on, each scrollLeft write gets
  // pulled to the nearest card and the slide fights the finger.
  const suspendSnap = () => { carouselTrack.style.scrollSnapType = 'none'; };
  const resumeSnap = () => {
    clearTimeout(snapRestore);
    // Wait for the programmatic glide to finish, or snapping grabs the track
    // mid-flight and lands it on whichever card is nearest right now.
    snapRestore = setTimeout(() => { carouselTrack.style.scrollSnapType = ''; }, 480);
  };

  carouselTrack.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    swipeX = e.touches[0].clientX;
    swipeY = e.touches[0].clientY;
    swipeFrom = carouselTrack.scrollLeft;
    swipeAxis = null;
    swiping = true;
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!swiping || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - swipeX;
    const dy = e.touches[0].clientY - swipeY;

    if (swipeAxis === null) {
      // Not enough travel yet to say which way this gesture is going.
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      swipeAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (swipeAxis === 'x') suspendSnap();
    }
    if (swipeAxis !== 'x') return;

    // Follow the finger 1:1 within the track's own bounds.
    const max = (total - 1) * step;
    carouselTrack.scrollLeft = Math.min(Math.max(swipeFrom - dx, 0), max);
  }, { passive: true });

  const endSwipe = (e) => {
    if (!swiping) return;
    swiping = false;
    if (swipeAxis !== 'x') { swipeAxis = null; return; }

    const touch = e.changedTouches && e.changedTouches[0];
    const dx = touch ? touch.clientX - swipeX : 0;
    // A short flick should still count; anything less is treated as a misfire
    // and springs back to where it started.
    const threshold = Math.min(56, step * 0.15);
    const from = step ? Math.round(swipeFrom / step) : 0;

    let target = from;
    if (dx <= -threshold) target = from + 1;
    else if (dx >= threshold) target = from - 1;

    goTo(target);
    resumeSnap();
    swipeAxis = null;
  };

  carouselTrack.addEventListener('touchend', endSwipe, { passive: true });
  carouselTrack.addEventListener('touchcancel', endSwipe, { passive: true });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      goTo(indexNow() + (button.dataset.carouselDir === 'next' ? 1 : -1));
    });
  });

  // Bound to the carousel rather than the document so the arrow keys keep
  // behaving normally everywhere else on the page.
  carousel.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    goTo(indexNow() + (e.key === 'ArrowRight' ? 1 : -1));
  });

  // The swipe hint has served its purpose the moment the reader swipes, so it
  // retires on the first scroll rather than pulsing for the whole visit.
  carouselTrack.addEventListener('scroll', function retire() {
    carousel.classList.add('has-swiped');
    carouselTrack.removeEventListener('scroll', retire);
  });

  // Called straight from the scroll event rather than deferred into a frame:
  // render() is pure arithmetic against the cached width and bails out unless
  // the index actually moved, so it is cheap enough to run inline — and the
  // readout cannot go stale if requestAnimationFrame is throttled.
  carouselTrack.addEventListener('scroll', () => {
    render();      // gated while a programmatic glide owns the readout
    syncHeight();  // never gated: the track must resize as slides come into view
  });

  // Slide pitch and heights both track the viewport, so everything cached here
  // goes stale on resize.
  window.addEventListener('resize', () => {
    measure();
    current = -1;
    render();
    syncHeight();
  });

  // Slide heights shift as the lazily-loaded artwork arrives, so re-fit once it
  // has landed rather than trusting the very first measurement.
  window.addEventListener('load', () => {
    measure();
    syncHeight();
  });

  // Reveals the nav and hides the native scrollbar. Set from script for the
  // same reason the dropdown sets aria-haspopup from script: until this line
  // runs, those buttons do nothing and the scrollbar is the real control.
  carousel.classList.add('is-enhanced');

  measure();
  render();
  syncHeight();
}
