/* ==========================================================================
   Main JS — Entry Point
   ========================================================================== */

import { initNavigation } from './navigation.js';
import { initScrollAnimations } from './animations.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initForm();
});

