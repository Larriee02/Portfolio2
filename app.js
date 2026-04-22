/* ============================================
   LANRE DIGITAL SOLUTIONS — app.js
   Core interactions, accessibility, auth sim
   ============================================ */

'use strict';

// ============================================
// THEME (Dark / Light Mode)
// ============================================

const ThemeManager = (() => {
  const HTML = document.documentElement;
  const STORAGE_KEY = 'ld-theme';
  const TOGGLE_BTN = document.getElementById('theme-toggle');
  const ICON_SUN   = document.getElementById('icon-sun');
  const ICON_MOON  = document.getElementById('icon-moon');

  const getPreferred = () =>
    localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const apply = (theme) => {
    if (theme === 'dark') {
      HTML.classList.add('dark');
      ICON_SUN?.classList.remove('hidden');
      ICON_MOON?.classList.add('hidden');
    } else {
      HTML.classList.remove('dark');
      ICON_SUN?.classList.add('hidden');
      ICON_MOON?.classList.remove('hidden');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    TOGGLE_BTN?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  const toggle = () => {
    apply(HTML.classList.contains('dark') ? 'light' : 'dark');
  };

  const init = () => {
    apply(getPreferred());
    TOGGLE_BTN?.addEventListener('click', toggle);
  };

  return { init };
})();

// ============================================
// NAVBAR — scroll behaviour
// ============================================

const NavbarManager = (() => {
  const navbar    = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpen  = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');
  let   isOpen    = false;

  const onScroll = () => {
    if (window.scrollY > 24) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  const toggleMenu = () => {
    isOpen = !isOpen;
    mobileMenu?.classList.toggle('hidden', !isOpen);
    menuOpen?.classList.toggle('hidden', isOpen);
    menuClose?.classList.toggle('hidden', !isOpen);
    menuToggle?.setAttribute('aria-expanded', String(isOpen));
  };

  const init = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    menuToggle?.addEventListener('click', toggleMenu);

    // Close mobile menu on nav link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !navbar?.contains(e.target)) toggleMenu();
    });

    // Mark active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };

  return { init };
})();

// ============================================
// SCROLL REVEAL
// ============================================

const RevealManager = (() => {
  const observe = () => {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  };

  return { init: observe };
})();

// ============================================
// BACK TO TOP
// ============================================

const BackToTop = (() => {
  const btn = document.getElementById('back-to-top');

  const onScroll = () => {
    if (!btn) return;
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  };

  const init = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    btn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();

// ============================================
// FOOTER YEAR
// ============================================

const setFooterYear = () => {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
};

// ============================================
// NEWSLETTER FORM
// ============================================

const NewsletterForm = (() => {
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const init = () => {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const errorEl = document.getElementById('newsletter-error');
      const btn = form.querySelector('button[type="submit"]');

      if (!validateEmail(input?.value || '')) {
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
          errorEl.classList.remove('hidden');
        }
        input?.classList.add('error');
        return;
      }

      if (errorEl) errorEl.classList.add('hidden');
      input?.classList.remove('error');
      if (btn) {
        btn.textContent = '✓ Subscribed!';
        btn.disabled = true;
        btn.classList.add('bg-green-600');
        btn.classList.remove('bg-forest-500', 'hover:bg-forest-400');
      }
    });
  };

  return { init };
})();

// ============================================
// AUTH MODAL (Simulated)
// ============================================

