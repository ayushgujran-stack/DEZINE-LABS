/* ==========================================
   DEZINE - PORTFOLIO SHOWCASE & MODAL MODULE
   ========================================== */

const PORTFOLIO_DATA = [
  {
    id: 1,
    category: 'branding',
    title: 'Aetheria Brand System',
    client: 'Aetheria Labs Inc.',
    year: '2026',
    desc: 'Complete high-end luxury brand identity, 3D visual system, and packaging for next-gen biotech wearable.',
    tags: ['Visual Identity', '3D Motion', 'Brand Strategy'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    category: 'web',
    title: 'VORTEX Cyber Dashboard',
    client: 'Vortex Capital',
    year: '2026',
    desc: 'Real-time financial analytics dashboard built with webGL dynamic shaders, ultra-responsive grid, and glassmorphism styling.',
    tags: ['Web Design', 'UI/UX', 'WebGL Shaders'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    category: 'motion',
    title: 'Kinetic Fluid Mechanics',
    client: 'Solana Ecosystem',
    year: '2025',
    desc: 'Abstract 3D fluid motion graphics reel created for annual keynote broadcast, featuring spatial audio visualizer.',
    tags: ['3D Motion Design', 'Cinema 4D', 'Spatial Audio'],
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    category: 'ecommerce',
    title: 'NEO-LUXE Fashion House',
    client: 'Maison Neo',
    year: '2026',
    desc: 'Immersive 3D interactive e-commerce store with real-time product customization engine and headless Shopify architecture.',
    tags: ['E-Commerce', 'Three.js Product Viewer', 'Headless Web'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 5,
    category: 'branding',
    title: 'Hyperion Aerospace Brand',
    client: 'Hyperion Tech',
    year: '2025',
    desc: 'Brand positioning, typography design, and launch campaign for private space tourism vehicle.',
    tags: ['Branding', 'Campaign Strategy', 'Typography'],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 6,
    category: 'web',
    title: 'Quantum Intelligence Web Engine',
    client: 'Q-Bits AI',
    year: '2026',
    desc: 'Interactive AI web experience built with custom canvas animations, dark mode aesthetic, and reactive layout.',
    tags: ['AI Interface', 'Frontend Dev', 'Animation'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80'
  }
];

export class PortfolioModule {
  constructor() {
    this.container = document.getElementById('portfolio-grid');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.modal = document.getElementById('portfolio-modal');
    this.modalContent = document.getElementById('modal-body');
    this.closeBtn = document.querySelector('.modal-close');

    this.init();
  }

  init() {
    this.renderItems('all');
    this.bindEvents();
  }

  renderItems(filter) {
    if (!this.container) return;

    const filtered = filter === 'all' 
      ? PORTFOLIO_DATA 
      : PORTFOLIO_DATA.filter(item => item.category === filter);

    this.container.innerHTML = filtered.map(item => `
      <div class="portfolio-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="portfolio-overlay">
          <div class="portfolio-cat">${item.category} • ${item.year}</div>
          <h3 class="portfolio-title">${item.title}</h3>
        </div>
      </div>
    `).join('');

    // Rebind card click handlers
    this.container.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id, 10);
        this.openModal(id);
      });
    });
  }

  bindEvents() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        this.renderItems(filter);
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
  }

  openModal(id) {
    const project = PORTFOLIO_DATA.find(p => p.id === id);
    if (!project || !this.modalContent) return;

    this.modalContent.innerHTML = `
      <div class="glass-card" style="padding: 2.5rem;">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 350px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-glass);" />
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <span class="glass-pill" style="margin-bottom: 0.5rem;">${project.category.toUpperCase()} CASE STUDY</span>
            <h2 style="font-size: 2.2rem; margin-top: 0.5rem;">${project.title}</h2>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--accent-cyan); font-weight: 700;">Client: ${project.client}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">Year: ${project.year}</div>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">
          ${project.desc}
        </p>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;">
          ${project.tags.map(t => `<span class="service-tag">${t}</span>`).join('')}
        </div>

        <a href="#contact" class="btn btn-primary" onclick="document.getElementById('portfolio-modal').classList.remove('open')">
          Request Similar Project <i class="fas me-arrow-right"></i>
        </a>
      </div>
    `;

    this.modal.classList.add('open');
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove('open');
  }
}
