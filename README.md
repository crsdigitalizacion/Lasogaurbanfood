# LASOGA Urban Food · Web de demostración

Propuesta de web para **LASOGA Urban Food** (bar restaurante, Calle Belchite 4, Logroño).
**Demostración no oficial** diseñada y desarrollada por [CRS Digital](https://crsdigital.es).

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Portada cinematográfica: hamburguesa por capas que se abre con el scroll |
| `/descubrenos/` | Presentación: el titular se abre y revela el entrecot |
| `/carta/` | Carta real por categorías, buscador y ficha de cada plato |
| `/galeria/` | Galería editorial con visor ampliado |
| `/contacto/` | Dirección, horario, teléfono e Instagram |

## Estructura

```
index.html · carta/ · descubrenos/ · galeria/ · contacto/
assets/css/   base.css (compartido) + un archivo por página
assets/js/    base.js (compartido) + un archivo por página
assets/data/  carta.js (platos y precios) · negocio.js (dirección, teléfono, horario)
assets/hamburguesa/ · assets/carta/ · assets/descubrenos/   imágenes optimizadas (WebP)
```

- **Editar la carta:** `assets/data/carta.js`.
- **Editar dirección, teléfono u horario:** `assets/data/negocio.js` y el pie de página de cada `index.html`.
- Sin frameworks. Animaciones con GSAP 3.12.5 + ScrollTrigger (cdnjs).

## Publicar con GitHub Pages

Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.

## Pendiente de confirmar por el establecimiento

Alérgenos, precios vigentes, nombres de los platos que solo aparecen en fotografía,
horario (tomado de Google Maps) y textos de Descúbrenos.
