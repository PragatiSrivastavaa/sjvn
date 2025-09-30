// Accessibility Functions

// Increase font size
function increaseFont() {
  document.body.style.fontSize = "larger";
}

// Decrease font size
function decreaseFont() {
  document.body.style.fontSize = "smaller";
}

// Toggle high contrast
function toggleContrast() {
  document.body.classList.toggle("high-contrast");
}

// tabs
document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".nav-tabs li a");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
      tab.addEventListener("click", function(e) {
        e.preventDefault();

        // remove active class from all tabs
        document.querySelectorAll(".nav-tabs li").forEach(li => li.classList.remove("active"));
        tabs.forEach(t => t.classList.remove("active"));

        // hide all panes
        panes.forEach(p => p.classList.remove("active"));

        // add active class to clicked tab + target pane
        this.parentElement.classList.add("active");
        document.querySelector(this.getAttribute("href")).classList.add("active");
      });
    });
  });


  //video popup
