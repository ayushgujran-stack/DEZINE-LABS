/* ==========================================
   DEZINE CREATIVE AGENCY - MAIN SCRIPT
   ========================================== */

import { ScrollSequenceEngine } from './scroll-sequence.js';
import { PortfolioModule } from './portfolio.js';
import { EstimatorModule } from './estimator.js';
import { FormHandlerModule } from './form-handler.js';
import { initTrionnInteractions } from './trionn-interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing DEZINE Creative Agency Engine...');

  // Initialize Scroll Sequence Engine
  const sequenceEngine = new ScrollSequenceEngine({
    canvasId: 'scroll-canvas',
    containerSelector: '.scroll-sequence-container',
    frameCount: 99
  });

  sequenceEngine.loadFrames('/frames/');

  // Initialize Portfolio Module
  new PortfolioModule();

  // Initialize Estimator Module
  new EstimatorModule();

  // Initialize Form Handler
  new FormHandlerModule();

  // Initialize Custom Circular Cursor Logic
  initCustomCursor();

  // Initialize Scroll Action Indicator Pill Button
  initScrollIndicator();

  // Initialize Trionn Interactions (Lenis, Magnetic, Scroll Reveals)
  initTrionnInteractions();

  // Smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

/**
 * Scroll Action Indicator Pill Controller
 */
function initScrollIndicator() {
  const btn = document.getElementById('scroll-indicator-btn');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      btn.classList.add('scrolled-hidden');
    } else {
      btn.classList.remove('scrolled-hidden');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  });
}

/**
 * Custom Inverted Circular Cursor Controller
 */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isMoving) {
      isMoving = true;
      ringX = mouseX;
      ringY = mouseY;
    }
  });

  function render() {
    // Lerp smooth follow for the ring
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Detect buttons and interactive elements
  const isButtonElement = (el) => {
    if (!el || el === document || el === document.body) return false;
    return !!el.closest('button, .btn, a, input[type="submit"], input[type="button"], .chip-btn, .filter-btn, [role="button"], label, .portfolio-card, .modal-close');
  };

  document.addEventListener('mouseover', (e) => {
    if (isButtonElement(e.target)) {
      dot.classList.add('hover-active');
      ring.classList.add('hover-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (isButtonElement(e.target)) {
      dot.classList.remove('hover-active');
      ring.classList.remove('hover-active');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
