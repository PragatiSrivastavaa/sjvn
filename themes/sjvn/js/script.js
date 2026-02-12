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

    // Search Toggle with Event Delegation
    $(document).on("click", ".search-btn button, .search-btn a", function (e) {
        e.preventDefault();
        console.log("Search button clicked");
        var $searchForm = $("#search-block-form");
        if ($searchForm.length) {
            $searchForm.toggleClass("search-block-form-ShowBox");
        } else {
            // Fallback if ID is different
            $(".search-block-form, [id^='search-block-form']").toggleClass("search-block-form-ShowBox");
        }
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

// Hero Carousel
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".carousel-slide");
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");
    const dotsContainer = document.querySelector(".carousel-dots");
    const carouselSection = document.querySelector('.hero-carousel');
    let currentSlide = 0;
    let autoSlide;
    let isCarouselPaused = false;

    if (!slides.length || !prevBtn || !nextBtn || !dotsContainer || !carouselSection) return;

    // Inject Pause/Play Button
    const pauseToggle = document.createElement("button");
    pauseToggle.className = "carousel-pause-toggle";
    pauseToggle.setAttribute("aria-label", "Pause auto-playing banner");
    pauseToggle.innerHTML = '<i class="bi bi-pause-fill"></i>';
    carouselSection.appendChild(pauseToggle);

    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.innerHTML = `<span class="visually-hidden">Go to slide ${index + 1}</span>`;
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("button");
    const heroCarousel = document.querySelector('.hero-carousel');
    let bgBlur = document.querySelector('.hero-bg-blur');
    if (heroCarousel && !bgBlur) {
        bgBlur = document.createElement('div');
        bgBlur.className = 'hero-bg-blur';
        heroCarousel.insertBefore(bgBlur, heroCarousel.firstChild);
    }

    function updateBackground(index) {
        if (!bgBlur || !slides[index]) return;
        const img = slides[index].querySelector('img');
        if (img) {
            bgBlur.style.backgroundImage = `url('${img.src}')`;
        }
    }

    function showSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        currentSlide = index;
        updateBackground(index);
    }

    function nextSlide() {
        if (isCarouselPaused) return;
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
        if (!isCarouselPaused) {
            autoSlide = setInterval(nextSlide, 5000);
        }
    }

    function togglePause() {
        isCarouselPaused = !isCarouselPaused;
        if (isCarouselPaused) {
            clearInterval(autoSlide);
            pauseToggle.innerHTML = '<i class="bi bi-play-fill"></i>';
            pauseToggle.setAttribute("aria-label", "Play auto-playing banner");
            pauseToggle.classList.add('paused');
        } else {
            resetAutoSlide();
            pauseToggle.innerHTML = '<i class="bi bi-pause-fill"></i>';
            pauseToggle.setAttribute("aria-label", "Pause auto-playing banner");
            pauseToggle.classList.remove('paused');
        }
    }

    pauseToggle.addEventListener("click", togglePause);

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    showSlide(currentSlide);
    resetAutoSlide();
});

// Announcement Ticker
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".announcement-track-wrapper");
    const track = document.querySelector(".announcement-track");
    const pauseBtn = document.querySelector(".ann-pause");
    const prevBtn = document.querySelector(".ann-prev");
    const nextBtn = document.querySelector(".ann-next");

    if (!wrapper || !track || !pauseBtn || !prevBtn || !nextBtn) return;

    const items = Array.from(track.children);
    const oneSetWidth = track.scrollWidth;

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
            if (scrollPos >= oneSetWidth) {
                scrollPos = 0;
            }
            wrapper.scrollLeft = scrollPos;
        }
        requestAnimationFrame(ticker);
    }

    const syncState = () => {
        let currentX = wrapper.scrollLeft;
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
});

