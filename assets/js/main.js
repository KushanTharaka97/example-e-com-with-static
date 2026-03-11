// ============================================================
// GOLD LANKA — Main JS
// ============================================================

/* ---- Wishlist ---- */
window.Wishlist = {
  items: JSON.parse(localStorage.getItem('wishlist')) || [],

  add(id) {
    if (!this.items.includes(id)) {
      this.items.push(id);
      this.save();
    }
  },

  remove(id) {
    this.items = this.items.filter(i => i !== id);
    this.save();
  },

  toggle(id) {
    if (this.items.includes(id)) {
      this.remove(id);
      UI.showToast('Removed from Wishlist');
      return false;
    } else {
      this.add(id);
      UI.showToast('Added to Wishlist ✦');
      return true;
    }
  },

  has(id) {
    return this.items.includes(id);
  },

  save() {
    localStorage.setItem('wishlist', JSON.stringify(this.items));
    this.updateUI();
  },

  updateUI() {
    const count = document.getElementById('wishlist-count');
    if (count) count.textContent = this.items.length;

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (this.has(id)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
        btn.innerHTML = '❤️';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to wishlist');
        btn.innerHTML = '🤍';
      }
    });
  }
};

/* ---- UI Utilities ---- */
window.UI = {
  _toastTimer: null,

  showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(UI._toastTimer);
    UI._toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }
};

/* ---- i18n ---- */
window.I18n = {
  lang: localStorage.getItem('lang') || 'en',

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    location.reload();
  },

  init() {
    document.documentElement.lang = this.lang;
    const selector = document.getElementById('lang-selector');
    if (selector) selector.value = this.lang;
  }
};

/* ---- Format Currency ---- */
window.formatCurrency = (amount) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);

/* ---- Header Scroll Elevation ---- */
function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const open  = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () =>
    nav.classList.contains('is-open') ? close() : open()
  );

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', close)
  );

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
  Wishlist.updateUI();
  initScrollHeader();
  initMobileMenu();

  const langSelector = document.getElementById('lang-selector');
  if (langSelector) {
    langSelector.addEventListener('change', e => I18n.setLang(e.target.value));
  }
});