const AuthModal = (() => {
  // Simulated in-memory user store (replace with real backend)
  const USERS_KEY = 'ld-users';
  const SESSION_KEY = 'ld-session';

  const getUsers  = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  const setSession = (u) => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  const clearSession = () => localStorage.removeItem(SESSION_KEY);

  const showModal = (mode = 'login') => {
    const overlay = document.getElementById('auth-modal');
    if (!overlay) return;
    setModalMode(mode);
    overlay.classList.add('open');
    overlay.querySelector('input')?.focus();
  };

  const hideModal = () => {
    const overlay = document.getElementById('auth-modal');
    overlay?.classList.remove('open');
  };

  const setModalMode = (mode) => {
    const title    = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const loginFields  = document.getElementById('modal-login-fields');
    const signupFields = document.getElementById('modal-signup-fields');
    const submitBtn = document.getElementById('modal-submit');
    const switchEl = document.getElementById('modal-switch');

    if (mode === 'login') {
      if (title)    title.textContent = 'Welcome back';
      if (subtitle) subtitle.textContent = 'Sign in to access your dashboard';
      loginFields?.classList.remove('hidden');
      signupFields?.classList.add('hidden');
      if (submitBtn) submitBtn.textContent = 'Sign In';
      if (switchEl)  switchEl.innerHTML = `Don't have an account? <button type="button" class="text-forest-500 font-medium hover:underline" onclick="AuthModal.show('signup')">Sign up</button>`;
    } else {
      if (title)    title.textContent = 'Create account';
      if (subtitle) subtitle.textContent = 'Join Lanre Digital Solutions';
      loginFields?.classList.add('hidden');
      signupFields?.classList.remove('hidden');
      if (submitBtn) submitBtn.textContent = 'Create Account';
      if (switchEl)  switchEl.innerHTML = `Already have an account? <button type="button" class="text-forest-500 font-medium hover:underline" onclick="AuthModal.show('login')">Sign in</button>`;
    }

    document.getElementById('modal-error')?.classList.add('hidden');
  };

  const handleSubmit = (mode) => {
    const emailInput = document.getElementById('modal-email');
    const passInput  = document.getElementById('modal-password');
    const nameInput  = document.getElementById('modal-name');
    const errorEl    = document.getElementById('modal-error');

    const email = emailInput?.value.trim() || '';
    const pass  = passInput?.value || '';

    const showError = (msg) => {
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.'); return;
    }
    if (pass.length < 6) {
      showError('Password must be at least 6 characters.'); return;
    }

    const users = getUsers();

    if (mode === 'signup') {
      const name = nameInput?.value.trim() || '';
      if (!name) { showError('Please enter your name.'); return; }
      if (users.find(u => u.email === email)) {
        showError('An account with this email already exists.'); return;
      }
      const user = { id: Date.now(), name, email, createdAt: new Date().toISOString() };
      users.push({ ...user, password: btoa(pass) });
      saveUsers(users);
      setSession(user);
    } else {
      const found = users.find(u => u.email === email && u.password === btoa(pass));
      if (!found) { showError('Invalid email or password.'); return; }
      setSession({ id: found.id, name: found.name, email: found.email, createdAt: found.createdAt });
    }

    hideModal();
    updateAuthUI();

    // Redirect to dashboard after login
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
  };

  const logout = () => {
    clearSession();
    updateAuthUI();
    if (window.location.pathname.includes('dashboard')) {
      window.location.href = 'index.html';
    }
  };

  const updateAuthUI = () => {
    const session = getSession();
    const loginBtns  = document.querySelectorAll('[data-auth="login"]');
    const logoutBtns = document.querySelectorAll('[data-auth="logout"]');
    const userNames  = document.querySelectorAll('[data-auth="username"]');

    loginBtns.forEach(el => el.classList.toggle('hidden', !!session));
    logoutBtns.forEach(el => el.classList.toggle('hidden', !session));
    userNames.forEach(el => { if (session) el.textContent = session.name.split(' ')[0]; });
  };

  const guardDashboard = () => {
    const isDashboard = window.location.pathname.includes('dashboard');
    if (isDashboard && !getSession()) {
      showModal('login');
    }
  };

  const init = () => {
    // Close on overlay click
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('auth-modal')) hideModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideModal();
    });

    // Submit handler
    document.getElementById('modal-submit')?.addEventListener('click', () => {
      const isLogin = !document.getElementById('modal-signup-fields')?.classList.contains('hidden') === false;
      const mode = document.getElementById('modal-signup-fields')?.classList.contains('hidden') ? 'login' : 'signup';
      handleSubmit(mode);
    });

    // Enter key in modal
    document.getElementById('auth-modal')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const mode = document.getElementById('modal-signup-fields')?.classList.contains('hidden') ? 'login' : 'signup';
        handleSubmit(mode);
      }
    });

    // Login/logout button listeners
    document.querySelectorAll('[data-auth="login"]').forEach(btn => {
      btn.addEventListener('click', () => showModal('login'));
    });
    document.querySelectorAll('[data-auth="logout"]').forEach(btn => {
      btn.addEventListener('click', logout);
    });

    updateAuthUI();
    guardDashboard();
  };

  return { init, show: showModal, hide: hideModal, getSession, logout };
})();

// Make AuthModal accessible globally for inline calls
window.AuthModal = AuthModal;

// ============================================
// CONTACT FORM VALIDATION
// ============================================

const ContactForm = (() => {
  const validators = {
    name:    (v) => v.trim().length >= 2  ? null : 'Name must be at least 2 characters.',
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email.',
    subject: (v) => v.trim().length >= 3  ? null : 'Please enter a subject.',
    message: (v) => v.trim().length >= 20 ? null : 'Message must be at least 20 characters.',
  };

  const showFieldError = (fieldId, msg) => {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}-error`);
    field?.classList.add('error');
    if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
  };

  const clearFieldError = (fieldId) => {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}-error`);
    field?.classList.remove('error');
    errEl?.classList.add('hidden');
  };

  const init = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Live validation on blur
    Object.keys(validators).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      input?.addEventListener('blur', () => {
        const err = validators[key](input.value);
        if (err) showFieldError(key, err);
        else clearFieldError(key);
      });
      input?.addEventListener('input', () => clearFieldError(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      Object.keys(validators).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        const err = input ? validators[key](input.value) : 'Required field missing.';
        if (err) { showFieldError(key, err); hasError = true; }
        else clearFieldError(key);
      });

      if (hasError) return;

      const btn = form.querySelector('[type="submit"]');
      const successEl = document.getElementById('form-success');

      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }

      // Simulate submission delay
      setTimeout(() => {
        form.reset();
        if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
        if (successEl) successEl.classList.remove('hidden');
        setTimeout(() => successEl?.classList.add('hidden'), 5000);
      }, 1400);
    });
  };

  return { init };
})();

