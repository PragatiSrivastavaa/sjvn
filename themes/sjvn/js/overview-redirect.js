(function () {
    'use strict';

    // Check if we are on the overview page (supporting both languages and potentially clean/unclean URLs)
    // Logic: path contains '/overview' at the end.
    var path = window.location.pathname;

    if (path.match(/\/(overview|avalaokana)\/?$/)) {
        var searchParams = new URLSearchParams(window.location.search);

        // Check if the specific query parameter is missing
        if (!searchParams.has('field_project_list_target_id')) {
            // Append the required parameter
            searchParams.set('field_project_list_target_id', '99');

            // Construct the new URL
            var newUrl = window.location.protocol + "//" + window.location.host + path + "?" + searchParams.toString();

            // Redirect
            window.location.replace(newUrl);
        }
    }
})();
