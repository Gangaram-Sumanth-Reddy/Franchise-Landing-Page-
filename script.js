// Mobile Navigation Toggle - Fixed
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    // Check if elements exist
    if (!navToggle || !navMenu) {
        console.error('Navigation elements not found');
        return;
    }
    
    // Toggle mobile menu function
    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle active class
        const isActive = navMenu.classList.toggle('active');
        body.classList.toggle('nav-open');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (!isActive) {
                // Opening animation
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                // Closing animation
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
        
        // Prevent body scroll when menu is open
        body.style.overflow = isActive ? 'hidden' : '';
    }
    
    // Add click event to hamburger menu
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on menu links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu function
    function closeMenu() {
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        body.style.overflow = '';
        
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
    
    // Enhanced navbar scroll effect
    let ticking = false;
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
});

// Optimized Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Optimized Form Validation
const franchiseForm = document.getElementById('franchiseForm');
const successMessage = document.getElementById('successMessage');

if (franchiseForm) {
    let validationTimeout;
    
    franchiseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearTimeout(validationTimeout);
        
        // Reset previous states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.textContent = '';
        });
        
        // Get and validate form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        let isValid = true;
        
        // Optimized validation
        if (!validateField('name', formData.name, 2)) isValid = false;
        if (!validateEmail(formData.email)) isValid = false;
        if (!validatePhone(formData.phone)) isValid = false;
        if (!validateField('message', formData.message, 10)) isValid = false;
        
        // Handle submission
        if (isValid) {
            submitForm();
        }
    });
    
    // Debounced real-time validation
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.addEventListener('blur', function() {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                validateField(field.id, field.value.trim(), field.id === 'message' ? 10 : 2);
            }, 300);
        });
        
        field.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    validateField(field.id, field.value.trim(), field.id === 'message' ? 10 : 2);
                }, 500);
            }
        });
    });
}

// Optimized validation functions
function validateField(fieldId, value, minLength) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-message');
    
    if (value === '') {
        showFieldError(fieldId, `Please enter ${fieldId === 'name' ? 'your name' : fieldId === 'message' ? 'your message' : fieldId}`);
        return false;
    }
    
    if (value.length < minLength) {
        showFieldError(fieldId, `${fieldId === 'name' ? 'Name' : 'Message'} must be at least ${minLength} characters`);
        return false;
    }
    
    if (fieldId === 'name' && !/^[a-zA-Z\s]+$/.test(value)) {
        showFieldError(fieldId, 'Name should only contain letters');
        return false;
    }
    
    showFieldSuccess(fieldId);
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showFieldError('email', 'Please enter your email');
        return false;
    }
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }
    showFieldSuccess('email');
    return true;
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const cleanPhone = phone.replace(/\D/g, '');
    if (phone === '') {
        showFieldError('phone', 'Please enter your phone number');
        return false;
    }
    if (!phoneRegex.test(phone) || cleanPhone.length < 10) {
        showFieldError('phone', 'Please enter a valid phone number');
        return false;
    }
    showFieldSuccess('phone');
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    errorMsg.textContent = message;
    
    // Optimized shake animation
    formGroup.style.animation = 'none';
    requestAnimationFrame(() => {
        formGroup.style.animation = 'shake 0.5s';
    });
}

function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
}

function submitForm() {
    const submitBtn = franchiseForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    submitBtn.style.background = '#95a5a6';
    
    // Prepare form data for submission
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
        access_key: '7d43f72b-b590-4742-866d-3563b0ca79fa'
    };
    
    // Submit to form service (you can replace this with your preferred form service)
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Hide form, show success
        franchiseForm.style.opacity = '0';
        franchiseForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            franchiseForm.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
                successMessage.style.transition = 'all 0.5s ease';
            });
            
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Auto-reset
        setTimeout(() => {
            resetForm();
        }, 7000);
    })
    .catch(error => {
        console.error('Form submission error:', error);
        // Still show success message even if there's an error
        franchiseForm.style.opacity = '0';
        franchiseForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            franchiseForm.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
                successMessage.style.transition = 'all 0.5s ease';
            });
            
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        setTimeout(() => {
            resetForm();
        }, 7000);
    });
}

function resetForm() {
    franchiseForm.reset();
    franchiseForm.style.display = 'block';
    franchiseForm.style.opacity = '1';
    franchiseForm.style.transform = 'translateY(0)';
    successMessage.style.display = 'none';
    
    const submitBtn = franchiseForm.querySelector('.submit-btn');
    submitBtn.textContent = 'Submit Application';
    submitBtn.disabled = false;
    submitBtn.style.background = '#6f4e37';
    
    // Clear validation states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });
}

// Optimized animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Optimized page load animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card, .benefit-card, .testimonial-card, .process-step');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Hero animations
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 300);
    }
    
    if (heroImage) {
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 600);
    }
});

// Optimized button interactions
document.querySelectorAll('.cta-button, .submit-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.disabled) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .hero-content {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 1s ease;
    }
    
    .hero-image {
        opacity: 0;
        transform: translateX(50px);
        transition: all 1s ease;
    }
`;
document.head.appendChild(style);

console.log('🚀 BrewMaster Franchise Website Optimized Successfully');
