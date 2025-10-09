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
    
    // Setup nav-list scroll controls (new template-based arrows)
    setupNavListScrollControls();
    
    if (!superfishMain) return;

    // Create scroll arrows
    createScrollArrows();

    // Function to setup nav-list scroll controls
    function setupNavListScrollControls() {
      const navList = document.getElementById('nav-list');
      const leftBtn = document.querySelector('.nav-scroll-left');
      const rightBtn = document.querySelector('.nav-scroll-right');
      
      if (!navList || !leftBtn || !rightBtn) return;
      
      // Scroll amount in pixels
      const scrollAmount = 200;
      
      // Handle left arrow click
      leftBtn.addEventListener('click', function() {
        navList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
      
      // Handle right arrow click
      rightBtn.addEventListener('click', function() {
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

    // Function to create scroll arrows
    function createScrollArrows() {

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
      const rect = menuItem.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get the parent submenu container
      const parentSubmenu = menuItem.closest('ul');
      const parentRect = parentSubmenu ? parentSubmenu.getBoundingClientRect() : null;
      
      // Position submenu to the right of the parent submenu container
      // Use 2-5px overlap to create a seamless connection and easier mouse access
      if (parentRect) {
        submenu.style.top = rect.top + 'px'; // Align with menu item vertically
        submenu.style.left = (parentRect.right - 5) + 'px'; // Right edge of parent container with 5px overlap for easier access
      } else {
        // Fallback if no parent submenu found
        submenu.style.top = rect.top + 'px';
        submenu.style.left = (rect.right - 5) + 'px'; // 5px overlap
      }
      
      // Check if submenu goes off-screen to the right
      const estimatedRight = parentRect ? parentRect.right + submenuRect.width : rect.right + submenuRect.width;
      if (estimatedRight > viewportWidth - 10) {
        // Show to the left of parent submenu if it overflows right
        if (parentRect) {
          submenu.style.left = (parentRect.left - submenuRect.width + 5) + 'px'; // Left side with 5px overlap
        } else {
          submenu.style.left = (rect.left - submenuRect.width + 5) + 'px';
        }
      }
      
      // Check if submenu goes off-screen to the bottom
      if (rect.top + submenuRect.height > viewportHeight - 10) {
        // Align to bottom of viewport
        submenu.style.top = Math.max(10, viewportHeight - submenuRect.height - 10) + 'px';
      }
      
      // Check if submenu goes off-screen to the top
      const finalTop = parseFloat(submenu.style.top);
      if (finalTop < 10) {
        submenu.style.top = '10px';
      }
      
      // Ensure submenu stays within viewport bounds horizontally
      const finalLeft = parseFloat(submenu.style.left);
      if (finalLeft < 10) {
        submenu.style.left = '10px';
      }
    }
    
    // Function to setup nested submenu behavior
    function setupNestedMenuBehavior() {
      // Mark items with children for styling
      const nestedMenuItems = superfishMain.querySelectorAll('li.menuparent:not(.sf-depth-1)');
      nestedMenuItems.forEach(function(menuItem) {
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

    // Handle hover events for all menu levels
    function setupMenuHoverEvents() {
      const allMenuItems = superfishMain.querySelectorAll('li');
      
      allMenuItems.forEach(function(menuItem) {
        const submenu = menuItem.querySelector(':scope > ul');
        
        if (submenu) {
          // Check if this is a main navigation submenu (level 1) or nested
          const parentSubmenu = menuItem.closest('ul');
          const isMainSubmenu = !parentSubmenu || parentSubmenu === superfishMain;
          
          if (isMainSubmenu) {
            // Level 1: Show submenu below
            menuItem.addEventListener('mouseenter', function() {
              positionSubmenu(menuItem, submenu);
              
              submenu.style.transitionDelay = '0s';
              submenu.style.opacity = '1';
              submenu.style.visibility = 'visible';
              submenu.style.transform = 'translateY(0)';
            });
            
            menuItem.addEventListener('mouseleave', function() {
              submenu.style.transitionDelay = '0.1s';
              submenu.style.opacity = '0';
              submenu.style.visibility = 'hidden';
              submenu.style.transform = 'translateY(-10px)';
            });
          } else {
            // Level 2+: Show submenu to the right
            let hideTimeout;
            
            menuItem.addEventListener('mouseenter', function() {
              // Clear any pending hide timeout
              clearTimeout(hideTimeout);
              
              positionNestedSubmenu(menuItem, submenu);
              
              submenu.style.transitionDelay = '0s';
              submenu.style.opacity = '1';
              submenu.style.visibility = 'visible';
              submenu.style.transform = 'translateX(0)';
            });
            
            menuItem.addEventListener('mouseleave', function() {
              // Delay hiding to allow mouse movement to submenu - increased to 300ms for easier access
              hideTimeout = setTimeout(function() {
                submenu.style.transitionDelay = '0s';
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateX(-10px)';
              }, 300); // 300ms delay for easier navigation
            });
            
            // Keep submenu visible when mouse enters it
            submenu.addEventListener('mouseenter', function() {
              clearTimeout(hideTimeout);
              submenu.style.transitionDelay = '0s';
              submenu.style.opacity = '1';
              submenu.style.visibility = 'visible';
              submenu.style.transform = 'translateX(0)';
            });
            
            submenu.addEventListener('mouseleave', function() {
              // Delay hiding when leaving submenu as well
              hideTimeout = setTimeout(function() {
                submenu.style.transitionDelay = '0s';
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateX(-10px)';
              }, 200); // 200ms delay when leaving submenu
            });
          }
        }
      });
    }
    
    // Initialize hover events
    setupMenuHoverEvents();
    
    // Reposition visible submenus on window resize and scroll
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        // Reposition all visible submenus
        const allSubmenus = superfishMain.querySelectorAll('ul');
        allSubmenus.forEach(function(submenu) {
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
    
    window.addEventListener('scroll', function() {
      // Reposition all visible submenus on scroll
      const allSubmenus = superfishMain.querySelectorAll('ul');
      allSubmenus.forEach(function(submenu) {
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