// Power Stations Carousel
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.power-item');
    const leftButton = document.querySelector('.power-station-carousel-button.left');
    const rightButton = document.querySelector('.power-station-carousel-button.right');
    if (!items.length || !leftButton || !rightButton) return;

    let activeIndex = 2;

    function updateCarousel() {
        const total = items.length;
        items.forEach((item, index) => {
            item.className = 'power-item';
            item.style.display = 'flex';
            let diff = index - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff <= -total / 2) diff += total;

            if (diff === 0) item.classList.add('active');
            else if (diff === -1) item.classList.add('left1');
            else if (diff === -2) item.classList.add('left2');
            else if (diff === 1) item.classList.add('right1');
            else if (diff === 2) item.classList.add('right2');
            else item.classList.add('hidden');
        });
    }

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

    updateCarousel();
});

// Our Business Section Hover/Click Logic
document.addEventListener("DOMContentLoaded", () => {
    const businessItems = document.querySelectorAll(".business-item");
    const businessDisplay = document.getElementById("business-display");

    if (!businessItems.length || !businessDisplay) return;

    businessItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const imgSrc = item.getAttribute("data-image");
            if (imgSrc) {
                // Smooth transition effect
                businessDisplay.style.opacity = '0.5';
                setTimeout(() => {
                    businessDisplay.src = imgSrc;
                    businessDisplay.style.opacity = '1';
                }, 150);
            }
        });

        item.addEventListener("click", () => {
            const link = item.getAttribute("data-link");
            if (link) {
                window.location.href = link;
            }
        });
    });
});

// Quick Links Scroll
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.quick-arrow').forEach(button => {
        button.addEventListener('click', () => {
            const container = document.querySelector('.quick-links-container');
            if (!container) return;
            const scrollAmount = 250;
            if (button.classList.contains('left')) {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });
});

// Alerts Carousel
document.addEventListener("DOMContentLoaded", () => {
    const alerts = document.querySelectorAll(".alert-card");
    const dotsContainer = document.querySelector(".alert-dots");
    let currentIndex = 0;
    let autoSlide;

    if (!alerts.length || !dotsContainer) return;

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
            if (dots[i]) dots[i].classList.toggle("active", i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        if (document.body.classList.contains('a11y-stop-animations')) return;
        let nextIndex = (currentIndex + 1) % alerts.length;
        showSlide(nextIndex);
    }

    function startAutoSlide() {
        if (!document.body.classList.contains('a11y-stop-animations')) {
            autoSlide = setInterval(nextSlide, 4000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    showSlide(0);
    startAutoSlide();

    const alertCarousel = document.querySelector(".alert-carousel");
    if (alertCarousel) {
        alertCarousel.addEventListener("mouseenter", stopAutoSlide);
        alertCarousel.addEventListener("mouseleave", startAutoSlide);
    }
});

// More Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const wrappers = document.querySelectorAll(".menu-wrapper");
    wrappers.forEach(wrapper => {
        const menu = wrapper.querySelector(".menu");
        const toggleBtn = wrapper.querySelector(".menu-toggle");
        if (!menu || !toggleBtn) return;

        let expanded = false;
        toggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            expanded = !expanded;
            if (expanded) {
                menu.style.flexWrap = "wrap";
                menu.style.overflowX = "visible";
                toggleBtn.innerHTML = "<span>Close</span> ▲";
                toggleBtn.classList.add('expanded');
            } else {
                menu.style.flexWrap = "nowrap";
                menu.style.overflowX = "auto";
                toggleBtn.innerHTML = "<span>More</span> ▼";
                toggleBtn.classList.remove('expanded');
            }
        });
    });
});

// Back to Top with Progress Ring
document.addEventListener("DOMContentLoaded", function () {
    let backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    const progressPath = backToTopBtn.querySelector('.progress-ring-path');
    if (!progressPath) return;

    const circumference = 2 * Math.PI * 46;
    progressPath.style.strokeDasharray = `${circumference} ${circumference}`;
    progressPath.style.strokeDashoffset = circumference;

    const setProgress = (percent) => {
        const offset = circumference - (percent / 100) * circumference;
        progressPath.style.strokeDashoffset = offset;
    };

    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop > 50) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }

        const scrollTotal = scrollHeight - clientHeight;
        let scrollPercentage = (scrollTop / scrollTotal) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercentage)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
