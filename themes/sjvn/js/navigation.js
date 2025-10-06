/**
 * Navigation submenu positioning handler for Superfish menu
 * Ensures submenus appear correctly outside the navigation container
 */
(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const superfishMain = document.getElementById('superfish-main');
    const navList = document.getElementById('nav-list');
    
    if (!superfishMain) return;

    // Create scroll arrows
    createScrollArrows();

    // Function to create scroll arrows
    function createScrollArrows() {
      const arrowsContainer = document.createElement('div');
      arrowsContainer.className = 'nav-scroll-arrows';
      
      const leftArrow = document.createElement('button');
      leftArrow.className = 'nav-scroll-arrow';
      leftArrow.innerHTML = '‹';
      leftArrow.setAttribute('aria-label', 'Scroll left');
      
      const rightArrow = document.createElement('button');
      rightArrow.className = 'nav-scroll-arrow';
      rightArrow.innerHTML = '›';
      rightArrow.setAttribute('aria-label', 'Scroll right');
      
      arrowsContainer.appendChild(leftArrow);
      arrowsContainer.appendChild(rightArrow);
      
      // Insert arrows into the navigation container
      const navContainer = superfishMain.parentElement;
      if (navContainer) {
        navContainer.style.position = 'relative';
        navContainer.appendChild(arrowsContainer);
      }
      
      // Add scroll functionality
      leftArrow.addEventListener('click', function() {
        superfishMain.scrollBy({ left: -200, behavior: 'smooth' });
      });
      
      rightArrow.addEventListener('click', function() {
        superfishMain.scrollBy({ left: 200, behavior: 'smooth' });
      });
      
      // Update arrow states based on scroll position
      function updateArrowStates() {
        const scrollLeft = superfishMain.scrollLeft;
        const maxScroll = superfishMain.scrollWidth - superfishMain.clientWidth;
        
        leftArrow.disabled = scrollLeft <= 0;
        rightArrow.disabled = scrollLeft >= maxScroll - 1;
      }
      
      superfishMain.addEventListener('scroll', updateArrowStates);
      updateArrowStates(); // Initial state
    }

    // Function to position submenus correctly using fixed positioning
    function positionSubmenus() {
      // Get all menu items including those in submenus
      const allMenuItems = superfishMain.querySelectorAll('li');
      
      allMenuItems.forEach(function(menuItem) {
        const submenu = menuItem.querySelector('ul');
        if (!submenu) return;

        // Get the menu item's position relative to the viewport
        const menuItemRect = menuItem.getBoundingClientRect();
        const submenuWidth = 200; // min-width from CSS
        const viewportWidth = window.innerWidth;
        const rightEdge = menuItemRect.right + submenuWidth;
        
        // Calculate position for fixed submenu
        let leftPosition = menuItemRect.left;
        let topPosition = menuItemRect.bottom + 2; // Small gap for easier navigation
        
        // If submenu would go off-screen, position it to the left
        if (rightEdge > viewportWidth) {
          leftPosition = menuItemRect.right - submenuWidth;
        }
        
        // For multi-level submenus (sub-submenus), position them to the right
        const parentSubmenu = menuItem.closest('ul');
        if (parentSubmenu && parentSubmenu !== superfishMain) {
          leftPosition = menuItemRect.right + 5; // Small gap for easier access
          topPosition = menuItemRect.top;
        }
        
        // Apply fixed positioning
        submenu.style.position = 'fixed';
        submenu.style.left = leftPosition + 'px';
        submenu.style.top = topPosition + 'px';
        submenu.style.right = 'auto';
        submenu.style.transform = '';
        
        // Update scroll indicators
        updateScrollIndicators(submenu);
      });
    }

    // Function to update scroll indicators with height threshold
    function updateScrollIndicators(submenu) {
      const scrollTop = submenu.scrollTop;
      const scrollHeight = submenu.scrollHeight;
      const clientHeight = submenu.clientHeight;
      
      // Define height threshold - only show scroll after 5 items (approximately 220px)
      const itemHeight = 44; // Height of each menu item
      const thresholdItems = 5; // Number of items before scrolling
      const thresholdHeight = itemHeight * thresholdItems;
      
      // Remove existing classes
      submenu.classList.remove('scrollable-top', 'scrollable-bottom');
      
      // Only add scroll indicators if content exceeds threshold height
      if (scrollHeight > thresholdHeight) {
        // Enable scrolling
        submenu.style.maxHeight = '300px';
        submenu.style.overflowY = 'auto';
        
        if (scrollTop > 0) {
          submenu.classList.add('scrollable-top');
        }
        if (scrollTop < scrollHeight - clientHeight - 1) {
          submenu.classList.add('scrollable-bottom');
        }
      } else {
        // Disable scrolling for small menus
        submenu.style.maxHeight = 'none';
        submenu.style.overflowY = 'visible';
      }
    }

    // Function to handle scroll positioning
    function handleScrollPositioning() {
      positionSubmenus();
    }

    // Position submenus on page load
    positionSubmenus();

    // Reposition on window resize
    window.addEventListener('resize', positionSubmenus);

    // Handle scroll events
    if (superfishMain) {
      superfishMain.addEventListener('scroll', handleScrollPositioning);
    }

    // Handle hover events for all menu levels (including sub-submenus)
    function setupMenuHoverEvents() {
      const allMenuItems = superfishMain.querySelectorAll('li');
      let hoverTimeout;
      
      allMenuItems.forEach(function(menuItem) {
        const submenu = menuItem.querySelector('ul');
        
        if (submenu) {
          // Mouse enter - show submenu immediately
          menuItem.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            positionSubmenus();
            submenu.style.transitionDelay = '0s';
            submenu.style.opacity = '1';
            submenu.style.visibility = 'visible';
            submenu.style.transform = 'translateY(0)';
          });
          
          // Mouse leave - hide submenu with delay
          menuItem.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(function() {
              submenu.style.transitionDelay = '0.1s';
              submenu.style.opacity = '0';
              submenu.style.visibility = 'hidden';
              submenu.style.transform = 'translateY(-10px)';
            }, 150); // 150ms delay before hiding
          });
          
          // Keep submenu visible when hovering over it
          submenu.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            submenu.style.transitionDelay = '0s';
            submenu.style.opacity = '1';
            submenu.style.visibility = 'visible';
            submenu.style.transform = 'translateY(0)';
          });
          
          // Hide submenu when leaving it
          submenu.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(function() {
              submenu.style.transitionDelay = '0.1s';
              submenu.style.opacity = '0';
              submenu.style.visibility = 'hidden';
              submenu.style.transform = 'translateY(-10px)';
            }, 150);
          });
          
          // Add scroll event listener for scroll indicators
          submenu.addEventListener('scroll', function() {
            updateScrollIndicators(submenu);
          });
        }
      });
    }
    
    // Initialize hover events
    setupMenuHoverEvents();

    // Debug function to check sub-submenus
    function debugSubSubmenus() {
      const allSubmenus = superfishMain.querySelectorAll('ul ul');
      console.log('Found sub-submenus:', allSubmenus.length);
      allSubmenus.forEach(function(submenu, index) {
        console.log(`Sub-submenu ${index + 1}:`, submenu);
        console.log('Parent:', submenu.parentElement);
        console.log('Menu items in sub-submenu:', submenu.querySelectorAll('li').length);
      });
      
      // Also check for menu items with submenus
      const menuItemsWithSubmenus = superfishMain.querySelectorAll('li:has(ul)');
      console.log('Menu items with submenus:', menuItemsWithSubmenus.length);
      
      // Check all menu levels
      const level1Menus = superfishMain.querySelectorAll('> li');
      const level2Menus = superfishMain.querySelectorAll('ul > li');
      const level3Menus = superfishMain.querySelectorAll('ul ul > li');
      
      console.log('Level 1 menu items:', level1Menus.length);
      console.log('Level 2 menu items:', level2Menus.length);
      console.log('Level 3 menu items:', level3Menus.length);
    }
    
    // Run debug function
    debugSubSubmenus();

    // Force sub-submenus to be visible for testing
    function forceSubSubmenuVisibility() {
      const allSubSubmenus = superfishMain.querySelectorAll('ul ul');
      allSubSubmenus.forEach(function(submenu) {
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.transform = 'translateY(0)';
        submenu.style.position = 'fixed';
        submenu.style.left = '50%';
        submenu.style.top = '50%';
        submenu.style.zIndex = '99999';
        submenu.style.background = 'red'; // Make them visible for testing
      });
    }
    
    // Uncomment the line below to force sub-submenus to be visible for testing
    // forceSubSubmenuVisibility();

    // Handle Superfish initialization if it exists
    if (typeof Drupal !== 'undefined' && Drupal.behaviors.superfish) {
      // Wait for Superfish to initialize
      setTimeout(function() {
        positionSubmenus();
        createScrollArrows();
        setupMenuHoverEvents(); // Re-setup events after Superfish loads
        debugSubSubmenus(); // Debug again after Superfish loads
      }, 500);
    }
  });
})();
