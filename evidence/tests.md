# Evidencia de pruebas — Cerrajería 24

## Resultado

**118/118 verificaciones interactivas aprobadas** en el navegador para 1440 × 1000, 768 × 1024, 390 × 844 y 375 × 812 px.

En cada tamaño se verificaron el ancho de contenido sin desbordamiento horizontal, el header, 24 marcas SVG, metadatos noindex/nofollow, ausencia de destinos `tel:`, `mailto:` o `wa.me` ficticios, funcionamiento de los cuatro acordeones y el filtro de cobertura. Se probaron búsqueda de alcaldías sin acentos, estado sin resultados, reinicio a las 16 alcaldías y selección que mantiene la cobertura explícitamente pendiente de confirmar. También se abrió y cerró el diálogo de demostración desde todos los CTAs y se comprobó el contexto por alcaldía. En 768, 390 y 375 px se probaron apertura/cierre del menú móvil, navegación por ancla, Escape, barra inferior fija y objetivos táctiles de al menos 44 px. No se detectaron errores JavaScript durante la secuencia de interacción.

## Build y servidor

- `pnpm install`: completado con pnpm 10.11.0; no hay dependencias de ejecución ni scripts de terceros.
- `pnpm run check`: aprobado (contenido, 16 alcaldías, cuatro acordeones, menús, contactos seguros, metadatos, assets y movimiento reducido).
- `pnpm run build`: aprobado; genera el sitio estático completo en `dist/`.
- `GET /manus-routes.json`: HTTP 200 y manifiesto JSON de `/`.
- HTML y fuentes locales: HTTP 200.
- La aplicación servida anuncia `X-Robots-Tag: noindex, nofollow`; `public/robots.txt` contiene `Disallow: /`.

## Capturas

- `desktop-1440.png`: página completa, escritorio a 1440 px.
- `mobile-390.png`: vista móvil a 390 px, con la barra fija visible.
- `mobile-full-375.png`: página completa a 375 px.
