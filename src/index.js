import '@fontsource/iceland';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import './styles.css';

const THEME_KEY = 'theprocess-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist = false) {
  document.documentElement.setAttribute('data-theme', theme);
  if (persist) localStorage.setItem(THEME_KEY, theme);
  updateThemeToggleIcon(theme);
}

function updateThemeToggleIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const sun = btn.querySelector('.icon-sun');
  const moon = btn.querySelector('.icon-moon');
  if (theme === 'dark') {
    sun.style.display = 'block';
    moon.style.display = 'none';
    btn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    sun.style.display = 'none';
    moon.style.display = 'block';
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

function initTheme() {
  const theme = getPreferredTheme();
  // Don't persist on initial load — only a manual toggle should override OS preference
  applyTheme(theme, false);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Keep in sync if user changes OS preference while page is open (no manual override)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}

function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

function initNavShadow() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', handler, { passive: true });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initNavShadow();
  initScrollAnimations();
});
