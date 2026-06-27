/* ═══════════════════════════════════════════════════════════════════════════════
   Theme Manager - Light/Dark Mode Controller
   ═══════════════════════════════════════════════════════════════════════════════ */

export class ThemeManager {
  constructor() {
    this.toggleBtn = document.getElementById('theme-toggle');
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    // Set initial theme attribute
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}
