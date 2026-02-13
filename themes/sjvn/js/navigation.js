/**
 * Navigation submenu positioning handler for Superfish menu
 * 
 * Menu Behavior:
 * - Main menu items (Level 1): Show submenus on HOVER
 * - Nested submenu items (Level 2+): Expand on CLICK (toggle with arrow)
 * 
 * This ensures:
 * 1. Quick access to primary navigation via hover
 * 2. Controlled expansion of nested submenus via click
 * 3. All levels of nested menus are accessible
 */
(function () {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function () {
    const superfishMain = document.getElementById('superfish-main');
    const navList = document.getElementById('nav-list');

    // Setup nav-list scroll controls (new template-based arrows)
    setupNavListScrollControls();

    if (!superfishMain) return;

    // Function to setup nav-list scroll controls
    function setupNavListScrollControls() {
      const navList = document.getElementById('nav-list');
      const leftBtn = document.querySelector('.nav-scroll-left');
      const rightBtn = document.querySelector('.nav-scroll-right');

      if (!navList || !leftBtn || !rightBtn) return;

      // Scroll amount in pixels
      const scrollAmount = 200;

      // Handle left arrow click
      leftBtn.addEventListener('click', function () {
        navList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      // Handle right arrow click
      rightBtn.addEventListener('click', function () {
        navList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });

      // Update button states based on scroll position
      function updateButtonStates() {
        const scrollLeft = navList.scrollLeft;
        const maxScroll = navList.scrollWidth - navList.clientWidth;

        // Disable left button if at start
        if (scrollLeft <= 0) {
          leftBtn.disabled = true;
          leftBtn.style.opacity = '0.3';
        } else {
          leftBtn.disabled = false;
          leftBtn.style.opacity = '1';
        }

        // Disable right button if at end
        if (scrollLeft >= maxScroll - 1) {
          rightBtn.disabled = true;
          rightBtn.style.opacity = '0.3';
        } else {
          rightBtn.disabled = false;
          rightBtn.style.opacity = '1';
        }
      }

      // Update button states on scroll
      navList.addEventListener('scroll', updateButtonStates);

      // Update button states on window resize
      window.addEventListener('resize', updateButtonStates);

      // Initial button state update
      updateButtonStates();

      // Update after a short delay to account for menu rendering
      setTimeout(updateButtonStates, 500);
    }


    // Function to position submenu below its parent (Level 1)
    function positionSubmenu(menuItem, submenu) {
      const rect = menuItem.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Position submenu directly below the menu item
      submenu.style.top = (rect.bottom) + 'px';
      submenu.style.left = rect.left + 'px';

      // Check if submenu goes off-screen to the right
      if (rect.left + submenuRect.width > viewportWidth) {
        submenu.style.left = (rect.right - submenuRect.width) + 'px';
      }

      // Check if submenu goes off-screen to the bottom
      if (rect.bottom + submenuRect.height > viewportHeight) {
        submenu.style.top = (rect.top - submenuRect.height) + 'px';
      }

      // Ensure submenu stays within viewport bounds
      const finalLeft = parseFloat(submenu.style.left);
      if (finalLeft < 0) {
        submenu.style.left = '0px';
      }
    }

    // Function to position nested submenu to the right (Level 2+)
    function positionNestedSubmenu(menuItem, submenu) {
      const parentRect = menuItem.getBoundingClientRect();
      const parentLi = menuItem.closest('li');
      const submenuRect = submenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Reset positioning to default (to the right of parent)
      submenu.style.left = '100%';
      submenu.style.right = 'auto';
      submenu.style.top = '0px';
      submenu.style.marginLeft = '-6px';

      // Check if submenu would overflow viewport on the right
      const wouldOverflowRight = parentRect.right + submenuRect.width > viewportWidth - 10;

      if (wouldOverflowRight) {
        // Position to the left of parent instead
        submenu.style.left = 'auto';
        submenu.style.right = '100%';
        submenu.style.marginLeft = '0px';
        submenu.style.marginRight = '-6px';
      }

      // Handle bottom-edge overflow
      const submenuBottom = parentRect.top + submenuRect.height;
      if (submenuBottom > viewportHeight - 10) {
        const topAdjustment = Math.min(0, viewportHeight - submenuBottom - 10);
        submenu.style.top = topAdjustment + 'px';
      }
    }


    // Function to setup nested submenu behavior
    function setupNestedMenuBehavior() {
      // Mark items with children for styling
      const nestedMenuItems = superfishMain.querySelectorAll('li.menuparent:not(.sf-depth-1)');
      nestedMenuItems.forEach(function (menuItem) {
        menuItem.classList.add('has-submenu');
      });

      console.log('All submenus are positioned as overlays');
    }

    // Helper function to determine nesting level
    function getNestingLevel(element) {
      let level = 0;
      let parent = element.parentElement;
      while (parent && parent !== superfishMain) {
        if (parent.tagName === 'UL') {
          level++;
        }
        parent = parent.parentElement;
      }
      return level;
    }

    // Scroll indicators removed - submenus now show full height without scrolling

    // Function to handle submenu initialization
    function handleSubmenuInitialization() {
      setupNestedMenuBehavior();
    }

    // Initialize nested menu behavior immediately
    setupNestedMenuBehavior();

    // Run again after a short delay to catch Superfish initialization
    setTimeout(setupNestedMenuBehavior, 100);
    setTimeout(setupNestedMenuBehavior, 500);

    // Re-initialize on window resize
    window.addEventListener('resize', setupNestedMenuBehavior);

    // Handle scroll events
    if (superfishMain) {
      superfishMain.addEventListener('scroll', handleSubmenuInitialization);
    }

    // Handle hover and focus events for all menu levels
    function setupMenuEvents() {
      const allMenuItems = superfishMain.querySelectorAll('li');

      allMenuItems.forEach(function (menuItem) {
        const submenu = menuItem.querySelector(':scope > ul');
        const link = menuItem.querySelector(':scope > a');

        // Function helpers for show/hide with types
        const parentUl = menuItem.parentElement;
        const isMainSubmenu = parentUl && (parentUl.id === 'superfish-main' || parentUl.id === 'nav-list' || parentUl.classList.contains('sf-menu'));

        const showFn = () => {
          if (window.innerWidth < 992) return;
          if (submenu) {
            if (isMainSubmenu) {
              positionSubmenu(menuItem, submenu);
              submenu.style.transform = 'translateY(0)';
            } else {
              positionNestedSubmenu(menuItem, submenu);
              submenu.style.transform = 'translateX(0)';
            }
            submenu.style.transitionDelay = '0s';
            submenu.style.opacity = '1';
            submenu.style.visibility = 'visible';
          }
        };

        const hideFn = () => {
          if (window.innerWidth < 992) return;
          if (submenu) {
            submenu.style.transitionDelay = '0.1s';
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
            if (isMainSubmenu) {
              submenu.style.transform = 'translateY(-10px)';
            } else {
              submenu.style.transform = 'translateX(-10px)';
            }
          }
        };

        if (submenu) {
          menuItem.addEventListener('mouseenter', showFn);
          menuItem.addEventListener('mouseleave', hideFn);
          menuItem.addEventListener('focusin', showFn);
          menuItem.addEventListener('focusout', (e) => {
            if (!menuItem.contains(e.relatedTarget)) {
              hideFn();
            }
          });
        }

        // --- KEYBOARD NAVIGATION (WCAG 2.4.3) ---
        if (link) {
          link.addEventListener('keydown', function (e) {
            const items = Array.from(menuItem.parentElement.children);
            const index = items.indexOf(menuItem);

            switch (e.key) {
              case 'Enter':
              case ' ':
                if (submenu) {
                  e.preventDefault();
                  showFn();
                  const firstSubLink = submenu.querySelector('a');
                  if (firstSubLink) firstSubLink.focus();
                }
                break;

              case 'ArrowDown':
                e.preventDefault();
                if (submenu && submenu.style.visibility === 'visible') {
                  const firstSubLink = submenu.querySelector('a');
                  if (firstSubLink) firstSubLink.focus();
                } else if (index < items.length - 1) {
                  const nextLink = items[index + 1].querySelector('a');
                  if (nextLink) nextLink.focus();
                }
                break;

              case 'ArrowUp':
                e.preventDefault();
                if (index > 0) {
                  const prevLink = items[index - 1].querySelector('a');
                  if (prevLink) prevLink.focus();
                }
                break;

              case 'ArrowRight':
                if (submenu) {
                  e.preventDefault();
                  showFn();
                  const firstSubLink = submenu.querySelector('a');
                  if (firstSubLink) firstSubLink.focus();
                } else if (isMainSubmenu && index < items.length - 1) {
                  const nextLink = items[index + 1].querySelector('a');
                  if (nextLink) nextLink.focus();
                }
                break;

              case 'ArrowLeft':
                if (!isMainSubmenu) {
                  e.preventDefault();
                  const parentLink = menuItem.parentElement.parentElement.querySelector('a');
                  if (parentLink) {
                    parentLink.focus();
                    const parentSubmenu = menuItem.parentElement;
                    parentSubmenu.style.visibility = 'hidden';
                    parentSubmenu.style.opacity = '0';
                  }
                } else if (index > 0) {
                  const prevLink = items[index - 1].querySelector('a');
                  if (prevLink) prevLink.focus();
                }
                break;

              case 'Escape':
                e.preventDefault();
                hideFn();
                if (!isMainSubmenu) {
                  const parentLink = menuItem.parentElement.parentElement.querySelector('a');
                  if (parentLink) parentLink.focus();
                }
                break;
            }
          });

          // DISABLING LINKS ON HOMEPAGE
          link.addEventListener('click', function (e) {
            const isFrontPage = document.body.classList.contains('path-frontpage') ||
              document.body.classList.contains('front');
            if (isFrontPage && submenu) {
              e.preventDefault();
              e.stopImmediatePropagation();
              return false;
            }
          });

          // Fallback Href for Homepage
          const isFrontPage = document.body.classList.contains('path-frontpage') ||
            document.body.classList.contains('front');
          if (isFrontPage && submenu && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            link.setAttribute('href', 'javascript:void(0)');
          }
        }
      });
    }

    // Initialize events
    setupMenuEvents();

    // GLOBAL DELEGATION TO DISABLE PARENT LINKS (Interception)
    // Only apply on Homepage as per user request
    document.addEventListener('click', function (e) {
      // Check if we are on the homepage
      const isFrontPage = document.body.classList.contains('path-frontpage') ||
        document.body.classList.contains('front') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/index.php');

      if (!isFrontPage) return; // Exit if not on homepage, allowing links to work

      // Find the closest link being clicked
      const link = e.target.closest('a');
      if (!link) return;

      const parentLi = link.parentElement;
      if (!parentLi) return;

      // Check if this link is a parent (has a dropdown)
      const hasSubmenu = parentLi.querySelector(':scope > ul');

      if (hasSubmenu) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Homepage Interception: Navigation blocked for parent link:', link.textContent.trim());

        // Trigger mobile menu toggle if on mobile
        if (window.innerWidth < 992) {
          mobileClickHandler.call(link, e);
        }
        return false;
      }
    }, true); // Use capture phase

    // MOBILE MENU CLICK HANDLER
    function setupMobileMenuClicks() {
      const parentLinks = superfishMain.querySelectorAll('li.menuparent > a');

      parentLinks.forEach(function (link) {
        // Remove any existing click listeners to avoid double firing
        link.removeEventListener('click', mobileClickHandler);
        link.addEventListener('click', mobileClickHandler);
      });
    }

    function mobileClickHandler(e) {
      // Only apply this logic on mobile and tablet view (up to 992px)
      if (window.innerWidth < 992) {
        const parentLi = this.parentElement;
        const submenu = parentLi.querySelector(':scope > ul');

        if (submenu) {
          // 🚫 Stop navigation and hover events
          e.preventDefault();
          e.stopPropagation();

          const isOpen = parentLi.classList.contains('is-open');

          // Close sibling submenus (accordion effect)
          const siblings = parentLi.parentElement.querySelectorAll(':scope > li.menuparent');
          siblings.forEach(li => {
            if (li !== parentLi) li.classList.remove('is-open');
          });

          // Toggle current submenu
          if (isOpen) {
            parentLi.classList.remove('is-open');
            // Clear inline styles to ensure static positioning works
            submenu.style.top = '';
            submenu.style.left = '';
            submenu.style.transform = '';
          } else {
            parentLi.classList.add('is-open');
            // Ensure inline styles don't conflict with accordion layout
            submenu.style.top = '';
            submenu.style.left = '';
            submenu.style.transform = '';
          }
        }
      }
    }

    // Initialize mobile clicks
    setupMobileMenuClicks();

    // Reposition visible submenus on window resize and scroll
    let resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        // Only reposition on desktop
        if (window.innerWidth < 992) return;

        // Reposition all visible submenus
        const allSubmenus = superfishMain.querySelectorAll('ul');
        allSubmenus.forEach(function (submenu) {
          const menuItem = submenu.parentElement;
          if (submenu.style.visibility === 'visible' || submenu.style.opacity === '1') {
            const parentSubmenu = menuItem.closest('ul');
            const isMainSubmenu = !parentSubmenu || parentSubmenu === superfishMain;

            if (isMainSubmenu) {
              positionSubmenu(menuItem, submenu);
            } else {
              positionNestedSubmenu(menuItem, submenu);
            }
          }
        });
      }, 100);
    });

    window.addEventListener('scroll', function () {
      // Only reposition on desktop
      if (window.innerWidth < 992) return;

      // Reposition all visible submenus on scroll
      const allSubmenus = superfishMain.querySelectorAll('ul');
      allSubmenus.forEach(function (submenu) {
        const menuItem = submenu.parentElement;
        if (submenu.style.visibility === 'visible' || submenu.style.opacity === '1') {
          const parentSubmenu = menuItem.closest('ul');
          const isMainSubmenu = !parentSubmenu || parentSubmenu === superfishMain;

          if (isMainSubmenu) {
            positionSubmenu(menuItem, submenu);
          } else {
            positionNestedSubmenu(menuItem, submenu);
          }
        }
      });
    });

    // Debug function to check all menu levels
    function debugAllMenuLevels() {
      const level1Menus = superfishMain.querySelectorAll('> li');
      const level2Menus = superfishMain.querySelectorAll('ul > li');
      const level3Menus = superfishMain.querySelectorAll('ul ul > li');
      const level4Menus = superfishMain.querySelectorAll('ul ul ul > li');

      console.log('=== Menu Level Debug ===');
      console.log('Level 1 menu items:', level1Menus.length);
      console.log('Level 2 menu items:', level2Menus.length);
      console.log('Level 3 menu items:', level3Menus.length);
      console.log('Level 4 menu items:', level4Menus.length);

      // Check which items have submenus
      level2Menus.forEach(function (item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 2 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });

      level3Menus.forEach(function (item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 3 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });

      level4Menus.forEach(function (item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 4 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });
    }

    // Run debug function
    debugAllMenuLevels();

    // Initialize nested menu behavior
    setTimeout(function () {
      setupNestedMenuBehavior();
      console.log('Nested submenu hover behavior initialized');
    }, 1000);

    // Handle Superfish initialization if it exists
    if (typeof Drupal !== 'undefined' && Drupal.behaviors.superfish) {
      // Wait for Superfish to initialize
      setTimeout(function () {
        setupNestedMenuBehavior();
        setupMenuEvents(); // Re-setup events after Superfish loads
        debugAllMenuLevels(); // Debug again after Superfish loads
      }, 500);
    }
  });
})();
