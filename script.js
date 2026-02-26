/* ============================================
   CONSILIUM AFRICA — JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     NAVBAR — scroll behavior
  ---------------------------------------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ----------------------------------------
     MOBILE NAV — hamburger toggle
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ----------------------------------------
     SCROLL REVEAL — Intersection Observer
  ---------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger children within same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------
     COUNTER ANIMATION — stats numbers
  ---------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats');
  let countersTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersTriggered) {
      countersTriggered = true;
      counters.forEach((el, i) => {
        setTimeout(() => animateCounter(el), i * 150);
      });
    }
  }, { threshold: 0.4 });

  if (statsSection) statsObserver.observe(statsSection);

  /* ----------------------------------------
     SMOOTH ACTIVE NAV LINK — scroll spy
  ---------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + sectionId) {
            a.style.color = '#fff';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ----------------------------------------
     CONTACT FORM — submission feedback
  ---------------------------------------- */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const originalContent = btn.innerHTML;

      // Loading state
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation: spin 0.9s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10"/>
        </svg>
        <span>Envoi en cours…</span>
      `;
      btn.disabled = true;

      // Simulate submission
      setTimeout(() => {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Message envoyé</span>
        `;
        btn.style.background = '#2d7d46';
        btn.style.borderColor = '#2d7d46';
        btn.style.color = '#fff';

        showToast('Votre demande a bien été reçue. Nous reviendrons vers vous sous 24h.');

        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalContent;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 3500);
      }, 1600);
    });
  }

  /* ----------------------------------------
     TOAST NOTIFICATION
  ---------------------------------------- */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  /* ----------------------------------------
     CSS: spinner keyframe injected
  ---------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------
     PARALLAX — subtle hero depth
  ---------------------------------------- */
  const heroGrid = document.querySelector('.hero-grid');

  if (heroGrid && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroGrid.style.transform = `translateY(${scrolled * 0.15}px)`;
    }, { passive: true });
  }

  /* ----------------------------------------
     CURSOR GLOW on service cards (desktop)
  ---------------------------------------- */
  const serviceCards = document.querySelectorAll('.service-card');

  if (window.innerWidth > 768) {
    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200,168,75,0.04) 0%, #fff 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }

})();
