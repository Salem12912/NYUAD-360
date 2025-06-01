// --- Scroll Progress Bar --- //
// Updates the width of the .scroll-progress element based on the user's scroll position.
// This creates a visual indicator at the top of the page showing how far the user has scrolled.
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset; // Current vertical scroll position
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height
    const progress = (scrolled / maxHeight) * 100; // Scroll progress as a percentage
    const scrollProgressBar = document.querySelector('.scroll-progress');
    if (scrollProgressBar) {
        scrollProgressBar.style.width = progress + '%';
    }
});

// --- Parallax Effect for Hero Section --- //
// Moves the hero section background at a slower rate than the scroll speed to create a parallax depth effect.
// This effect is only applied if the hero element exists and is within the viewport.
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) { // Check if hero exists and is in view
        hero.style.transform = `translateY(${scrolled * 0.3}px)`; // Apply vertical transform
    }
});

// --- Intersection Observer for Fade-In Animations --- //
// Uses Intersection Observer to add a 'visible' class to elements with the 'fade-in' class
// when they enter the viewport. This triggers a CSS animation.
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjusts the bounding box, effectively triggering a bit sooner
};

// The callback function for the Intersection Observer
const intersectionCallback = (entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) { // If the element is in view
            // Apply a staggered delay to the animation for multiple elements
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100); 
            // observer.unobserve(entry.target); // Optional: stop observing after animation
        }
    });
};

// Create and initialize the Intersection Observer
const observer = new IntersectionObserver(intersectionCallback, observerOptions);

// Target all elements with the .fade-in class to be observed
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// --- Smooth Scrolling for Anchor Links --- //
// Adds a click event listener to all anchor links (<a>) that start with '#'.
// When clicked, it smoothly scrolls the page to the target element ID, accounting for the fixed navbar height.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump-to-anchor behavior
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            let targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            let scrollTargetY;

            if (targetId === '#home') {
                scrollTargetY = 0; // Scroll to the very top for the #home link
            } else {
                scrollTargetY = targetPosition - navbarHeight;
            }

            window.scrollTo({
                top: scrollTargetY,
                behavior: 'smooth'
            });
        }
    });
});

// --- Carousel Functionality --- //
let currentSlideIndex = 0;
let slides, dots, totalSlides;
let autoAdvanceInterval; // Stores the interval ID for auto-advancing slides

/**
 * Initializes the carousel.
 * Selects all slide and dot elements, sets the total number of slides,
 * displays the first slide, and starts the auto-advance timer.
 * How to use: Called when the DOM is fully loaded.
 */
function initializeCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) { // If no slides, carousel cannot function
        return;
    }
    totalSlides = slides.length;
    
    showSlide(0); // Show the first slide initially
    startAutoAdvance(); // Begin automatic slide transitions
}

/**
 * Displays a specific slide and updates the active dot.
 */
function showSlide(index) {
    if (!slides || slides.length === 0 || !dots || dots.length === 0) return; // Safety check
    
    // Handle index out of bounds (looping behavior)
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    // Hide all slides and deactivate all dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show the target slide and activate its corresponding dot
    if (slides[index] && dots[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    currentSlideIndex = index; // Update the global current slide index
}

/**
 * Advances to the next slide in the carousel.
 * How to use: Called by the auto-advance timer and the 'next' button.
 */
function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

/**
 * Goes to the previous slide in the carousel.
 * How to use: Called by the 'previous' button.
 */
function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

/**
 * Shows a slide based on a 1-indexed number, typically from a dot click.
 */
function currentSlide(index) {
    showSlide(index - 1); // Convert 1-based to 0-based index for showSlide function
}

/**
 * Starts the automatic slide advancement timer.
 * Slides will change every 6 seconds.
 * How to use: Called by initializeCarousel and after user interaction to resume auto-play.
 */
function startAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval); // Clear any existing timer
    }
    autoAdvanceInterval = setInterval(nextSlide, 6000); // Set new timer
}

/**
 * Stops the automatic slide advancement timer.
 * How to use: Called when the user interacts with carousel controls (buttons/dots).
 */
function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
}

// Initialize carousel when the DOM is fully loaded.
// This ensures all carousel HTML elements are available.
if (document.readyState === 'loading') { // If DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else { // If DOM has already loaded
    initializeCarousel();
}

// Event listener for user interaction with carousel controls (buttons or dots).
// Pauses auto-advance on interaction and restarts it after a delay.
document.addEventListener('click', (e) => {
    // Check if the clicked element is a carousel button or dot
    if (e.target.matches('.carousel-btn, .carousel-btn *, .dot, .dot *')) { 
        stopAutoAdvance(); // Stop current auto-advance
        // Restart auto-advance after 10 seconds of inactivity
        setTimeout(startAutoAdvance, 10000);
    }
});

// --- Video Controls Hover Effect --- //
// Shows video controls when the mouse enters the video section, hides them on mouse leave.
// This provides a cleaner look when the video is not being interacted with.
const videoSection = document.querySelector('.video-section');
const videoPlayer = document.querySelector('.video-container-full video');

if (videoSection && videoPlayer) { // Ensure both elements exist
    videoSection.addEventListener('mouseenter', () => {
        videoPlayer.setAttribute('controls', 'controls'); // Show controls
    });

    videoSection.addEventListener('mouseleave', () => {
        videoPlayer.removeAttribute('controls'); // Hide controls
    });
}

// --- Navigation Bar Functionality --- //

// Dropdown Menu Toggle
// Adds a click listener to elements with the class 'dropdown-toggle'.
// When clicked, it toggles the 'open' class on the parent '.nav-dropdown' element,
// which controls the visibility of the dropdown menu via CSS.
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior if it's an <a> tag
        const dropdown = this.closest('.nav-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('open');
        }
    });
});

// Close dropdown if clicked outside
// Adds a click listener to the window. If a click occurs outside of an open dropdown menu,
// the dropdown will close.
window.addEventListener('click', function(e) {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});

// Active Navigation Link Highlighting on Scroll
// Observes different sections of the page. When a section is in view,
// the corresponding navigation link gets an 'active-link' class.
const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID
const navLinks = document.querySelectorAll('.nav-menu .nav-link[href^="#"], .dropdown-menu .dropdown-item[href^="#"]');

const navObserverOptions = {
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
    threshold: 0 // Needs at least a tiny bit of the section to be visible
};

const navIntersectionCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active-link');
                    // If the active link is inside a dropdown, also mark the dropdown toggle as active-ish
                    const parentDropdownToggle = link.closest('.dropdown-menu')?.previousElementSibling;
                    if (parentDropdownToggle && parentDropdownToggle.classList.contains('dropdown-toggle')) {
                        // Remove active from other main nav items first
                        document.querySelectorAll('.nav-menu > .nav-item > .nav-link').forEach(nl => nl.classList.remove('active-link'));
                        parentDropdownToggle.classList.add('active-link');
                    } else if (!link.closest('.dropdown-menu')) {
                         // If it's a top-level link, ensure no other dropdown toggle is marked active
                        document.querySelectorAll('.nav-menu .dropdown-toggle').forEach(dt => dt.classList.remove('active-link'));
                    }
                }
            });
        }
    });
};

const navObserver = new IntersectionObserver(navIntersectionCallback, navObserverOptions);
sections.forEach(section => {
    navObserver.observe(section);
});