/* ==========================================
   DEZINE - INTERACTIVE PROJECT COST ESTIMATOR
   ========================================== */

export class EstimatorModule {
  constructor() {
    this.priceDisplay = document.getElementById('estimated-price-display');
    this.summaryList = document.getElementById('estimator-summary-items');

    this.selectedServices = new Set(['web']);
    this.selectedTimeline = 4; // weeks
    this.selectedScale = 'growth';

    this.servicePrices = {
      branding: 3500,
      web: 4800,
      motion: 3200,
      ecommerce: 6500,
      strategy: 2500
    };

    this.scaleMultipliers = {
      startup: 0.85,
      growth: 1.0,
      enterprise: 1.6
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculatePrice();
  }

  bindEvents() {
    // Service chips
    document.querySelectorAll('[data-service-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.serviceChip;
        if (this.selectedServices.has(val)) {
          if (this.selectedServices.size > 1) {
            this.selectedServices.delete(val);
            chip.classList.remove('selected');
          }
        } else {
          this.selectedServices.add(val);
          chip.classList.add('selected');
        }
        this.calculatePrice();
      });
    });

    // Scale chips
    document.querySelectorAll('[data-scale-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-scale-chip]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.selectedScale = chip.dataset.scaleChip;
        this.calculatePrice();
      });
    });

    // Timeline slider
    const slider = document.getElementById('timeline-slider');
    const sliderValue = document.getElementById('timeline-slider-val');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.selectedTimeline = parseInt(e.target.value, 10);
        if (sliderValue) sliderValue.textContent = `${this.selectedTimeline} Weeks`;
        this.calculatePrice();
      });
    }
  }

  calculatePrice() {
    let base = 0;
    this.selectedServices.forEach(srv => {
      base += (this.servicePrices[srv] || 0);
    });

    const scaleMult = this.scaleMultipliers[this.selectedScale] || 1.0;
    
    // Timeline factor: Rush projects (< 3 weeks) cost slightly more
    let timelineFactor = 1.0;
    if (this.selectedTimeline <= 2) timelineFactor = 1.25;
    else if (this.selectedTimeline <= 4) timelineFactor = 1.1;

    const total = Math.round(base * scaleMult * timelineFactor);

    if (this.priceDisplay) {
      this.animatePriceDisplay(total);
    }

    if (this.summaryList) {
      const servicesArray = Array.from(this.selectedServices).map(s => s.toUpperCase());
      this.summaryList.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
          <span style="color:var(--text-muted);">Services:</span>
          <span style="color:var(--text-main); font-weight:600;">${servicesArray.join(', ')}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
          <span style="color:var(--text-muted);">Scale Level:</span>
          <span style="color:var(--accent-cyan); font-weight:600;">${this.selectedScale.toUpperCase()}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Target Timeline:</span>
          <span style="color:var(--text-main); font-weight:600;">${this.selectedTimeline} Weeks</span>
        </div>
      `;
    }
  }

  animatePriceDisplay(targetVal) {
    let currentVal = parseInt(this.priceDisplay.textContent.replace(/[^0-9]/g, '') || '0', 10);
    const duration = 400;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const val = Math.round(currentVal + (targetVal - currentVal) * progress);
      this.priceDisplay.textContent = `$${val.toLocaleString()}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }
}
