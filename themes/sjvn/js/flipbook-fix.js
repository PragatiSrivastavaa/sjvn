(function ($, Drupal, drupalSettings, once) {
    Drupal.behaviors.sjvnFlipbookFix = {
        attach: function (context, settings) {
            // Basic path setup
            var path = drupalSettings.host + "/" + drupalSettings.modulepath;
            var pdfChoice = drupalSettings.pdfchoice;

            // Mode 1: Popup
            if (pdfChoice == 1) {
                once('sjvn-flipbook-fix', '.flipbook-trigger', context).forEach(function (el) {
                    $(el).on('click', function (e) {
                        e.preventDefault();
                        var $btn = $(this);
                        var fid = $btn.attr('data-flipbook-id');
                        var currentpath = $btn.attr('data-pdf') || $btn.attr('data');
                        var modalSelector = '#flip-book-window-' + fid;
                        var $modal = $(modalSelector);

                        if (!$modal.length) {
                            // Fallback to old global modal if ID modal not found
                            $modal = $('#flip-book-window');
                        }

                        if (!$modal.length) {
                            console.error('Flipbook modal not found: ' + modalSelector);
                            return;
                        }

                        var options = {
                            pdf: currentpath,
                            downloadURL: currentpath,
                            template: {
                                html: path + '/templates/default-book-view.html',
                                styles: [
                                    path + '/css/font-awesome.min.css',
                                    path + '/css/short-white-book-view.css'
                                ],
                                script: path + '/js/default-book-view.js'
                            }
                        };

                        var $mountNode = $modal.find('.mount-node');

                        // Re-initialize flipbook when modal is shown
                        $modal.off('shown.bs.modal').on('shown.bs.modal', function () {
                            $mountNode.FlipBook(options);
                        });

                        // Cleanup when modal is hidden
                        $modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                            $mountNode.empty();
                        });

                        $modal.modal('show');
                    });
                });
            }
            // Mode 2: Embedded
            else {
                once('sjvn-flipbook-fix', '.pdfcontainer[data-pdf]', context).forEach(function (el) {
                    var $container = $(el);
                    var pdfPath = $container.attr('data-pdf');

                    $container.FlipBook({
                        pdf: pdfPath,
                        template: {
                            html: path + '/templates/default-book-view.html',
                            links: [{
                                rel: 'stylesheet',
                                href: path + '/css/font-awesome.min.css'
                            }],
                            styles: [
                                path + '/css/short-black-book-view.css'
                            ],
                            script: path + '/js/default-book-view.js'
                        }
                    });
                });
            }
        }
    };
})(jQuery, Drupal, drupalSettings, once);
