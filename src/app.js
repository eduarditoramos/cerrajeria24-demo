import { CONTACTS } from './site-config.js';

const DISTRICT_DEFAULT_TITLE = 'Tu zona, por confirmar';
const DISTRICT_DEFAULT_DETAIL = 'Selecciona una alcaldía para explorar la propuesta. Ninguna zona de atención está confirmada todavía.';
const DISTRICT_PENDING_DETAIL = 'Cobertura pendiente de confirmación con Marco. Aún no contamos con una lista verificada de colonias ni disponibilidad para esta alcaldía.';
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
const EMAIL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._+-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
const SVG_NS = 'http://www.w3.org/2000/svg';

function contactValue(kind) {
  const value = CONTACTS?.[kind];
  return typeof value === 'string' ? value : '';
}

function verifiedPhone(kind) {
  const value = contactValue(kind);
  return E164_PATTERN.test(value) ? value : '';
}

function verifiedEmail() {
  const value = contactValue('email');
  return EMAIL_PATTERN.test(value) ? value : '';
}

function whatsappMessage(element) {
  const service = element.dataset.service?.trim();
  return service
    ? `Hola, quisiera consultar sobre ${service}.`
    : 'Hola, quisiera consultar un servicio de cerrajería.';
}

function contactDestination(element) {
  const kind = element.dataset.contact;
  if (kind === 'phone') {
    const phone = verifiedPhone('phone');
    return phone ? `tel:${phone}` : '';
  }
  if (kind === 'whatsapp') {
    const phone = verifiedPhone('whatsapp');
    if (!phone) return '';
    const digits = phone.slice(1);
    const text = encodeURIComponent(whatsappMessage(element));
    return `https://wa.me/${digits}?text=${text}`;
  }
  if (kind === 'email') {
    const email = verifiedEmail();
    return email ? `mailto:${email}` : '';
  }
  return '';
}

function replaceTag(element, tagName, excludedAttributes = new Set()) {
  const replacement = document.createElement(tagName);
  for (const attribute of [...element.attributes]) {
    if (!excludedAttributes.has(attribute.name)) {
      replacement.setAttribute(attribute.name, attribute.value);
    }
  }
  replacement.append(...element.childNodes);
  element.replaceWith(replacement);
  return replacement;
}

function configureContactElement(element) {
  const destination = contactDestination(element);
  let target = element;

  if (destination) {
    if (target instanceof HTMLButtonElement) {
      if (target.disabled) return;
      target = replaceTag(target, 'a', new Set([
        'type', 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'role',
      ]));
    }
    if (!(target instanceof HTMLAnchorElement)) return;
    target.href = destination;
    if (target.dataset.contact === 'whatsapp') {
      target.target = '_blank';
      target.rel = 'noopener noreferrer';
    } else {
      target.removeAttribute('target');
      target.removeAttribute('rel');
    }
    return;
  }

  // Sin datos verificados no queda activo ningún href: los enlaces se vuelven botones.
  if (target instanceof HTMLAnchorElement) {
    target = replaceTag(target, 'button', new Set(['href', 'target', 'rel', 'download', 'role', 'tabindex']));
  }
  if (target instanceof HTMLButtonElement && !target.hasAttribute('type')) {
    target.type = 'button';
  }
}

function configureAllContactElements() {
  document.querySelectorAll('[data-contact]').forEach(configureContactElement);
}

