from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / 'reference/original.html').read_text()
css = re.search(r'<style>(.*?)</style>', source, re.S).group(1)
css = css.replace('url("assets/', 'url("../assets/')
(ROOT / 'src/original.css').write_text(css.strip() + '\n')
html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="/src/original.css">\n<link rel="stylesheet" href="/src/enhancements.css">', source, flags=re.S)
html = re.sub(r'<script>.*?</script>', '<script type="module" src="/src/app.js"></script>', html, flags=re.S)
html = html.replace('content="noindex"', 'content="noindex, nofollow"')
html = html.replace('<title>Cerrajería 24 · Propuesta visual (nombre provisional)</title>', '<title>Cerrajería 24 · Propuesta conceptual de HazloSimple</title>')
html = html.replace('content="Prototipo de propuesta visual. Contenido provisional por validar con el cliente."', 'content="Propuesta conceptual de cerrajería para hogares, negocios y vehículos en CDMX. Contactos, cobertura y atención 24 horas pendientes de confirmar."')
html = html.replace('</head>', '<meta name="theme-color" content="#142338">\n<meta property="og:type" content="website">\n<meta property="og:title" content="Cerrajería 24 · Propuesta conceptual">\n<meta property="og:description" content="Una experiencia digital creada por HazloSimple. Contactos, cobertura y horario por confirmar.">\n<meta property="og:locale" content="es_MX">\n<meta property="og:site_name" content="Cerrajería 24">\n<meta name="twitter:card" content="summary">\n</head>')
html = html.replace('<body>', '<body>\n<a class="skip-link" href="#inicio">Saltar al contenido</a>')
html = re.sub(r'<div class="proto".*?</div>', '<div class="proto" role="note">PROPUESTA CONCEPTUAL · DATOS POR CONFIRMAR <span>— Una demo de HazloSimple para Marco</span></div>', html, count=1)
html = html.replace('<main id="inicio">', '<main id="inicio" tabindex="-1">')
html = html.replace('<div class="live" aria-label="Atención las 24 horas"><span><span class="long">Atención </span>24 horas</span></div>', '<div class="live"><span>24 h · por confirmar</span></div>')
# Convertir CTA de contacto estáticos en botones seguros. app.js solo activará enlaces con datos confirmados.
html = re.sub(r'<a class="btn ([^"]+)" href="#contacto">(.*?)</a>', lambda m: '<button type="button" class="btn ' + m[1] + '" data-contact="' + ('whatsapp' if '#i-wa' in m[2] else 'phone') + '">' + m[2] + '</button>', html, flags=re.S)
html = html.replace('    <!-- PROVISIONAL: reemplazar href por tel:+52… cuando Marco confirme su número -->', '')
menu = '''<button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path class="menu-lines" d="M3 6h18M3 12h18M3 18h18"/><path class="menu-close" d="m5 5 14 14M19 5 5 19"/></svg></button>'''
html = html.replace('Llamar ahora</button>\n  </div>\n</header>', 'Llamar ahora</button>\n' + menu + '\n  </div>\n<nav class="mobile-nav" id="mobile-nav" aria-label="Principal móvil" hidden><a href="#servicios">Servicios</a><a href="#cobertura">Cobertura</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a><p>Propuesta conceptual · horario y cobertura por confirmar.</p></nav>\n</header>')
html = html.replace('    <div>\n      <p class="eyebrow"', '    <div data-reveal>\n      <p class="eyebrow"', 1)
html = html.replace('<figure class="dial" style="margin:0">', '<figure class="dial" style="margin:0" data-reveal>')
html = html.replace('      <ul class="facts">', '      <p class="hero-disclaimer">Demo: contactos, cobertura y atención 24 h por confirmar.</p>\n      <ul class="facts">')
html = html.replace('<li><strong>24 h</strong>Todos los días</li>', '<li><strong>24 h</strong>Por confirmar</li>')
html = html.replace('<li><strong>CDMX</strong>Zona de atención</li>', '<li><strong>CDMX</strong>Zonas por validar</li>')
html = html.replace('<circle cx="280" cy="280" r="168"', '<circle class="dial-orbit" cx="280" cy="280" r="168"')
html = html.replace('>ABIERTO</text>', '>24 HORAS*</text>')
html = html.replace('Imagen ilustrativa · se sustituye por foto real', '*Disponibilidad propuesta · pendiente de confirmación')
html = html.replace('Cuatro frentes de atención. Un solo teléfono para todos.', 'Para tu casa, tu negocio o tu vehículo. Explora los servicios propuestos y cuéntanos qué necesitas.')
services = [
('Apertura de puertas', 'Evaluación de puertas y cerraduras para recuperar el acceso. Los tipos de apertura y condiciones del servicio se confirmarán con Marco.'),
('Cambio de cerraduras', 'Orientación sobre instalación o reemplazo según el tipo de puerta. Marcas, modelos y disponibilidad pendientes de validar.'),
('Cerrajería automotriz', 'Consulta sobre llaves y cerraduras de vehículos. Marcas, modelos y trabajos automotrices disponibles por confirmar.'),
('Atención a negocios', 'Consulta para puertas de locales, oficinas y bodegas. Cada trabajo y su alcance se revisarán antes de confirmar el servicio.'),
]
for i, (name, detail) in enumerate(services, 1):
    panel = f'''<button type="button" class="more" data-service-toggle aria-expanded="false" aria-controls="service-{i}"><span data-toggle-label>Ver detalles</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><div id="service-{i}" class="service-panel" hidden><p>{detail}</p><button type="button" class="service-cta" data-contact="whatsapp" data-service="{name}">Consultar este servicio →</button></div>'''
    html = html.replace('<a class="more" href="#contacto">Llamar</a>', panel, 1)
