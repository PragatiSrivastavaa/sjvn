(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.dopSearchHighlight = {
    attach: function (context, settings) {
      // Find search query from URL query parameter 'body_value' or the exposed filter input field
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('body_value') || $('input[name="body_value"]', context).val();
      
      // Find the DOP view container or accordion items in the current context
      const $dopAccordion = $('.view-id-dop, #accordionFaqPage2', context);
      if ($dopAccordion.length === 0) {
        return;
      }

      // Clean up any existing highlights first to avoid duplication/nesting
      $dopAccordion.find('mark.search-highlight').each(function () {
        const parent = this.parentNode;
        if (parent) {
          $(this).replaceWith(this.textContent);
          parent.normalize(); // Merge adjacent text nodes back together
        }
      });

      if (!query || query.trim() === '') {
        return;
      }

      const trimmedQuery = query.trim();

      // Highlight the matching terms inside the accordion items
      $dopAccordion.find('.accordion-item').each(function () {
        const accordionItem = this;
        highlightKeywords(accordionItem, trimmedQuery);
        
        // If a match is found in the accordion body, expand the accordion item
        const $item = $(accordionItem);
        const hasHighlight = $item.find('mark.search-highlight').length > 0;
        if (hasHighlight) {
          const $button = $item.find('.accordion-button');
          const $collapse = $item.find('.accordion-collapse');
          
          if ($button.hasClass('collapsed')) {
            $button.removeClass('collapsed').attr('aria-expanded', 'true');
            $collapse.addClass('show');
          }
        }
      });

      /**
       * Highlight keywords in a DOM element by replacing matching text nodes.
       */
      function highlightKeywords(element, query) {
        if (!element || !query) return;

        const terms = [];
        terms.push(query);

        // Split into individual words
        const words = query.split(/\s+/);
        words.forEach(word => {
          const w = word.trim();
          // Include words with length >= 3
          if (w.length >= 3 && !terms.includes(w)) {
            terms.push(w);
          }
        });

        // Sort terms by length descending to match longest phrases first
        terms.sort((a, b) => b.length - a.length);

        // Escape regex characters for each term
        const escapedTerms = terms.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        
        // Build the regex pattern
        const pattern = `(${escapedTerms.join('|')})`;
        const regex = new RegExp(pattern, 'gi');

        // Traverse the DOM to find all text nodes
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        while (walker.nextNode()) {
          const node = walker.currentNode;
          
          // Skip script, style, textarea, input, and already highlighted marks
          if (
            node.parentNode &&
            node.parentNode.tagName !== 'SCRIPT' &&
            node.parentNode.tagName !== 'STYLE' &&
            node.parentNode.tagName !== 'MARK' &&
            node.parentNode.tagName !== 'TEXTAREA' &&
            node.parentNode.tagName !== 'INPUT'
          ) {
            // Test if the text node contains any matching terms
            if (regex.test(node.nodeValue)) {
              textNodes.push(node);
            }
          }
        }

        // Replace each text node with highlighted HTML
        textNodes.forEach(node => {
          const parent = node.parentNode;
          if (!parent) return;

          const text = node.nodeValue;
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;

          // Reset regex index
          regex.lastIndex = 0;
          let match;

          while ((match = regex.exec(text)) !== null) {
            const matchText = match[0];
            const matchIndex = match.index;

            // Add text before match
            if (matchIndex > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
            }

            // Add highlighted mark
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.appendChild(document.createTextNode(matchText));
            fragment.appendChild(mark);

            lastIndex = regex.lastIndex;
          }

          // Add remaining text
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
          }

          parent.replaceChild(fragment, node);
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
