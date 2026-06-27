/* ═══════════════════════════════════════════════════════════════════════════════
   Showcase Component - Manages tab switching for interactive phone mockups
   ═══════════════════════════════════════════════════════════════════════════════ */

export class Showcase {
  constructor() {
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.screenImg = document.getElementById('showcase-screen-img');
    
    // Screens map matching tab data-target index
    this.screens = [
      '/Welcome Screen.png',
      '/Intro Slide 1 Screen.png',
      '/Intro Slide 2 Screen.png'
    ];

    this.init();
  }

  init() {
    if (!this.screenImg) return;

    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-target'));
        this.switchScreen(index, btn);
      });
    });
  }

  switchScreen(index, activeBtn) {
    if (index < 0 || index >= this.screens.length) return;
    
    // Remove active from all buttons
    this.tabBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    // Smooth transition
    this.screenImg.style.opacity = '0';
    this.screenImg.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      this.screenImg.src = this.screens[index];
      this.screenImg.style.opacity = '1';
      this.screenImg.style.transform = 'scale(1)';
    }, 200);
  }
}
