# Cerrajería 24 — propuesta conceptual

Landing responsive e interactiva de HazloSimple para presentar una propuesta a Marco. Conserva los SVG, la Manrope y la identidad Industrial Premium del mockup original. Es una demo: contacto, nombre, horario y cobertura siguen pendientes de confirmación.

## Desarrollo y build

Requiere Node.js 22+ y pnpm 10.11.0.

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm run check
pnpm run build
```

El servidor usa `PORT` o, por defecto, el puerto 3000. El build estático se genera en `dist/`. No hay backend, base de datos, dependencias de ejecución, pagos ni servicios de terceros.

## Contactos

`src/site-config.js` mantiene `phone`, `whatsapp` y `email` como `null`. No cambies los valores hasta que Marco confirme personalmente los datos. El frontend valida los formatos y, solo con valores verificados, prepara `tel:`, `https://wa.me/` o `mailto:`. Mientras permanezcan nulos, cada CTA abre el aviso de demostración y no un destino externo.

## Cobertura y contenido

Las 16 alcaldías se muestran como referencias provisionales, ninguna está marcada como atendida y no se listan colonias sin confirmación. Disponibilidad de 24 horas, servicios, beneficios, horario y nombre están sujetos a validar con Marco; no se incluyen testimonios, certificaciones, tiempos de llegada ni garantías.

## Publicación de demostración

`vercel.json` declara un build estático, agrega `X-Robots-Tag: noindex, nofollow` y no configura dominios personalizados. `public/robots.txt` bloquea indexación durante la demo. Mantén la configuración `noindex` hasta obtener autorización explícita para una publicación comercial.

## Archivos

- `reference/`: mockup HTML y brand board originales como referencias.
- `public/assets/`: logotipos, favicon y tipografías suministrados.
- `src/original.css`: estilos originales extraídos; `src/enhancements.css`: mejoras responsive y accesibles.
- `src/app.js`: menú, acordeones, filtro de alcaldías, contactos de demo y gráfico SVG.
- `src/site-config.js`: configuración de contactos confirmados, inicialmente vacía.
- `scripts/adapt-mockup.py`: transformación repetible del mockup original.
- `scripts/check.mjs`: verificaciones de contenido, contactos y metadatos.
- `scripts/browser-check.js`: comprobación interactiva multi-viewport.
- `evidence/`: capturas y resultado de pruebas de aceptación.
