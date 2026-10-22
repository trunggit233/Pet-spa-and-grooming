/* ==========================================================================
   Scroll Animations — Intersection Observer based
   ========================================================================== */

export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-stagger'
  );

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

