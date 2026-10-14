import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initTrionnInteractions() {
  // 1. Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Keep ScrollTrigger in sync with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: 0 });
      }
    });
  });

  // 2. Magnetic Buttons
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;
      
      const strength = 0.4; 
      
      gsap.to(magnet, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    magnet.addEventListener('mouseleave', () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // 3. Scroll Reveals (Text & Elements)
  const reveals = document.querySelectorAll('.reveal-text, .reveal-fade');
  reveals.forEach(reveal => {
    gsap.fromTo(reveal, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reveal,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

}
