/**
 * @file
 * Handles tab functionality for Our Business content type.
 */

(function () {
  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".nav-tabs li a");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
      tab.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        
        // If it's a real link, do nothing and let the browser navigate
        if (href && !href.startsWith("#")) {
          return;
        }

        e.preventDefault();

        // Remove active class from all tabs
        document.querySelectorAll(".nav-tabs li").forEach(li => li.classList.remove("active"));

        // Hide all panes
        panes.forEach(p => p.classList.remove("active"));

        // Add active class to clicked tab + target pane
        this.parentElement.classList.add("active");
        const target = document.querySelector(href);
        if (target) target.classList.add("active");
      });
    });
  });

})();

