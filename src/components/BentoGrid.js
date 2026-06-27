/* ═══════════════════════════════════════════════════════════════════════════════
   BentoGrid Component - Handles 3D parallax tilt & hover glows on grid cards
   ═══════════════════════════════════════════════════════════════════════════════ */

export class BentoGrid {
  constructor() {
    this.cards = document.querySelectorAll('.bento-card, .tilt-element');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      // Create relative glow element if not present
      let glow = card.querySelector('.card-glow');
      if (!glow) {
        glow = document.createElement('div');
        glow.className = 'card-glow';
        card.appendChild(glow);
      }

      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card, glow));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card, glow));
    });
  }

  handleMouseMove(e, card, glow) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside element
    const y = e.clientY - rect.top;  // y coordinate inside element
    
    // Set glow coordinates
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    glow.style.opacity = '1';
    
    // Calculate tilt values (-10deg to 10deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 5; // max tilt 5 degrees
    const rotateY = ((x - centerX) / centerX) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  handleMouseLeave(card, glow) {
    glow.style.opacity = '0';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }
}
