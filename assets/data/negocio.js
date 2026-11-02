/* =========================================================
   LASOGA URBAN FOOD · Datos del negocio
   Fuente: ficha de Google Maps (consultada el 31/10/2026).
   Confirmar con el restaurante antes de publicar la web real.
   Se usará también en la futura página /contacto/.
   ========================================================= */
window.LASOGA_NEGOCIO = {
  nombre: 'LASOGA Urban Food',
  tipo: 'Bar restaurante',
  direccion: 'Calle Belchite, 4, 26003 Logroño, La Rioja',
  telefono: '941 23 45 78',
  telefonoEnlace: '+34941234578',
  mapa: 'https://www.google.com/maps/search/?api=1&query=LASOGA%20Urban%20Food%2C%20Calle%20Belchite%204%2C%2026003%20Logro%C3%B1o',
  precioPorPersona: '10–30 €',
  servicios: ['Es obligatorio reservar', 'Terraza', 'Se admiten perros'],
  instagram: 'https://www.instagram.com/lasogaurbanfood/',
  horario: [
    { dias: 'Lunes',     horas: null },                          // cerrado
    { dias: 'Martes',    horas: ['11:00–15:30', '20:00–23:00'] },
    { dias: 'Miércoles', horas: ['11:00–15:30', '20:00–23:00'] },
    { dias: 'Jueves',    horas: ['11:00–15:30', '20:00–23:00'] },
    { dias: 'Viernes',   horas: ['11:00–15:30', '21:00–23:30'] },
    { dias: 'Sábado',    horas: ['12:00–16:00', '21:00–23:30'] },
    { dias: 'Domingo',   horas: null }                           // cerrado
  ]
};
