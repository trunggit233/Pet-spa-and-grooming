export function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!isOpen));
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  if (header) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('header--scrolled', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (nav) nav.setAttribute('data-open', 'false');
      }
    });
  });
}
