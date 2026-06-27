/* ═══════════════════════════════════════════════════════════════════════════════
   Main Entry Point - Initializer for all components and scroll animations
   ═══════════════════════════════════════════════════════════════════════════════ */

import { Navbar } from './components/Navbar.js';
import { BentoGrid } from './components/BentoGrid.js';
import { Matchmaker } from './components/Matchmaker.js';
import { DiagnosticsScanner } from './components/DiagnosticsScanner.js';
import { ContactForm } from './components/ContactForm.js';
import { Showcase } from './components/Showcase.js';
import { MagnetEffect } from './components/MagnetEffect.js';
import { runTextScramble } from './components/TextScramble.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Components
  const navbar = new Navbar();
  const bento = new BentoGrid();
  const matchmaker = new Matchmaker();
  const scanner = new DiagnosticsScanner();
  const contactForm = new ContactForm();
  const showcase = new Showcase();
  const magnet = new MagnetEffect();

  // Trigger text scramble on load
  const scrambleTarget = document.getElementById('scramble-word');
  if (scrambleTarget) {
    runTextScramble(scrambleTarget, 1500);
  }

  // 2. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Stats Counter Animation (About Section)
  const animateStats = () => {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
      const val = parseInt(stat.getAttribute('data-val'));
      let count = 0;
      const speed = Math.ceil(val / 30) || 1;
      const interval = setInterval(() => {
        count += speed;
        if (count >= val) {
          stat.innerText = val;
          clearInterval(interval);
        } else {
          stat.innerText = count;
        }
      }, 40);
    });
  };

  // 4. Viewport Intersection Observer for Stats
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 4b. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Parallax Scroll Effect on Glow Blobs
  window.addEventListener('scroll', () => {
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    const scrollY = window.scrollY;
    
    if (glow1) {
      glow1.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
    if (glow2) {
      glow2.style.transform = `translateY(${-scrollY * 0.1}px)`;
    }
  });

  // 6. Global Mouse Tracker for Ambient Light Spotlight
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
});
