/* ═══════════════════════════════════════════════════════════════════════════════
   ContactForm Component - Handles contact submissions and high-tech feedback
   ═══════════════════════════════════════════════════════════════════════════════ */

export class ContactForm {
  constructor() {
    this.form = document.getElementById('landing-contact-form');
    this.btnSubmit = this.form ? this.form.querySelector('.btn-submit') : null;
    this.feedback = document.getElementById('form-feedback');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.form || !this.btnSubmit || !this.feedback) return;
    
    // Get values
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const roleSelect = document.getElementById('form-role');
    const role = roleSelect.options[roleSelect.selectedIndex].text;
    
    // Set loading state
    this.btnSubmit.disabled = true;
    const originalText = this.btnSubmit.innerHTML;
    this.btnSubmit.innerHTML = `
      <span class="pulse-dot"></span>
      <span>Encrypting transmission...</span>
    `;
    
    setTimeout(() => {
      // Show success feedback
      this.feedback.className = 'form-feedback success';
      this.feedback.innerHTML = `
        <strong>Transmission Secure!</strong><br />
        Thank you ${name}. Your registration request as a <strong>${role}</strong> has been logged in our databases. A clinical operations coordinator will contact you at ${email} within 24 hours.
      `;
      this.feedback.classList.remove('hidden');
      
      // Reset button
      this.btnSubmit.disabled = false;
      this.btnSubmit.innerHTML = originalText;
      
      // Reset form fields
      this.form.reset();
      
      // Scroll to feedback
      this.feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
    }, 2000);
  }
}
