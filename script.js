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
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const slideDots = document.querySelectorAll('.slide-dot');
  
  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');

  // Shortcuts Modal Elements
  const shortcutsBtn = document.getElementById('shortcuts-btn');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const shortcutsOverlay = document.getElementById('shortcuts-overlay');
  const shortcutsClose = document.getElementById('shortcuts-close');

  // Toast Notification
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // Email Copy Buttons
  const headerCopyEmailBtn = document.getElementById('header-copy-email-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // Update Active Slide Display
  function goToSlide(slideIndex) {
    if (slideIndex < 1) slideIndex = 1;
    if (slideIndex > totalSlides) slideIndex = totalSlides;
    
    currentSlide = slideIndex;
    
    slides.forEach((slide) => {
      const index = parseInt(slide.getAttribute('data-slide-index'), 10);
      if (index === currentSlide) {
        slide.classList.add('active');
        const content = slide.querySelector('.slide-content');
        if (content) content.scrollTop = 0;
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Update Slide Dots
    slideDots.forEach((dot) => {
      const dotSlide = parseInt(dot.getAttribute('data-slide'), 10);
      if (dotSlide === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update Counter & Progress Bar
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

  // Slide Dot Click Handlers
  slideDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideNum = parseInt(dot.getAttribute('data-slide'), 10);
      if (slideNum) goToSlide(slideNum);
    });
  });
  
  // Keyboard Navigation Support
  document.addEventListener('keydown', (e) => {
    // If input active, skip key handlers
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Escape key closes modals
    if (e.key === 'Escape') {
      closeLightbox();
      closeShortcutsModal();
      return;
    }

    if (e.key === '?') {
      toggleShortcutsModal();
      return;
    }
    
    if (lightboxModal && lightboxModal.classList.contains('active')) return;
    if (shortcutsModal && shortcutsModal.classList.contains('active')) return;
    
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
    }
  });
  
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

  // Material Filter Handler for Slide 7
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sampleCards = document.querySelectorAll('.sample-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      sampleCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal Logic for Fullscreen Image Viewing
  const triggers = document.querySelectorAll('.lightbox-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title') || 'Image Preview';
      openLightbox(imgSrc, title);
    });
  });

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
  }

  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  // Keyboard Shortcuts Modal Logic
  function openShortcutsModal() {
    if (shortcutsModal) shortcutsModal.classList.add('active');
  }

  function closeShortcutsModal() {
    if (shortcutsModal) shortcutsModal.classList.remove('active');
  }

  function toggleShortcutsModal() {
    if (shortcutsModal) shortcutsModal.classList.toggle('active');
  }

  if (shortcutsBtn) shortcutsBtn.addEventListener('click', openShortcutsModal);
  if (shortcutsOverlay) shortcutsOverlay.addEventListener('click', closeShortcutsModal);
  if (shortcutsClose) shortcutsClose.addEventListener('click', closeShortcutsModal);

  // Copy Email to Clipboard Functionality
  function copyEmailToClipboard() {
    const email = 'ehabnoura4@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email ehabnoura4@gmail.com copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy. Email: ehabnoura4@gmail.com');
    });
  }

  if (headerCopyEmailBtn) headerCopyEmailBtn.addEventListener('click', copyEmailToClipboard);
  if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyEmailToClipboard);

  // Toast Alert Notification
  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3200);
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
    if (lightboxModal && lightboxModal.classList.contains('active')) return;
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
