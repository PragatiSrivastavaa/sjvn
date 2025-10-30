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
        e.preventDefault();

        // Remove active class from all tabs
        document.querySelectorAll(".nav-tabs li").forEach(li => li.classList.remove("active"));

        // Hide all panes
        panes.forEach(p => p.classList.remove("active"));

        // Add active class to clicked tab + target pane
        this.parentElement.classList.add("active");
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.classList.add("active");
      });
    });
  });

})();

