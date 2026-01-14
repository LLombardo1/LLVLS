window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
    return false;
}, true);

window.addEventListener('unhandledrejection', function(e) {
    e.preventDefault();
});

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
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

let pageLoaded = false;

const loadTimeout = setTimeout(function() {
    if (!pageLoaded) {
        const loader = document.querySelector('.loader');
        const errorMsg = document.getElementById('load-error');
        if (loader && errorMsg) {
            loader.style.display = 'none';
            errorMsg.style.display = 'block';
        }
    }
}, 10000);

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

        const animateElements = document.querySelectorAll('.assessment-section, .trust-section, .case-examples-section, .services-overview, .final-cta, .flip-card, .hover-card');
        
        animateElements.forEach((el, index) => {
            el.classList.add('fade-in-element');
            el.style.setProperty('--index', index);
            observer.observe(el);
        });
    } catch (error) {
        const animateElements = document.querySelectorAll('.fade-in-element');
        animateElements.forEach(el => el.classList.add('animate-in'));
    }

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
                }
            } catch (error) {}
        });
    });

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                this.style.display = 'none';
            }
        });
    });
});

// Formspree native form submission (no JavaScript needed)
// Form submits directly to https://formspree.io/f/mojjqgnw
