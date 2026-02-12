(function ($, Drupal, drupalSettings) {
    'use strict';

    Drupal.behaviors.externalLinkSafetyWarning = {
        attach: function (context, settings) {
            // Determine language
            const lang = $('html').attr('lang') || 'en';
            const isHindi = lang === 'hi';

            // Translations based on user-provided content
            const content = {
                title: isHindi ? 'बाहरी वेबसाइट पर पुनर्निर्देशन' : 'External Website Redirection',
                alertTitle: isHindi ? 'आप एक बाहरी वेबसाइट पर जा रहे हैं' : 'You are being redirected to an external website',
                subTitle: isHindi ? 'यह लिंक आपको एसजेवीएन की आधिकारिक वेबसाइट से बाहर ले जाएगा।' : 'This link will take you to outside of the SJVN official website.',
                disclaimer: isHindi
                    ? 'एसजेवीएन लिंक की गई वेबसाइट की सामग्री या विश्वसनीयता के लिए ज़िम्मेदार नहीं है और इसमें व्यक्त किए गए विचारों का आवश्यक रूप से समर्थन नहीं करता है।'
                    : 'SJVN is not responsible for the content or reliability of the linked website and does not necessarily endorse the views expressed within it.',
                proceed: isHindi ? 'क्या आप आगे बढ़ना चाहते हैं?' : 'Do you want to proceed?',
                continue: isHindi ? '✔ जारी रखें' : '✔ Continue',
                cancel: isHindi ? '✖ रद्द करें' : '✖ Cancel'
            };

            // 1. Inject Modal HTML if not exists
            if ($('#elw-overlay').length === 0) {
                const modalHtml = `
          <div id="elw-overlay" class="elw-modal-overlay" aria-hidden="true" role="dialog">
            <div class="elw-modal" tabindex="-1">
              <div class="elw-header">
                <h2>${content.title}</h2>
                <button class="elw-close" aria-label="Close">&times;<span class="visually-hidden">Close</span></button>
              </div>
              <div class="elw-body">
                <div class="elw-alert-title">
                  <span class="elw-icon">⚠️</span>
                  <span>${content.alertTitle}</span>
                </div>
                <p class="elw-text"><strong>${content.subTitle}</strong></p>
                <div class="elw-policy-box">
                  ${content.disclaimer}
                </div>
                <p style="margin-top: 25px; text-align: center; font-weight: bold;">${content.proceed}</p>
              </div>
              <div class="elw-footer">
                <button class="elw-btn elw-btn-cancel">${content.cancel}</button>
                <a href="#" class="elw-btn elw-btn-continue">${content.continue}</a>
              </div>
            </div>
          </div>
        `;
                $('body').append(modalHtml);
            }

            const $overlay = $('#elw-overlay');
            const $continueBtn = $overlay.find('.elw-btn-continue');
            const $closeBtns = $overlay.find('.elw-close, .elw-btn-cancel');

            // 2. Identify External Links
            const currentHost = window.location.host;

            $(once('external-warning', 'a[href]', context)).each(function () {
                const $link = $(this);
                const href = $link.attr('href');

                // Safety checks for valid links
                if (!href ||
                    href.startsWith('/') ||
                    href.startsWith('#') ||
                    href.startsWith('mailto:') ||
                    href.startsWith('tel:') ||
                    href.startsWith('javascript:') ||
                    href.startsWith('?') || // Exclude query-only links (common in pagination)
                    href.includes(currentHost) ||
                    $link.closest('.pager, .pagination').length > 0) { // Exclude links inside pagers
                    return;
                }

                // It's an external link - Attach click handler
                $link.on('click', function (e) {
                    e.preventDefault();

                    const targetUrl = $link.prop('href');
                    const targetAttr = $link.attr('target');

                    // Prep the modal
                    $continueBtn.attr('href', targetUrl);
                    if (targetAttr === '_blank') {
                        $continueBtn.attr('target', '_blank');
                    } else {
                        $continueBtn.removeAttr('target');
                    }

                    // Show modal
                    $overlay.addClass('active');
                    $overlay.attr('aria-hidden', 'false');
                    $overlay.find('.elw-modal').focus();
                });
            });

            // Close handlers
            $closeBtns.on('click', function () {
                $overlay.removeClass('active');
                $overlay.attr('aria-hidden', 'true');
            });

            $overlay.on('click', function (e) {
                if ($(e.target).is($overlay)) {
                    $overlay.removeClass('active');
                }
            });

            // Escape key to close
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape' && $overlay.hasClass('active')) {
                    $overlay.removeClass('active');
                }
            });

            // Continue button click logic (close modal after clicking continue if it's the same tab)
            $continueBtn.on('click', function () {
                if (!$continueBtn.attr('target')) {
                    $overlay.removeClass('active');
                }
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
