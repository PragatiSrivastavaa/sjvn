console.log("✅ script.js is loading");
// tabs
$(document).ready(function(){
  $(".nav-tabs a").click(function(){
    $(this).tab('show');
  });
 
});


// Function to load includes with callback
function includeHTML(id, file, callback) {
  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (typeof callback === "function") callback();
    })
    .catch(err => console.error("Include Error:", err));
}

// Attach Theme Switcher Logic
/*function attachThemeSwitcher() {
  const themeOptions = document.querySelectorAll(".theme-inline .theme-color");
  if (!themeOptions.length) return;

  themeOptions.forEach(option => {
    option.addEventListener("click", () => {
      themeOptions.forEach(c => (c.style.borderColor = "transparent"));
      option.style.borderColor = "#fff";

      const theme = option.dataset.theme;
      document.documentElement.classList.remove("green-theme", "dark-theme");
      if (theme === "green") document.documentElement.classList.add("green-theme");
      if (theme === "dark") document.documentElement.classList.add("dark-theme");

      localStorage.setItem("site-theme", theme);
    });
  });

  // Load saved theme safely
  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme) {
    document.documentElement.classList.remove("green-theme", "dark-theme");
    if (savedTheme === "green") document.documentElement.classList.add("green-theme");
    if (savedTheme === "dark") document.documentElement.classList.add("dark-theme");

    const selectedCircle = document.querySelector(`.theme-inline .${savedTheme}`);
    if (selectedCircle) selectedCircle.style.borderColor = "#fff";
  }
}
*/
// Attach Theme Switcher Logic
function attachThemeSwitcher() {
  const themeOptions = document.querySelectorAll(".theme-inline .theme-color");
  if (!themeOptions.length) return;

  const themes = ["blue", "green", "dark"];

  function applyTheme(theme) {
    // Remove all theme classes
    document.documentElement.classList.remove(...themes.map(t => `${t}-theme`));
    // Apply selected theme
    document.documentElement.classList.add(`${theme}-theme`);
    // Reset borders
    themeOptions.forEach(c => (c.style.borderColor = "transparent"));
    const selectedCircle = document.querySelector(`.theme-inline .${theme}`);
    if (selectedCircle) selectedCircle.style.borderColor = "#fff";
    // Save theme
    localStorage.setItem("site-theme", theme);
  }

  // Attach click events
  themeOptions.forEach(option => {
    option.addEventListener("click", () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
    });
  });

  // Load saved theme or force default blue
  let savedTheme = localStorage.getItem("site-theme");
  if (!savedTheme || !themes.includes(savedTheme)) {
    savedTheme = "blue"; // Default theme
  }
  applyTheme(savedTheme);
}

// Run after DOM loads
document.addEventListener("DOMContentLoaded", attachThemeSwitcher);


document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dotsContainer = document.querySelector(".carousel-dots");
  let currentSlide = 0;
  let autoSlide;

  // Create pagination dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  }

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  // Initialize carousel
  showSlide(currentSlide);
  resetAutoSlide();
});


document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".announcement-track");
  const pauseBtn = document.querySelector(".ann-pause");
  const prevBtn = document.querySelector(".ann-prev");
  const nextBtn = document.querySelector(".ann-next");

  let isPaused = false;

  pauseBtn.addEventListener("click", () => {
    if (isPaused) {
      track.style.animationPlayState = "running";
      pauseBtn.textContent = "⏸";
    } else {
      track.style.animationPlayState = "paused";
      pauseBtn.textContent = "▶";
    }
    isPaused = !isPaused;
  });

  prevBtn.addEventListener("click", () => {
    track.scrollLeft -= 150;
  });

  nextBtn.addEventListener("click", () => {
    track.scrollLeft += 150;
  });
});


const carousel = document.getElementById('carousel');
const items = carousel.querySelectorAll('.power-item');
const leftButton = document.querySelector('.power-station-carousel-button.left');
const rightButton = document.querySelector('.power-station-carousel-button.right');

let activeIndex = 2; // start from center item

function updateCarousel() {
  items.forEach((item, index) => {
    item.className = 'power-item'; // reset classes
    if (index === activeIndex) {
      item.classList.add('active');
    } else if (index === activeIndex - 1) {
      item.classList.add('left1');
    } else if (index === activeIndex - 2) {
      item.classList.add('left2');
    } else if (index === activeIndex + 1) {
      item.classList.add('right1');
    } else if (index === activeIndex + 2) {
      item.classList.add('right2');
    }
  });
}

leftButton.addEventListener('click', () => {
  activeIndex = (activeIndex - 1 + items.length) % items.length;
  updateCarousel();
});

rightButton.addEventListener('click', () => {
  activeIndex = (activeIndex + 1) % items.length;
  updateCarousel();
});

// Initial display
updateCarousel();


document.addEventListener("DOMContentLoaded", () => {
  const alerts = document.querySelectorAll(".alert-card");
  const dotsContainer = document.querySelector(".alert-dots");
  let currentIndex = 0;
  let autoSlide;

  // Create dots dynamically
  alerts.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function showSlide(index) {
    alerts.forEach((alert, i) => {
      alert.classList.toggle("active", i === index);
      dots[i].classList.toggle("active", i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % alerts.length;
    showSlide(nextIndex);
  }

  // Auto slide every 4s
  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  // Initialize
  showSlide(0);
  startAutoSlide();

  // Pause on hover
  document.querySelector(".alert-carousel").addEventListener("mouseenter", stopAutoSlide);
  document.querySelector(".alert-carousel").addEventListener("mouseleave", startAutoSlide);
});


document.addEventListener("DOMContentLoaded", () => {
  const businessItems = document.querySelectorAll(".business-item");
  const businessDisplay = document.getElementById("business-display");

  businessItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      const imgSrc = item.getAttribute("data-image");
      businessDisplay.src = imgSrc;
    });

    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link");
      window.location.href = link;
    });
  });
});


document.querySelectorAll('.quick-arrow').forEach(button => {
  button.addEventListener('click', () => {
    const container = document.querySelector('.quick-links-container');
    const scrollAmount = 250; // adjust as needed

    if (button.classList.contains('left')) {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  });
});

// search box toggle
jQuery(document).ready(function($){
  $(".search-btn a").click(function(e){
    e.preventDefault();
    $("#search-block-form").toggleClass("search-block-form-ShowBox");
  });
});

