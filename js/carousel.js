document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.recommendations-track');
    const cards = document.querySelectorAll('.recommendation-card');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    let cardWidth = cards[0].offsetWidth + 32; // width + gap
    let currentIndex = 0;
    let maxIndex = Math.ceil(cards.length / 1) - 1; // Adjust based on visible cards

    // Handle responsive maxIndex
    function updateMaxIndex() {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 1024) {
            maxIndex = Math.ceil(cards.length / 3) - 1; // 3 cards visible
        } else if (windowWidth >= 768) {
            maxIndex = Math.ceil(cards.length / 2) - 1; // 2 cards visible
        } else {
            maxIndex = cards.length - 1; // 1 card visible
        }
        // Ensure currentIndex is within bounds
        currentIndex = Math.min(currentIndex, maxIndex);
        updateCarousel();
    }

    // Update carousel position
    function updateCarousel() {
        const offset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        updateArrowState();
    }

    // Update arrow states based on current index
    function updateArrowState() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = Math.min(Math.max(0, index), maxIndex);
        updateCarousel();
    }

    // Event listeners for arrows
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });

    // Handle touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });

    // Initialize
    updateMaxIndex();
    updateDots();
    updateArrowState();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cardWidth = cards[0].offsetWidth + 32;
            updateMaxIndex();
        }, 250);
    });
});
