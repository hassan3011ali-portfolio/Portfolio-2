// =========================================================
// HASSAN PORTFOLIO — shared site behavior
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== navToggle) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterIO.observe(el));
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.testimonial-controls');
  if (track) {
    const cards = track.children;
    const total = cards.length;
    const getPerView = () => {
      const w = window.innerWidth;
      if (w <= 720) return 1;
      if (w <= 1024) return 2;
      return 3;
    };
    let perView = getPerView();
    let index = 0;
    let maxIndex = Math.max(0, total - perView);
    let autoplayTimer;

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const dotCount = maxIndex + 1;
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', 'Show testimonial group ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
        dotsWrap.appendChild(dot);
      }
    };

    const update = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
      }
    };

    const goTo = (i) => {
      index = Math.max(0, Math.min(i, maxIndex));
      update();
    };

    const next = () => { index = index >= maxIndex ? 0 : index + 1; update(); };

    const restartAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, 5500);
    };

    window.addEventListener('resize', () => {
      perView = getPerView();
      maxIndex = Math.max(0, total - perView);
      index = Math.min(index, maxIndex);
      buildDots();
      update();
    });

    buildDots();
    update();
    restartAutoplay();
  }

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML;
  }

  /* ---------- Portfolio: filter tabs ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  const applyFilter = (filter) => {
    let visibleIndex = 0;
    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) {
        card.classList.remove('is-hidden', 'filtering-out');
        card.style.animationDelay = (visibleIndex * 0.08) + 's';
        card.classList.remove('filtering-in');
        // force reflow so the animation re-triggers every time
        void card.offsetWidth;
        card.classList.add('filtering-in');
        visibleIndex++;
      } else {
        card.classList.add('is-hidden');
      }
    });
  };

  if (filterTabs.length && projectCards.length) {
    let userChangedFilter = false;

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        userChangedFilter = true;
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        applyFilter(tab.dataset.filter);
      });
    });

    const initialTab = document.querySelector('.filter-tab.active') || filterTabs[0];
    const grid = document.querySelector('.project-grid');

    // Trigger the first staggered reveal only once the grid scrolls into view,
    // so cards animate in as the visitor scrolls rather than all at once on load.
    // Skipped entirely if the visitor already picked a tab manually, so their
    // choice is never silently overwritten.
    if (grid && 'IntersectionObserver' in window) {
      const gridIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!userChangedFilter) applyFilter(initialTab.dataset.filter);
            gridIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      gridIO.observe(grid);
    } else {
      applyFilter(initialTab.dataset.filter);
    }
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-media img');
    const lightboxCat = lightbox.querySelector('.lightbox-cat');
    const lightboxTitle = lightbox.querySelector('.lightbox-body h3');
    const lightboxDesc = lightbox.querySelector('.lightbox-body p');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');

    const openLightbox = (card) => {
      const img = card.querySelector('.work-thumb img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCat.textContent = card.dataset.categoryLabel || '';
      lightboxTitle.textContent = card.dataset.title || '';
      lightboxDesc.textContent = card.dataset.desc || '';
      lightbox.classList.add('open');
      document.body.classList.add('lightbox-active');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.classList.remove('lightbox-active');
    };

    projectCards.forEach((card) => {
      card.addEventListener('click', () => openLightbox(card));
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- Skill meters (About page) ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length && 'IntersectionObserver' in window) {
    const skillIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.value || '0';
          requestAnimationFrame(() => {
            entry.target.style.width = target + '%';
          });
          skillIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach((el) => skillIO.observe(el));
  } else {
    skillFills.forEach((el) => { el.style.width = (el.dataset.value || '0') + '%'; });
  }

  /* ---------- Contact form (front-end only for now) ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const originalLabel = btn.innerHTML;
      btn.innerHTML = 'Message Sent ✓';
      btn.style.opacity = '0.85';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.reset();
        btn.innerHTML = originalLabel;
        btn.style.opacity = '';
        btn.disabled = false;
      }, 2600);
    });
  }

});
