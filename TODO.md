# TODO — Cerrajería 24 Demo HazloSimple

## 1. Identidad, contenido y fidelidad al mockup — En curso
- Trabajar directamente sobre el HTML y assets proporcionados, conservar el concepto **Industrial Premium** y no rediseñar desde cero ni sustituir la identidad.
- Mantener azul noche `#142338`, amarillo seguridad `#F6C453`, blanco `#FFFFFF`, gris claro `#F3F5F7`, Manrope, logotipo conceptual de cerradura y disponibilidad 24 horas.
- Utilizar provisionalmente el nombre **CERRAJERÍA 24**, el texto principal **«¿Te quedaste fuera de casa?»** y el texto secundario **«Servicios de cerrajería para hogares, negocios y vehículos en Ciudad de México.»**
- La disponibilidad de atención 24 horas queda sujeta a confirmación final. Mostrar identificación discreta pero visible de propuesta conceptual.
- No inventar testimonios, certificaciones, años de experiencia, tiempos de llegada ni garantías comerciales.
- En el footer incluir **«Una experiencia digital creada por HazloSimple.»**
- Incluir metadatos básicos, favicon y `noindex, nofollow` mientras el sitio sea una demostración.

## 2. Navegación, hero y servicios interactivos — Abierto
- Implementar header fijo con transición sutil al desplazarse, navegación mediante anclas, menú móvil funcional y scroll suave entre secciones.
- Implementar en el hero animaciones de entrada suaves, gráfico circular de 24 horas con movimiento sutil mediante CSS o SVG, botones de llamada y WhatsApp y microinteracciones al pasar el cursor.
- Implementar tarjetas de servicios interactivas con animaciones hover, descripciones expandibles y CTA de contacto contextual.
- Incluir estados hover, focus y active y transiciones naturales.

## 3. Cobertura y sección «Sobre nosotros» — Abierto
- Implementar una sección interactiva para explorar las alcaldías de CDMX mediante filtro o selector.
- Mostrar todas las zonas como provisionales hasta que Marco confirme su cobertura real; no afirmar que se atienden zonas no verificadas.
- Preparar un espacio para fotografía real del propietario o su equipo y presentar visualmente beneficios con animaciones discretas al desplazarse.

## 4. Contacto de demostración y protección contra datos falsos — Abierto
- Implementar botones de llamada mediante `tel:`, WhatsApp mediante `wa.me` y correo mediante `mailto:` cuando Marco proporcione los datos confirmados.
- Mientras no existan datos confirmados, los botones deben mostrar un aviso de demostración y no abrir números de teléfono, direcciones de correo ni enlaces de contacto inventados.
- Incluir barra inferior fija de contacto en móviles.

## 5. Experiencia responsive, accesible y rápida — Abierto
- Priorizar especialmente la versión móvil.
- Permitir que el visitante comprenda inmediatamente qué servicio ofrece la empresa, que la atención es de 24 horas sujeto a confirmación final, dónde opera y cómo llamar o enviar un WhatsApp.
- Respetar `prefers-reduced-motion`, contraste accesible, navegación por teclado y tamaños táctiles adecuados.
- Evitar estética genérica de IA, plantillas convencionales y animaciones excesivas; las animaciones deben sentirse premium.
- Mantener carga rápida, especialmente en teléfonos con conexiones móviles.
- No añadir backend, base de datos, chatbot, pasarela de pago ni sistema de reservaciones.
- Mantener la implementación definitiva como landing page sencilla dentro del paquete cotizado de **$3,500 MXN**. CRM, automatizaciones, pagos, cuentas de usuario, reservas e integraciones externas quedan fuera del alcance y se cotizarían por separado.

## 6. Proyecto independiente y despliegue Vercel — Abierto
- Crear un proyecto completamente independiente, con repositorio nuevo e independiente; no modificar repositorios ni configuraciones de HazloSimple, SidePath ni otros proyectos existentes.
- Ejecutar instalación de dependencias y build y verificar que no existan errores.
- Desplegar en Vercel y entregar URL HTTPS pública funcionando.
- No conectar dominios personalizados ni añadir servicios de pago.

## 7. Pruebas y entrega de evidencia — Abierto
- Antes de dar el proyecto por terminado, verificar escritorio a 1440 px, tablet a 768 px y móvil a 390 px y 375 px.
- Verificar funcionamiento del menú y la navegación, interactividad de tarjetas, filtro de cobertura, barra inferior móvil, ausencia de desbordamiento horizontal, accesibilidad básica, ausencia de errores en consola y que ningún CTA abra un número o correo de ejemplo.
- Comprobar la URL desplegada, no únicamente la versión local.
- Entregar URL de Vercel funcionando, código fuente completo, captura de escritorio, captura de móvil, resumen de interacciones implementadas, resultado de pruebas y lista de datos pendientes de confirmar con Marco.
