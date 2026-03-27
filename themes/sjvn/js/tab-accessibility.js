/**
 * @file
 * tab-accessibility.js
 * 
 * Provides enhanced keyboard accessibility for radio buttons styled as tabs/buttons.
 * Allows users to TAB through each individual button and activate them with Enter/Space.
 */
(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.sjvnTabAccessibility = {
    attach: function (context) {
      // Find all labels in the tab-menu-item form-radios group
      const $labels = $(once('tab-a11y', '.tab-menu-item .form-radios label', context));

      $labels.each(function () {
        const $label = $(this);
        const radioId = $label.attr('for');
        
        if (!radioId) return;
        
        const $radio = $('#' + radioId);
        if (!$radio.length) return;

        // 1. Make the label focusable
        $label.attr('tabindex', '0');
        $label.attr('role', 'button');
        
        // Add aria-pressed state if checked
        if ($radio.is(':checked')) {
          $label.attr('aria-pressed', 'true');
        } else {
          $label.attr('aria-pressed', 'false');
        }

        // 2. Handle keyboard activation (Enter or Space)
        $label.on('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Trigger click on the radio button
            $radio.prop('checked', true).trigger('change');
            // Also click it to trigger any BEF AJAX logic
            $radio.click();
          }
        });

        // 3. Update aria-pressed when radio changes
        $radio.on('change', function() {
           $('.tab-menu-item .form-radios label[for]').attr('aria-pressed', 'false');
           if ($(this).is(':checked')) {
             $label.attr('aria-pressed', 'true');
           }
        });
      });
    }
  };

})(jQuery, Drupal, once);