function setupDemoDialog() {
  const dialog = document.getElementById('demo-dialog');
  const context = document.getElementById('demo-context');
  if (!dialog) return;

  let opener = null;
  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest?.('.dialog-backdrop')) {
      closeDialog();
    }
    if (event.target.closest?.('[data-close-dialog]')) {
      closeDialog();
    }
  });
  dialog.addEventListener('close', () => {
    if (context) {
      context.textContent = '';
      context.hidden = true;
    }
    if (opener?.isConnected && typeof opener.focus === 'function') {
      opener.focus({ preventScroll: true });
    }
    opener = null;
  });

  document.addEventListener('click', (event) => {
    const element = event.target.closest?.('[data-contact]');
    if (!element) return;

    const destination = contactDestination(element);
    if (destination) {
      if (element.dataset.contact === 'whatsapp') {
        event.preventDefault();
        window.open(destination, '_blank', 'noopener,noreferrer');
      } else if (!(element instanceof HTMLAnchorElement)) {
        // Respaldo si una acción válida no pudo convertirse en enlace.
        event.preventDefault();
        window.location.assign(destination);
      }
      return;
    }

    event.preventDefault();
    if (dialog.open || typeof dialog.showModal !== 'function') return;
    opener = element;
    const service = element.dataset.service?.trim();
    if (context) {
      context.textContent = service ? `Consulta: ${service}.` : '';
      context.hidden = !service;
    }
    dialog.showModal();
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.type = toggle instanceof HTMLButtonElement ? 'button' : toggle.type;
  toggle.setAttribute('aria-controls', nav.id || 'mobile-nav');
  toggle.setAttribute('aria-expanded', 'false');
  nav.hidden = true;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.hidden = !open;
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  nav.addEventListener('click', (event) => {
    if (event.target.closest?.('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (isOpen() && !toggle.contains(event.target) && !nav.contains(event.target)) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false);
  });

  const closeAtDesktopWidth = () => {
    if (window.innerWidth > 1040) setOpen(false);
    measureHeader();
  };
  window.addEventListener('resize', closeAtDesktopWidth, { passive: true });
}

function measureHeader() {
  const header = document.querySelector('.hdr');
  if (!header) return;
  const bar = header.querySelector('.wrap') || header;
  document.documentElement.style.setProperty('--header-height', `${bar.getBoundingClientRect().height}px`);
}

function setupHeader() {
  const header = document.querySelector('.hdr');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 24);
  update();
  measureHeader();
  window.addEventListener('scroll', update, { passive: true });

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measureHeader);
    observer.observe(header);
  }
}

function setupReveals() {
  const elements = [...document.querySelectorAll('[data-reveal]')];
  if (!elements.length) return;

  const revealAll = () => elements.forEach((element) => element.classList.add('is-visible'));
  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  try {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    elements.forEach((element) => observer.observe(element));
  } catch {
    revealAll();
  }
}

function setupServiceAccordions() {
  document.querySelectorAll('[data-service-toggle]').forEach((toggle, index) => {
    let panelId = toggle.getAttribute('aria-controls')?.trim();
    let panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) panel = toggle.closest('.card')?.querySelector('[data-service-panel]') || null;
    if (!panel) return;

    if (!panel.id) panel.id = `service-panel-${index + 1}`;
    toggle.setAttribute('aria-controls', panel.id);
    toggle.setAttribute('aria-expanded', 'false');
    if (toggle instanceof HTMLButtonElement && !toggle.hasAttribute('type')) toggle.type = 'button';
    panel.hidden = true;
    toggle.querySelectorAll('[data-toggle-label]').forEach((label) => {
      label.textContent = 'Ver detalles';
    });
    toggle.closest('.card')?.classList.remove('is-expanded');

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      panel.hidden = !expanded;
      toggle.closest('.card')?.classList.toggle('is-expanded', expanded);
      toggle.querySelectorAll('[data-toggle-label]').forEach((label) => {
        label.textContent = expanded ? 'Cerrar detalles' : 'Ver detalles';
      });
    });
  });
}

function normalizeForSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .trim();
}