// ============================================
// BLOG — filter / search (used on blog.html)
// ============================================

const BlogFilter = (() => {
  const init = () => {
    const searchInput = document.getElementById('blog-search');
    const filterBtns  = document.querySelectorAll('[data-filter]');
    const articles    = document.querySelectorAll('[data-category]');

    if (!searchInput && !filterBtns.length) return;

    let activeFilter = 'all';

    const render = () => {
      const query = searchInput?.value.toLowerCase() || '';
      articles.forEach(article => {
        const cat   = article.dataset.category?.toLowerCase() || '';
        const text  = article.textContent.toLowerCase();
        const matchFilter = activeFilter === 'all' || cat.includes(activeFilter);
        const matchSearch = !query || text.includes(query);
        article.style.display = (matchFilter && matchSearch) ? '' : 'none';
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter || 'all';
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        render();
      });
    });

    searchInput?.addEventListener('input', render);
  };

  return { init };
})();

// ============================================
// DASHBOARD — live stats simulation
// ============================================

const Dashboard = (() => {
  const animateCount = (el, target, duration = 1200) => {
    if (!el) return;
    const start = Date.now();
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const init = () => {
    const isDashboard = !!document.getElementById('dashboard-stats');
    if (!isDashboard) return;

    // Animate stat numbers
    animateCount(document.getElementById('stat-visitors'), 12840);
    animateCount(document.getElementById('stat-leads'), 284);
    animateCount(document.getElementById('stat-projects'), 42);
    animateCount(document.getElementById('stat-revenue'), 98500);
  };

  return { init };
})();

// ============================================
// CMS SIMULATION — blog post loading
// ============================================

const CMS = (() => {
  // Simulated CMS data store (replace with real API/headless CMS)
  const posts = [
    {
      id: 1,
      slug: 'design-system-before-scale',
      title: 'Why your SaaS product needs a design system before it scales',
      category: 'Product',
      date: 'Jun 12, 2025',
      readTime: '6 min read',
      excerpt: 'The decision to invest in a proper design system is one of the highest-leverage choices you can make early on in your product journey.',
      featured: true,
    },
    {
      id: 2,
      slug: 'auth-best-practices',
      title: 'Authentication best practices every web developer must know',
      category: 'Security',
      date: 'May 28, 2025',
      readTime: '8 min read',
      excerpt: 'User authentication is one of the most critical — and most misconfigured — parts of any web application.',
      featured: false,
    },
    {
      id: 3,
      slug: 'mvp-in-eight-weeks',
      title: 'From idea to launch: How we build MVPs in under 8 weeks',
      category: 'Growth',
      date: 'May 10, 2025',
      readTime: '5 min read',
      excerpt: 'Speed without cutting corners is an art form. Here\'s our exact process for launching viable products fast, from kickoff to production.',
      featured: false,
    },
    {
      id: 4,
      slug: 'tailwind-component-architecture',
      title: 'Building scalable component architecture with Tailwind CSS',
      category: 'Development',
      date: 'Apr 22, 2025',
      readTime: '7 min read',
      excerpt: 'Tailwind is often misunderstood as a utility dump. Done right, it can produce the most maintainable frontend codebases you\'ve ever worked in.',
      featured: false,
    },
    {
      id: 5,
      slug: 'web-performance-101',
      title: 'Web performance in 2025: What still matters and what changed',
      category: 'Performance',
      date: 'Apr 5, 2025',
      readTime: '9 min read',
      excerpt: 'Core Web Vitals aren\'t going anywhere. Here\'s a no-fluff breakdown of where to focus your performance optimization efforts this year.',
      featured: false,
    },
    {
      id: 6,
      slug: 'client-handoff-guide',
      title: 'The perfect client handoff: A developer\'s complete checklist',
      category: 'Process',
      date: 'Mar 18, 2025',
      readTime: '4 min read',
      excerpt: 'How you close a project matters almost as much as how you built it. Our 40-point handoff checklist has never failed us.',
      featured: false,
    },
  ];

  const getAll  = () => [...posts];
  const getById = (id) => posts.find(p => p.id === id) || null;
  const getBySlug = (slug) => posts.find(p => p.slug === slug) || null;
  const getFeatured = () => posts.filter(p => p.featured);

  return { getAll, getById, getBySlug, getFeatured };
})();

// Make CMS accessible globally
window.CMS = CMS;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavbarManager.init();
  RevealManager.init();
  BackToTop.init();
  setFooterYear();
  NewsletterForm.init();
  AuthModal.init();
  ContactForm.init();
  BlogFilter.init();
  Dashboard.init();
});
