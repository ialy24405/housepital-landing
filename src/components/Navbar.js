/* ═══════════════════════════════════════════════════════════════════════════════
   Navbar Component - Handles floating header interaction & scroll progress
   ═══════════════════════════════════════════════════════════════════════════════ */

export class Navbar {
  constructor() {
    this.header = document.querySelector('.navbar-wrapper');
    this.nav = document.querySelector('.navbar');
    this.progress = document.querySelector('.scroll-progress');
    this.toggleBtn = document.querySelector('.mobile-menu-toggle');
    this.drawer = document.querySelector('.mobile-drawer');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    this.sections = document.querySelectorAll('section, header');

    this.isOpen = false;
    this.init();
  }

  init() {
    // Scroll Events
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateProgress();
      this.highlightActiveSection();
    });

    // Mobile Drawer Toggle
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile drawer on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.toggleMobileMenu();
      });
    });

    // Initial run
    this.handleScroll();
    this.updateProgress();
  }

  handleScroll() {
    if (!this.nav) return;
    if (window.scrollY > 20) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  updateProgress() {
    if (!this.progress) return;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressVal = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    this.progress.style.transform = `scaleX(${progressVal})`;
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.drawer.style.display = 'block';
      this.toggleBtn.innerHTML = '<i data-lucide="x"></i>';
    } else {
      this.drawer.style.display = 'none';
      this.toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
    }
    // Re-initialize Lucide icon inside button
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  highlightActiveSection() {
    let scrollPos = window.scrollY + 100;
    
    this.sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}
