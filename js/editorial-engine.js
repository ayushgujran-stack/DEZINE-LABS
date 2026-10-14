/* ==========================================================================
   MIKE WILCOCK DESIGN ENGINE FOR DEZINE LABS
   - Interactive Cursor (dot + dynamic text ring)
   - Header & Fullscreen Menu
   - Selected Work Docked Preview
   - Horizontal Up-Close strip dragging
   - Pinned Statement Word Illumination
   - Smooth anchor scrolling & Back to Top
   ========================================================================== */

export function initEditorialInteractions() {
  initCustomCursor();
  initNavigation();
  initSelectedWorkDock();
  initHorizontalScroll();
  initStatementScrollReveal();
  initBackToTop();
}

/**
 * Custom Editorial Cursor (dot + ring with data-cursor text)
 */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const ringText = ring ? ring.querySelector('span') : null;
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let activeCursorText = '';

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Attach hover triggers with cursor cues (delegated for dynamic elements)
  document.addEventListener('mouseover', (e) => {
    const target = e.target && e.target.closest ? e.target.closest('[data-cursor]') : null;
    if (target) {
      activeCursorText = target.getAttribute('data-cursor') || 'View';
      if (ringText) ringText.textContent = activeCursorText;
      ring.classList.add('active');
      dot.style.transform = 'translate(-50%, -50%) scale(0.2)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target && e.target.closest ? e.target.closest('[data-cursor]') : null;
    if (target) {
      const related = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('[data-cursor]') : null;
      if (!related) {
        ring.classList.remove('active');
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    }
  });
}

/**
 * Mobile / Curtain Menu
 */
function initNavigation() {
  const menuBtn = document.querySelector('.mw-header__menu-btn');
  const menu = document.querySelector('.mw-menu');
  const menuLinks = document.querySelectorAll('.mw-menu__item');

  if (!menuBtn || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu ☰';
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    menu.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.textContent = 'Close ✕';
    document.body.style.overflow = 'hidden';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Selected Work Docked Preview Switching on Hover
 */
function initSelectedWorkDock() {
  const rows = document.querySelectorAll('.mw-selected-work__row');
  const previewImg = document.querySelector('.mw-selected-work__preview-img');
  const previewTitle = document.querySelector('.mw-selected-work__preview-title');
  const previewDesc = document.querySelector('.mw-selected-work__preview-desc');

  if (!rows.length || !previewImg) return;

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');

      const imgUrl = row.getAttribute('data-img');
      const title = row.getAttribute('data-title');
      const desc = row.getAttribute('data-desc');

      if (imgUrl && previewImg) {
        previewImg.style.opacity = '0.3';
        previewImg.style.transform = 'scale(1.04)';
        setTimeout(() => {
          previewImg.src = imgUrl;
          previewImg.style.opacity = '1';
          previewImg.style.transform = 'scale(1)';
        }, 150);
      }
      if (title && previewTitle) previewTitle.textContent = title;
      if (desc && previewDesc) previewDesc.textContent = desc;
    });
  });
}

/**
 * Horizontal Up-Close strip dragging
 */
function initHorizontalScroll() {
  const track = document.querySelector('.mw-upclose__track');
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.8;
    track.scrollLeft = scrollLeft - walk;
  });
}

/**
 * Statement Scroll Word Illumination
 */
function initStatementScrollReveal() {
  const statement = document.querySelector('.mw-statement');
  const words = document.querySelectorAll('.mw-statement__word');
  if (!statement || !words.length) return;

  const handleScroll = () => {
    const rect = statement.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Calculate how far into the statement we've scrolled (0 -> 1)
    const start = windowH * 0.8;
    const end = -rect.height * 0.3;
    const current = start - rect.top;
    const total = start - end;
    const progress = Math.max(0, Math.min(1, current / total));

    const totalWords = words.length;
    const wordsToLight = Math.floor(progress * totalWords * 1.3);

    words.forEach((w, index) => {
      if (index <= wordsToLight) {
        w.classList.add('lit');
      } else {
        w.classList.remove('lit');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Back to top smooth button
 */
function initBackToTop() {
  const btn = document.querySelector('.mw-footer__top-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
