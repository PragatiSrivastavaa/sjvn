(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.menuParentRedirect = {
    attach: function (context) {
      once('menuParentRedirect', 'ul.menu a[href="#"], ul.menu a[href=""]', context).forEach(function (parentLink) {

        // Find the first valid child link ahead of time
        const parentLi = parentLink.closest('li');
        if (!parentLi) return;

        let firstChild = parentLi.querySelector('ul li a[href]:not([href="#"]):not([href=""])');

        if (!firstChild) {
          const nextMenuItem = parentLi.nextElementSibling;
          if (nextMenuItem) {
            firstChild = nextMenuItem.querySelector('a[href]:not([href="#"]):not([href=""])');
          }
        }

        if (!firstChild) {
          const region = parentLi.closest('.region-right-menu, .menu--main');
          if (region) {
            firstChild = region.querySelector('ul.menu li a[href]:not([href="#"]):not([href=""])');
          }
        }

        // ✅ If child found, set its real URL on the parent <a>
        if (firstChild) {
          parentLink.setAttribute('href', firstChild.getAttribute('href'));
        }

      });
    }
  };
})(Drupal, once);
