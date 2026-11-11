(async () => {
  const results = [];
  const failures = [];
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:0;top:0;height:900px;border:0;z-index:9999;background:white;';
  document.body.append(frame);
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (pass, name) => { results.push({ name, pass: Boolean(pass) }); if (!pass) failures.push(name); };
  try {
    for (const width of [1440, 768, 390, 375]) {
      frame.style.width = width + 'px';
      await new Promise((resolve, reject) => { frame.onload = resolve; frame.onerror = reject; frame.src = location.origin + '/?qa=' + width; });
      await pause(750);
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      const errors = [];
      win.addEventListener('error', event => errors.push(event.message));
      const get = selector => doc.querySelector(selector);
      assert(win.innerWidth === width, width + ': viewport exacto');
      assert(doc.documentElement.scrollWidth <= width, width + ': sin desbordamiento horizontal');
      assert(get('.hdr').getBoundingClientRect().width <= width, width + ': header ajustado');
      assert(get('#ticks').children.length === 24, width + ': 24 marcas SVG');
      assert(!get('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me"]'), width + ': ningún contacto ficticio activo');
      assert(get('meta[name="robots"]').content === 'noindex, nofollow', width + ': noindex,nofollow');
      const toggle = get('#menu-toggle');
      if (width <= 1040) {
        assert(win.getComputedStyle(toggle).display !== 'none', width + ': botón menú visible');
        toggle.click();
        assert(!get('#mobile-nav').hidden && toggle.getAttribute('aria-expanded') === 'true', width + ': menú abre');
        get('#mobile-nav a').click();
        assert(get('#mobile-nav').hidden && toggle.getAttribute('aria-expanded') === 'false', width + ': ancla cierra menú');
        toggle.click();
        doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert(get('#mobile-nav').hidden, width + ': Escape cierra menú');
      }
      const accordions = [...doc.querySelectorAll('[data-service-toggle]')];
      for (const [index, button] of accordions.entries()) {
        const panel = doc.getElementById(button.getAttribute('aria-controls'));
        button.click();
        assert(!panel.hidden && button.getAttribute('aria-expanded') === 'true', width + ': servicio ' + (index+1) + ' abre');
        button.click();
        assert(panel.hidden && button.getAttribute('aria-expanded') === 'false', width + ': servicio ' + (index+1) + ' cierra');
      }
      const select = get('#coverage-select');
      select.value = 'Coyoacán';
      select.dispatchEvent(new win.Event('change', { bubbles: true }));
      assert(doc.querySelectorAll('#district-list li:not([hidden])').length === 1 && get('#district-name').textContent === 'Coyoacán', width + ': selector filtra alcaldía');
      assert(get('#district-detail').textContent.includes('pendiente de confirmación'), width + ': cobertura sigue provisional');
      get('#coverage-reset').click();
      const search = get('#coverage-search');
      search.value = 'alvaro';
      search.dispatchEvent(new win.Event('input', { bubbles: true }));
      assert(doc.querySelectorAll('#district-list li:not([hidden])').length === 1, width + ': búsqueda sin acentos');
      search.value = 'zzzz';
      search.dispatchEvent(new win.Event('input', { bubbles: true }));
      assert(!get('#coverage-empty').hidden, width + ': estado sin resultados');
      get('#coverage-reset').click();
      assert(doc.querySelectorAll('#district-list li:not([hidden])').length === 16, width + ': reset muestra 16 alcaldías');
      get('[data-district-select="Tlalpan"]').click();
      assert(get('#district-name').textContent === 'Tlalpan' && get('[data-district-select="Tlalpan"]').getAttribute('aria-pressed') === 'true', width + ': tarjeta selecciona alcaldía');
      const dialog = get('#demo-dialog');
      let allSafe = true;
      for (const button of doc.querySelectorAll('[data-contact]')) {
        button.click();
        allSafe = allSafe && dialog.open;
        get('[data-close-dialog]').click();
        await pause(1);
        allSafe = allSafe && !dialog.open;
      }
      assert(allSafe, width + ': todos los CTA muestran y cierran demo');
      get('#coverage-contact').click();
      assert(get('#demo-context').textContent.includes('Tlalpan'), width + ': contacto contextual de zona');
      get('[data-close-dialog]').click();
      if (width <= 860) {
        const dock = get('.dock');
        assert(win.getComputedStyle(dock).position === 'fixed' && win.getComputedStyle(dock).display !== 'none', width + ': dock móvil fijo');
        assert([...dock.querySelectorAll('button')].every(b => b.getBoundingClientRect().height >= 44), width + ': objetivos táctiles >=44px');
      }
      const secondary = get('.hero .btn-ghost');
      assert(win.getComputedStyle(secondary).backgroundColor === 'rgba(0, 0, 0, 0)', width + ': botón secundario contrastado');
      assert(errors.length === 0, width + ': sin errores JS durante interacciones');
      assert(doc.documentElement.scrollWidth <= width, width + ': sin desbordamiento tras interacción');
    }
  } finally { frame.remove(); }
  return { origin: location.origin, total: results.length, passed: results.filter(r => r.pass).length, failures, results };
})()
