document.addEventListener('DOMContentLoaded', function() {
    // AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
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
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            burger.classList.toggle('toggle');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    if (burger) { // Check burger again just in case
                        burger.classList.remove('toggle');
                    }
                    navLinks.forEach(l => l.style.animation = '');
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
                header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    }

    // Portfolio Image Modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const portfolioItems = document.querySelectorAll(".portfolio-item img");
    const spanCloseModal = document.getElementsByClassName("close-modal")[0];

    if (modal && modalImg && captionText && spanCloseModal) {
        portfolioItems.forEach(item => {
            item.onclick = function(){
                modal.style.display = "block";
                modalImg.src = this.src;
                captionText.innerHTML = this.alt;
            }
        });

        spanCloseModal.onclick = function() { 
            modal.style.display = "none";
        }
        
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    } else {
        console.warn('Image modal elements not fully found. Modal functionality may be impaired.');
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Back to Top Button Logic
    const backToTopButton = document.getElementById("backToTopBtn");

    function scrollFunction() {
        if (backToTopButton) { // Check if button exists
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                // Check current display style to avoid redundant changes
                if (getComputedStyle(backToTopButton).display === "none") {
                    backToTopButton.style.display = "flex"; // Use flex as per CSS for centering
                }
                backToTopButton.style.opacity = "1"; 
            } else {
                backToTopButton.style.opacity = "0"; 
                // Wait for fade out before hiding completely
                setTimeout(() => {
                     if (!(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)) {
                        if (getComputedStyle(backToTopButton).display !== "none") {
                           backToTopButton.style.display = "none";
                        }
                     }
                }, 300); // Match CSS transition duration for opacity
            }
        }
    }

    if (backToTopButton) {
        window.onscroll = scrollFunction;
        scrollFunction(); // Call once on load to set initial state
    } else {
        console.warn('Back to top button not found.');
    }
});