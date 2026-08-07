/* ==========================================================================
   Noura Ehab Portfolio - Interactive Website Controller JavaScript
   Multilingual Support: English (en), Arabic (ar), German (de)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const appHeader = document.getElementById('app-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Language Dropdown Elements
  const langDropdownBtn = document.getElementById('lang-dropdown-btn');
  const langDropdownMenu = document.getElementById('lang-dropdown-menu');
  const langCurrentLabel = document.getElementById('lang-current-label');
  const langOptionBtns = document.querySelectorAll('.lang-option-btn');
  const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');

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

  let currentLang = localStorage.getItem('noura_lang') || 'en';

  /* ------------------------------------------------------------------------
     0. Internationalization (i18n) Language Switcher Engine
     ------------------------------------------------------------------------ */
  const langLabels = {
    en: 'English',
    ar: 'العربية',
    de: 'Deutsch'
  };

  function setLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    currentLang = lang;
    localStorage.setItem('noura_lang', lang);

    // Update HTML attributes
    document.documentElement.setAttribute('lang', lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);

    // Update Label in Header
    if (langCurrentLabel) {
      langCurrentLabel.textContent = langLabels[lang] || 'English';
    }

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = translations[lang][key];
      if (val !== undefined) {
        // Preserving icons if element has child icons that are strictly icons
        // If translation string contains HTML tags (like <strong> or <em> or <span>), set innerHTML
        if (val.includes('<') && val.includes('>')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update active class on dropdown options & mobile language buttons
    langOptionBtns.forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    mobileLangBtns.forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Language Dropdown Event Handlers
  if (langDropdownBtn && langDropdownMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = langDropdownMenu.classList.contains('active');
      langDropdownMenu.classList.toggle('active');
      langDropdownBtn.setAttribute('aria-expanded', !isExpanded);
    });

    document.addEventListener('click', (e) => {
      if (!langDropdownBtn.contains(e.target) && !langDropdownMenu.contains(e.target)) {
        langDropdownMenu.classList.remove('active');
        langDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  langOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
        if (langDropdownMenu) langDropdownMenu.classList.remove('active');
        if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  mobileLangBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
    });
  });

  // Initialize Language on DOM Load
  setLanguage(currentLang);

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
      const title = trigger.getAttribute('data-title') || (translations[currentLang] ? translations[currentLang]['lightbox.default_title'] : 'High Resolution Preview');
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
    const successMsg = (translations[currentLang] && translations[currentLang]['toast.copied']) || 'Email ehabnoura4@gmail.com copied to clipboard!';
    const failMsg = (translations[currentLang] && translations[currentLang]['toast.copy_fail']) || 'Failed to copy. Email: ehabnoura4@gmail.com';

    navigator.clipboard.writeText(email).then(() => {
      showToast(successMsg);
    }).catch(() => {
      showToast(failMsg);
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
