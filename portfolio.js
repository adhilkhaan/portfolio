/**
 * Portfolio Website - JavaScript
 * Handles navigation, theme toggle, form submission, and smooth scrolling
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const header = document.getElementById('header');

    // ============================================
    // Mobile Navigation Toggle
    // ============================================

    function initMobileMenu() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Dark Mode Toggle
    // ============================================

    function initThemeToggle() {
        if (!themeToggle || !themeIcon) return;

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.textContent = theme === 'dark' ? '☀' : '⏾';
    }

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================

    function initSmoothScroll() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================

    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > scrollThreshold) {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================

    function initContactForm() {
        if (!contactForm || !formMessage) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            // Basic validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            // In production, you would send this to a server endpoint
            showFormMessage('Sending message...', '');

            // Simulate API call delay
            setTimeout(function() {
                // Success message
                showFormMessage('Thank you! Your message has been sent. I\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(function() {
                    formMessage.textContent = '';
                    formMessage.className = 'form__message';
                }, 5000);
            }, 1000);
        });
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = 'form__message ' + type;
        
        // Scroll to message if needed
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ============================================
    // Intersection Observer for Fade-in Animations
    // ============================================

    function initScrollAnimations() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe service cards, project cards, and process steps
        const animatedElements = document.querySelectorAll(
            '.service__card, .project__card'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // Process Timeline (from koi.html)
    // ============================================

    function initTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        const activeStep = Number(timeline.dataset.activeStep || 0);
        const items = timeline.querySelectorAll('.timeline-item');

        // Mark completed steps
        items.forEach(item => {
            const step = Number(item.dataset.step || 0);
            if (activeStep && step && step <= activeStep) {
                item.classList.add('completed');
            }
        });

        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('visible'));
            return;
        }

        // Scroll reveal for timeline items
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.95,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        items.forEach(item => observer.observe(item));
    }

    // ============================================
    // Keyboard Navigation Enhancements
    // ============================================

    function initKeyboardNavigation() {
        // Close mobile menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Trap focus within mobile menu when open
        if (navMenu) {
            navMenu.addEventListener('keydown', function(e) {
                if (!navMenu.classList.contains('active')) return;

                const focusableElements = navMenu.querySelectorAll(
                    'a, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }

    // ============================================
    // Initialize All Features
    // ============================================

    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initMobileMenu();
                initThemeToggle();
                initSmoothScroll();
                initHeaderScroll();
                initContactForm();
                initScrollAnimations();
                initTimeline();
                initKeyboardNavigation();
            });
        } else {
            // DOM already loaded
            initMobileMenu();
            initThemeToggle();
            initSmoothScroll();
            initHeaderScroll();
            initContactForm();
            initScrollAnimations();
            initTimeline();
            initKeyboardNavigation();
        }
    }

    // Start initialization
    init();

})();

