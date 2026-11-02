/* =========================================================
   LASOGA URBAN FOOD · Datos de la carta
   ÚNICO sitio donde se editan categorías y platos.

   Fuente: carta publicada en lasogaurbanfood.wordpress.com
   (captura del 31/10/2026). Textos y precios transcritos tal cual;
   pendientes de confirmar por el establecimiento.

   Campos de cada plato:
     nombre        → tal como aparece en la carta
     descripcion   → texto de la carta (null si la carta no lo trae)
     alergenos     → claves de ALERGENOS (vacío = pendiente)
     precio        → euros (null = pendiente)
     foto          → nombre base en assets/carta/ (se usan -480.webp y -960.webp); null = fotografía pendiente
     fotoProbable  → true si la asignación de la foto debe confirmarla el restaurante
     nombreProvisional → true si el plato sale de una fotografía y no de la carta:
                     nombre puesto por nosotros, precio pendiente
   ========================================================= */
window.LASOGA_CARTA = {
  moneda: '€',

  // Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011)
  ALERGENOS: {
    gluten: 'Gluten', crustaceos: 'Crustáceos', huevo: 'Huevo', pescado: 'Pescado',
    cacahuetes: 'Cacahuetes', soja: 'Soja', lacteos: 'Lácteos', frutos_cascara: 'Frutos de cáscara',
    apio: 'Apio', mostaza: 'Mostaza', sesamo: 'Sésamo', sulfitos: 'Sulfitos',
    altramuces: 'Altramuces', moluscos: 'Moluscos'
  },

  // Categorías de la carta original ("todo" lo añade carta.js)
  categorias: [
    { id: 'hamburguesa', nombre: 'Hamburguesas' },
    { id: 'bocadillos',  nombre: 'Bocadillos' },
    { id: 'hotdog',      nombre: 'Hot dog' },
    { id: 'raciones',    nombre: 'Raciones y picoteo' },
    { id: 'ensaladas',   nombre: 'Ensaladas' },
    { id: 'postres',     nombre: 'Postres' }
  ],

  productos: [
    // ---- Raciones y picoteo ----
    { id: 'r01', categoria: 'raciones', nombre: 'Croquetas cremosas de jamón ibérico', precio: 8.5 },
    { id: 'r02', categoria: 'raciones', nombre: 'Croquetas cremosas de rabo de toro', precio: 8.5 },
    { id: 'r03', categoria: 'raciones', nombre: 'Croquetas cremosas de chipirón', precio: 9 },
    { id: 'r04', categoria: 'raciones', nombre: 'Croquetas cremosas de manzana y foie', precio: 8.5 },
    { id: 'r05', categoria: 'raciones', nombre: 'Patatas bravas Lasoga', precio: 4.5, foto: 'patatas-bravas' },
    { id: 'r06', categoria: 'raciones', nombre: 'Patatas gajo especiadas al toque de maho japo', precio: 5.5 },
    { id: 'r07', categoria: 'raciones', nombre: 'Fritura de calamares al toque de limón', precio: 9 },
    { id: 'r08', categoria: 'raciones', nombre: 'Tabla de jamón ibérico (paletilla)', precio: 16.5 },
    { id: 'r09', categoria: 'raciones', nombre: 'Tabla de papada de cerdo ibérica', precio: 16.5 },
    { id: 'r10', categoria: 'raciones', nombre: 'Tabla de cecina de Astorga, miel y toque de AOVE', precio: 16.5 },
    { id: 'r11', categoria: 'raciones', nombre: 'Tiras de pollo crujientes estilo Kentucky con maho japo', precio: 9.5 },
    { id: 'r12', categoria: 'raciones', nombre: 'Tataki de atún rojo, cítricos y cecina de Astorga', precio: 14.5 },
    { id: 'r13', categoria: 'raciones', nombre: 'Tataki de atún rojo con emulsión de teriyaki y cebolla morada encurtida', precio: 12.5 },
    { id: 'r14', categoria: 'raciones', nombre: 'Laminado de entrecot con salteado de pimiento piquillo y sal de vino D.O. Rioja', precio: 14, foto: 'laminado-entrecot' },
    { id: 'r15', categoria: 'raciones', nombre: 'Revuelto de boletus, foie y emulsión de pimentón', precio: 14 },
    { id: 'r16', categoria: 'raciones', nombre: 'Patatas gajo con carne deshilachada', foto: 'patatas-gajo-carne-deshilachada', nombreProvisional: true },
    { id: 'r17', categoria: 'raciones', nombre: 'Tostas de foie y setas', foto: 'tostas-foie-setas', nombreProvisional: true },
    { id: 'r18', categoria: 'raciones', nombre: 'Tortilla con cebolla caramelizada', foto: 'tortilla-cebolla-caramelizada', nombreProvisional: true },
    { id: 'r19', categoria: 'raciones', nombre: 'Steak tartar', foto: 'steak-tartar', nombreProvisional: true },

    // ---- Ensaladas ----
    { id: 'e01', categoria: 'ensaladas', nombre: 'Ensalada Kentucky con cebolla morada encurtida y emulsión japonesa', precio: 9.5 },
    { id: 'e02', categoria: 'ensaladas', nombre: 'Ensalada de saquitos de queso cremoso con pimiento rojo, cebolla crujiente y emulsión japonesa', precio: 9.5 },

    // ---- Bocadillos ----
    { id: 'b01', categoria: 'bocadillos', nombre: 'Riojanito', precio: 8.5,
      descripcion: 'Entrecot lomo alto, pimiento najerano salteado, lascas de parmesano y patatas gajo.' },
    { id: 'b02', categoria: 'bocadillos', nombre: 'Tumaka', precio: 9,
      descripcion: 'Jamón de paleta ibérica con tomate triturado y toque de AOVE.' },
    { id: 'b03', categoria: 'bocadillos', nombre: 'Kentucky', precio: 8.5,
      descripcion: 'Tiras de pollo crujiente, maho japo, queso fundido y patatas gajo.' },
    { id: 'b04', categoria: 'bocadillos', nombre: 'Bocadillo de jamón, bacon y queso', foto: 'bocadillo-jamon-bacon-queso', nombreProvisional: true },

    // ---- Hamburguesas ----
    { id: 'h01', categoria: 'hamburguesa', nombre: 'Lasogaburguesa', precio: 12.5, foto: 'lasogaburguesa', fotoProbable: true, destacado: true,
      descripcion: '200 g de carne black angus, bacon crujiente, maho japo, rúcula, crispy de cebolla, queso cheddar fundido y patatas gajo.' },
    // Desde aquí: platos de las fotografías, sin ficha en la carta publicada
    { id: 'h02', categoria: 'hamburguesa', nombre: 'Burger de cebolla encurtida', foto: 'burger-cebolla-encurtida', nombreProvisional: true },
    { id: 'h03', categoria: 'hamburguesa', nombre: 'Burger bañada en salsa blanca', foto: 'burger-salsa-blanca', nombreProvisional: true },
    { id: 'h04', categoria: 'hamburguesa', nombre: 'Burger de bacon, cheddar y pimiento', foto: 'burger-bacon-piquillo', nombreProvisional: true },

    // ---- Hot dog ----
    { id: 'd01', categoria: 'hotdog', nombre: 'Hot Dog New York', precio: 8.5,
      descripcion: 'Salchicha tradicional, maho japo, salsa barbacoa, bacon, cebolla crispy, queso cheddar y brotes tiernos.' },
    { id: 'd02', categoria: 'hotdog', nombre: 'Hot Dog Baviera', precio: 8.5,
      descripcion: 'Salchicha alemana, maho japo, emulsión de pimentón, cebolla crispy, bacon, queso cheddar y rúcula.' },

    // ---- Postres ----
    { id: 'p01', categoria: 'postres', nombre: 'Tarta de queso cremosa “Lasoga” con helado de turrón', precio: 5.5, foto: 'tarta-queso' },
    { id: 'p02', categoria: 'postres', nombre: 'Ligero de tiramisú en conserva', precio: 5.5 }
  ],

  // Fotografías recibidas que no se han podido relacionar con seguridad con un plato de la carta
  fotosSinAsignar: []
};
