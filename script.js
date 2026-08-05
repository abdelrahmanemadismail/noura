/* ==========================================================================
   Noura Ehab Portfolio - Interactive Website Controller JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const appHeader = document.getElementById('app-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');

  // Toast Notification Elements
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // Email Copy Buttons
  const headerCopyEmailBtn = document.getElementById('header-copy-email-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  /* ------------------------------------------------------------------------
     1. Sticky Header & Back to Top Scroll Behavior
     ------------------------------------------------------------------------ */
  function handleScroll() {
    const scrollY = window.scrollY;

    // Header Background Shadow Toggle
    if (appHeader) {
      if (scrollY > 40) {
        appHeader.classList.add('header-scrolled');
      } else {
        appHeader.classList.remove('header-scrolled');
      }
    }

    // Back to Top Button Visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Back to Top Click Handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Mobile Drawer Navigation Toggle
     ------------------------------------------------------------------------ */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isExpanded ? 'ph-bold ph-x' : 'ph-bold ph-list';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!appHeader.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ph-bold ph-list';
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Smooth Scrolling & ScrollSpy Active Link Highlighter
     ------------------------------------------------------------------------ */
  const navLinksMap = new Map();
  navLinks.forEach((link) => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        navLinksMap.set(targetSection, link);
      }
    }
  });

  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeLink = navLinksMap.get(entry.target);
        if (activeLink) {
          navLinks.forEach((l) => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }, sectionObserverOptions);

  navLinksMap.forEach((_, section) => {
    sectionObserver.observe(section);
  });

  // Close mobile drawer on link click & smooth scroll anchor
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'ph-bold ph-list';
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Language Skill Progress Bar Animation on Scroll
     ------------------------------------------------------------------------ */
  const langFills = document.querySelectorAll('.lang-fill');
  if (langFills.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.3
    };

    const langObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetWidth = target.getAttribute('data-width') || '100%';
          target.style.width = targetWidth;
          langObserver.unobserve(target);
        }
      });
    }, observerOptions);

    langFills.forEach((fill) => langObserver.observe(fill));
  }

  /* ------------------------------------------------------------------------
     5. Sample Material & Testimonial Filter Tabs
     ------------------------------------------------------------------------ */
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
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Testimonial Filter Tabs
  const tFilterBtns = document.querySelectorAll('.testimonial-filter-btn');
  const tCards = document.querySelectorAll('.testimonial-item');

  tFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      tCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. Lightbox Modal Image Viewer
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      const imgSrc = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title') || 'High Resolution Preview';
      if (imgSrc) {
        openLightbox(imgSrc, title);
      }
    }
  });

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  // Close Lightbox on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  /* ------------------------------------------------------------------------
     7. Email Copy to Clipboard & Toast Alert
     ------------------------------------------------------------------------ */
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

  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3200);
  }
});
