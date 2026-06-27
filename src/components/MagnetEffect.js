/* ═══════════════════════════════════════════════════════════════════════════════
   MagnetEffect Component - Handles high-tech mouse attraction on buttons
   ═══════════════════════════════════════════════════════════════════════════════ */

export class MagnetEffect {
  constructor() {
    this.buttons = document.querySelectorAll('.magnet-btn');
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
      btn.addEventListener('mouseleave', () => this.handleMouseLeave(btn));
    });
  }

  handleMouseMove(e, btn) {
    const rect = btn.getBoundingClientRect();
    // Calculate cursor distance from center of the button
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Move the button slightly towards cursor coordinates
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.28}px) scale(1.02)`;
    btn.style.boxShadow = `0 10px 25px rgba(102, 126, 234, 0.25), 0 0 15px rgba(102, 126, 234, 0.1)`;
  }

  handleMouseLeave(btn) {
    btn.style.transform = 'translate(0px, 0px) scale(1)';
    btn.style.boxShadow = '';
  }
}
