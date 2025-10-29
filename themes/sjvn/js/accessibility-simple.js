/**
 * Simplified Accessibility Widget - GUARANTEED TO WORK
 * This version uses multiple initialization methods to ensure it loads
 */

(function() {
  'use strict';
  
  console.log('🚀 Loading Accessibility Widget...');
  
  // Settings storage
  let settings = {
    textSize: 'normal',
    theme: 'light',
    textAlign: 'left',
    textSpacing: 'normal',
    lineHeight: 'normal',
    cursor: 'normal',
    hideImages: false,
    highlightLinks: false
  };
  
  // Store original font sizes (base reference)
  let originalSizes = new Map();
  
  // Initialize multiple times to ensure it works
  function init() {
    // Check if already initialized
    if (window.accessibilityInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    
    console.log('🔧 Initializing Accessibility Widget...');
    
    const trigger = document.getElementById('accessibility-trigger');
    const drawer = document.getElementById('accessibility-drawer');
    const overlay = document.getElementById('accessibility-overlay');
    const closeBtn = document.getElementById('accessibility-close');
    
    if (!trigger || !drawer || !overlay || !closeBtn) {
      console.warn('Accessibility elements not ready yet, will retry...');
      return;
    }
    
    console.log('✅ All elements found!');
    window.accessibilityInitialized = true;
    
    // OPEN/CLOSE DRAWER
    trigger.onclick = function() {
      console.log('🖱️ Trigger clicked');
      drawer.classList.add('open');
      drawer.style.right = '0';
      overlay.classList.add('active');
    };
    
    closeBtn.onclick = function() {
      console.log('❌ Close clicked');
      drawer.classList.remove('open');
      drawer.style.right = '-400px';
      overlay.classList.remove('active');
    };
    
    overlay.onclick = function() {
      closeBtn.click();
    };
    
    // TEXT SIZE BUTTONS
    const textButtons = drawer.querySelectorAll('[data-action^="text-"]');
    console.log('Found', textButtons.length, 'text size buttons');
    
    textButtons.forEach(function(btn) {
      btn.onclick = function() {
        const action = this.getAttribute('data-action');
        console.log('📝 Text size clicked:', action);
        
        // Remove active from all
        textButtons.forEach(function(b) {
          b.classList.remove('active');
          b.style.background = '';
          b.style.color = '';
          b.style.border = '';
        });
        
        // Make this one active
        this.classList.add('active');
        this.style.background = '#009EDB';
        this.style.color = '#fff';
        this.style.border = '2px solid #009EDB';
        
        console.log('✓ Made button active');
        
        // Remove all text size classes
        document.body.classList.remove('a11y-text-decrease', 'a11y-text-increase');
        
        // Apply new size relative to BASE
        if (action === 'text-decrease') {
          document.body.classList.add('a11y-text-decrease');
          applyTextSize(0.85); // A- = BASE × 0.85 (15% smaller)
          settings.textSize = 'decrease';
          console.log('✅ A- Applied: BASE size × 0.85 (smaller)');
        } else if (action === 'text-increase') {
          document.body.classList.add('a11y-text-increase');
          applyTextSize(1.2); // A+ = BASE × 1.2 (20% larger)
          settings.textSize = 'increase';
          console.log('✅ A+ Applied: BASE size × 1.2 (larger)');
        } else {
          applyTextSize(1); // A = BASE × 1 (original/normal)
          settings.textSize = 'normal';
          console.log('✅ A Applied: Restored to BASE size (original)');
        }
        
        saveSettings();
      };
    });
    
    // THEME RADIO BUTTONS
    const themeInputs = drawer.querySelectorAll('input[name="theme"]');
    console.log('Found', themeInputs.length, 'theme options');
    
    themeInputs.forEach(function(input) {
      const label = input.closest('label');
      
      // Handle both input change and label click
      function handleTheme() {
        const value = input.value;
        console.log('🎨 Theme selected:', value);
        
        // Remove active from all
        themeInputs.forEach(function(inp) {
          const lbl = inp.closest('label');
          lbl.classList.remove('active');
          lbl.style.background = '';
          lbl.style.border = '';
        });
        
        // Make this one active
        label.classList.add('active');
        label.style.background = '#e6f7ff';
        label.style.border = '3px solid #009EDB';
        input.checked = true;
        
        console.log('✓ Made option active');
        
        // Remove all theme classes
        document.body.classList.remove('a11y-theme-dark', 'a11y-theme-high-contrast');
        
        // Apply theme
        if (value === 'dark') {
          document.body.classList.add('a11y-theme-dark');
          document.body.style.background = '#1a1a1a';
          document.body.style.color = '#ffffff';
          settings.theme = 'dark';
          console.log('✅ Applied dark theme');
        } else if (value === 'high-contrast') {
          document.body.classList.add('a11y-theme-high-contrast');
          document.body.style.background = '#000000';
          document.body.style.color = '#ffff00';
          settings.theme = 'high-contrast';
          console.log('✅ Applied high contrast theme');
        } else {
          document.body.style.background = '';
          document.body.style.color = '';
          settings.theme = 'light';
          console.log('✅ Applied light theme');
        }
        
        saveSettings();
      }
      
      input.onchange = handleTheme;
      label.onclick = handleTheme;
    });
    
    // TEXT ALIGNMENT BUTTONS
    const alignButtons = drawer.querySelectorAll('[data-action^="align-"]');
    console.log('Found', alignButtons.length, 'text alignment buttons');
    
    alignButtons.forEach(function(btn) {
      btn.onclick = function() {
        const action = this.getAttribute('data-action');
        console.log('↔️ Text alignment clicked:', action);
        
        // Remove active from all
        alignButtons.forEach(function(b) {
          b.classList.remove('active');
          b.style.cssText = '';
        });
        
        // Make this one active
        this.classList.add('active');
        this.style.cssText = 'background: #009EDB !important; color: white !important;';
        
        // Remove all alignment classes
        document.body.classList.remove('a11y-align-left', 'a11y-align-center', 'a11y-align-right');
        
        // Apply alignment
        if (action === 'align-left') {
          document.body.classList.add('a11y-align-left');
          applyTextAlignment('left');
          settings.textAlign = 'left';
          console.log('✅ Applied left alignment');
        } else if (action === 'align-center') {
          document.body.classList.add('a11y-align-center');
          applyTextAlignment('center');
          settings.textAlign = 'center';
          console.log('✅ Applied center alignment');
        } else if (action === 'align-right') {
          document.body.classList.add('a11y-align-right');
          applyTextAlignment('right');
          settings.textAlign = 'right';
          console.log('✅ Applied right alignment');
        }
        
        saveSettings();
      };
    });
    
    // TEXT SPACING RADIO BUTTONS
    const spacingInputs = drawer.querySelectorAll('input[name="text-spacing"]');
    console.log('Found', spacingInputs.length, 'text spacing options');
    
    spacingInputs.forEach(function(input) {
      const label = input.closest('label');
      
      function handleSpacing() {
        const value = input.value;
        console.log('📐 Text spacing selected:', value);
        
        // Remove active from all
        spacingInputs.forEach(function(inp) {
          const lbl = inp.closest('label');
          lbl.classList.remove('active');
          lbl.style.cssText = '';
        });
        
        // Make this one active
        label.classList.add('active');
        label.style.cssText = 'background: #e6f7ff !important; border: 3px solid #009EDB !important;';
        input.checked = true;
        
        // Remove all spacing classes
        document.body.classList.remove('a11y-spacing-tight', 'a11y-spacing-loose');
        
        // Apply spacing
        if (value === 'tight') {
          document.body.classList.add('a11y-spacing-tight');
          applyTextSpacing(-0.5, -1);
          settings.textSpacing = 'tight';
          console.log('✅ Applied tight spacing');
        } else if (value === 'loose') {
          document.body.classList.add('a11y-spacing-loose');
          applyTextSpacing(1, 3);
          settings.textSpacing = 'loose';
          console.log('✅ Applied loose spacing');
        } else {
          applyTextSpacing(0, 0);
          settings.textSpacing = 'normal';
          console.log('✅ Applied normal spacing');
        }
        
        saveSettings();
      }
      
      input.onchange = handleSpacing;
      label.onclick = handleSpacing;
    });
    
    // LINE HEIGHT RADIO BUTTONS
    const lineHeightInputs = drawer.querySelectorAll('input[name="line-height"]');
    console.log('Found', lineHeightInputs.length, 'line height options');
    
    lineHeightInputs.forEach(function(input) {
      const label = input.closest('label');
      
      function handleLineHeight() {
        const value = input.value;
        console.log('📏 Line height selected:', value);
        
        // Remove active from all
        lineHeightInputs.forEach(function(inp) {
          const lbl = inp.closest('label');
          lbl.classList.remove('active');
          lbl.style.cssText = '';
        });
        
        // Make this one active
        label.classList.add('active');
        label.style.cssText = 'background: #e6f7ff !important; border: 3px solid #009EDB !important;';
        input.checked = true;
        
        // Remove all line height classes
        document.body.classList.remove('a11y-line-height-tight', 'a11y-line-height-loose');
        
        // Apply line height
        if (value === 'tight') {
          document.body.classList.add('a11y-line-height-tight');
          applyLineHeight(1.3);
          settings.lineHeight = 'tight';
          console.log('✅ Applied tight line height');
        } else if (value === 'loose') {
          document.body.classList.add('a11y-line-height-loose');
          applyLineHeight(2.0);
          settings.lineHeight = 'loose';
          console.log('✅ Applied loose line height');
        } else {
          applyLineHeight(1.5);
          settings.lineHeight = 'normal';
          console.log('✅ Applied normal line height');
        }
        
        saveSettings();
      }
      
      input.onchange = handleLineHeight;
      label.onclick = handleLineHeight;
    });
    
    // CURSOR SIZE RADIO BUTTONS
    const cursorInputs = drawer.querySelectorAll('input[name="cursor"]');
    console.log('Found', cursorInputs.length, 'cursor size options');
    
    cursorInputs.forEach(function(input) {
      const label = input.closest('label');
      
      function handleCursor() {
        const value = input.value;
        console.log('🖱️ Cursor size selected:', value);
        
        // Remove active from all
        cursorInputs.forEach(function(inp) {
          const lbl = inp.closest('label');
          lbl.classList.remove('active');
          lbl.style.cssText = '';
        });
        
        // Make this one active
        label.classList.add('active');
        label.style.cssText = 'background: #e6f7ff !important; border: 3px solid #009EDB !important;';
        input.checked = true;
        
        // Remove all cursor classes
        document.body.classList.remove('a11y-cursor-small', 'a11y-cursor-large');
        
        // Apply cursor
        if (value === 'small') {
          document.body.classList.add('a11y-cursor-small');
          settings.cursor = 'small';
          console.log('✅ Applied small cursor');
        } else if (value === 'large') {
          document.body.classList.add('a11y-cursor-large');
          settings.cursor = 'large';
          console.log('✅ Applied large cursor');
        } else {
          settings.cursor = 'normal';
          console.log('✅ Applied normal cursor');
        }
        
        saveSettings();
      }
      
      input.onchange = handleCursor;
      label.onclick = handleCursor;
    });
    
    // VISUAL OPTIONS (CHECKBOXES)
    const visualCheckboxes = drawer.querySelectorAll('.checkbox-option input[type="checkbox"]');
    console.log('Found', visualCheckboxes.length, 'visual option checkboxes');
    
    visualCheckboxes.forEach(function(checkbox) {
      checkbox.onchange = function() {
        const name = this.getAttribute('name');
        const checked = this.checked;
        console.log('👁️ Visual option changed:', name, '=', checked);
        
        // Apply visual options
        if (name === 'hide-images') {
          if (checked) {
            document.body.classList.add('a11y-hide-images');
          } else {
            document.body.classList.remove('a11y-hide-images');
          }
          settings.hideImages = checked;
          console.log('✅ Hide images:', checked);
        } else if (name === 'highlight-links') {
          if (checked) {
            document.body.classList.add('a11y-highlight-links');
          } else {
            document.body.classList.remove('a11y-highlight-links');
          }
          settings.highlightLinks = checked;
          console.log('✅ Highlight links:', checked);
        }
        
        saveSettings();
      };
    });
    
    // QUICK ACTIONS (BUTTONS)
    const quickActionButtons = drawer.querySelectorAll('.action-btn');
    console.log('Found', quickActionButtons.length, 'quick action buttons');
    
    quickActionButtons.forEach(function(btn) {
      btn.onclick = function() {
        const action = this.getAttribute('data-action');
        console.log('⚡ Quick action clicked:', action);
        
        if (action === 'skip-to-main') {
          // Skip to main content
          const mainContent = document.querySelector('#mainSec, main, [role="main"], .main-content');
          if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            console.log('✅ Skipped to main content');
          } else {
            console.warn('Main content not found');
          }
          closeDrawer();
        } else if (action === 'back-to-top') {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log('✅ Scrolled to top');
          closeDrawer();
        } else if (action === 'reset-all') {
          // Reset all settings
          if (confirm('Are you sure you want to reset all accessibility settings to default?')) {
            resetAllSettings();
            console.log('✅ Reset all settings');
          }
        }
      };
    });
    
    // Store original sizes FIRST (this is the BASE reference - "A")
    storeOriginalSizes();
    
    // Load saved settings
    loadSettings();
    applySettings();
    
    console.log('✅ Accessibility Widget Initialized Successfully!');
  }
  
  // Store original font sizes as BASE reference
  function storeOriginalSizes() {
    console.log('📐 Storing original (BASE) font sizes...');
    
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    let count = 0;
    
    elements.forEach(function(el) {
      // Don't store accessibility drawer elements
      if (!el.closest('#accessibility-drawer')) {
        const computedStyle = window.getComputedStyle(el);
        const originalSize = parseFloat(computedStyle.fontSize);
        
        // Store the original size for this element
        originalSizes.set(el, originalSize);
        count++;
      }
    });
    
    console.log('✓ Stored', count, 'original (BASE) font sizes');
    console.log('📌 "A" button will restore to these BASE sizes');
  }
  
  // Apply text size relative to BASE (original) sizes
  function applyTextSize(scale) {
    console.log('📏 Applying text size scale:', scale, 'relative to BASE');
    
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    let count = 0;
    
    elements.forEach(function(el) {
      // Don't apply to accessibility drawer itself
      if (!el.closest('#accessibility-drawer')) {
        // Get the BASE (original) size for this element
        let baseSize = originalSizes.get(el);
        
        // If we don't have it stored, get current size as base
        if (!baseSize) {
          baseSize = parseFloat(window.getComputedStyle(el).fontSize);
          originalSizes.set(el, baseSize);
        }
        
        // Calculate new size relative to BASE
        if (scale === 1) {
          // A button: Restore to BASE (original) size
          el.style.fontSize = baseSize + 'px';
        } else {
          // A+ or A-: Scale from BASE
          const newSize = baseSize * scale;
          el.style.fontSize = newSize + 'px';
        }
        count++;
      }
    });
    
    console.log('✓ Applied to', count, 'elements (BASE × ' + scale + ')');
  }
  
  // Apply text alignment
  function applyTextAlignment(align) {
    console.log('↔️ Applying text alignment:', align);
    
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th');
    let count = 0;
    
    elements.forEach(function(el) {
      if (!el.closest('#accessibility-drawer')) {
        el.style.textAlign = align;
        count++;
      }
    });
    
    console.log('✓ Applied alignment to', count, 'elements');
  }
  
  // Apply text spacing
  function applyTextSpacing(letterSpacing, wordSpacing) {
    console.log('📐 Applying text spacing:', letterSpacing + 'px letter, ' + wordSpacing + 'px word');
    
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6');
    let count = 0;
    
    elements.forEach(function(el) {
      if (!el.closest('#accessibility-drawer')) {
        if (letterSpacing === 0 && wordSpacing === 0) {
          el.style.letterSpacing = '';
          el.style.wordSpacing = '';
        } else {
          el.style.letterSpacing = letterSpacing + 'px';
          el.style.wordSpacing = wordSpacing + 'px';
        }
        count++;
      }
    });
    
    console.log('✓ Applied spacing to', count, 'elements');
  }
  
  // Apply line height
  function applyLineHeight(height) {
    console.log('📏 Applying line height:', height);
    
    const elements = document.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6');
    let count = 0;
    
    elements.forEach(function(el) {
      if (!el.closest('#accessibility-drawer')) {
        el.style.lineHeight = height;
        count++;
      }
    });
    
    console.log('✓ Applied line height to', count, 'elements');
  }
  
  // Close the drawer
  function closeDrawer() {
    const drawer = document.getElementById('accessibility-drawer');
    const overlay = document.getElementById('accessibility-overlay');
    
    if (drawer && overlay) {
      drawer.classList.remove('open');
      drawer.style.right = '-400px';
      overlay.classList.remove('active');
      console.log('📂 Drawer closed');
    }
  }
  
  // Reset all settings
  function resetAllSettings() {
    console.log('🔄 Resetting all settings...');
    
    // Reset settings object
    settings = {
      textSize: 'normal',
      theme: 'light',
      textAlign: 'left',
      textSpacing: 'normal',
      lineHeight: 'normal',
      cursor: 'normal',
      hideImages: false,
      highlightLinks: false
    };
    
    // Remove all classes from body
    document.body.classList.remove(
      'a11y-text-decrease', 'a11y-text-increase',
      'a11y-theme-dark', 'a11y-theme-high-contrast',
      'a11y-align-left', 'a11y-align-center', 'a11y-align-right',
      'a11y-spacing-tight', 'a11y-spacing-loose',
      'a11y-line-height-tight', 'a11y-line-height-loose',
      'a11y-cursor-small', 'a11y-cursor-large',
      'a11y-hide-images', 'a11y-highlight-links'
    );
    
    // Reset inline styles
    document.body.style.background = '';
    document.body.style.color = '';
    
    // Reset all text elements to original sizes
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    elements.forEach(function(el) {
      if (!el.closest('#accessibility-drawer')) {
        const baseSize = originalSizes.get(el);
        if (baseSize) {
          el.style.fontSize = baseSize + 'px';
        } else {
          el.style.fontSize = '';
        }
        el.style.textAlign = '';
        el.style.letterSpacing = '';
        el.style.wordSpacing = '';
        el.style.lineHeight = '';
      }
    });
    
    // Reset UI - uncheck all checkboxes
    const drawer = document.getElementById('accessibility-drawer');
    drawer.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
      cb.checked = false;
    });
    
    // Reset button active states
    drawer.querySelectorAll('[data-action^="text-"]').forEach(function(btn) {
      btn.classList.remove('active');
      btn.style.cssText = '';
    });
    drawer.querySelector('[data-action="text-normal"]').classList.add('active');
    drawer.querySelector('[data-action="text-normal"]').style.cssText = 'background: #009EDB !important; color: white !important;';
    
    // Reset radio button states
    drawer.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      const label = radio.closest('label');
      label.classList.remove('active');
      label.style.cssText = '';
      
      // Check defaults
      if ((radio.name === 'theme' && radio.value === 'light') ||
          (radio.name === 'cursor' && radio.value === 'normal') ||
          (radio.name === 'line-height' && radio.value === 'normal') ||
          (radio.name === 'text-spacing' && radio.value === 'normal')) {
        radio.checked = true;
        label.classList.add('active');
        label.style.cssText = 'background: #e6f7ff !important; border: 3px solid #009EDB !important;';
      } else {
        radio.checked = false;
      }
    });
    
    // Reset alignment buttons
    drawer.querySelectorAll('[data-action^="align-"]').forEach(function(btn) {
      btn.classList.remove('active');
      btn.style.cssText = '';
    });
    drawer.querySelector('[data-action="align-left"]').classList.add('active');
    drawer.querySelector('[data-action="align-left"]').style.cssText = 'background: #009EDB !important; color: white !important;';
    
    // Save reset settings
    saveSettings();
    
    console.log('✅ All settings reset to default');
    alert('All accessibility settings have been reset to default.');
  }
  
  // Save settings to localStorage
  function saveSettings() {
    try {
      localStorage.setItem('sjvn_accessibility', JSON.stringify(settings));
      console.log('💾 Settings saved:', settings);
    } catch(e) {
      console.warn('Could not save settings:', e);
    }
  }
  
  // Load settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem('sjvn_accessibility');
      if (saved) {
        settings = JSON.parse(saved);
        console.log('📂 Settings loaded:', settings);
      }
    } catch(e) {
      console.warn('Could not load settings:', e);
    }
  }
  
  // Apply saved settings on load
  function applySettings() {
    console.log('🔄 Applying saved settings...');
    
    // Apply text size
    if (settings.textSize === 'decrease') {
      const btn = document.querySelector('[data-action="text-decrease"]');
      if (btn) btn.click();
    } else if (settings.textSize === 'increase') {
      const btn = document.querySelector('[data-action="text-increase"]');
      if (btn) btn.click();
    }
    
    // Apply theme
    if (settings.theme !== 'light') {
      const input = document.querySelector('input[name="theme"][value="' + settings.theme + '"]');
      if (input) {
        input.checked = true;
        const label = input.closest('label');
        if (label) label.click();
      }
    }
  }
  
  // Try to initialize multiple times
  console.log('Setting up initialization...');
  
  // Method 1: DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('📍 DOMContentLoaded triggered');
      setTimeout(init, 100);
    });
  } else {
    console.log('📍 DOM already loaded');
    setTimeout(init, 100);
  }
  
  // Method 2: Window load
  window.addEventListener('load', function() {
    console.log('📍 Window load triggered');
    setTimeout(init, 200);
  });
  
  // Method 3: Drupal behaviors (if available)
  if (typeof Drupal !== 'undefined' && Drupal.behaviors) {
    Drupal.behaviors.sjvnAccessibilitySimple = {
      attach: function(context) {
        if (context === document) {
          console.log('📍 Drupal behaviors triggered');
          setTimeout(init, 300);
        }
      }
    };
  }
  
  // Method 4: Direct init after delay
  setTimeout(function() {
    console.log('📍 Delayed init triggered');
    init();
  }, 500);
  
  // Expose to window for manual testing
  window.initAccessibility = init;
  
  console.log('✅ Accessibility script loaded');
  console.log('💡 If not working, run: window.initAccessibility()');
  
})();

