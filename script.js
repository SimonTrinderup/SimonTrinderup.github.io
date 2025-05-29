// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const animateOnScroll = () => {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate hero content with staggered delays
                if (entry.target.classList.contains('hero')) {
                    const heroContent = entry.target.querySelector('.hero-content');
                    if (heroContent) {
                        heroContent.classList.add('visible');
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
};

// Parallax and gradient animation
const initParallax = () => {
    const gradientBg = document.querySelector('.gradient-bg');
    let scrollPos = 0;
    let ticking = false;

    const updateGradient = () => {
        const scrollValue = window.scrollY;
        const opacity = 0.4 + (scrollValue * 0.0005);
        const scale = 1 + (scrollValue * 0.0002);
        
        if (gradientBg) {
            gradientBg.style.opacity = Math.min(opacity, 0.7);
            gradientBg.style.transform = `scale(${Math.min(scale, 1.1)})`;
            
            // Slight color shift based on scroll
            const hueShift = scrollValue * 0.01;
            gradientBg.style.filter = `hue-rotate(${hueShift}deg)`;
        }
    };

    window.addEventListener('scroll', () => {
        scrollPos = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateGradient();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateGradient();
};

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    initParallax();
    
    // Add hover effects to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.2)';
            icon.style.transition = 'all 0.3s ease';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click animation to profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('click', () => {
            profileImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                profileImage.style.transform = 'scale(1)';
            }, 200);
        });
    }
});
