/* ==========================================================================
   Navigation — Mobile menu, smooth scroll, sticky header
   ========================================================================== */

export function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');

  // --- Mobile menu toggle ---
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!isOpen));
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // --- Sticky header on scroll ---
  if (header) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('header--scrolled', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    // Observe a sentinel element at the top of the page
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile menu after clicking
        if (nav) nav.setAttribute('data-open', 'false');
      }
    });
  });
}

