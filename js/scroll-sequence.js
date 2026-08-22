/* ==========================================
   DEZINE - SCROLL-DRIVEN VIDEO FRAME ENGINE
   (Optimized for Netlify & High-Performance CDN)
   ========================================== */

export class ScrollSequenceEngine {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'scroll-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.container = document.querySelector(options.containerSelector || '.scroll-sequence-container');
    this.requestedFrameCount = options.frameCount || 99;
    this.frameCount = this.requestedFrameCount;
    
    // Map of loaded HTMLImageElements keyed by 0-indexed frame integer
    this.loadedFrames = new Map();
    this.targetFrame = 0;
    this.currentFrame = 0;
    this.isUsingProceduralFallback = false;
    this.lastValidImg = null;
    this.workingBaseUrl = '/frames/';
    
    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.renderCurrentFrame();
  }

  /**
   * Resolves valid base URL across local dev, Netlify, sub-routes, and CDN hosts
   */
  async findWorkingFrameBaseUrl(initialBaseUrl = '/frames/') {
    const candidatePaths = [
      initialBaseUrl,
      './frames/',
      'frames/',
      `${window.location.origin}/frames/`,
      '/public/frames/'
    ];

    for (const path of candidatePaths) {
      const normalizedPath = path.endsWith('/') ? path : `${path}/`;
      const loaded = await new Promise((resolve) => {
        const testImg = new Image();
        testImg.onload = () => resolve(true);
        testImg.onerror = () => resolve(false);
        testImg.src = `${normalizedPath}frame_0001.png?v=${Date.now()}`;
      });

      if (loaded) {
        return normalizedPath;
      }
    }

    return initialBaseUrl.endsWith('/') ? initialBaseUrl : `${initialBaseUrl}/`;
  }

  /**
   * High-Performance Queued & Keyframe-First Preloader
   */
  async loadFrames(frameBaseUrl = '/frames/') {
    const preloaderBar = document.querySelector('.loader-bar-fill');
    const preloaderStatus = document.getElementById('preloader-status');

    this.workingBaseUrl = await this.findWorkingFrameBaseUrl(frameBaseUrl);

    // 1. Immediately load Frame 1 and render it on canvas
    const firstImg = await this.loadImageSingle(0);
    if (firstImg) {
      this.loadedFrames.set(0, firstImg);
      this.lastValidImg = firstImg;
      this.renderCurrentFrame();
    }

    // Start animation loop immediately
    this.startAnimationLoop();

    // 2. Build prioritized loading list: Keyframes (every 5th frame) first, then fill rest
    const keyframeIndices = [];
    const restIndices = [];

    for (let i = 0; i < this.requestedFrameCount; i++) {
      if (i === 0) continue; // already loaded
      if (i % 5 === 0 || i === this.requestedFrameCount - 1) {
        keyframeIndices.push(i);
      } else {
        restIndices.push(i);
      }
    }

    const loadQueue = [...keyframeIndices, ...restIndices];
    let loadedCount = firstImg ? 1 : 0;
    const totalToLoad = this.requestedFrameCount;

    // Concurrent request queue (max 6 parallel downloads to prevent CDN throttling)
    const CONCURRENCY_LIMIT = 6;
    let queueIndex = 0;

    const worker = async () => {
      while (queueIndex < loadQueue.length) {
        const frameIdx = loadQueue[queueIndex++];
        const img = await this.loadImageSingle(frameIdx);
        if (img) {
          this.loadedFrames.set(frameIdx, img);
          if (!this.lastValidImg) this.lastValidImg = img;
        }
        loadedCount++;

        // Update preloader UI
        const percent = Math.floor((loadedCount / totalToLoad) * 100);
        if (preloaderBar) preloaderBar.style.width = `${percent}%`;
        if (preloaderStatus) preloaderStatus.textContent = `Loading sequence ${percent}% (${loadedCount}/${totalToLoad})...`;
      }
    };

    // Spawn concurrent workers
    const workers = [];
    for (let c = 0; c < CONCURRENCY_LIMIT; c++) {
      workers.push(worker());
    }

    await Promise.all(workers);

    if (this.loadedFrames.size < 3) {
      console.warn('Frames could not be fetched from CDN. Activating procedural 3D canvas fallback.');
      this.isUsingProceduralFallback = true;
    } else {
      this.isUsingProceduralFallback = false;
    }

    // Dismiss preloader smoothly
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hidden');
    }, 400);
  }

  loadImageSingle(index) {
    const paddedIndex = String(index + 1).padStart(4, '0');
    const src = `${this.workingBaseUrl}frame_${paddedIndex}.png`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
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

    // Show navbar as scroll sequence reaches 85%
    const navbar = document.getElementById('navbar');
    if (progress >= 0.85) {
      if (navbar) navbar.classList.add('visible');
    } else {
      if (navbar) navbar.classList.remove('visible');
    }
  }

  startAnimationLoop() {
    const loop = () => {
      // Lerp smooth frame position
      this.currentFrame += (this.targetFrame - this.currentFrame) * 0.14;
      this.renderCurrentFrame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  renderCurrentFrame() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.isUsingProceduralFallback) {
      this.renderProceduralCanvasFrame(this.currentFrame);
      return;
    }

    const targetIdx = Math.min(
      this.requestedFrameCount - 1,
      Math.max(0, Math.round(this.currentFrame))
    );

    let img = this.loadedFrames.get(targetIdx);

    // If target frame is still downloading, find closest loaded frame in memory
    if (!img) {
      for (let offset = 1; offset < this.requestedFrameCount; offset++) {
        const prev = this.loadedFrames.get(targetIdx - offset);
        if (prev) {
          img = prev;
          break;
        }
        const next = this.loadedFrames.get(targetIdx + offset);
        if (next) {
          img = next;
          break;
        }
      }
    }

    if (img) {
      this.drawCoverImage(img);
      this.lastValidImg = img;
    } else if (this.lastValidImg) {
      this.drawCoverImage(this.lastValidImg);
    }
  }

  drawCoverImage(img) {
    if (!img || !img.naturalWidth) return;

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

