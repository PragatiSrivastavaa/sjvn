(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.menuParentRedirect = {
    attach: function (context) {
      // Target all menus — main or sidebar
      once('menuParentRedirect', 'ul.menu a[href="#"], ul.menu a[href=""]', context).forEach(function (parentLink) {
        parentLink.addEventListener('click', function (e) {
          e.preventDefault();

          const parentLi = parentLink.closest('li');
          if (!parentLi) return;

          // 1️⃣ Try to find first child link in submenu
          let firstChild = parentLi.querySelector('ul li a[href]:not([href="#"]):not([href=""])');

          // 2️⃣ If submenu is collapsed and not rendered, try to find
          //    the next visible menu link at the same level
          if (!firstChild) {
            const nextMenuItem = parentLi.nextElementSibling;
            if (nextMenuItem) {
              firstChild = nextMenuItem.querySelector('a[href]:not([href="#"]):not([href=""])');
            }
          }

          // 3️⃣ If still not found, try to find a link inside the same region
          if (!firstChild) {
            const region = parentLi.closest('.region-right-menu, .menu--main');
            if (region) {
              firstChild = region.querySelector('ul.menu li a[href]:not([href="#"]):not([href=""])');
            }
          }

          if (firstChild) {
            window.location.href = firstChild.href;
          } else {
            console.warn('No child or next sibling link found for:', parentLink);
          }
        });
      });
    }
  };
})(Drupal, once);
