// Global Error Handler
window.addEventListener('error', function(e) {
    console.error('Error caught:', e.error || e.message);
    if (e.target.tagName === 'IMG') {
        // Handle image load errors
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
    return false;
}, true);

// Unhandled Promise Rejection Handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Network Error Detection
window.addEventListener('offline', function() {
    showNotification('You are offline. Please check your internet connection.', 'warning');
});

window.addEventListener('online', function() {
    showNotification('Connection restored!', 'success');
});

// Notification System
function showNotification(message, type = 'info') {
    const existingNotif = document.querySelector('.error-notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = `error-notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'warning' ? '⚠️' : type === 'success' ? '✓' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Page Loader with timeout
let pageLoaded = false;

// Set timeout to show error if page takes too long
const loadTimeout = setTimeout(function() {
    if (!pageLoaded) {
        const loader = document.querySelector('.loader');
        const errorMsg = document.getElementById('load-error');
        if (loader && errorMsg) {
            loader.style.display = 'none';
            errorMsg.style.display = 'block';
        }
    }
}, 10000); // 10 seconds timeout

window.addEventListener('load', function() {
    pageLoaded = true;
    clearTimeout(loadTimeout);
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            try {
                // Validate form fields
                const name = form.querySelector('#name');
                const email = form.querySelector('#email');
                const message = form.querySelector('#message');
                
                if (name && !name.value.trim()) {
                    showNotification('Please enter your name', 'warning');
                    name.focus();
                    return;
                }
                
                if (email && !email.value.trim()) {
                    showNotification('Please enter your email', 'warning');
                    email.focus();
                    return;
                }
                
                if (email && !isValidEmail(email.value)) {
                    showNotification('Please enter a valid email address', 'warning');
                    email.focus();
                    return;
                }
                
                if (message && !message.value.trim()) {
                    showNotification('Please enter a message', 'warning');
                    message.focus();
                    return;
                }
                
                // Simulate form submission
                button.textContent = 'Sending...';
                button.disabled = true;
                button.style.background = '#c9a961';
                
                setTimeout(() => {
                    button.textContent = 'Sent!';
                    button.style.background = '#27ae60';
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    setTimeout(() => {
                        form.reset();
                        button.textContent = originalText;
                        button.style.background = '';
                        button.disabled = false;
                    }, 2000);
                }, 1500);
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('An error occurred. Please try again.', 'warning');
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Smooth scroll animations with error handling
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    };

    try {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        const animateElements = document.querySelectorAll('.assessment-section, .trust-section, .case-examples-section, .services-overview, .final-cta, .flip-card, .hover-card');
        
        animateElements.forEach((el, index) => {
            el.classList.add('fade-in-element');
            el.style.setProperty('--index', index);
            observer.observe(el);
        });
    } catch (error) {
        console.warn('Animation observer error:', error);
        // Fallback: show all elements immediately
        const animateElements = document.querySelectorAll('.fade-in-element');
        animateElements.forEach(el => el.classList.add('animate-in'));
    }

    // Smooth scrolling for anchor links with error handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            try {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.warn('Anchor target not found:', this.getAttribute('href'));
                }
            } catch (error) {
                console.error('Scroll error:', error);
            }
        });
    });

    // Handle broken images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                this.style.display = 'none';
                console.warn('Image failed to load:', this.src);
            }
        });
    });
});
