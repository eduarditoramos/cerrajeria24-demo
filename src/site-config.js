// Configuración pública del demo. Mantén null mientras los datos no estén verificados.
// Para activar un contacto, sustituye null por el dato real confirmado:
//   phone: "+<número verificado en formato E.164>"
//   whatsapp: "+<número verificado en formato E.164>" (puede ser distinto)
//   email: "<dirección verificada>"
// El módulo valida los formatos antes de crear cualquier destino tel:, wa.me o mailto:.
export const CONTACTS = Object.freeze({
  phone: null,
  whatsapp: null,
  email: null,
});
