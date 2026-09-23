/**
 * Suraj Patel - Personal Portfolio Interactive Logic
 * Vanilla JavaScript (High-Performance, Lightweight, Zero-Dependency)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollSpy();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initClipboardButtons();
  initBackToTop();
  initScrollReveal();
  initCopyrightYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Retrieve saved theme or check system preference
  const savedTheme = localStorage.getItem('suraj_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('suraj_portfolio_theme', newTheme);
    });
  }

  // Listen for system theme changes if user has not set a manual preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('suraj_portfolio_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
    }
  });
}

/* ==========================================================================
   2. Mobile Navigation & Drawer Toggle
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/* ==========================================================================
   3. Sticky Navbar Blur & Active ScrollSpy
   ========================================================================== */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar shadow elevation on scroll
    if (navbar) {
      if (scrollY > 30) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }

    // ScrollSpy active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   4. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedFilter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (selectedFilter === 'all' || category === selectedFilter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Project Modal Details
   ========================================================================== */
const projectDetailsData = {
  'gesture-youtube': {
    title: 'Hand Gesture Controlled YouTube',
    category: 'Computer Vision & Automation',
    date: 'Aug 2026',
    description: 'A touchless YouTube control interface engineered using OpenCV and MediaPipe. The system tracks 21 individual hand landmarks in real time through a standard web camera and translates natural hand gestures into browser control actions without requiring specialized external hardware.',
    features: [
      'Webcam-based 21-point hand landmark tracking and geometry-based gesture classification.',
      'Comprehensive control map: play/pause, volume increment/decrement, 5s rewind/forward seeking, mute, and fullscreen toggle.',
      'PyAutoGUI automation pipeline calibrated with dynamic frame cooldowns to prevent erratic duplicate triggers.',
      'Robust performance running at ~30 FPS on standard consumer laptop hardware.'
    ],
    techStack: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI', 'NumPy'],
    githubUrl: 'https://github.com/surajpatel1709'
  },
  'compiler-ide': {
    title: 'Multi-Language Online Compiler & IDE',
    category: 'Developer Tools & Systems',
    date: 'Jul 2026',
    description: 'A web-based interactive programming compiler and execution environment built to enable rapid code testing and compilation across multiple major languages including C, C++, Java, and Python.',
    features: [
      'Multi-language compilation pipeline with runtime sandboxing and execution timeout constraints.',
      'Interactive code editor interface featuring line numbering, syntax formatting, and language selection.',
      'Custom standard input (stdin) feeding mechanism and structured output/error stream segregation (stdout & stderr).',
      'Engineered with a lightweight responsive UI accommodating development on desktop and tablet screens.'
    ],
    techStack: ['Python', 'C', 'C++', 'Java', 'Web APIs', 'Process Execution'],
    githubUrl: 'https://github.com/surajpatel1709'
  },
  'population-trends': {
    title: 'India Population Trends Analysis',
    category: 'Data Science & Predictive ML',
    date: 'May 2026',
    description: 'An in-depth empirical data analysis study evaluating demographic transformations, state-wise population density, urbanization velocity, and literacy rates across India using historical and modern demographic records.',
    features: [
      'Systematic data cleansing and exploratory data analysis (EDA) across multi-decadal demographic datasets.',
      'Statistical correlation analysis investigating the socio-economic impacts of literacy rates on regional fertility and growth.',
      'High-impact visualizations: multi-line trend charts, demographic pyramid simulations, and correlation heatmaps.',
      'Predictive trend modeling using Scikit-learn regression algorithms to forecast future demographic milestones.'
    ],
    techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'HTML Reporting'],
    githubUrl: 'https://github.com/surajpatel1709'
  },
  'linkedin-dashboard': {
    title: 'LinkedIn Job Analysis Dashboard',
    category: 'Business Intelligence & Analytics',
    date: 'Apr 2026',
    description: 'An executive Business Intelligence dashboard engineered in Power BI Desktop to analyze employment listings, employer hiring velocity, compensation brackets, and demand patterns for technical competencies in the software and data industries.',
    features: [
      'Data preparation and transformation pipeline structured using Power Query to handle unstructured job postings.',
      'Sophisticated DAX measures for dynamic salary distribution percentiles, hiring index calculations, and role-frequency rankings.',
      'Interactive analytical views with dynamic cross-filtering slicers by experience level, location, industry, and core skills.',
      'Actionable talent insights visual layout tailored for recruiters, hiring managers, and prospective graduates.'
    ],
    techStack: ['Power BI Desktop', 'Power Query', 'DAX', 'Data Modeling', 'Business Intelligence'],
    githubUrl: 'https://github.com/surajpatel1709'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const expandButtons = document.querySelectorAll('.expand-project-btn');

  if (!modal || !modalBody || !closeBtn) return;

  function openModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <span class="modal-header-tag">${data.category} • ${data.date}</span>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-desc">${data.description}</p>
      
      <h4 class="modal-section-title">Key Architectural Features</h4>
      <ul class="modal-features-list">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <h4 class="modal-section-title">Technologies Used</h4>
      <div class="modal-tech-stack">
        ${data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>View on GitHub</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  expandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project-id');
      openModal(pid);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitFormBtn');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function setError(input, isError) {
    const parent = input.parentElement;
    if (parent) {
      parent.classList.toggle('has-error', isError);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (!isValid) return;

    // Form is valid: simulate sending state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Sending...</span>
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
    `;

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Message Sent</span>
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;

      showToast('Thank you! Your message has been received.');

      setTimeout(() => {
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }, 3000);
    }, 800);
  });
}

function showToast(message, duration = 3500) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, duration);
}

/* ==========================================================================
   7. Copy to Clipboard Utility
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   10. Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
