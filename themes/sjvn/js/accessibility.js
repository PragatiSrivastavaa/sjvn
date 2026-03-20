/**
 * Accessibility Widget JavaScript
 * WCAG 2.1 AA Compliant
 * Government Website Standards
 * 
 * Features:
 * - Text size adjustment
 * - Theme switching (Light, Dark, High Contrast)
 * - Cursor size adjustment
 * - Line height adjustment
 * - Text alignment
 * - Text spacing
 * - Visual options (Focus indicators, Hide images, Highlight links, etc.)
 * - Quick actions
 * - LocalStorage persistence
 * - Keyboard navigation support
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'sjvn_accessibility_settings',
    drawerSelector: '#accessibility-drawer',
    triggerSelector: '#accessibility-trigger',
    overlaySelector: '#accessibility-overlay',
    closeSelector: '#accessibility-close'
  };

  // State management
  let settings = {
    textSize: 'normal',
    theme: 'light',
    cursor: 'normal',
    lineHeight: 'normal',
    textAlign: 'left',
    textSpacing: 'normal',
    enhancedFocus: false,
    hideImages: false,
    highlightLinks: false,
    showTooltips: false,
    reduceMotion: false
  };

  // Initialize when DOM is ready - Compatible with Drupal
  function initWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        init();
        handleFormErrors(document);
      });
    } else {
      // DOM is already loaded
      init();
      handleFormErrors(document);
    }
  }

  // Wait a bit to ensure Drupal has finished loading
  if (typeof Drupal !== 'undefined' && Drupal.behaviors) {
    // Use Drupal behaviors for better compatibility
    Drupal.behaviors.sjvnAccessibility = {
      attach: function (context, settings) {
        // 1. Initialize the general accessibility widget (once)
        if (context === document && !document.body.classList.contains('a11y-initialized')) {
          document.body.classList.add('a11y-initialized');
          init();
        }
        
        // 2. Handle form errors: Redirect focus to first error field
        // This runs on every AJAX update too
        handleFormErrors(context);
      }
    };
  } else {
    // Fallback for non-Drupal environments
    initWhenReady();
  }

  /**
   * Initialize the accessibility widget
   */
  function init() {
    console.log('🔧 Initializing SJVN Accessibility Widget...');

    // Check if elements exist
    const trigger = document.querySelector(CONFIG.triggerSelector);
    const drawer = document.querySelector(CONFIG.drawerSelector);

    if (!trigger) {
      console.error('❌ Accessibility trigger button not found!');
      return;
    }

    if (!drawer) {
      console.error('❌ Accessibility drawer not found!');
      return;
    }

    console.log('✅ Accessibility elements found');

    // Load saved settings
    loadSettings();

    // Apply saved settings
    applyAllSettings();

    // Set up event listeners
    setupEventListeners();

    // Initialize UI state
    updateUIState();

    // Check for system preferences
    checkSystemPreferences();

    console.log('✅ SJVN Accessibility Widget initialized successfully!');
  }

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    const drawer = document.querySelector(CONFIG.drawerSelector);
    const trigger = document.querySelector(CONFIG.triggerSelector);
    const overlay = document.querySelector(CONFIG.overlaySelector);
    const closeBtn = document.querySelector(CONFIG.closeSelector);

    if (!drawer || !trigger || !overlay || !closeBtn) {
      console.error('Accessibility widget elements not found:', {
        drawer: !!drawer,
        trigger: !!trigger,
        overlay: !!overlay,
        closeBtn: !!closeBtn
      });
      return;
    }

    console.log('✅ Accessibility widget initialized successfully');

    // Open drawer - with debugging
    trigger.addEventListener('click', function (e) {
      console.log('🖱️ Accessibility button clicked!');
      e.preventDefault();
      e.stopPropagation();
      openDrawer();
    }, false);

    // Also try with onclick as backup
    trigger.onclick = function (e) {
      console.log('🖱️ Button clicked via onclick');
      openDrawer();
      return false;
    };

    // Close drawer
    closeBtn.addEventListener('click', function (e) {
      console.log('❌ Close button clicked');
      e.preventDefault();
      closeDrawer();
    });

    overlay.addEventListener('click', function (e) {
      console.log('🔲 Overlay clicked');
      closeDrawer();
    });

    // Keyboard support for drawer
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Text size buttons
    const textButtons = drawer.querySelectorAll('[data-action^="text-"]');
    textButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        console.log('📝 Text size button clicked:', this.getAttribute('data-action'));
        handleTextSize.call(this, e);
      });
    });

    // Theme radio buttons
    const themeInputs = drawer.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(input => {
      input.addEventListener('change', function (e) {
        console.log('🎨 Theme radio changed:', this.value);
        handleThemeChange.call(this, e);
      });

      // Also handle clicks on label for better UX
      const label = input.closest('label');
      if (label) {
        label.addEventListener('click', function (e) {
          console.log('🎨 Theme label clicked');
          // Remove active from all
          drawer.querySelectorAll('input[name="theme"]').forEach(inp => {
            inp.closest('label').classList.remove('active');
          });
          // Add active to this one
          this.classList.add('active');
          // Check the radio
          input.checked = true;
          // Trigger change
          handleThemeChange.call(input, e);
        });
      }
    });

    // Cursor radio buttons
    const cursorInputs = drawer.querySelectorAll('input[name="cursor"]');
    cursorInputs.forEach(input => {
      input.addEventListener('change', handleCursorChange);
      input.closest('label').addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          input.checked = true;
          handleCursorChange.call(input);
        }
      });
    });

    // Line height radio buttons
    const lineHeightInputs = drawer.querySelectorAll('input[name="line-height"]');
    lineHeightInputs.forEach(input => {
      input.addEventListener('change', handleLineHeightChange);
      input.closest('label').addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          input.checked = true;
          handleLineHeightChange.call(input);
        }
      });
    });

    // Text alignment buttons
    const alignButtons = drawer.querySelectorAll('[data-action^="align-"]');
    alignButtons.forEach(btn => {
      btn.addEventListener('click', handleTextAlign);
    });

    // Text spacing radio buttons
    const spacingInputs = drawer.querySelectorAll('input[name="text-spacing"]');
    spacingInputs.forEach(input => {
      input.addEventListener('change', handleTextSpacingChange);
      input.closest('label').addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          input.checked = true;
          handleTextSpacingChange.call(input);
        }
      });
    });

    // Visual options checkboxes
    const checkboxes = drawer.querySelectorAll('.checkbox-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleVisualOption);
    });

    // Quick action buttons
    const actionButtons = drawer.querySelectorAll('[data-action]');
    actionButtons.forEach(btn => {
      const action = btn.getAttribute('data-action');
      if (action === 'skip-to-main') {
        btn.addEventListener('click', skipToMain);
      } else if (action === 'back-to-top') {
        btn.addEventListener('click', backToTop);
      } else if (action === 'reset-all') {
        btn.addEventListener('click', resetAll);
      }
    });
  }

  /**
   * Open the accessibility drawer
   */
  function openDrawer() {
    console.log('📂 Opening drawer...');

    const drawer = document.querySelector(CONFIG.drawerSelector);
    const trigger = document.querySelector(CONFIG.triggerSelector);
    const overlay = document.querySelector(CONFIG.overlaySelector);

    if (!drawer || !trigger || !overlay) {
      console.error('❌ Cannot open drawer - elements missing:', {
        drawer: !!drawer,
        trigger: !!trigger,
        overlay: !!overlay
      });
      return;
    }

    // Add classes to open drawer
    drawer.classList.add('open');
    overlay.classList.add('active');

    // Force styles as backup
    drawer.style.right = '0';
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';

    // Update ARIA attributes
    drawer.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');

    console.log('✅ Drawer opened!', {
      drawerClasses: drawer.className,
      overlayClasses: overlay.className,
      drawerRight: window.getComputedStyle(drawer).right
    });

    // Focus the first interactive element
    setTimeout(() => {
      const firstFocusable = drawer.querySelector('button, input, select, textarea, a[href]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    // Trap focus in drawer
    trapFocus(drawer);
  }

  /**
   * Close the accessibility drawer
   */
  function closeDrawer() {
    console.log('📂 Closing drawer...');

    const drawer = document.querySelector(CONFIG.drawerSelector);
    const trigger = document.querySelector(CONFIG.triggerSelector);
    const overlay = document.querySelector(CONFIG.overlaySelector);

    if (!drawer || !trigger || !overlay) {
      return;
    }

    drawer.classList.remove('open');
    overlay.classList.remove('active');

    // Remove forced styles
    drawer.style.right = '';
    overlay.style.opacity = '';
    overlay.style.visibility = '';

    drawer.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');

    // Return focus to trigger button
    trigger.focus();

    console.log('✅ Drawer closed!');
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyboardNavigation(e) {
    const drawer = document.querySelector(CONFIG.drawerSelector);

    // Close on Escape key
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }

  /**
   * Trap focus within the drawer when open
   */
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Handle text size changes
   */
  function handleTextSize(e) {
    const action = this.getAttribute('data-action');
    console.log('📝 Text size button clicked:', action);

    const drawer = document.querySelector(CONFIG.drawerSelector);

    // IMPORTANT: Remove active class from ALL text size buttons first
    const allTextButtons = drawer.querySelectorAll('[data-action^="text-"]');
    console.log('   Removing active from', allTextButtons.length, 'buttons');
    allTextButtons.forEach(btn => {
      btn.classList.remove('active');
      console.log('   - Removed active from:', btn.getAttribute('data-action'));
    });

    // Add active class to clicked button
    this.classList.add('active');
    console.log('   ✓ Added active to:', action);
    console.log('   Button now has active:', this.classList.contains('active'));

    // Remove previous text size classes from body
    document.body.classList.remove('a11y-text-decrease', 'a11y-text-increase');

    // Apply new text size
    if (action === 'text-decrease') {
      document.body.classList.add('a11y-text-decrease');
      settings.textSize = 'decrease';
      console.log('✅ Text size decreased - body class added:', document.body.classList.contains('a11y-text-decrease'));
    } else if (action === 'text-increase') {
      document.body.classList.add('a11y-text-increase');
      settings.textSize = 'increase';
      console.log('✅ Text size increased - body class added:', document.body.classList.contains('a11y-text-increase'));
    } else {
      settings.textSize = 'normal';
      console.log('✅ Text size reset to normal');
    }

    saveSettings();
    console.log('💾 Settings saved:', settings);

    // Force UI refresh
    setTimeout(() => {
      updateUIState();
      console.log('🔄 UI state refreshed');
    }, 100);
  }

  /**
   * Handle theme changes
   */
  function handleThemeChange(e) {
    const value = this.value;
    console.log('🎨 Theme changed to:', value);

    const drawer = document.querySelector(CONFIG.drawerSelector);

    // IMPORTANT: Remove active class from ALL theme options first
    console.log('   Removing active from all theme options...');
    drawer.querySelectorAll('input[name="theme"]').forEach(input => {
      const label = input.closest('label');
      if (label) {
        label.classList.remove('active');
        console.log('   - Removed active from:', input.value);
      }
    });

    // Add active class to selected option
    const thisLabel = this.closest('label');
    if (thisLabel) {
      thisLabel.classList.add('active');
      console.log('   ✓ Added active to:', value);
      console.log('   Label now has active:', thisLabel.classList.contains('active'));
    }

    // Remove previous theme classes from body
    document.body.classList.remove('a11y-theme-dark', 'a11y-theme-high-contrast');

    // Apply new theme
    if (value === 'dark') {
      document.body.classList.add('a11y-theme-dark');
      console.log('✅ Dark theme applied - body class:', document.body.classList.contains('a11y-theme-dark'));
    } else if (value === 'high-contrast') {
      document.body.classList.add('a11y-theme-high-contrast');
      console.log('✅ High contrast theme applied - body class:', document.body.classList.contains('a11y-theme-high-contrast'));
    } else {
      console.log('✅ Light theme applied (default)');
    }

    settings.theme = value;
    saveSettings();
    console.log('💾 Settings saved:', settings);

    // Force UI refresh
    setTimeout(() => {
      updateUIState();
      console.log('🔄 UI state refreshed');
    }, 100);
  }

  /**
   * Handle cursor size changes
   */
  function handleCursorChange() {
    const value = this.value;
    const drawer = document.querySelector(CONFIG.drawerSelector);

    // Update UI
    drawer.querySelectorAll('input[name="cursor"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === value) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Remove previous cursor classes
    document.body.classList.remove('a11y-cursor-small', 'a11y-cursor-large');

    // Apply new cursor
    if (value === 'small') {
      document.body.classList.add('a11y-cursor-small');
    } else if (value === 'large') {
      document.body.classList.add('a11y-cursor-large');
    }

    settings.cursor = value;
    saveSettings();
  }

  /**
   * Handle line height changes
   */
  function handleLineHeightChange() {
    const value = this.value;
    const drawer = document.querySelector(CONFIG.drawerSelector);

    // Update UI
    drawer.querySelectorAll('input[name="line-height"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === value) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Remove previous line height classes
    document.body.classList.remove('a11y-line-height-tight', 'a11y-line-height-loose');

    // Apply new line height
    if (value === 'tight') {
      document.body.classList.add('a11y-line-height-tight');
    } else if (value === 'loose') {
      document.body.classList.add('a11y-line-height-loose');
    }

    settings.lineHeight = value;
    saveSettings();
  }

  /**
   * Handle text alignment changes
   */
  function handleTextAlign(e) {
    const action = e.currentTarget.getAttribute('data-action');
    const drawer = document.querySelector(CONFIG.drawerSelector);

    // Remove active class from all alignment buttons
    drawer.querySelectorAll('[data-action^="align-"]').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to clicked button
    e.currentTarget.classList.add('active');

    // Remove previous alignment classes
    document.body.classList.remove('a11y-align-left', 'a11y-align-center', 'a11y-align-right');

    // Apply new alignment
    if (action === 'align-left') {
      document.body.classList.add('a11y-align-left');
      settings.textAlign = 'left';
    } else if (action === 'align-center') {
      document.body.classList.add('a11y-align-center');
      settings.textAlign = 'center';
    } else if (action === 'align-right') {
      document.body.classList.add('a11y-align-right');
      settings.textAlign = 'right';
    }

    saveSettings();
  }

  /**
   * Handle text spacing changes
   */
  function handleTextSpacingChange() {
    const value = this.value;
    const drawer = document.querySelector(CONFIG.drawerSelector);

    // Update UI
    drawer.querySelectorAll('input[name="text-spacing"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === value) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Remove previous spacing classes
    document.body.classList.remove('a11y-spacing-tight', 'a11y-spacing-loose');

    // Apply new spacing
    if (value === 'tight') {
      document.body.classList.add('a11y-spacing-tight');
    } else if (value === 'loose') {
      document.body.classList.add('a11y-spacing-loose');
    }

    settings.textSpacing = value;
    saveSettings();
  }

  /**
   * Handle visual option checkboxes
   */
  function handleVisualOption() {
    const name = this.getAttribute('name');
    const checked = this.checked;

    // Map checkbox names to body classes
    const classMap = {
      'enhanced-focus': 'a11y-enhanced-focus',
      'hide-images': 'a11y-hide-images',
      'highlight-links': 'a11y-highlight-links',
      'show-tooltips': 'a11y-show-tooltips',
      'reduce-motion': 'a11y-reduce-motion'
    };

    const className = classMap[name];
    if (className) {
      if (checked) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    }

    // Update settings
    const settingMap = {
      'enhanced-focus': 'enhancedFocus',
      'hide-images': 'hideImages',
      'highlight-links': 'highlightLinks',
      'show-tooltips': 'showTooltips',
      'reduce-motion': 'reduceMotion'
    };

    const settingKey = settingMap[name];
    if (settingKey) {
      settings[settingKey] = checked;
      saveSettings();
    }
  }

  /**
   * Skip to main content
   */
  function skipToMain() {
    const mainContent = document.querySelector('#mainSec, main, [role="main"]');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeDrawer();
  }

  /**
   * Scroll back to top
   */
  function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeDrawer();
  }

  /**
   * Reset all accessibility settings
   */
  function resetAll() {
    if (confirm('Are you sure you want to reset all accessibility settings?')) {
      // Reset settings object
      settings = {
        textSize: 'normal',
        theme: 'light',
        cursor: 'normal',
        lineHeight: 'normal',
        textAlign: 'left',
        textSpacing: 'normal',
        enhancedFocus: false,
        hideImages: false,
        highlightLinks: false,
        showTooltips: false,
        reduceMotion: false
      };

      // Remove all accessibility classes from body
      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('a11y-'))
        .join(' ');

      // Reset UI
      updateUIState();

      // Save settings
      saveSettings();

      // Provide feedback
      alert('All accessibility settings have been reset to defaults.');
    }
  }

  /**
   * Update UI to reflect current settings
   */
  function updateUIState() {
    const drawer = document.querySelector(CONFIG.drawerSelector);
    if (!drawer) return;

    // Text size buttons
    drawer.querySelectorAll('[data-action^="text-"]').forEach(btn => {
      const action = btn.getAttribute('data-action');
      if (
        (settings.textSize === 'decrease' && action === 'text-decrease') ||
        (settings.textSize === 'increase' && action === 'text-increase') ||
        (settings.textSize === 'normal' && action === 'text-normal')
      ) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Theme radio buttons
    drawer.querySelectorAll('input[name="theme"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === settings.theme) {
        input.checked = true;
        label.classList.add('active');
      } else {
        input.checked = false;
        label.classList.remove('active');
      }
    });

    // Cursor radio buttons
    drawer.querySelectorAll('input[name="cursor"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === settings.cursor) {
        input.checked = true;
        label.classList.add('active');
      } else {
        input.checked = false;
        label.classList.remove('active');
      }
    });

    // Line height radio buttons
    drawer.querySelectorAll('input[name="line-height"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === settings.lineHeight) {
        input.checked = true;
        label.classList.add('active');
      } else {
        input.checked = false;
        label.classList.remove('active');
      }
    });

    // Text alignment buttons
    drawer.querySelectorAll('[data-action^="align-"]').forEach(btn => {
      const action = btn.getAttribute('data-action');
      if (
        (settings.textAlign === 'left' && action === 'align-left') ||
        (settings.textAlign === 'center' && action === 'align-center') ||
        (settings.textAlign === 'right' && action === 'align-right')
      ) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Text spacing radio buttons
    drawer.querySelectorAll('input[name="text-spacing"]').forEach(input => {
      const label = input.closest('label');
      if (input.value === settings.textSpacing) {
        input.checked = true;
        label.classList.add('active');
      } else {
        input.checked = false;
        label.classList.remove('active');
      }
    });

    // Visual option checkboxes
    const checkboxMap = {
      'enhanced-focus': settings.enhancedFocus,
      'hide-images': settings.hideImages,
      'highlight-links': settings.highlightLinks,
      'show-tooltips': settings.showTooltips,
      'reduce-motion': settings.reduceMotion
    };

    Object.keys(checkboxMap).forEach(name => {
      const checkbox = drawer.querySelector(`input[name="${name}"]`);
      if (checkbox) {
        checkbox.checked = checkboxMap[name];
      }
    });
  }

  /**
   * Apply all settings to the page
   */
  function applyAllSettings() {
    // Text size
    document.body.classList.remove('a11y-text-decrease', 'a11y-text-increase');
    if (settings.textSize === 'decrease') {
      document.body.classList.add('a11y-text-decrease');
    } else if (settings.textSize === 'increase') {
      document.body.classList.add('a11y-text-increase');
    }

    // Theme
    document.body.classList.remove('a11y-theme-dark', 'a11y-theme-high-contrast');
    if (settings.theme === 'dark') {
      document.body.classList.add('a11y-theme-dark');
    } else if (settings.theme === 'high-contrast') {
      document.body.classList.add('a11y-theme-high-contrast');
    }

    // Cursor
    document.body.classList.remove('a11y-cursor-small', 'a11y-cursor-large');
    if (settings.cursor === 'small') {
      document.body.classList.add('a11y-cursor-small');
    } else if (settings.cursor === 'large') {
      document.body.classList.add('a11y-cursor-large');
    }

    // Line height
    document.body.classList.remove('a11y-line-height-tight', 'a11y-line-height-loose');
    if (settings.lineHeight === 'tight') {
      document.body.classList.add('a11y-line-height-tight');
    } else if (settings.lineHeight === 'loose') {
      document.body.classList.add('a11y-line-height-loose');
    }

    // Text alignment
    document.body.classList.remove('a11y-align-left', 'a11y-align-center', 'a11y-align-right');
    if (settings.textAlign === 'center') {
      document.body.classList.add('a11y-align-center');
    } else if (settings.textAlign === 'right') {
      document.body.classList.add('a11y-align-right');
    } else {
      document.body.classList.add('a11y-align-left');
    }

    // Text spacing
    document.body.classList.remove('a11y-spacing-tight', 'a11y-spacing-loose');
    if (settings.textSpacing === 'tight') {
      document.body.classList.add('a11y-spacing-tight');
    } else if (settings.textSpacing === 'loose') {
      document.body.classList.add('a11y-spacing-loose');
    }

    // Visual options
    if (settings.enhancedFocus) {
      document.body.classList.add('a11y-enhanced-focus');
    }
    if (settings.hideImages) {
      document.body.classList.add('a11y-hide-images');
    }
    if (settings.highlightLinks) {
      document.body.classList.add('a11y-highlight-links');
    }
    if (settings.showTooltips) {
      document.body.classList.add('a11y-show-tooltips');
    }
    if (settings.reduceMotion) {
      document.body.classList.add('a11y-reduce-motion');
    }
  }

  /**
   * Load settings from localStorage
   */
  function loadSettings() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        settings = { ...settings, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load accessibility settings:', e);
    }
  }

  /**
   * Save settings to localStorage
   */
  function saveSettings() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save accessibility settings:', e);
    }
  }

  /**
   * Handle form errors: focus first error and ensure accessibility linking
   * This ensures screen readers read error messages correctly.
   */
  function handleFormErrors(context) {
    const ctx = context || document;

    // Find all error messages in this context
    const errorMessages = ctx.querySelectorAll('.form-item--error-message');

    if (errorMessages.length === 0) return;

    console.log(`🎯 Accessibility: Checking ${errorMessages.length} form errors`);

    errorMessages.forEach(errorMes => {
      // Find the wrapper (Drupal's .form-item or similar)
      const wrapper = errorMes.closest('.form-item, .js-form-item');
      if (wrapper) {
        // Find input, select or textarea in this wrapper
        const field = wrapper.querySelector('input:not([type="hidden"]), select, textarea');
        if (field) {
          // 1. Link the field to its error message via aria-describedby for SR support
          if (errorMes.id) {
            const currentDescr = field.getAttribute('aria-describedby') || '';
            if (!currentDescr.includes(errorMes.id)) {
              field.setAttribute('aria-describedby', (currentDescr + ' ' + errorMes.id).trim());
            }
          }

          // 2. Mark as invalid for screen readers
          field.setAttribute('aria-invalid', 'true');
        }
      }
    });

    // 3. Focus the first field with an error
    // We only do this once per "event" to avoid grabbing focus unexpectedly during AJAX typing
    const firstErrorWrapper = ctx.querySelector('.form-item--error, .has-error');
    if (firstErrorWrapper) {
      const firstField = firstErrorWrapper.querySelector('input:not([type="hidden"]), select, textarea');
      
      // Check if we already handled this field to avoid focus loops in AJAX
      if (firstField && !firstField.getAttribute('data-a11y-focused')) {
        firstField.setAttribute('data-a11y-focused', 'true');
        
        console.log('🎯 Accessibility: Moving focus to first error field');

        // Delay slightly to allow the screen reader to acknowledge the page state
        setTimeout(() => {
          if (firstField) {
            firstField.focus();
            // Scroll it into view for sighted users
            firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }

  /**
   * Check for system preferences and apply them if no user settings exist
   */
  function checkSystemPreferences() {
    // Check if user has saved settings
    const hasSavedSettings = localStorage.getItem(CONFIG.storageKey);
    if (hasSavedSettings) return;

    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Note: Don't auto-apply dark mode for government sites, just detect it
      console.log('Dark mode preference detected');
    }

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      settings.reduceMotion = true;
      document.body.classList.add('a11y-reduce-motion');
      const checkbox = document.querySelector('input[name="reduce-motion"]');
      if (checkbox) checkbox.checked = true;
      saveSettings();
    }

    // Check for high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      console.log('High contrast preference detected');
    }
  }

  // Expose public API (if needed)
  window.SJVNAccessibility = {
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    resetAll: resetAll,
    getSettings: function () { return settings; }
  };

})();
