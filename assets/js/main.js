/**
 * ESPAÇO DE EVENTOS SAMUEL LUCAS
 * Main Interactive Engine (Mobile-First)
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURATION & CONSTANTS
  // ==========================================================================
  // O número do WhatsApp pode ser alterado aqui a qualquer momento pelo cliente.
  const CONFIG = {
    whatsappNumber: '5511999999999', // Substituir pelo número oficial quando fornecido
    instagramUrl: '#', // Link oficial do Instagram quando fornecido
    googleMapsUrl: 'https://maps.google.com/?q=Espaco+de+Eventos+Samuel+Lucas',
  };

  const WHATSAPP_MESSAGES = {
    default: 'Olá! Gostaria de solicitar um orçamento para realizar meu evento no Espaço de Eventos Samuel Lucas.',
    casamento: 'Olá! Gostaria de informações sobre um casamento no Espaço de Eventos Samuel Lucas.',
    aniversario: 'Olá! Gostaria de informações sobre um aniversário no Espaço de Eventos Samuel Lucas.',
    '15-anos': 'Olá! Gostaria de informações sobre uma festa de 15 anos no Espaço de Eventos Samuel Lucas.',
    corporativo: 'Olá! Gostaria de informações sobre um evento corporativo no Espaço de Eventos Samuel Lucas.',
  };

  let currentContext = 'default';

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-links a, .drawer-cta a');
  const quickNavItems = document.querySelectorAll('.quick-nav-item');
  const floatingWhatsappBtn = document.getElementById('floatingWhatsappBtn');
  const toastNotice = document.getElementById('toastNotice');

  // ==========================================================================
  // HEADER SCROLL OBSERVER
  // ==========================================================================
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ==========================================================================
  // MOBILE DRAWER NAVIGATION
  // ==========================================================================
  function openDrawer() {
    navDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
    }
  });

  // ==========================================================================
  // WHATSAPP HELPER FUNCTIONS
  // ==========================================================================
  function buildWhatsappUrl(message) {
    const encoded = encodeURIComponent(message || WHATSAPP_MESSAGES.default);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
  }

  function updateFloatingWhatsapp(context) {
    currentContext = context || 'default';
    const message = WHATSAPP_MESSAGES[currentContext] || WHATSAPP_MESSAGES.default;
    if (floatingWhatsappBtn) {
      floatingWhatsappBtn.href = buildWhatsappUrl(message);
    }
  }

  // Set initial WhatsApp floating URL
  updateFloatingWhatsapp('default');

  // Contextual Event Cards Action: [ CONHECER ]
  document.querySelectorAll('[data-event-context]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const eventType = this.getAttribute('data-event-context');
      updateFloatingWhatsapp(eventType);

      // Pre-select chip in budget form
      const targetChip = document.querySelector(`.chip-btn[data-value="${eventType}"]`);
      if (targetChip) {
        selectChip(targetChip);
      }
    });
  });

  // Direct WhatsApp links
  document.querySelectorAll('.js-whatsapp-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const customMsg = this.getAttribute('data-message') || WHATSAPP_MESSAGES[currentContext] || WHATSAPP_MESSAGES.default;
      window.open(buildWhatsappUrl(customMsg), '_blank', 'noopener,noreferrer');
    });
  });

  // ==========================================================================
  // QUICK NAV ACTIVE HIGHLIGHT ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  function highlightQuickNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(function (current) {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        quickNavItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightQuickNav, { passive: true });

  // ==========================================================================
  // GALLERY CAROUSEL & LIGHTBOX
  // ==========================================================================
  const gallerySlider = document.getElementById('gallerySlider');
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryCounter = document.getElementById('galleryCounter');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let visibleSlides = Array.from(gallerySlides);

  function updateGalleryCounter() {
    if (galleryCounter && visibleSlides.length > 0) {
      galleryCounter.textContent = `${currentGalleryIndex + 1} / ${visibleSlides.length}`;
    }
  }

  function scrollToGallerySlide(index) {
    if (index < 0) index = 0;
    if (index >= visibleSlides.length) index = visibleSlides.length - 1;
    currentGalleryIndex = index;
    const targetSlide = visibleSlides[currentGalleryIndex];
    if (targetSlide && gallerySlider) {
      gallerySlider.scrollTo({
        left: targetSlide.offsetLeft,
        behavior: 'smooth'
      });
    }
    updateGalleryCounter();
  }

  if (galleryPrev) {
    galleryPrev.addEventListener('click', function () {
      scrollToGallerySlide(currentGalleryIndex - 1);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', function () {
      scrollToGallerySlide(currentGalleryIndex + 1);
    });
  }

  // Update index on manual scroll / swipe
  if (gallerySlider) {
    let scrollTimeout;
    gallerySlider.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        const scrollLeft = gallerySlider.scrollLeft;
        const slideWidth = gallerySlider.offsetWidth;
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== currentGalleryIndex && newIndex >= 0 && newIndex < visibleSlides.length) {
          currentGalleryIndex = newIndex;
          updateGalleryCounter();
        }
      }, 80);
    }, { passive: true });
  }

  // Category Filter
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      gallerySlides.forEach(function (slide) {
        const category = slide.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          slide.style.display = 'block';
        } else {
          slide.style.display = 'none';
        }
      });

      visibleSlides = Array.from(gallerySlides).filter(s => s.style.display !== 'none');
      currentGalleryIndex = 0;
      scrollToGallerySlide(0);
      updateGalleryCounter();
    });
  });

  // Lightbox functionality
  function openLightbox(index) {
    const slide = visibleSlides[index];
    if (!slide) return;
    const img = slide.querySelector('img');
    const caption = slide.getAttribute('data-title') || img.alt;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  gallerySlides.forEach(function (slide) {
    slide.addEventListener('click', function () {
      const index = visibleSlides.indexOf(this);
      if (index !== -1) {
        currentGalleryIndex = index;
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + visibleSlides.length) % visibleSlides.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % visibleSlides.length;
      openLightbox(currentGalleryIndex);
    });
  }

  // Swipe support for Lightbox on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      // Swiped left -> Next
      if (lightbox.classList.contains('open')) {
        currentGalleryIndex = (currentGalleryIndex + 1) % visibleSlides.length;
        openLightbox(currentGalleryIndex);
      }
    }
    if (touchEndX > touchStartX + threshold) {
      // Swiped right -> Prev
      if (lightbox.classList.contains('open')) {
        currentGalleryIndex = (currentGalleryIndex - 1 + visibleSlides.length) % visibleSlides.length;
        openLightbox(currentGalleryIndex);
      }
    }
  }

  // ==========================================================================
  // BUDGET FORM INTERACTION & WHATSAPP GENERATION
  // ==========================================================================
  const chipButtons = document.querySelectorAll('.chip-btn');
  const eventTypeSelect = document.getElementById('tipoEvento');
  const budgetForm = document.getElementById('budgetForm');
  const phoneInput = document.getElementById('whatsappInput');

  function selectChip(btn) {
    chipButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const val = btn.getAttribute('data-value');
    if (eventTypeSelect) {
      eventTypeSelect.value = val;
    }
    updateFloatingWhatsapp(val);
  }

  chipButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectChip(this);
    });
  });

  if (eventTypeSelect) {
    eventTypeSelect.addEventListener('change', function () {
      const val = this.value;
      const targetChip = document.querySelector(`.chip-btn[data-value="${val}"]`);
      if (targetChip) {
        chipButtons.forEach(b => b.classList.remove('selected'));
        targetChip.classList.add('selected');
      }
      updateFloatingWhatsapp(val);
    });
  }

  // Auto-mask Brazilian phone number: (DD) 9XXXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 6) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      } else {
        e.target.value = '';
      }
    });
  }

  function showToast(msg) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-msg').textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(function () {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  if (budgetForm) {
    budgetForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('nomeInput').value.trim();
      const phone = phoneInput.value.trim();
      const eventType = eventTypeSelect.options[eventTypeSelect.selectedIndex].text;
      const date = document.getElementById('dataInput').value;
      const guests = document.getElementById('convidadosInput').value.trim();
      const message = document.getElementById('mensagemInput').value.trim();

      if (!name || !phone) {
        alert('Por favor, informe seu nome e WhatsApp.');
        return;
      }

      // Format date if present
      let formattedDate = 'A definir';
      if (date) {
        const parts = date.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }

      // Build formatted WhatsApp message
      const text = [
        '✨ *SOLICITAÇÃO DE ORÇAMENTO*',
        '📍 *Espaço de Eventos Samuel Lucas*',
        '',
        `👤 *Nome:* ${name}`,
        `📱 *WhatsApp:* ${phone}`,
        `🎉 *Tipo de Evento:* ${eventType}`,
        `📅 *Data Prevista:* ${formattedDate}`,
        `👥 *Nº de Convidados:* ${guests || 'A definir'}`,
        message ? `💬 *Mensagem:* ${message}` : '',
        '',
        '_Mensagem enviada através do site oficial._'
      ].filter(Boolean).join('\n');

      showToast('Enviando solicitação para o WhatsApp...');

      setTimeout(function () {
        window.open(buildWhatsappUrl(text), '_blank');
      }, 600);
    });
  }

  // ==========================================================================
  // GOOGLE MAPS & INSTAGRAM ACTION BUTTONS
  // ==========================================================================
  const btnGoogleMaps = document.getElementById('btnGoogleMaps');
  if (btnGoogleMaps) {
    btnGoogleMaps.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(CONFIG.googleMapsUrl, '_blank');
    });
  }

  const btnInstagram = document.getElementById('btnInstagram');
  if (btnInstagram) {
    btnInstagram.addEventListener('click', function (e) {
      e.preventDefault();
      if (CONFIG.instagramUrl === '#') {
        showToast('Perfil do Instagram será disponibilizado em breve.');
      } else {
        window.open(CONFIG.instagramUrl, '_blank');
      }
    });
  }

  // Initialize
  updateGalleryCounter();

})();
