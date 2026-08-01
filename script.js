/* ==========================================================================
   Noura Ehab Portfolio - Interactive Presentation Engine JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 1;
  const totalSlides = 9;
  
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progress-bar');
  const slideCounter = document.getElementById('slide-counter');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const toggleViewBtn = document.getElementById('toggle-view-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  // Update Active Slide Display
  function goToSlide(slideIndex) {
    if (slideIndex < 1) slideIndex = 1;
    if (slideIndex > totalSlides) slideIndex = totalSlides;
    
    currentSlide = slideIndex;
    
    slides.forEach((slide) => {
      const index = parseInt(slide.getAttribute('data-slide-index'), 10);
      if (index === currentSlide) {
        slide.classList.add('active');
        // Scroll inside slide to top
        const content = slide.querySelector('.slide-content');
        if (content) content.scrollTop = 0;
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Update counter and progress bar
    if (slideCounter) {
      slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
    }
    if (progressBar) {
      const progressPercent = (currentSlide / totalSlides) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
    
    // Update Button Disabled States
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;
  }
  
  // Next & Previous Handlers
  function nextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  }
  
  function prevSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }
  
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  // Keyboard Navigation Support
  document.addEventListener('keydown', (e) => {
    // Disable slide key shortcuts if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides);
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    } else if (e.key.toLowerCase() === 'g') {
      toggleViewMode();
    }
  });
  
  // Toggle Presentation Mode vs Grid / Overview Mode
  let isGridMode = false;
  function toggleViewMode() {
    isGridMode = !isGridMode;
    document.body.classList.toggle('mode-grid', isGridMode);
    
    if (toggleViewBtn) {
      toggleViewBtn.innerHTML = isGridMode
        ? '<i class="ph ph-slideshow"></i> Slide Mode'
        : '<i class="ph ph-squares-four"></i> Grid View';
    }
    
    if (!isGridMode) {
      goToSlide(currentSlide);
    }
  }
  
  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', toggleViewMode);
  }
  
  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Print Portfolio Handler
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Touch Swipe Support for Mobile Presentation
  let touchStartX = 0;
  let touchEndX = 0;
  
  const slidesWrapper = document.querySelector('.slides-wrapper');
  if (slidesWrapper) {
    slidesWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slidesWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    if (isGridMode) return;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }
  
  // Initialize Presentation at Slide 1
  goToSlide(1);
});
