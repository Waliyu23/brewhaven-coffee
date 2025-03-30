// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animation styles
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    if (element.dataset.aos === 'fade-up') {
        element.style.transform = 'translateY(20px)';
    } else if (element.dataset.aos === 'fade-down') {
        element.style.transform = 'translateY(-20px)';
    } else if (element.dataset.aos === 'fade-left') {
        element.style.transform = 'translateX(20px)';
    } else if (element.dataset.aos === 'fade-right') {
        element.style.transform = 'translateX(-20px)';
    }
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Run once on page load
animateOnScroll();

// Parallax effect for hero section
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
}

// Animate numbers (for stats if added)
const animateNumbers = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateNumbers, 1);
        } else {
            counter.innerText = target;
        }
    });
};

// Initialize number animation when section is in view
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}