function setupCoverage() {
  const list = document.getElementById('district-list');
  if (!list) return;

  const select = document.getElementById('coverage-select');
  const search = document.getElementById('coverage-search');
  const status = document.getElementById('coverage-status');
  const empty = document.getElementById('coverage-empty');
  const nameHeading = document.getElementById('district-name');
  const detail = document.getElementById('district-detail');
  const reset = document.getElementById('coverage-reset');
  let filter = { kind: 'all', value: '' };

  const entries = () => [...list.querySelectorAll('li[data-district]')].map((item) => {
    const button = item.querySelector('.district-btn[data-district-select]');
    return {
      item,
      button,
      name: button?.dataset.districtSelect || item.dataset.district || '',
    };
  });

  const setSelection = (name) => {
    for (const entry of entries()) {
      entry.button?.setAttribute('aria-pressed', String(Boolean(name && entry.name === name)));
    }
    if (name) {
      if (nameHeading) nameHeading.textContent = name;
      if (detail) detail.textContent = DISTRICT_PENDING_DETAIL;
    } else {
      if (nameHeading) nameHeading.textContent = DISTRICT_DEFAULT_TITLE;
      if (detail) detail.textContent = DISTRICT_DEFAULT_DETAIL;
    }
    const coverageContact = document.getElementById('coverage-contact');
    if (coverageContact) {
      coverageContact.dataset.service = name ? `cobertura en ${name}` : 'consulta de cobertura';
      configureContactElement(coverageContact);
    }
  };

  const updateList = () => {
    const currentEntries = entries();
    const query = normalizeForSearch(filter.value);
    let visibleCount = 0;

    for (const entry of currentEntries) {
      let visible = true;
      if (filter.kind === 'district') visible = entry.name === filter.value;
      if (filter.kind === 'search' && query) visible = normalizeForSearch(entry.name).includes(query);
      entry.item.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    if (empty) {
      empty.hidden = visibleCount > 0;
      if (!visibleCount) {
        empty.textContent = filter.kind === 'search' && filter.value
          ? `No encontramos alcaldías que coincidan con “${filter.value}”.`
          : 'No hay alcaldías para mostrar.';
      }
    }

    if (status) {
      if (filter.kind === 'district') {
        status.textContent = `Mostrando ${filter.value}. La cobertura de esta alcaldía está pendiente de confirmar.`;
      } else if (filter.kind === 'search' && filter.value) {
        status.textContent = visibleCount
          ? `${visibleCount} ${visibleCount === 1 ? 'alcaldía coincide' : 'alcaldías coinciden'} con “${filter.value}”. Toda cobertura está pendiente de confirmar.`
          : `Sin resultados para “${filter.value}”.`;
      } else {
        status.textContent = `${visibleCount} ${visibleCount === 1 ? 'alcaldía disponible' : 'alcaldías disponibles'} en la lista. Todas están pendientes de confirmar.`;
      }
    }
  };

  if (select) {
    if ([...select.options].some((option) => option.value === 'all')) select.value = 'all';
    select.addEventListener('change', () => {
      const value = select.value;
      if (search) search.value = '';
      if (!value || value === 'all') {
        filter = { kind: 'all', value: '' };
        setSelection('');
      } else {
        filter = { kind: 'district', value };
        setSelection(value);
      }
      updateList();
    });
  }

  search?.addEventListener('input', () => {
    if (select && [...select.options].some((option) => option.value === 'all')) select.value = 'all';
    setSelection('');
    filter = search.value.trim()
      ? { kind: 'search', value: search.value.trim() }
      : { kind: 'all', value: '' };
    updateList();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest?.('.district-btn[data-district-select]');
    if (!button || !list.contains(button)) return;
    const entry = button.closest('li[data-district]');
    const name = button.dataset.districtSelect || entry?.dataset.district || '';
    if (!name) return;
    setSelection(name);
    if (status) status.textContent = `Cobertura pendiente de confirmar para ${name}.`;
  });

  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    if (select && [...select.options].some((option) => option.value === 'all')) select.value = 'all';
    filter = { kind: 'all', value: '' };
    setSelection('');
    updateList();
  });

  setSelection('');
  updateList();
}

function setupDialTicks() {
  const group = document.getElementById('ticks');
  if (!group || group.childElementCount) return;

  const centerX = 280;
  const centerY = 280;
  for (let index = 0; index < 24; index += 1) {
    const major = index % 6 === 0;
    const angle = (index * 15 - 90) * Math.PI / 180;
    const innerRadius = major ? 226 : 236;
    const outerRadius = 250;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', (centerX + innerRadius * Math.cos(angle)).toFixed(1));
    line.setAttribute('y1', (centerY + innerRadius * Math.sin(angle)).toFixed(1));
    line.setAttribute('x2', (centerX + outerRadius * Math.cos(angle)).toFixed(1));
    line.setAttribute('y2', (centerY + outerRadius * Math.sin(angle)).toFixed(1));
    line.setAttribute('stroke-width', major ? '4' : '2.5');
    group.append(line);
  }
}

function init() {
  document.documentElement.classList.add('js-ready');
  setupHeader();
  setupMobileMenu();
  setupReveals();
  setupServiceAccordions();
  setupCoverage();
  setupDialTicks();
  configureAllContactElements();
  setupDemoDialog();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
