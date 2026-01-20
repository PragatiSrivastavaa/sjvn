
jQuery(document).ready(function () {
    var path = drupalSettings.host + "/" + drupalSettings.modulepath;

    // Check mode
    if (drupalSettings.pdfchoice == 1) {
        // --- POPUP MODE ---
        var template = {
            html: path + '/templates/default-book-view.html',
            styles: [
                path + '/css/font-awesome.min.css',
                path + '/css/short-white-book-view.css'
            ],
            script: path + '/js/default-book-view.js'
        };

        // Bind click to the new class we added in Twig
        jQuery('.flipbook-popup-trigger').click(function (e) {
            e.preventDefault();
            var $btn = jQuery(this);
            var currentpath = $btn.attr('data-pdf') || $btn.attr('data'); // Fallback to old attr if needed
            var targetModalSelector = $btn.attr('data-target'); // e.g. #flip-book-window-123

            if (!targetModalSelector) {
                // Fallback for legacy ID if something failed
                targetModalSelector = '#flip-book-window';
            }

            var $modal = jQuery(targetModalSelector);
            var $mountNode = $modal.find('.mount-node');

            var booksOptions = {
                pdf: currentpath,
                downloadURL: currentpath,
                template: template
            };

            var instance = {
                scene: undefined,
                options: booksOptions,
                node: $mountNode
            };

            // Manage Modal Events
            // Ensure we don't stack event listeners if clicked multiple times
            $modal.off('shown.bs.modal').on('shown.bs.modal', function () {
                // Initialize FlipBook when modal is shown
                if (!instance.scene) {
                    instance.scene = instance.node.FlipBook(instance.options);
                }
            });

            $modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                // Dispose to free memory when hidden
                if (instance.scene) {
                    instance.scene.dispose();
                    instance.scene = undefined;
                }
            });

            // Show the modal
            $modal.modal('show');
        });

    } else {
        // --- EMBEDDED MODE ---
        var template = {
            html: path + '/templates/default-book-view.html',
            links: [{
                rel: 'stylesheet',
                href: path + '/css/font-awesome.min.css'
            }],
            styles: [
                path + '/css/short-black-book-view.css'
            ],
            script: path + '/js/default-book-view.js'
        };

        // Support both old ID (fallback) and new Class
        var $containers = jQuery('.flipbook-embed-container, #container1');

        $containers.each(function () {
            var $container = jQuery(this);

            // Prevent double initialization
            if ($container.hasClass('js-flipbook-processed')) {
                return;
            }
            $container.addClass('js-flipbook-processed');

            // Get PDF URL from data attribute (new way) or global settings (legacy fallback)
            var pdfPath = $container.attr('data-pdf');
            if (!pdfPath && $container.attr('id') === 'container1') {
                pdfPath = drupalSettings.pdfpath;
            }

            if (pdfPath) {
                $container.FlipBook({
                    pdf: pdfPath,
                    template: template
                });
            }
        });
    }
});