import { initThemeSwitcher } from './modules/themeSwitcher';
import { initHeroCarousel } from './modules/heroCarousel';
import { initAnnouncements } from './modules/announcements';
import { initPowerStations } from './modules/powerStations';
import { initBusiness } from './modules/business';
import { initQuickLinks } from './modules/quickLinks';
import { initSearchToggle } from './modules/search';
import { initAccessibility } from './modules/accessibility';
import { initMenuScroll } from './modules/menuScroll';
import { initA11yPanel } from './modules/a11yPanel';

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initHeroCarousel();
  initAnnouncements();
  initPowerStations();
  initBusiness();
  initQuickLinks();
  initSearchToggle();
  initAccessibility();
  initMenuScroll();
  initA11yPanel();
});


