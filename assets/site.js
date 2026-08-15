// Shared behaviour for index.html and the case-study pages.
// Loaded at the end of <body>, so the DOM is already parsed.
//
// Section fade-in is handled entirely in CSS (the fadeUp keyframe), not here.
// Nothing in this file is allowed to control whether content is visible: if it
// fails to load, the pages must still render.

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
