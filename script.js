document.addEventListener('DOMContentLoaded', function() {
    // AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            disable: window.innerWidth < 768 // Optionally disable AOS on mobile
        });
    } else {
        console.warn('AOS library not found.');
    }

    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        // Close nav when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    navLinks.forEach(l => l.style.animation = ''); // Reset animation
                }
            });
        });
    } else {
        console.warn('Burger menu or nav-links not found. Navigation will not be interactive.');
    }
    
    // Header scroll background change
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Solid white
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Semi-transparent
            }
        });
    }

    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGridItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    if (filterButtons.length > 0 && portfolioGridItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active state for button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.dataset.filter; // e.g., "*", ".design-proposal"

                portfolioGridItems.forEach(item => {
                    // Using class for hiding/showing for CSS transitions
                    item.classList.remove('hide-item'); // Make visible by default
                    
                    if (filterValue === '*') {
                        // No action needed, already visible
                    } else {
                        // Check if item has the class (remove leading dot from filterValue)
                        if (!item.classList.contains(filterValue.substring(1))) {
                            item.classList.add('hide-item');
                        }
                    }
                });
                 // Refresh AOS after filtering if you're using hide-item class that affects layout/visibility
                if (typeof AOS !== 'undefined' && window.innerWidth >= 768) { // Only refresh if AOS is active
                    setTimeout(() => { // Delay for CSS transitions to start
                        AOS.refresh();
                    }, 300); // Match transition duration
                }
            });
        });
    } else {
        // console.warn('Filter buttons or portfolio items not found. Filtering will not work.');
    }


    // Lightbox (Modal) Functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = lightbox ? lightbox.querySelector(".lightbox-content img") : null;
    const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
    const lightboxCloseButton = lightbox ? lightbox.querySelector(".lightbox-close") : null;
    const lightboxPrevButton = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
    const lightboxNextButton = lightbox ? lightbox.querySelector(".lightbox-next") : null;

    const portfolioAnchors = document.querySelectorAll('a[data-lightbox="portfolio"]');
    let lightboxItemsData = [];
    let currentLightboxIndex;

    if (portfolioAnchors.length > 0) {
        portfolioAnchors.forEach(anchor => {
            lightboxItemsData.push({
                href: anchor.getAttribute('href'),
                title: anchor.getAttribute('data-title') || (anchor.querySelector('img') ? anchor.querySelector('img').alt : "Portfolio Image")
            });
        });
    }

    function showLightboxImage(index) {
        if (index >= 0 && index < lightboxItemsData.length && lightboxImage && lightboxCaption) {
            const item = lightboxItemsData[index];
            lightboxImage.src = item.href;
            lightboxImage.alt = item.title; 
            lightboxCaption.innerHTML = item.title;
            currentLightboxIndex = index;

            if (lightboxPrevButton) lightboxPrevButton.style.display = (index === 0) ? "none" : "block";
            if (lightboxNextButton) lightboxNextButton.style.display = (index === lightboxItemsData.length - 1) ? "none" : "block";
        }
    }

    if (lightbox && lightboxImage && lightboxCaption && lightboxCloseButton && lightboxPrevButton && lightboxNextButton && portfolioAnchors.length > 0) {
        portfolioAnchors.forEach((anchor, index) => {
            anchor.addEventListener('click', function(e){
                e.preventDefault(); // Prevent default anchor behavior
                lightbox.style.display = "block";
                document.body.style.overflow = 'hidden'; // Prevent background scroll
                showLightboxImage(index);
            });
        });

        lightboxCloseButton.onclick = function() { 
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto'; 
        }
        
        // Close lightbox if background is clicked
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) { 
                lightbox.style.display = "none";
                document.body.style.overflow = 'auto';
            }
        });

        lightboxPrevButton.onclick = function() {
            if (currentLightboxIndex > 0) {
                showLightboxImage(currentLightboxIndex - 1);
            }
        }

        lightboxNextButton.onclick = function() {
            if (currentLightboxIndex < lightboxItemsData.length - 1) {
                showLightboxImage(currentLightboxIndex + 1);
            }
        }

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(event) {
            if (lightbox.style.display === "block") {
                if (event.key === "ArrowLeft" || event.keyCode === 37) { // Left arrow
                    if (currentLightboxIndex > 0) {
                        showLightboxImage(currentLightboxIndex - 1);
                    }
                } else if (event.key === "ArrowRight" || event.keyCode === 39) { // Right arrow
                     if (currentLightboxIndex < lightboxItemsData.length - 1) {
                        showLightboxImage(currentLightboxIndex + 1);
                    }
                } else if (event.key === "Escape" || event.keyCode === 27) { // Escape key
                    lightbox.style.display = "none";
                    document.body.style.overflow = 'auto';
                }
            }
        });

    } else {
        if (!lightbox) console.warn('Lightbox element not found.');
        else if (portfolioAnchors.length === 0) console.warn('No portfolio anchors found for lightbox.');
        else console.warn('Some lightbox elements (image, caption, or controls) not fully found. Lightbox functionality may be impaired.');
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Back to Top Button Logic
    const backToTopButton = document.getElementById("backToTopBtn");

    function toggleBackToTopButton() {
        if (backToTopButton) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }
    }

    if (backToTopButton) {
        window.addEventListener('scroll', toggleBackToTopButton);
        toggleBackToTopButton(); // Call once on load
    } else {
        console.warn('Back to top button not found.');
    }

    // Contact Form Mailto Enhancement
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const nameField = document.getElementById('name');
            const subjectField = document.getElementById('subject'); 
            const messageField = document.getElementById('message');

            const name = nameField.value.trim();
            const subject = subjectField.value.trim(); // Subject
            const message = messageField.value.trim();

            if (!name || !subject || !message) {
                alert('Please fill out all fields.'); // Basic validation
                return;
            }

            const recipientEmail = "mrdeepanjandas@gmail.com";
            
            let body = "Hello InteriorBhaiyaji,\n\n";
            body += "\n" + message + "\n\n";
            body += "---\nSincerely,\n" + name + "\n"; // Optional signature

            // Encode subject and body for the mailto link
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open the user's default email client
            window.location.href = mailtoLink;

            // Optionally, reset the form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        });
    } else {
        console.warn('Contact form (#contactForm) not found. Mailto enhancement not applied.');
    }

});