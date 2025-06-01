document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to the About section with custom animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const aboutSection = document.querySelector('.about');
    
    if (scrollIndicator && aboutSection) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target position
            const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; // 1.5 seconds for the scroll
            let start = null;
            
            // Custom easing function for smooth acceleration and deceleration
            function easeInOutCubic(t) {
                return t < 0.5 
                    ? 4 * t * t * t 
                    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }
            
            // Animation function with performance optimizations
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                const easedPercentage = easeInOutCubic(percentage);
                
                // Use transform for smoother animation with will-change
                const scrollY = startPosition + (distance * easedPercentage);
                
                // Apply scroll position
                window.scrollTo({
                    top: scrollY,
                    behavior: 'auto' // Disable default smooth scrolling
                });
                
                // Continue animation if not complete
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
            
            // Start the animation
            window.requestAnimationFrame(step);
        });
    }

    // Configuration
    const CONFIG = {
        autoScrollInterval: 4000, // 4 seconds between slides
        transitionDuration: 500, // 0.5s transition
        cardsToShow: 3, // Default number of cards to show
        cardGap: 32 // Gap between cards in pixels
    };

    // DOM Elements
    const track = document.querySelector('.recommendations-track');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const template = document.getElementById('recommendation-template');
    
    // State
    let currentIndex = 0;
    let cardWidth = 0;
    let autoScrollInterval;
    let isHovering = false;
    let isAnimating = false; // Track if animation is in progress
    let cards = [];
    let maxIndex = 0;

    // Recommendations data
    const recommendations = [
        {
            text: "Simon har udover ovenstående bidraget med stabilitet, højt humør, mødestabilitet og hans konstante iver efter at lære, smitter af på alle hans kollegaer. Ydermere er Simon en kæmpe holdspiller, der formår at involvere hele teamet.",
            name: "Sebastian Andersen",
            role: "CEO, Salesmen ApS"
        },
        {
            text: "Simon har vist stort initiativ i sit arbejde, og ser muligheder for at optimere arbejdsgange. Han har udarbejdet, og implementeret, et nyt system til opfølgning på vores forsendelser.",
            name: "Lisse-Lotte Jensen",
            role: "Manager, Selektro A/S"
        },
        {
            text: "I like Simon, he's a solid dude! that's why we call him statue ;)",
            name: "Dimitris Klouras",
            role: "BDR Team Lead, Adversus A/S"
        }
    ];

    // Initialize the carousel
    function initCarousel() {
        // Clear existing cards
        track.innerHTML = '';
        
        // Create clones of the last few cards and add them to the beginning
        const startClones = [];
        const endClones = [];
        const numClones = 3; // Number of cards to clone at each end
        
        // Create clones for the beginning (from the end of the array)
        for (let i = 0; i < numClones; i++) {
            const index = recommendations.length - 1 - (i % recommendations.length);
            const card = createCard(recommendations[index], 'start-' + i);
            startClones.unshift(card);
        }
        
        // Create the main cards
        const mainCards = recommendations.map((rec, index) => 
            createCard(rec, index)
        );
        
        // Create clones for the end (from the start of the array)
        for (let i = 0; i < numClones; i++) {
            const index = i % recommendations.length;
            const card = createCard(recommendations[index], 'end-' + i);
            endClones.push(card);
        }
        
        // Combine all cards
        const allCards = [...startClones, ...mainCards, ...endClones];
        
        // Add all cards to the track
        allCards.forEach(card => track.appendChild(card));
        
        // Update cards array with all cards
        cards = Array.from(track.children);
        
        // Set initial position after the start clones
        track.style.transition = 'none';
        currentIndex = startClones.length;
        
        // Calculate the width of the track to ensure proper positioning
        updateCarousel(true);
        
        // Start auto-scrolling
        startAutoScroll();
    }
    
    // Create a card element from template
    function createCard(data, id) {
        const card = template.content.cloneNode(true);
        card.querySelector('.recommendation-text').textContent = data.text;
        card.querySelector('.recommender-name').textContent = data.name;
        card.querySelector('.recommender-role').textContent = data.role;
        card.querySelector('.recommendation-card').dataset.id = id;
        return card;
    }
    
    // Update carousel position
    function updateCarousel(forceInstant = false) {
        if (forceInstant) {
            track.style.transition = 'none';
        } else if (track.style.transition === 'none') {
            track.style.transition = `transform ${CONFIG.transitionDuration}ms ease`;
        }
        
        cardWidth = cards[0]?.offsetWidth || 300; // Fallback width if cards[0] is undefined
        const offset = -currentIndex * (cardWidth + CONFIG.cardGap);
        track.style.transform = `translateX(${offset}px)`;
        updateArrowState();
    }
    
    // Update arrow states
    function updateArrowState() {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
    
    // Go to specific slide
    function goToSlide(index, instant = false) {
        // Don't start a new animation if one is already in progress
        if (isAnimating && !instant) return;
        
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = `transform ${CONFIG.transitionDuration}ms ease`;
            isAnimating = true; // Set animation flag
        }
        
        // Calculate the actual index considering the clones
        const numClones = 3; // Should match the number in initCarousel
        const mainCards = recommendations.length;
        
        // If we're in the start clones area, jump to the corresponding position in the main cards
        if (index < numClones) {
            const mainIndex = (mainCards - (numClones - index) % mainCards) % mainCards + numClones;
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = mainIndex;
                updateCarousel(true);
                isAnimating = false; // Reset animation flag after instant update
            }, instant ? 0 : CONFIG.transitionDuration);
        } 
        // If we're in the end clones area, jump to the corresponding position in the main cards
        else if (index >= mainCards + numClones) {
            const mainIndex = (index - numClones) % mainCards + numClones;
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = mainIndex;
                updateCarousel(true);
                isAnimating = false; // Reset animation flag after instant update
            }, instant ? 0 : CONFIG.transitionDuration);
        }
        
        currentIndex = index;
        updateCarousel(instant);
        
        // Reset animation flag after the transition ends
        if (!instant) {
            track.addEventListener('transitionend', function onTransitionEnd() {
                track.removeEventListener('transitionend', onTransitionEnd);
                isAnimating = false;
            }, { once: true });
        }
    }
    
    // Start auto-scrolling
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        
        autoScrollInterval = setInterval(() => {
            if (!isHovering) {
                goToSlide(currentIndex + 1);
            }
        }, CONFIG.autoScrollInterval);
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', () => {
        if (!isAnimating) {
            goToSlide(currentIndex - 1);
            startAutoScroll(); // Reset the auto-scroll timer on user interaction
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (!isAnimating) {
            goToSlide(currentIndex + 1);
            startAutoScroll(); // Reset the auto-scroll timer on user interaction
        }
    });
    
    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    track.addEventListener('mouseleave', () => {
        isHovering = false;
        startAutoScroll();
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return; // Ignore keypresses during animation
        
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
            startAutoScroll();
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
            startAutoScroll();
        }
    });
    
    // Handle touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - next
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - previous
            goToSlide(currentIndex - 1);
        }
        
        startAutoScroll();
    }, { passive: true });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
    
    // Initialize everything
    initCarousel();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    });
});
