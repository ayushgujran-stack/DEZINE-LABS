/* ==========================================
   DEZINE - CONTACT BRIEF FORM HANDLER
   ========================================== */

export class FormHandlerModule {
  constructor() {
    this.form = document.getElementById('agency-brief-form');
    this.statusContainer = document.getElementById('form-status');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const briefInput = document.getElementById('client-brief');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !briefInput.value.trim()) {
      this.showStatus('Please fill out all required fields.', 'error');
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      this.showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Simulated submission
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending Brief <i class="fas fa-spinner fa-spin"></i>`;
    }

    setTimeout(() => {
      this.showStatus('⚡ Brief Received! Our creative leads will respond within 24 hours.', 'success');
      this.form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Submit Project Brief <i class="fas fa-paper-plane"></i>`;
      }
    }, 1200);
  }

  showStatus(msg, type) {
    if (!this.statusContainer) return;

    this.statusContainer.style.display = 'block';
    this.statusContainer.style.padding = '1rem';
    this.statusContainer.style.borderRadius = 'var(--radius-md)';
    this.statusContainer.style.marginTop = '1rem';
    this.statusContainer.style.fontWeight = '600';

    if (type === 'error') {
      this.statusContainer.style.background = 'rgba(255, 0, 127, 0.15)';
      this.statusContainer.style.border = '1px solid var(--accent-pink)';
      this.statusContainer.style.color = '#ff80bf';
    } else {
      this.statusContainer.style.background = 'rgba(0, 245, 212, 0.15)';
      this.statusContainer.style.border = '1px solid var(--accent-cyan)';
      this.statusContainer.style.color = '#80fff2';
    }

    this.statusContainer.textContent = msg;
  }
}
