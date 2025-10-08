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

    // Helper function to force vertical flow positioning - NO OVERLAP
    function forceInlinePositioning(submenu) {
      submenu.classList.remove('sf-hidden');
      
      // CRITICAL: Use static positioning for natural document flow
      submenu.style.setProperty('position', 'static', 'important');
      submenu.style.setProperty('display', 'block', 'important');
      
      // Visibility
      submenu.style.setProperty('opacity', '1', 'important');
      submenu.style.setProperty('visibility', 'visible', 'important');
      submenu.style.setProperty('max-height', 'none', 'important');
      submenu.style.setProperty('height', 'auto', 'important');
      submenu.style.setProperty('overflow', 'visible', 'important');
      
      // Remove ALL positioning constraints
      submenu.style.setProperty('left', 'auto', 'important');
      submenu.style.setProperty('top', 'auto', 'important');
      submenu.style.setProperty('right', 'auto', 'important');
      submenu.style.setProperty('bottom', 'auto', 'important');
      submenu.style.setProperty('transform', 'none', 'important');
      
      // NO width constraints - let it flow naturally
      submenu.style.setProperty('width', 'auto', 'important');
      submenu.style.setProperty('min-width', '0', 'important');
      
      // NO floating
      submenu.style.setProperty('float', 'none', 'important');
      submenu.style.setProperty('clear', 'both', 'important');
      
      console.log('Forced vertical flow for submenu');
    }
    
    // Function to setup nested submenu - make them always visible and inline
    function setupNestedMenuBehavior() {
      // Target all nested submenus and ensure they're always visible
      const nestedSubmenus = superfishMain.querySelectorAll('ul ul');
      
      console.log('Found nested submenus to make always visible:', nestedSubmenus.length);
      
      nestedSubmenus.forEach(function(submenu) {
        // Force inline positioning
        forceInlinePositioning(submenu);
        
        // Use MutationObserver to watch for Superfish trying to change styles
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              // Superfish changed the styles, revert it!
              forceInlinePositioning(submenu);
            }
          });
        });
        
        // Observe style changes
        observer.observe(submenu, {
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      });
      
      // Mark items with children
      const nestedMenuItems = superfishMain.querySelectorAll('li.menuparent:not(.sf-depth-1)');
      nestedMenuItems.forEach(function(menuItem) {
        menuItem.classList.add('has-submenu');
      });
      
      console.log('Nested submenus are now inline and always visible with MutationObserver protection');
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

    // Handle hover events for main navigation submenus
    function setupMenuHoverEvents() {
      const allMenuItems = superfishMain.querySelectorAll('li');
      
      allMenuItems.forEach(function(menuItem) {
        const submenu = menuItem.querySelector('ul');
        
        if (submenu) {
          // Check if this is a main navigation submenu (level 1)
          const parentSubmenu = menuItem.closest('ul');
          const isMainSubmenu = !parentSubmenu || parentSubmenu === superfishMain;
          
          if (isMainSubmenu) {
            // Mouse enter - show main submenu
            menuItem.addEventListener('mouseenter', function() {
              submenu.style.transitionDelay = '0s';
              submenu.style.opacity = '1';
              submenu.style.visibility = 'visible';
              submenu.style.transform = 'translateY(0)';
              
              console.log('Showing main submenu:', submenu);
            });
            
            // Mouse leave - hide main submenu
            menuItem.addEventListener('mouseleave', function() {
              submenu.style.transitionDelay = '0.1s';
              submenu.style.opacity = '0';
              submenu.style.visibility = 'hidden';
              submenu.style.transform = 'translateY(-10px)';
            });
          }
          
          // Add scroll event listener for scroll indicators
          submenu.addEventListener('scroll', function() {
            updateScrollIndicators(submenu);
          });
        }
      });
    }
    
    // Initialize hover events
    setupMenuHoverEvents();

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
      level2Menus.forEach(function(item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 2 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });
      
      level3Menus.forEach(function(item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 3 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });
      
      level4Menus.forEach(function(item, index) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          console.log(`Level 4 item ${index + 1} has submenu:`, item.textContent.trim());
        }
      });
    }
    
    // Run debug function
    debugAllMenuLevels();

    // Initialize nested menu behavior
    setTimeout(function() {
      setupNestedMenuBehavior();
      console.log('Nested submenu hover behavior initialized');
    }, 1000);

    // Handle Superfish initialization if it exists
    if (typeof Drupal !== 'undefined' && Drupal.behaviors.superfish) {
      // Wait for Superfish to initialize
      setTimeout(function() {
        setupNestedMenuBehavior();
        createScrollArrows();
        setupMenuHoverEvents(); // Re-setup events after Superfish loads
        debugAllMenuLevels(); // Debug again after Superfish loads
      }, 500);
    }
  });
})();
