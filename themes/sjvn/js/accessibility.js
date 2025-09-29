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
$(document).ready(function(){
  $(".nav-tabs a").click(function(){
    $(this).tab('show');
  });
 
});


//video popup
