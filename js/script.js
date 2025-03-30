// Coffee Shop Website - Main Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with updated settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out-quart',
        once: true,
        offset: 100,
        disable: window.innerWidth < 768 // Disable animations on mobile
    });

    // Enhanced navbar scroll effect with throttle
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    const handleScroll = throttle(function() {
        const currentScroll = window.pageYOffset;
        
        // Scroll down effect
        if (currentScroll > lastScroll && currentScroll > navbarHeight) {
            navbar.classList.add('scrolled', 'navbar-hide');
        } 
        // Scroll up effect
        else if (currentScroll < lastScroll) {
            navbar.classList.remove('navbar-hide');
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Enhanced dark mode toggle with system preference check
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-bs-theme');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        setTheme('dark');
    }

    // Toggle dark mode with animation
    darkModeToggle.addEventListener('click', function() {
        const isDark = htmlElement.getAttribute('data-bs-theme') === 'dark';
        htmlElement.style.transition = 'background-color 0.5s ease';
        setTheme(isDark ? 'light' : 'dark');
        
        // Remove transition after animation completes
        setTimeout(() => {
            htmlElement.style.transition = '';
        }, 500);
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Enhanced smooth scrolling with offset and history management
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.replaceState(null, null, targetId);
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // Enhanced menu filtering with animation and count display
    const filterButtons = document.querySelectorAll('[data-filter]');
    const menuItems = document.querySelectorAll('.menu-item');
    const itemCountDisplay = document.createElement('div');
    itemCountDisplay.className = 'item-count text-muted small mt-3';
    document.querySelector('.menu-items').parentNode.appendChild(itemCountDisplay);

    function updateItemCount() {
        const visibleItems = document.querySelectorAll('.menu-item[style="display: block"]').length;
        itemCountDisplay.textContent = `${visibleItems} items available`;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            let visibleCount = 0;
            
            // Filter items with animation
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.setAttribute('data-aos', 'fade-up');
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            AOS.refresh();
            updateItemCount();
        });
    });

    // Initialize with all items visible
    updateItemCount();

    // Enhanced form validation with AJAX simulation
    (function() {
        'use strict';
        
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (this.checkValidity()) {
                    const submitBtn = this.querySelector('[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    
                    // Simulate form submission
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                    
                    try {
                        // Simulate API call delay
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        // Show success message
                        const toast = showToast('Message sent successfully!', 'success');
                        
                        // Reset form
                        this.reset();
                        this.classList.remove('was-validated');
                        
                        // Remove toast after delay
                        setTimeout(() => {
                            toast.remove();
                        }, 5000);
                    } catch (error) {
                        showToast('Error sending message. Please try again.', 'error');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }
                
                this.classList.add('was-validated');
            }, false);
        });
    })();

    // Enhanced testimonial carousel with pause on hover and touch
    const testimonialCarousel = new bootstrap.Carousel('#testimonialCarousel', {
        interval: 8000,
        ride: 'carousel',
        wrap: true,
        touch: true,
        pause: 'hover'
    });

    // Pause carousel when user interacts with it
    const carouselElement = document.querySelector('#testimonialCarousel');
    carouselElement.addEventListener('touchstart', () => {
        testimonialCarousel.pause();
    });
    
    carouselElement.addEventListener('touchend', () => {
        setTimeout(() => testimonialCarousel.cycle(), 5000);
    });

    // Enhanced lazy loading with Intersection Observer
    const lazyLoad = (targets) => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        img.removeAttribute('loading');
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px',
                threshold: 0.01
            });

            targets.forEach(target => observer.observe(target));
        } else {
            // Fallback for browsers without IntersectionObserver
            targets.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    };

    lazyLoad(document.querySelectorAll('img[loading="lazy"]'));

    // Enhanced add to cart functionality with quantity controls
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.card');
            const itemName = card.querySelector('.card-title').textContent;
            const itemPrice = card.querySelector('.text-primary').textContent;
            const itemImage = card.querySelector('img').src;
            
            // Create toast with item details
            const toastId = `toast-${Math.random().toString(36).substr(2, 9)}`;
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '1100';
            toast.innerHTML = `
                <div id="${toastId}" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-primary text-white">
                        <strong class="me-auto">Added to Cart</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            <img src="${itemImage}" class="rounded me-3" width="40" height="40" alt="${itemName}" loading="lazy">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${itemName}</h6>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-muted small">${itemPrice}</span>
                                    <div class="quantity-controls d-flex align-items-center">
                                        <button class="btn btn-sm btn-outline-secondary quantity-minus">-</button>
                                        <span class="mx-2 quantity">1</span>
                                        <button class="btn btn-sm btn-outline-secondary quantity-plus">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-sm btn-success view-cart">View Cart</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Add event listeners for quantity controls
            const toastElement = document.getElementById(toastId);
            const quantityElement = toastElement.querySelector('.quantity');
            const minusBtn = toastElement.querySelector('.quantity-minus');
            const plusBtn = toastElement.querySelector('.quantity-plus');
            let quantity = 1;
            
            minusBtn.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantityElement.textContent = quantity;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                quantity++;
                quantityElement.textContent = quantity;
            });
            
            // View cart button
            toastElement.querySelector('.view-cart').addEventListener('click', () => {
                // In a real implementation, this would navigate to the cart page
                console.log(`Added ${quantity} ${itemName} to cart`);
                toast.remove();
            });
            
            // Remove toast after delay if not interacted with
            let toastTimeout = setTimeout(() => {
                toast.remove();
            }, 5000);
            
            // Reset timeout on interaction
            toastElement.addEventListener('mouseenter', () => {
                clearTimeout(toastTimeout);
            });
            
            toastElement.addEventListener('mouseleave', () => {
                toastTimeout = setTimeout(() => {
                    toast.remove();
                }, 3000);
            });
        });
    });

    // Helper function to show toast notifications
    function showToast(message, type = 'info') {
        const toastId = `toast-${Math.random().toString(36).substr(2, 9)}`;
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '1100';
        
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 'bg-primary';
        
        toast.innerHTML = `
            <div id="${toastId}" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white">
                    <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        return toast;
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus'
        });
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Responsive adjustments
    function handleResponsiveChanges() {
        // Example: Adjust carousel behavior on mobile
        if (window.innerWidth < 768) {
            testimonialCarousel.pause();
        } else {
            testimonialCarousel.cycle();
        }
    }

    // Listen for window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveChanges, 200);
    });

    // Initial responsive check
    handleResponsiveChanges();
});