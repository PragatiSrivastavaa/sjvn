console.log("✅ script.js is loading");

// search box toggle
jQuery(document).ready(function ($) {


  $('.set h2, .set h3, .set h4, .set h5').on('click', function () {

    const $heading = $(this);

    if ($heading.hasClass('active')) {
      $heading.removeClass('active');
      $heading.find('button').attr('aria-expanded', false);
      $heading.parents('.set').removeClass('active-tab');
      $heading.siblings('.acc-content').slideUp(200);
      $heading.find('svg').removeClass('fa-minus').addClass('fa-plus');
    } else {
      $heading.find('svg').removeClass('fa-plus').addClass('fa-minus');
      $heading.addClass('active');
      $heading.find('button').attr('aria-expanded', true);
      $heading.parents('.set').addClass('active-tab');
      $heading.siblings('.acc-content').slideDown(200);

      /* 👉 Scroll to clicked heading */
      $('html, body').animate({
        scrollTop: $heading.offset().top - 100
      }, 400);
    }
  });



  $(".search-btn a").click(function (e) {
    e.preventDefault();
    $("#search-block-form").toggleClass("search-block-form-ShowBox");
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
  const wrapper = document.querySelector(".announcement-track-wrapper");
  const track = document.querySelector(".announcement-track");
  const pauseBtn = document.querySelector(".ann-pause");
  const prevBtn = document.querySelector(".ann-prev");
  const nextBtn = document.querySelector(".ann-next");

  if (!wrapper || !track || !pauseBtn || !prevBtn || !nextBtn) return;

  // Clone items TWICE to ensure a perfectly seamless loop without gaps
  const items = Array.from(track.children);
  const oneSetWidth = track.scrollWidth; // get initial width

  items.forEach(item => track.appendChild(item.cloneNode(true)));
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  let isPaused = false;
  let isNavigating = false;
  let scrollPos = 0;
  const speed = 0.5;
  let navTimeout = null;

  function ticker() {
    if (!isPaused && !isNavigating) {
      scrollPos += speed;
      // When we reach the end of the first set, jump back quietly
      if (scrollPos >= oneSetWidth) {
        scrollPos = 0;
      }
      wrapper.scrollLeft = scrollPos;
    }
    requestAnimationFrame(ticker);
  }

  const syncState = () => {
    let currentX = wrapper.scrollLeft;
    // Keep internal scrollPos within the first set range
    if (currentX >= oneSetWidth) {
      currentX = currentX % oneSetWidth;
      wrapper.scrollLeft = currentX;
    }
    scrollPos = currentX;
  };

  const setPause = (paused) => {
    isPaused = paused;
    pauseBtn.textContent = isPaused ? "▶" : "⏸";
  };

  pauseBtn.addEventListener("click", () => {
    if (isPaused) {
      if (navTimeout) clearTimeout(navTimeout);
      isNavigating = false;
      syncState();
      setPause(false);
    } else {
      setPause(true);
    }
  });

  const moveToIndex = (direction) => {
    if (navTimeout) clearTimeout(navTimeout);
    isNavigating = true;
    setPause(true);

    const allItems = Array.from(track.children);
    const currentX = wrapper.scrollLeft;
    let targetX = currentX;
    const tolerance = 20;

    if (direction === "next") {
      for (let item of allItems) {
        if (item.offsetLeft > currentX + tolerance) {
          targetX = item.offsetLeft;
          break;
        }
      }
    } else {
      for (let i = allItems.length - 1; i >= 0; i--) {
        if (allItems[i].offsetLeft < currentX - tolerance) {
          targetX = allItems[i].offsetLeft;
          break;
        }
      }
    }

    wrapper.scrollTo({
      left: targetX,
      behavior: "smooth"
    });

    navTimeout = setTimeout(() => {
      syncState();
      isNavigating = false;
      navTimeout = null;
    }, 600);
  };

  nextBtn.addEventListener("click", () => moveToIndex("next"));
  prevBtn.addEventListener("click", () => moveToIndex("prev"));

  requestAnimationFrame(ticker);

  wrapper.addEventListener("scroll", () => {
    if (isPaused && !isNavigating) {
      syncState();
    }
  });

  wrapper.addEventListener("mouseenter", () => setPause(true));
  wrapper.addEventListener("mouseleave", () => {
    if (pauseBtn.textContent === "⏸") {
      syncState();
      setPause(false);
    }
  });
});


const carousel = document.getElementById('carousel');
const items = carousel.querySelectorAll('.power-item');
const leftButton = document.querySelector('.power-station-carousel-button.left');
const rightButton = document.querySelector('.power-station-carousel-button.right');

let activeIndex = 2; // start from center item

function updateCarousel() {
  const total = items.length;
  items.forEach((item, index) => {
    item.className = 'power-item';
    item.style.display = 'flex';

    // Calculate circular relative position
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff <= -total / 2) diff += total;

    if (diff === 0) {
      item.classList.add('active');
    } else if (diff === -1) {
      item.classList.add('left1');
    } else if (diff === -2) {
      item.classList.add('left2');
    } else if (diff === 1) {
      item.classList.add('right1');
    } else if (diff === 2) {
      item.classList.add('right2');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Add click functionality to carousel items
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    activeIndex = index;
    updateCarousel();
  });
});

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



// Back to Top functionality with Progress Ring
document.addEventListener("DOMContentLoaded", function () {
  let backToTopBtn = document.getElementById("back-to-top");

  // FAILSAFE: Inject button if missing (e.g. different template)
  if (!backToTopBtn) {
    const btnHTML = `
      <button id="back-to-top" class="back-to-top" aria-label="Back to Top" title="Back to Top">
        <svg class="progress-ring" width="100%" height="100%" viewBox="0 0 100 100">
          <circle class="progress-ring-bg" cx="50" cy="50" r="46" stroke="none" stroke-width="0" fill="#009edb" style="fill: var(--primary-color, #009edb)" />
          <circle class="progress-ring-path" cx="50" cy="50" r="46" stroke-width="4" fill="none" stroke="#fdb913" style="stroke: var(--secondary-color, #fdb913)" />
        </svg>
        <span class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </span>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', btnHTML);
    backToTopBtn = document.getElementById("back-to-top");
  }

  const progressPath = backToTopBtn.querySelector('.progress-ring-path');

  if (backToTopBtn && progressPath) {
    // Circumference = 2 * PI * r
    // r = 46, so C ≈ 289.02
    const circumference = 2 * Math.PI * 46;

    // Set initial dasharray and offset
    progressPath.style.strokeDasharray = `${circumference} ${circumference}`;
    progressPath.style.strokeDashoffset = circumference;

    const setProgress = (percent) => {
      const offset = circumference - (percent / 100) * circumference;
      progressPath.style.strokeDashoffset = offset;
    };

    const updateProgress = (e) => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      // Detect who is scrolling
      if (e && e.target && e.target !== document) {
        // Scrolling inside a div/element
        scrollTop = e.target.scrollTop;
        scrollHeight = e.target.scrollHeight;
        clientHeight = e.target.clientHeight;
      } else {
        // Window/Body scrolling
        scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        clientHeight = document.documentElement.clientHeight || window.innerHeight;
      }

      // If we found a valid scroll position, update the button
      if (typeof scrollTop !== 'number') return;

      // Show/Hide button logic (Threshold 50px)
      if (scrollTop > 50) {
        backToTopBtn.classList.add("show");
        backToTopBtn.style.opacity = "1";
        backToTopBtn.style.visibility = "visible";
      } else {
        backToTopBtn.classList.remove("show");
        backToTopBtn.style.opacity = "0";
        backToTopBtn.style.visibility = "hidden";
      }

      // Calculate Scroll Percentage
      const scrollTotal = scrollHeight - clientHeight;
      let scrollPercentage = 0;
      if (scrollTotal > 0) {
        scrollPercentage = (scrollTop / scrollTotal) * 100;
      }

      // Cap at 100%
      if (scrollPercentage > 100) scrollPercentage = 100;
      if (scrollPercentage < 0) scrollPercentage = 0;

      setProgress(scrollPercentage);
    };

    // USE CAPTURE PHASE: Pass 'true' as third argument
    // This catches 'scroll' events from ANY element (div, iframe, etc.) before they bubble (which they don't usually do)
    document.addEventListener("scroll", updateProgress, true);

    // Fallback: Check window scroll periodically just in case
    setInterval(() => {
      updateProgress();
    }, 1000); // Check every second

    // Button Click Logic - Try to scroll EVERYTHING
    backToTopBtn.addEventListener("click", function () {
      // 1. Try Window
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });

      // 2. Try to find scrolling containers and scroll them too
      const scrollables = document.querySelectorAll('*');
      for (let el of scrollables) {
        if (el.scrollTop > 0) {
          try {
            el.scrollTo({ top: 0, behavior: "smooth" });
          } catch (e) {
            el.scrollTop = 0; // Fallback if scrollTo not supported
          }
        }
      }
    });
  }
});
