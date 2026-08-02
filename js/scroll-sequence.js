/* ==========================================
   DEZINE - SCROLL-DRIVEN VIDEO FRAME ENGINE
   ========================================== */

export class ScrollSequenceEngine {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'scroll-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container = document.querySelector(options.containerSelector || '.scroll-sequence-container');
    this.frameCount = options.frameCount || 120;
    
    this.images = [];
    this.loadedFrames = 0;
    this.targetFrame = 0;
    this.currentFrame = 0;
    this.isUsingProceduralFallback = false;
    
    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.renderCurrentFrame();
  }

  async loadFrames(frameBaseUrl = '/frames/') {
    const preloaderBar = document.querySelector('.loader-bar-fill');
    const preloaderStatus = document.getElementById('preloader-status');

    let loadedCount = 0;
    const loadPromises = [];

    // Try loading frames from directory
    for (let i = 1; i <= this.frameCount; i++) {
      const paddedIndex = String(i).padStart(4, '0');
      const img = new Image();
      
      const promise = new Promise((resolve) => {
        img.onload = () => {
          loadedCount++;
          if (preloaderBar) preloaderBar.style.width = `${(loadedCount / this.frameCount) * 100}%`;
          if (preloaderStatus) preloaderStatus.textContent = `Loading frame ${loadedCount}/${this.frameCount}...`;
          resolve(img);
        };
        img.onerror = () => {
          // Frame not found
          resolve(null);
        };
        img.src = `${frameBaseUrl}frame_${paddedIndex}.png`;
      });
      
      loadPromises.push(promise);
      this.images.push(img);
    }

    const results = await Promise.all(loadPromises);
    const validImages = results.filter(img => img !== null);

    if (validImages.length < 5) {
      console.warn('Frames not detected in public/frames/. Initializing 3D Procedural Canvas Engine fallback.');
      this.isUsingProceduralFallback = true;
      if (preloaderBar) preloaderBar.style.width = '100%';
    } else {
      this.isUsingProceduralFallback = false;
      this.frameCount = validImages.length;
    }

    // Hide preloader after brief moment
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hidden');
    }, 600);

    this.startAnimationLoop();
  }

  loadFramesFromFiles(fileList) {
    const sortedFiles = Array.from(fileList).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    if (sortedFiles.length === 0) return;

    this.images = [];
    this.frameCount = sortedFiles.length;
    this.isUsingProceduralFallback = false;

    sortedFiles.forEach((file, index) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      this.images[index] = img;
    });

    console.log(`Loaded ${this.frameCount} custom frames from user upload.`);
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  onScroll() {
    if (!this.container) return;

    const containerRect = this.container.getBoundingClientRect();
    const scrollDistance = this.container.offsetHeight - window.innerHeight;
    const currentScroll = Math.max(0, -containerRect.top);

    const progress = Math.min(1, Math.max(0, currentScroll / scrollDistance));
    this.targetFrame = progress * (this.frameCount - 1);

    // Show navbar and toolbar as scroll sequence reaches 85%
    const navbar = document.getElementById('navbar');
    const toolbar = document.querySelector('.zip-uploader-toolbar');
    if (progress >= 0.85) {
      if (navbar) navbar.classList.add('visible');
      if (toolbar) toolbar.classList.add('visible');
    } else {
      if (navbar) navbar.classList.remove('visible');
      if (toolbar) toolbar.classList.remove('visible');
    }
  }

  startAnimationLoop() {
    const loop = () => {
      // Smooth frame interpolation (lerp)
      this.currentFrame += (this.targetFrame - this.currentFrame) * 0.12;
      this.renderCurrentFrame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  renderCurrentFrame() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.isUsingProceduralFallback) {
      this.renderProceduralCanvasFrame(this.currentFrame);
      return;
    }

    const frameIndex = Math.round(this.currentFrame);
    const img = this.images[frameIndex];

    if (img && img.complete && img.naturalWidth > 0) {
      this.drawCoverImage(img);
    } else {
      this.renderProceduralCanvasFrame(this.currentFrame);
    }
  }

  drawCoverImage(img) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = this.width / this.height;
    
    let drawWidth, drawHeight, x, y;

    if (canvasRatio > imgRatio) {
      drawWidth = this.width;
      drawHeight = this.width / imgRatio;
      x = 0;
      y = (this.height - drawHeight) / 2;
    } else {
      drawWidth = this.height * imgRatio;
      drawHeight = this.height;
      x = (this.width - drawWidth) / 2;
      y = 0;
    }

    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  /* Procedural 3D Motion Frame Fallback */
  renderProceduralCanvasFrame(frameVal) {
    const time = frameVal * 0.08;
    
    // Deep dark background
    const bgGradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 50,
      this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );
    bgGradient.addColorStop(0, '#0f1424');
    bgGradient.addColorStop(0.5, '#0a0c14');
    bgGradient.addColorStop(1, '#06070a');

    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Glowing organic waves & grid particles
    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);

    const numPoints = 80;
    const radius = Math.min(this.width, this.height) * 0.3;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 + time * 0.2;
      const wave = Math.sin(angle * 4 + time) * 30 + Math.cos(angle * 2 - time * 0.5) * 20;
      const currentRadius = radius + wave;

      const px = Math.cos(angle) * currentRadius;
      const py = Math.sin(angle) * currentRadius;

      const glow = this.ctx.createRadialGradient(px, py, 2, px, py, 25);
      const isViolet = i % 2 === 0;
      glow.addColorStop(0, isViolet ? 'rgba(138, 43, 226, 0.8)' : 'rgba(0, 245, 212, 0.8)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 25, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }
}
