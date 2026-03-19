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
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activeIndex = index;
                updateCarousel();
            }
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

// Our Business Section Interaction Logic
document.addEventListener("DOMContentLoaded", () => {
    const businessItems = document.querySelectorAll(".business-item");
    const businessDisplay = document.getElementById("business-display");
    let businessTimeout;

    if (!businessItems.length || !businessDisplay) return;

    businessItems.forEach(item => {
        const updateImage = () => {
            const imgSrc = item.getAttribute("data-image");
            if (!imgSrc || item.classList.contains("active")) return;

            // Remove active class from all and add to current
            businessItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Smooth transition with race condition protection
            if (businessTimeout) clearTimeout(businessTimeout);

            businessDisplay.style.opacity = '0.4';
            businessTimeout = setTimeout(() => {
                businessDisplay.src = imgSrc;
                businessDisplay.style.opacity = '1';
            }, 100);
        };

        // Update on hover and focus
        item.addEventListener("mouseenter", updateImage);
        item.addEventListener("focus", updateImage);

        const handleInteraction = (e) => {
            const link = item.getAttribute("data-link");

            // If it's already active, redirect to the link
            if (item.classList.contains("active")) {
                if (link) window.location.href = link;
            } else {
                // If not active, just switch the image (especially useful for mobile)
                e.preventDefault();
                updateImage();
            }
        };

        item.addEventListener("click", handleInteraction);
        item.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleInteraction(e);
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

// Logo Carousel Play/Pause and Infinite Scroll Fix
document.addEventListener("DOMContentLoaded", () => {
    const playPauseBtn = document.getElementById('logo-play-pause');
    const track = document.querySelector('.carousel-track');
    
    if (!playPauseBtn || !track) return;
    
    // Duplicate logos for infinite scroll effect
    const logos = Array.from(track.children);
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        track.appendChild(clone);
    });
    
    let isPaused = false;
    
    playPauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
            track.classList.add('paused');
            playPauseBtn.classList.add('paused');
            playPauseBtn.innerHTML = '▶';
            playPauseBtn.setAttribute("aria-label", "Play Carousel");
        } else {
            track.classList.remove('paused');
            playPauseBtn.classList.remove('paused');
            playPauseBtn.innerHTML = '⏸';
            playPauseBtn.setAttribute("aria-label", "Pause Carousel");
        }
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
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show alert ${i + 1}`);
        dot.addEventListener("click", () => showSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("button");

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

// Photo Gallery Slider Logic - Circular / Infinite Loop
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".photo-gallery-slider-container");
    const track = document.querySelector(".photo-gallery-grid-slider");
    let slides = document.querySelectorAll(".photo-gallery-grid-slider .gallery-item");
    const prevBtn = document.querySelector(".gallery-prev");
    const nextBtn = document.querySelector(".gallery-next");
    const playPauseBtn = document.querySelector(".gallery-play-pause");

    if (!container || !track || slides.length === 0) return;

    let currentIndex = 0;
    let isPlaying = true;
    let autoSlideInterval;
    let isTransitioning = false;
    const slideIntervalTime = 5000;

    function getVisibleSlides() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    // Clone slides for infinite effect
    function setupclones() {
        const visibleSlides = getVisibleSlides();
        // Remove existing clones if any
        const existingClones = track.querySelectorAll('.clone');
        existingClones.forEach(c => c.remove());

        // Clone first set and append
        for (let i = 0; i < visibleSlides; i++) {
            const clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        // Clone last set and prepend
        for (let i = slides.length - 1; i >= slides.length - visibleSlides; i--) {
            const clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }

        // Update slides reference
        currentIndex = visibleSlides; // Start at the first real slide
        updateSlider(false);
    }

    function updateSlider(animate = true) {
        const visibleSlides = getVisibleSlides();
        const slideWidth = container.offsetWidth / visibleSlides;
        const allSlides = track.querySelectorAll(".gallery-item");

        allSlides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.boxSizing = "border-box";
            slide.style.padding = "0 3.5px";
        });

        track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
    }

    function nextSlide() {
        if (isTransitioning) return;
        const visibleSlides = getVisibleSlides();
        currentIndex++;
        isTransitioning = true;
        updateSlider(true);

        // Check if we reached the clone of the first slide
        if (currentIndex >= slides.length + visibleSlides) {
            setTimeout(() => {
                track.style.transition = "none";
                currentIndex = visibleSlides;
                updateSlider(false);
                isTransitioning = false;
            }, 500);
        } else {
            setTimeout(() => isTransitioning = false, 500);
        }
    }

    function prevSlide() {
        if (isTransitioning) return;
        const visibleSlides = getVisibleSlides();
        currentIndex--;
        isTransitioning = true;
        updateSlider(true);

        // Check if we reached the clone of the last slide
        if (currentIndex < visibleSlides) {
            // Wait for transition to end then jump to real slide
            if (currentIndex < 0) {
                // Should not happen with visibleSlides buffer but safety check
            }
        }

        if (currentIndex < visibleSlides) {
            setTimeout(() => {
                track.style.transition = "none";
                currentIndex = slides.length + visibleSlides - 1;
                // Since handles are simple, just jump to the corresponding real one
                if (currentIndex < visibleSlides) currentIndex = slides.length;
                updateSlider(false);
                isTransitioning = false;
            }, 500);
        } else {
            setTimeout(() => isTransitioning = false, 500);
        }
    }

    // Simplified loop logic for circular
    function handleLoop() {
        const visibleSlides = getVisibleSlides();
        if (currentIndex >= slides.length + visibleSlides) {
            track.style.transition = "none";
            currentIndex = visibleSlides;
            updateSlider(false);
        }
        if (currentIndex < visibleSlides) {
            track.style.transition = "none";
            currentIndex = slides.length + visibleSlides - 1;
            updateSlider(false);
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            if (isPlaying) nextSlide();
        }, slideIntervalTime);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function togglePlayPause() {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
        playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    }

    // Container Styles
    container.style.overflow = "hidden";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.padding = "10px 0";

    track.style.display = "flex";
    track.style.width = "max-content";

    // Controls Styles
    const controls = document.querySelector(".gallery-slider-controls");
    const seeMoreWrapper = document.querySelector(".photo-gallery-section .see-more-wrapper");

    if (controls) {
        controls.style.display = "flex";
        controls.style.justifyContent = "center";
        controls.style.alignItems = "center";
        controls.style.gap = "10px";
        controls.style.marginTop = "10px";
        controls.style.position = "relative";
        controls.style.width = "100%";

        // Move "See More" button into the same line if it exists
        if (seeMoreWrapper) {
            seeMoreWrapper.style.position = "absolute";
            seeMoreWrapper.style.right = "0";
            seeMoreWrapper.style.marginTop = "0";
            seeMoreWrapper.style.top = "50%";
            seeMoreWrapper.style.transform = "translateY(-50%)";
            controls.appendChild(seeMoreWrapper);
        }
    }

    const buttons = [prevBtn, nextBtn, playPauseBtn];
    buttons.forEach(btn => {
        if (btn) {
            btn.style.background = "var(--primary-color, #009edb)";
            btn.style.color = "white";
            btn.style.border = "none";
            btn.style.width = "30px";  // Shrinked from 40px
            btn.style.height = "30px"; // Shrinked from 40px
            btn.style.borderRadius = "50%";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "0.9rem"; // Shrinked from 1.2rem
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.transition = "all 0.3s ease";
            btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

            btn.addEventListener("mouseover", () => {
                btn.style.transform = "scale(1.1)";
                btn.style.background = "var(--secondary-color, #fdb913)";
            });
            btn.addEventListener("mouseout", () => {
                btn.style.transform = "scale(1)";
                btn.style.background = "var(--primary-color, #009edb)";
            });
        }
    });

    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); if (isPlaying) startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); if (isPlaying) startAutoSlide(); });
    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlayPause);

    window.addEventListener("resize", () => {
        setupclones();
        updateSlider(false);
    });

    setupclones();
    startAutoSlide();
});

/**
 * GIGW 3.0 / WCAG 2.1 Compliance: Descriptive Link Text & Interactive Elements
 * Automatically enhances generic links (Read More, Click Here, etc.)
 * and interactive role="button" elements.
 */
document.addEventListener('DOMContentLoaded', () => {
    const genericTexts = [
        'read more', 'click here', 'view all', 'see more', 'learn more',
        'view detail', 'view', 'continue', 'proceed', 'go', 'explore',
        'details', 'more', 'view more', 'link', 'download', 'visit'
    ];

    const hindiGeneric = [
        'और पढ़ें', 'यहाँ क्लिक करें', 'सभी देखें', 'अधिक देखें',
        'जारी रखें', 'विस्तार से', 'विवरण', 'यहाँ देखें', 'अधिक जानकारी',
        'डाउनलोड', 'लिंक', 'सब देखें', 'अधिक'
    ];

    const enhanceElements = () => {
        const lang = document.documentElement.lang || 'en';
        const isHindi = lang.startsWith('hi');
        const activeGeneric = [...genericTexts, ...hindiGeneric];

        // Process Links, Buttons and Role="button" elements
        document.querySelectorAll('a, [role="button"], button').forEach(el => {
            const text = el.textContent.trim().toLowerCase();
            if (!text || text.length > 35) return;

            // More inclusive matching for generic phrases
            let isGeneric = activeGeneric.some(gt => {
                const cleanText = text.replace(/[^a-z\s\u0900-\u097F]/g, '').trim();
                return cleanText === gt || (cleanText.length < 20 && cleanText.includes(gt));
            });

            if (isGeneric) {
                // Find context from identifiable container
                const contextContainer = el.closest('.custom-card, .news-item, .announcement-item, article, .view-row, .node, .power-item, .business-item, .alert-card, .views-row, .views-field, .field-item, .block, .news-column, .alert-column, .card, td, li');

                if (contextContainer) {
                    const heading = contextContainer.querySelector('h1, h2, h3, h4, h5, .title, .node__title, .label, .card-title, .views-field-title, .section-heading, strong, b, span:first-child');
                    if (heading && heading !== el) {
                        const desc = heading.textContent.trim();
                        // Only add if desc is long enough to be meaningful
                        if (desc && desc.length > 3) {
                            const currentAria = el.getAttribute('aria-label');

                            if (!currentAria || currentAria === el.textContent.trim()) {
                                const newAria = isHindi
                                    ? `${el.textContent.trim()} (${desc} के बारे में)`
                                    : `${el.textContent.trim()} about ${desc}`;

                                el.setAttribute('aria-label', newAria);
                                if (!el.getAttribute('title')) el.setAttribute('title', newAria);
                            }
                        }
                    }
                }
            }
        });

        // Handle icon-only links (Social media, etc.)
        document.querySelectorAll('a').forEach(link => {
            if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
                const icon = link.querySelector('i, svg, img');
                if (icon) {
                    let label = "";
                    const cls = (icon.className || "").toLowerCase();
                    const src = (icon.src || "").toLowerCase();
                    const alt = icon.alt || "";

                    if (alt) label = alt;
                    else if (cls.includes('facebook')) label = 'Facebook';
                    else if (cls.includes('twitter') || cls.includes('x-twitter')) label = 'Twitter';
                    else if (cls.includes('youtube')) label = 'YouTube';
                    else if (cls.includes('linkedin')) label = 'LinkedIn';
                    else if (cls.includes('instagram')) label = 'Instagram';
                    else if (cls.includes('search')) label = 'Search';
                    else if (cls.includes('home')) label = 'Home';

                    if (label) {
                        link.setAttribute('aria-label', isHindi ? `${label}` : label);
                        link.setAttribute('title', label);
                    }
                }
            }
        });

        // Handle File download links explicitly
        document.querySelectorAll('a[href*=".pdf"], a[href*=".doc"], a[href*=".docx"], a[href*=".xls"], a[href*=".xlsx"]').forEach(link => {
            const href = link.getAttribute('href').toLowerCase();
            const extMatch = href.match(/\.(pdf|docx?|xlsx?)$/);
            if (extMatch) {
                const ext = extMatch[1].toUpperCase();
                const contentText = link.textContent.trim();

                if (!contentText.includes(ext)) {
                    const label = isHindi ? `डाउनलोड (${ext})` : `Download (${ext})`;
                    const currentAria = link.getAttribute('aria-label') || contentText;
                    if (!currentAria.includes(ext)) {
                        link.setAttribute('aria-label', `${currentAria} - ${label}`);
                    }
                }
            }
        });

        // Add tabiindex="0" to all org chart cells
        const orgChartContainer = document.getElementById('render_orgchart');
        if (orgChartContainer) {
            // Add aria-labelledby and role="region" dynamically
            if (!orgChartContainer.hasAttribute('role')) {
                orgChartContainer.setAttribute('role', 'region');
                orgChartContainer.setAttribute('aria-labelledby', 'org-chart-main-heading');
                
                // Insert a visibly-hidden heading before it if it doesn't exist
                if (!document.getElementById('org-chart-main-heading')) {
                    const heading = document.createElement('h2');
                    heading.id = 'org-chart-main-heading';
                    heading.className = 'visually-hidden';
                    heading.textContent = 'Organization Chart';
                    orgChartContainer.parentNode.insertBefore(heading, orgChartContainer);
                }
            }

            // Apply tabindex and aria attributes to individual cells
            orgChartContainer.querySelectorAll('.cell').forEach(cell => {
                if (!cell.hasAttribute('tabindex')) {
                    cell.setAttribute('tabindex', '0');
                }
                if (!cell.hasAttribute('role')) {
                    cell.setAttribute('role', 'group');
                }
                if (!cell.hasAttribute('aria-label')) {
                    // Grab the visible text inside the cell for the screen reader
                    const cellText = cell.textContent || cell.innerText;
                    cell.setAttribute('aria-label', cellText.trim());
                }
            });
        }
    };

    // Initial run
    enhanceElements();

    // Re-run for dynamic content (Views AJAX, Modals, etc.)
    const observer = new MutationObserver((mutations) => {
        let shouldEnhance = false;
        mutations.forEach(m => {
            if (m.addedNodes.length > 0) shouldEnhance = true;
        });
        if (shouldEnhance) enhanceElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

/**
 * Language Switch Notification Logic
 * Displays a message when the user clicks a language switcher link 
 * and after the page reloads in the new language.
 */
function initLanguageNotification() {
    const notification = document.createElement('div');
    notification.id = 'language-notification';
    notification.className = 'language-notification';
    notification.setAttribute('aria-live', 'polite');
    document.body.prepend(notification);

    const isHindi = document.documentElement.lang === 'hi';

    // Check if we just switched language
    const pendingLang = sessionStorage.getItem('sjvn_switching_lang');
    if (pendingLang) {
        const successMsg = isHindi
            ? `भाषा बदलकर ${pendingLang} कर दी गई है।`
            : `Language has been changed to ${pendingLang}.`;

        notification.innerHTML = `<i class="bi bi-check-circle-fill"></i> <span>${successMsg}</span>`;
        notification.classList.add('show', 'success');
        sessionStorage.removeItem('sjvn_switching_lang');

        // Hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Listen for language switcher clicks
    document.addEventListener('click', (e) => {
        const langLink = e.target.closest('.language-toggle a, .language-switcher-language-url a');

        if (langLink) {
            const isHindiLang = document.documentElement.lang === 'hi';
            const confirmMsg = isHindiLang 
                ? "क्या आप भाषा बदलना चाहते हैं?" 
                : "Are you sure you want to change the language?";
            
            if (!confirm(confirmMsg)) {
                e.preventDefault();
                return;
            }

            const targetLang = langLink.textContent.trim();
            const loadingMsg = isHindiLang
                ? `भाषा को ${targetLang} में बदला जा रहा है...`
                : `Changing language to ${targetLang}...`;

            notification.innerHTML = `<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div> <span>${loadingMsg}</span>`;
            notification.classList.add('show', 'loading');

            sessionStorage.setItem('sjvn_switching_lang', targetLang);
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initLanguageNotification);

