(function ($, Drupal) {
    Drupal.behaviors.sjvnFilterLabels = {
        attach: function (context, settings) {
            function renameOptions() {
                // Find View containers
                var $views = $('.view-tariff-petition, .view-energy-bill', context).addBack('.view-tariff-petition, .view-energy-bill');

                $views.each(function () {
                    var $view = $(this);
                    // Iterate over each SHS widget container to identify level by data attribute
                    // This relies on SHS module structure: <div class="shs-widget-container" data-shs-level="X">
                    $view.find('.shs-widget-container').each(function () {
                        var $container = $(this);
                        // Ensure we parse the level as an integer
                        var level = parseInt($container.data('shs-level'), 10);
                        var $select = $container.find('select');

                        // The value for "Any" is usually "All" in Drupa Views. 
                        // We target it specifically to change its text.
                        var $option = $select.find('option[value="All"]');

                        if ($option.length) {
                            if (level === 0) {
                                $option.text(Drupal.t('Project Category'));
                            } else if (level === 1) {
                                $option.text(Drupal.t('Project Name'));
                            }
                        }
                    });
                });
            }

            // 1. Run immediately on attach
            renameOptions();

            // 2. Run on any AJAX completion (to catch Views or SHS updates)
            $(document).ajaxComplete(function () {
                renameOptions();
            });

            // 3. Bind to change event to catch "lazy" loading of next levels
            // We use a timeout because SHS might insert the new DOM elements slightly after the change event.
            $('select.shs-select', context).once('sjvn-bind-shs-rename').on('change', function () {
                setTimeout(renameOptions, 200);
                setTimeout(renameOptions, 700);
            });
        }
    };
})(jQuery, Drupal);