html = html.replace('<article class="card">', '<article class="card" data-reveal>')
html = html.replace('<svg viewBox="0 0 120 120"', '<svg aria-hidden="true" viewBox="0 0 120 120"')
html = html.replace('<h2>Atención en Ciudad de México.</h2>', '<h2>¿En qué zona estás?</h2>')
html = html.replace('Aquí se mostrarán las alcaldías y colonias que Marco atiende. Hoy aparecen las 16 alcaldías como lista base, todas pendientes de confirmar.', 'Explora las 16 alcaldías de Ciudad de México. Esta es una lista de referencia: la cobertura real se confirmará con Marco.')
match = re.search(r'<ul class="alc".*?</ul>', html, re.S)
names = re.findall(r'<li>(.*?)</li>', match[0], re.S)
options = ''.join(f'<option value="{name}">{name}</option>' for name in names)
items = ''.join(f'<li data-district="{name}"><button class="district-btn" type="button" data-district-select="{name}" aria-pressed="false"><span>{name}</span><small>Por confirmar</small></button></li>\n' for name in names)
coverage = f'''<div class="coverage-tools"><label class="field" for="coverage-select">Explorar por alcaldía<select id="coverage-select"><option value="all">Todas las alcaldías</option>{options}</select></label><label class="field" for="coverage-search">Buscar una alcaldía<input type="search" id="coverage-search" placeholder="Ej. Coyoacán" autocomplete="off"></label></div><ul class="alc" id="district-list" aria-label="Alcaldías de la Ciudad de México — cobertura provisional">{items}</ul><p id="coverage-empty" hidden>No encontramos esa alcaldía. Intenta con otro nombre.</p><div class="coverage-meta"><p id="coverage-status" role="status" aria-live="polite">16 alcaldías · todas por confirmar</p><button type="button" id="coverage-reset">Ver todas</button></div>'''
html = html[:match.start()] + coverage + html[match.end():]
html = html.replace('<div class="legend"><span><i class="on"></i>Atiende (se marca al confirmar)</span><span><i class="off"></i>Por confirmar</span></div>', '<div class="legend"><span><i class="off" aria-hidden="true"></i>Ninguna zona está confirmada todavía.</span></div>')
html = re.sub(r'<aside class="col">.*?</aside>', '''<aside class="col" aria-labelledby="district-name"><span class="tag">Cobertura provisional</span><h3 id="district-name">Tu zona, por confirmar</h3><p id="district-detail">Selecciona una alcaldía para explorar la propuesta. Ninguna zona de atención está confirmada todavía.</p><div class="slot">Las colonias se mostrarán aquí únicamente después de recibir la lista real de Marco.</div><button class="btn btn-primary" type="button" data-contact="whatsapp" id="coverage-contact"><svg aria-hidden="true"><use href="#i-wa"/></svg>Consultar mi zona</button></aside>''', html, count=1, flags=re.S)
html = html.replace('<div class="photo">', '<div class="photo" data-reveal><span class="photo-label">EL ROSTRO DETRÁS DEL SERVICIO</span>')
html = html.replace('<span class="cap">Espacio para foto de Marco o su equipo</span>', '<span class="cap">Aquí conocerás a Marco.<small>Espacio reservado para una fotografía real de él o su equipo.</small></span>')
html = html.replace('Hablas con quien presta el servicio.', 'Propuesta de trato directo; forma de atención por validar.')
html = html.replace('Se acuerda el costo antes de trabajar.', 'Una forma de trabajar que se confirmará con Marco.')
html = html.replace('<h3>Disponible a cualquier hora</h3><p>Atención las 24 horas, todos los días.</p>', '<h3>Atención de 24 horas</h3><p>Horario propuesto, sujeto a confirmación final con Marco.</p>')
html = html.replace('<h2>Llama ahora. Te atendemos.</h2>', '<h2>Un primer paso para volver a entrar.</h2><p class="lead">Llamada o WhatsApp: elige cómo quieres contactar. En esta demo, los datos de Marco aún están pendientes de confirmar.</p>')
html = html.replace('55 XXXX XXXX · número por confirmar', 'Teléfono pendiente de confirmar')
html = html.replace('Mismo número · por confirmar', 'WhatsApp pendiente de confirmar')
html = html.replace('<span class="v">55 XXXX XXXX<small>Teléfono de ejemplo, no es real</small></span>', '<span class="v">Por confirmar<small>Sin teléfono activo en esta demo</small></span>')
html = html.replace('<span class="v">55 XXXX XXXX<small>Por confirmar</small></span>', '<span class="v">Por confirmar<small>Sin WhatsApp activo en esta demo</small></span>')
html = html.replace('<span class="v">contacto@dominio-por-definir<small>El dominio y los dos correos se definen al contratar</small></span>', '<span class="v"><button type="button" class="contact-email" data-contact="email">Consultar por correo →</button><small>Correo pendiente de confirmar</small></span>')
html = html.replace('<span>Nombre provisional · Propuesta visual elaborada por HazloSimple</span>', '<span class="footer-credit">Una experiencia digital creada por HazloSimple.<small class="footer-note">Propuesta conceptual · Nombre, servicios, cobertura y horario por confirmar.</small></span>')
dialog = '''<dialog class="demo-dialog" id="demo-dialog" aria-labelledby="demo-title" aria-describedby="demo-description"><span class="tag">Propuesta conceptual</span><h2 id="demo-title">Estás viendo una demostración.</h2><p id="demo-description">Los datos de contacto de Marco todavía no están confirmados. Este botón no realiza llamadas ni abre contactos de ejemplo.</p><p id="demo-context" hidden></p><button type="button" class="btn btn-primary" data-close-dialog>Entendido, seguir explorando</button></dialog>'''
html = html.replace('<script type="module"', dialog + '\n<script type="module"')
html = html.replace('section id="servicios" class="sec"', 'section id="servicios" class="sec"')
(ROOT / 'index.html').write_text(html)
print('Adapted source:', len(html), 'characters; retained original CSS and all original SVG illustrations.')
