/* =========================================================
   Pankaj Maddheshiya — Portfolio interactions
   ========================================================= */

(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  const themeToggle = $('#themeToggle');
  const themeColor = $('#themeColor');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  const setTheme = (theme, persist = true) => {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;

    if (themeIcon) {
      themeIcon.className = `fa-solid ${next === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    }

    if (themeToggle) {
      const nextLabel = next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      themeToggle.setAttribute('aria-label', nextLabel);
      themeToggle.setAttribute('title', nextLabel);
      themeToggle.setAttribute('aria-pressed', String(next === 'light'));
    }

    if (themeColor) {
      themeColor.setAttribute('content', next === 'dark' ? '#070a0f' : '#f4f7fa');
    }

    if (persist) {
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        /* storage can be unavailable in private browsing */
      }
    }
  };

  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- toast ---------- */
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  }

  /* ---------- scroll progress, header and back-to-top ---------- */
  const siteHeader = $('#siteHeader');
  const scrollBar = $('#scrollBar');
  const toTop = $('#toTop');

  const onScroll = () => {
    const top = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (top / max) * 100 : 0;

    if (scrollBar) scrollBar.style.width = `${progress}%`;
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', top > 10);
    if (toTop) toTop.classList.toggle('show', top > 620);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
  onScroll();

  /* ---------- mobile navigation ---------- */
  const navToggle = $('#navToggle');
  const primaryNav = $('#primaryNav');

  const setNav = (open) => {
    if (!navToggle || !primaryNav) return;

    primaryNav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', open);

    if (open) {
      const firstLink = primaryNav.querySelector('a');
      if (firstLink) {
        window.setTimeout(() => firstLink.focus({ preventScroll: true }), 60);
      }
    }
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      setNav(!primaryNav.classList.contains('is-open'));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNav(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setNav(false);
    });

    document.addEventListener('click', (event) => {
      if (!primaryNav.classList.contains('is-open')) return;
      if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) {
        setNav(false);
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 981px)');
    const handleDesktop = (event) => {
      if (event.matches) setNav(false);
    };

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', handleDesktop);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(handleDesktop);
    }
  }

  /* ---------- active navigation link ---------- */
  const navLinks = $$('#primaryNav a[href^="#"]');
  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window && navLinks.length) {
    const linkMap = new Map(
      navLinks.map((link) => [link.getAttribute('href').slice(1), link])
    );

    const setActiveLink = (id) => {
      const current = linkMap.get(id);
      navLinks.forEach((link) => {
        const isCurrent = link === current;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach((section) => linkObserver.observe(section));
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');

  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 60}ms`);
      revealObserver.observe(element);
    });
  } else {
    revealEls.forEach((element) => element.classList.add('is-visible'));
  }

  /* ---------- copy email ---------- */
  const copyButtons = $$('[data-copy]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy') || '';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const helper = document.createElement('textarea');
          helper.value = value;
          helper.setAttribute('readonly', '');
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.appendChild(helper);
          helper.select();
          document.execCommand('copy');
          helper.remove();
        }
        showToast('Email copied to clipboard');
      } catch (error) {
        showToast('Could not copy. Please select the email manually.');
      }
    });
  });

  /* ---------- contact form (mailto) ---------- */
  const contactForm = $('#contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = $('#name');
      const email = $('#email');
      const subject = $('#subject');
      const message = $('#message');
      let valid = true;

      const markField = (field, invalid) => {
        if (!field) return;
        const wrapper = field.closest('.field');
        if (wrapper) wrapper.classList.toggle('invalid', invalid);
        if (invalid && valid) {
          field.focus();
          valid = false;
        }
      };

      markField(name, !name.value.trim());
      markField(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      markField(message, !message.value.trim());

      if (!valid) {
        showToast('Please add your name, a valid email and a message.');
        return;
      }

      const subjectText = subject && subject.value.trim()
        ? subject.value.trim()
        : `Portfolio enquiry from ${name.value.trim()}`;

      const body = [
        `Name: ${name.value.trim()}`,
        `Email: ${email.value.trim()}`,
        '',
        message.value.trim()
      ].join('\n');

      window.location.href = `mailto:maddheshiyap181@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(body)}`;
      showToast('Opening your email app');
      contactForm.reset();
    });

    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.field');
        if (wrapper) wrapper.classList.remove('invalid');
      });
    });
  }

  /* ---------- GitHub repositories ---------- */
  const repoList = $('#githubRepos');
  const repoStatus = $('#repoStatus');
  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    Shell: '#89e051'
  };

  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const formatDate = (value) => {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
    } catch (error) {
      return 'Recently';
    }
  };

  const loadRepos = async () => {
    if (!repoList || !repoStatus) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(
        'https://api.github.com/users/pankaj425/repos?per_page=100&sort=updated',
        {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal
        }
      );

      if (!response.ok) throw new Error('GitHub request failed');

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected GitHub response');

      const repos = data
        .filter((repo) => !repo.fork && repo.name !== 'portfolio')
        .slice(0, 4);

      if (!repos.length) throw new Error('No repositories found');

      repoList.innerHTML = repos.map((repo) => {
        const language = repo.language || 'Code';
        const color = languageColors[language] || '#94a3b8';
        const description = repo.description
          ? escapeHtml(repo.description)
          : 'No description provided.';

        return `
          <a class="repo-item" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
            <span class="repo-top">
              <span class="repo-name">${escapeHtml(repo.name)}</span>
              <span class="repo-lang"><span class="lang-dot" style="--lang:${color}"></span>${escapeHtml(language)}</span>
            </span>
            <span class="repo-desc">${description}</span>
            <span class="repo-meta">Updated ${formatDate(repo.updated_at)}</span>
          </a>
        `;
      }).join('');

      repoStatus.textContent = 'Live from GitHub';
      repoStatus.className = 'repo-status is-live';
    } catch (error) {
      repoStatus.textContent = 'Showing featured repositories';
      repoStatus.className = 'repo-status is-fallback';
    } finally {
      window.clearTimeout(timeout);
    }
  };

  loadRepos();
})();
