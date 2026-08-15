// Shared behaviour for index.html and the case-study pages.
// Loaded at the end of <body>, so the DOM is already parsed.

// ── SCROLL-TRIGGERED FADE-IN ──
// Sections start at opacity 0 in CSS and are revealed by adding .visible.
// .case-study is the whole article body on a case-study page; .hero and
// .toc-section are the homepage's two sections.
const REVEAL_SELECTOR = '.case-study, .hero, .toc-section';

// Trigger once a section has crossed 12% up into the viewport (rootMargin)
// rather than on intersectionRatio. A ratio threshold is measured against the
// element's own area, so the same threshold fires at a different scroll
// position for a short section than for a page-length one, and for a section
// tall enough it cannot fire at all. The viewport-relative trigger behaves the
// same regardless of section height.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => el.classList.add('visible'));
}

// ── NAV DROPDOWN ("Projects") ──
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const trigger = dropdown.querySelector('.nav-dropdown-trigger');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    if (!isOpen) dropdown.classList.add('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
});

// ── LIGHTBOX for case study and about-page images ──
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

// Shared across every page, so skip rather than throw if a page has no lightbox
// markup — an exception here would take the rest of this file down with it.
if (lightboxOverlay && lightboxImg && lightboxCaption && lightboxClose) {
  const openLightbox = (src, alt, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.cs-figure img, .sidebar-img-real img, .about-photo-frame img').forEach(img => {
    img.addEventListener('click', () => {
      const figure = img.closest('.cs-figure-col') || img.closest('.cs-figure') || img.closest('.sidebar-img-real') || img.closest('.about-photo-card');
      const captionEl = figure ? figure.querySelector('.cs-figure-caption, .sidebar-img-real-caption, .about-photo-caption') : null;
      openLightbox(img.src, img.alt, captionEl ? captionEl.textContent : '');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
