/**
 * Simplified Accessibility Widget - Multi-step Apply Version
 * This version ensures no automatic settings are applied without 'Apply Settings' click
 * complying with WCAG 2.1 – 3.2.2 (On Input).
 */

(function () {
  'use strict';

  console.log('🚀 Loading Accessibility Widget (Compliance Version)...');

  // Settings storage
  let settings = {
    textSize: 'normal',
    theme: 'light',
    textAlign: 'left',
    textSpacing: 'normal',
    lineHeight: 'normal',
    cursor: 'normal',
    hideImages: false,
    highlightLinks: false,
    focusMode: 'disable'
  };

  // Draft settings (pending application)
  let pendingSettings = JSON.parse(JSON.stringify(settings));

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
    const applyBtn = document.getElementById('a11y-apply');

    if (!trigger || !drawer || !overlay || !closeBtn) {
      console.warn('Accessibility elements not ready yet, will retry...');
      return;
    }

    console.log('✅ All elements found!');
    window.accessibilityInitialized = true;

    // OPEN/CLOSE DRAWER
    trigger.onclick = function () {
      console.log('🖱️ Drawer opened - Syncing pending settings');
      // Sync pending with currently applied settings
      pendingSettings = JSON.parse(JSON.stringify(settings));
      updateUIState(); // Ensure UI matches pending settings

      drawer.classList.add('open');
      drawer.style.right = '0';
      overlay.classList.add('active');
    };

    closeBtn.onclick = function () {
      drawer.classList.remove('open');
      drawer.style.right = '-400px';
      overlay.classList.remove('active');
    };

    overlay.onclick = function () {
      closeBtn.click();
    };

    // APPLY SETTINGS BUTTON
    if (applyBtn) {
      applyBtn.onclick = function () {
        console.log('💾 Applying settings...', pendingSettings);
        settings = JSON.parse(JSON.stringify(pendingSettings));
        applyAllToBody();
        saveSettings();

        // Visual feedback
        const originalText = applyBtn.textContent;
        applyBtn.textContent = 'Applied!';
        applyBtn.style.background = '#28a745';

        setTimeout(() => {
          applyBtn.textContent = originalText;
          applyBtn.style.background = '';
          closeBtn.click();
        }, 800);
      };
    }

    // TEXT SIZE BUTTONS
    const textButtons = drawer.querySelectorAll('[data-action^="text-"]');
    textButtons.forEach(function (btn) {
      btn.onclick = function () {
        const action = this.getAttribute('data-action');
        let val = 'normal';
        if (action === 'text-decrease') val = 'decrease';
        else if (action === 'text-increase') val = 'increase';

        pendingSettings.textSize = val;
        updateUIState();
      };
    });

    // THEME RADIO BUTTONS
    const themeInputs = drawer.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(function (input) {
      const label = input.closest('label');
      function handleThemeSelection() {
        pendingSettings.theme = input.value;
        updateUIState();
      }
      input.onchange = handleThemeSelection;
      label.onclick = handleThemeSelection;
    });

    // TEXT ALIGNMENT BUTTONS
    const alignButtons = drawer.querySelectorAll('[data-action^="align-"]');
    alignButtons.forEach(function (btn) {
      btn.onclick = function () {
        const action = this.getAttribute('data-action');
        pendingSettings.textAlign = action.replace('align-', '');
        updateUIState();
      };
    });

    // TEXT SPACING RADIO BUTTONS
    const spacingInputs = drawer.querySelectorAll('input[name="text-spacing"]');
    spacingInputs.forEach(function (input) {
      const label = input.closest('label');
      function handleSpacingSelection() {
        pendingSettings.textSpacing = input.value;
        updateUIState();
      }
      input.onchange = handleSpacingSelection;
      label.onclick = handleSpacingSelection;
    });

    // LINE HEIGHT RADIO BUTTONS
    const lineHeightInputs = drawer.querySelectorAll('input[name="line-height"]');
    lineHeightInputs.forEach(function (input) {
      const label = input.closest('label');
      function handleLineHeightSelection() {
        pendingSettings.lineHeight = input.value;
        updateUIState();
      }
      input.onchange = handleLineHeightSelection;
      label.onclick = handleLineHeightSelection;
    });

    // CURSOR SIZE RADIO BUTTONS
    const cursorInputs = drawer.querySelectorAll('input[name="cursor"]');
    cursorInputs.forEach(function (input) {
      const label = input.closest('label');
      function handleCursorSelection() {
        pendingSettings.cursor = input.value;
        updateUIState();
      }
      input.onchange = handleCursorSelection;
      label.onclick = handleCursorSelection;
    });

    // FOCUS MODE RADIO BUTTONS
    const focusInputs = drawer.querySelectorAll('input[name="focus-mode"]');
    focusInputs.forEach(function (input) {
      const label = input.closest('label');
      function handleFocusSelection() {
        pendingSettings.focusMode = input.value;
        updateUIState();
      }
      input.onchange = handleFocusSelection;
      label.onclick = handleFocusSelection;
    });

    // VISUAL OPTIONS (CHECKBOXES)
    const visualCheckboxes = drawer.querySelectorAll('.checkbox-option input[type="checkbox"]');
    visualCheckboxes.forEach(function (checkbox) {
      checkbox.onchange = function () {
        const name = this.getAttribute('name');
        if (name === 'hide-images') pendingSettings.hideImages = this.checked;
        if (name === 'highlight-links') pendingSettings.highlightLinks = this.checked;
        updateUIState();
      };
    });

    // QUICK ACTIONS (BUTTONS)
    const quickActionButtons = drawer.querySelectorAll('.action-btn');
    quickActionButtons.forEach(function (btn) {
      const action = btn.getAttribute('data-action');
      if (action === 'apply-settings') return; // Handled separately

      btn.onclick = function () {
        console.log('⚡ Quick action:', action);
        if (action === 'skip-to-main') {
          const mainContent = document.querySelector('#mainSec, main, [role="main"], .main-content');
          if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
          }
          closeBtn.click();
        } else if (action === 'back-to-top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          closeBtn.click();
        } else if (action === 'reset-all') {
          if (confirm('Are you sure you want to reset all accessibility settings to default?')) {
            resetAllSettings();
          }
        }
      };
    });

    // Store original sizes FIRST
    storeOriginalSizes();

    // Load saved settings
    loadSettings();
    pendingSettings = JSON.parse(JSON.stringify(settings));
    applyAllToBody();
    updateUIState();

    console.log('✅ Accessibility Widget Initialized!');
  }

  // Update Drawer UI to match pendingSettings
  function updateUIState() {
    const drawer = document.getElementById('accessibility-drawer');
    if (!drawer) return;

    // Update Text Size Buttons
    const textButtons = drawer.querySelectorAll('[data-action^="text-"]');
    textButtons.forEach(btn => {
      const action = btn.getAttribute('data-action');
      const isMatch = (action === 'text-decrease' && pendingSettings.textSize === 'decrease') ||
        (action === 'text-normal' && pendingSettings.textSize === 'normal') ||
        (action === 'text-increase' && pendingSettings.textSize === 'increase');

      if (isMatch) {
        btn.classList.add('active');
        btn.style.cssText = 'background: #009EDB !important; color: white !important; border: 2px solid #009EDB !important;';
      } else {
        btn.classList.remove('active');
        btn.style.cssText = '';
      }
    });

    // Update Radio Groups (Theme, Spacing, Line Height, Cursor, Focus)
    const radios = drawer.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      const name = radio.name;
      const val = radio.value;
      const label = radio.closest('label');

      let isMatch = false;
      if (name === 'theme') isMatch = (pendingSettings.theme === val);
      else if (name === 'text-spacing') isMatch = (pendingSettings.textSpacing === val);
      else if (name === 'line-height') isMatch = (pendingSettings.lineHeight === val);
      else if (name === 'cursor') isMatch = (pendingSettings.cursor === val);
      else if (name === 'focus-mode') isMatch = (pendingSettings.focusMode === val);

      radio.checked = isMatch;
      if (isMatch) {
        label.classList.add('active');
        label.style.cssText = 'background: #e6f7ff !important; border: 3px solid #009EDB !important;';
      } else {
        label.classList.remove('active');
        label.style.cssText = '';
      }
    });

    // Update Alignment Buttons
    const alignButtons = drawer.querySelectorAll('[data-action^="align-"]');
    alignButtons.forEach(btn => {
      const action = btn.getAttribute('data-action').replace('align-', '');
      if (pendingSettings.textAlign === action) {
        btn.classList.add('active');
        btn.style.cssText = 'background: #009EDB !important; color: white !important;';
      } else {
        btn.classList.remove('active');
        btn.style.cssText = '';
      }
    });

    // Update Checkboxes
    const checkboxes = drawer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      const name = cb.getAttribute('name');
      if (name === 'hide-images') cb.checked = pendingSettings.hideImages;
      if (name === 'highlight-links') cb.checked = pendingSettings.highlightLinks;
    });
  }

  // Apply all CURRENTLY SAVED settings to body
  function applyAllToBody() {
    console.log('🛠️ Applying settings to body:', settings);

    // Remove all classes first
    document.body.classList.remove(
      'a11y-text-decrease', 'a11y-text-increase',
      'a11y-theme-dark', 'a11y-theme-high-contrast',
      'a11y-align-left', 'a11y-align-center', 'a11y-align-right',
      'a11y-spacing-tight', 'a11y-spacing-loose',
      'a11y-line-height-tight', 'a11y-line-height-loose',
      'a11y-cursor-small', 'a11y-cursor-large',
      'a11y-hide-images', 'a11y-highlight-links', 'a11y-focus-mode'
    );

    // 1. Text Size
    if (settings.textSize === 'decrease') {
      document.body.classList.add('a11y-text-decrease');
      applyTextSize(0.85);
    } else if (settings.textSize === 'increase') {
      document.body.classList.add('a11y-text-increase');
      applyTextSize(1.2);
    } else {
      applyTextSize(1);
    }

    // 2. Theme
    document.body.style.background = '';
    document.body.style.color = '';
    if (settings.theme === 'dark') {
      document.body.classList.add('a11y-theme-dark');
      document.body.style.background = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else if (settings.theme === 'high-contrast') {
      document.body.classList.add('a11y-theme-high-contrast');
      document.body.style.background = '#000000';
      document.body.style.color = '#ffff00';
    }

    // 3. Alignment
    if (settings.textAlign !== 'left') {
      document.body.classList.add('a11y-align-' + settings.textAlign);
      applyTextAlignment(settings.textAlign);
    } else {
      // Clear inline style if it was set before
      const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th');
      elements.forEach(function (el) {
        if (!el.closest('#accessibility-drawer')) el.style.textAlign = '';
      });
    }


    // 4. Spacing
    if (settings.textSpacing === 'tight') {
      document.body.classList.add('a11y-spacing-tight');
      applyTextSpacing(-0.5, -1);
    } else if (settings.textSpacing === 'loose') {
      document.body.classList.add('a11y-spacing-loose');
      applyTextSpacing(1, 3);
    } else {
      applyTextSpacing(0, 0);
    }

    // 5. Line Height
    if (settings.lineHeight === 'tight') {
      document.body.classList.add('a11y-line-height-tight');
      applyLineHeight(1.3);
    } else if (settings.lineHeight === 'loose') {
      document.body.classList.add('a11y-line-height-loose');
      applyLineHeight(2.0);
    } else {
      applyLineHeight(1.5);
    }

    // 6. Cursor
    if (settings.cursor !== 'normal') {
      document.body.classList.add('a11y-cursor-' + settings.cursor);
    }

    // 7. Focus Mode
    if (settings.focusMode === 'enable') {
      document.body.classList.add('a11y-focus-mode');
    }

    // 8. Visual Options
    if (settings.hideImages) document.body.classList.add('a11y-hide-images');
    if (settings.highlightLinks) document.body.classList.add('a11y-highlight-links');
  }

  // --- Utility Functions ---

  function storeOriginalSizes() {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) {
        const computedStyle = window.getComputedStyle(el);
        const originalSize = parseFloat(computedStyle.fontSize);
        originalSizes.set(el, originalSize);
      }
    });
  }

  function applyTextSize(scale) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) {
        let baseSize = originalSizes.get(el);
        if (!baseSize) {
          baseSize = parseFloat(window.getComputedStyle(el).fontSize);
          originalSizes.set(el, baseSize);
        }
        el.style.fontSize = (scale === 1) ? baseSize + 'px' : (baseSize * scale) + 'px';
      }
    });
  }

  function applyTextAlignment(align) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) el.style.textAlign = align;
    });
  }

  function applyTextSpacing(letterSpacing, wordSpacing) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) {
        el.style.letterSpacing = (letterSpacing === 0) ? '' : letterSpacing + 'px';
        el.style.wordSpacing = (wordSpacing === 0) ? '' : wordSpacing + 'px';
      }
    });
  }

  function applyLineHeight(height) {
    const elements = document.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) el.style.lineHeight = height;
    });
  }

  function resetAllSettings() {
    settings = {
      textSize: 'normal',
      theme: 'light',
      textAlign: 'left',
      textSpacing: 'normal',
      lineHeight: 'normal',
      cursor: 'normal',
      focusMode: 'disable',
      hideImages: false,
      highlightLinks: false
    };
    pendingSettings = JSON.parse(JSON.stringify(settings));

    // Clear inline styles on body
    document.body.style.background = '';
    document.body.style.color = '';

    // Clear inline styles on all elements
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6, td, th, label, button');
    elements.forEach(function (el) {
      if (!el.closest('#accessibility-drawer')) {
        el.style.fontSize = '';
        el.style.textAlign = '';
        el.style.letterSpacing = '';
        el.style.wordSpacing = '';
        el.style.lineHeight = '';
      }
    });

    applyAllToBody();
    updateUIState();
    saveSettings();
    alert('All accessibility settings have been reset to default.');
  }

  function saveSettings() {
    try {
      localStorage.setItem('sjvn_accessibility', JSON.stringify(settings));
    } catch (e) { }
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem('sjvn_accessibility');
      if (saved) settings = JSON.parse(saved);
    } catch (e) { }
  }

  /**
   * Handle form errors by focusing the first error field and linking error messages via ARIA.
   * This helps screen readers communicate errors clearly to users.
   */
  function handleFormErrors(context) {
    const ctx = context || document;
    const errorMessages = ctx.querySelectorAll('.form-item--error-message, .messages--error');

    if (errorMessages.length === 0) return;

    console.log('🎯 Accessibility: Form errors detected, improving ARIA context...');

    errorMessages.forEach(function (errorMes) {
      const wrapper = errorMes.closest('.form-item, .js-form-item, [class*="form-type-"]');
      if (wrapper) {
        const field = wrapper.querySelector('input:not([type="hidden"]), select, textarea');
        if (field) {
          // Link field to its error message
          if (errorMes.id) {
            const currentDescr = field.getAttribute('aria-describedby') || '';
            if (!currentDescr.includes(errorMes.id)) {
              field.setAttribute('aria-describedby', (currentDescr + ' ' + errorMes.id).trim());
            }
          }
          // Set invalid state
          field.setAttribute('aria-invalid', 'true');
        }
      }
    });

    // Focus first error field (once per load/attach)
    const firstErrorItem = ctx.querySelector('.form-item--error, .has-error, .is-invalid');
    if (firstErrorItem) {
      const firstField = firstErrorItem.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstField && !firstField.hasAttribute('data-a11y-handled')) {
        firstField.setAttribute('data-a11y-handled', 'true');
        console.log('🎯 Accessibility: Focusing first error field:', firstField.id || firstField.name);
        
        setTimeout(function () {
          if (firstField) {
            firstField.focus();
            firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }

  // Initialization methods
  if (typeof Drupal !== 'undefined' && Drupal.behaviors) {
    Drupal.behaviors.sjvnAccessibilitySimple = {
      attach: function (context) {
        if (context === document) {
           setTimeout(init, 100);
        }
        // Always handle form errors in context (for AJAX support)
        handleFormErrors(context);
      }
    };
  } else {
    // Standard initialization if Drupal is not present
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(init, 100);
        handleFormErrors(document);
      });
    } else {
      setTimeout(init, 100);
      handleFormErrors(document);
    }
    window.onload = function() {
       setTimeout(init, 500);
       handleFormErrors(document);
    };
  }

})();
