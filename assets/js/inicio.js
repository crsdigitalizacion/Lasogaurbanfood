/* =========================================================
   LASOGA URBAN FOOD · inicio.js  (portada v2)
   Portada cinematográfica con GSAP + ScrollTrigger (pin + scrub).

   Capas de la hamburguesa (cada una con su papel, sin conflictos):
     #hb       → posición en pantalla (derecha → centro), inclinación, escala   [scroll]
     #hbFloat  → flotación ligera en bucle                                      [continuo]
     #hbStage  → pequeño "aplastamiento" al encajar cada capa                    [carga]
     .layer    → apertura, vaivén lateral y cierre de ingredientes               [scroll]
     .layer img→ caída de cada capa al cargar                                    [carga]
     .steam    → imagen de vapor real (screen) que sube y se desvanece           [scroll]

   Ritmo (unidades de la línea de tiempo):
     0   – 1.2   Entrada: al centro con inclinación · "No es solo una burger"
     2.0 – 3.4   Apertura de capas y gotas de salsa
     3.4 – 6.0   Hamburguesa abierta: vaivén lateral muy pequeño · "El secreto está en cada capa"
     6.0 – 8.2   Cierre pausado
     7.0 – 9.8   Vapor que aparece y se disipa · "¿Te atreves a probarla?"
     10.0– 10.6  Pausa y se libera el scroll
   ========================================================= */
(() => {
  const html = document.documentElement;
  const hb = document.getElementById('hb');
  if (!hb) return;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('is-cine', 'cine-wait'); return; } // sin GSAP: portada estática
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const float  = document.getElementById('hbFloat');
  const stage  = document.getElementById('hbStage');
  const title  = document.getElementById('cineTitle');
  const hint   = document.getElementById('cineHint');
  const layers = gsap.utils.toArray('#hb .layer');            // de abajo arriba: pan, carne, bacon, morada, crujiente, pan
  const imgs   = layers.map(l => l.querySelector('img'));
  const fxAll  = gsap.utils.toArray('#hb .fx');
  const shadow = stage.querySelector('.hb-shadow');
  const glow   = stage.querySelector('.hb-glow');
  const words  = n => gsap.utils.toArray(`.phrase.p${n} .w > span`);
  const phr    = n => document.querySelector(`.phrase.p${n}`);
  const num    = (el, k) => parseFloat(el.dataset[k]) || 0;

  const ready = Promise.all(imgs.map(i => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())));

  const mm = gsap.matchMedia();
  mm.add({
    wide:   '(min-aspect-ratio: 9/10) and (prefers-reduced-motion: no-preference)',
    tall:   '(max-aspect-ratio: 9/10) and (prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, ctx => {
    const { tall, reduce } = ctx.conditions;
    if (reduce) { html.classList.remove('is-cine', 'cine-wait'); return; }  // movimiento reducido: composición estática
    html.classList.add('is-cine');

    const S      = () => stage.offsetWidth;                   // tamaño de la hamburguesa (cuadrada)
    const amp    = tall ? 0.85 : 1;                           // vertical: apertura algo más corta
    const fxAmp  = tall ? 0.42 : 0.5;                         // gotas y migas: desplazamiento contenido
    const fx     = fxAll.filter(el => !(tall && el.classList.contains('fx-extra')));
    const startX = () => innerWidth * (tall ? 0.1 : 0.22);    // fase 1: desplazada a la derecha
    // Altura en el centro: cerrada algo más arriba; abierta baja un poco para compensar que el pan sube más
    const yClosed = () => S() * (tall ? -0.1 : 0.02);
    const yOpen   = () => S() * (tall ? -0.02 : 0.08);

    const steam = stage.querySelector('.steam');

    /* ---- Carga: las capas caen y encajan (algo más rápido que v1) ---- */
    gsap.set(imgs, { autoAlpha: 0, y: () => -S() * 0.6, rotation: () => gsap.utils.random(-6, 6) });
    gsap.set([phr(1), phr(2), phr(3)], { autoAlpha: 0 });
    const intro = gsap.timeline({ paused: true });
    imgs.forEach((img, i) => {
      const t = 0.15 + i * 0.12;
      intro.to(img, { autoAlpha: 1, duration: 0.14, ease: 'none' }, t)
           .to(img, { y: 0, rotation: 0, duration: 0.36, ease: 'power3.in' }, t)
           .to(stage, { scaleY: 0.978, scaleX: 1.01, duration: 0.07, ease: 'power1.out', transformOrigin: '50% 100%' }, t + 0.36)
           .to(stage, { scaleY: 1, scaleX: 1, duration: 0.28, ease: 'elastic.out(1, 0.5)' }, t + 0.43);
    });
    // Arranque único: cuando las capas están decodificadas y la tipografía cargada (máx. 1,5 s),
    // se muestra la portada y empiezan a la vez el titular y la caída de las capas.
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([Promise.all([ready, fontsReady]), new Promise(r => setTimeout(r, 1500))]).then(() => {
      html.classList.remove('cine-wait');
      intro.play();
    });

    /* ---- Flotación muy ligera, siempre activa ----
       Mismos valores que la versión original (1,6 % del tamaño, 0,7°, 2,8 s, ida y vuelta),
       pero como animación CSS en su propio contenedor (#hbFloat): no depende del reloj
       de GSAP, que Safari puede dejar detenido al volver a la página con el botón atrás. */
    const setFloat = () => float.style.setProperty('--float-y', (-S() * 0.016).toFixed(2) + 'px');
    setFloat();
    ScrollTrigger.addEventListener('refresh', setFloat);

    /* ---- Secuencia controlada por scroll ---- */
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#cine',
        start: 'top top',
        end: () => '+=' + Math.round(innerHeight * (tall ? 4.2 : 5.0)),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Entrada · al centro con inclinación (más corta)
    tl.fromTo(hb,
        { x: startX, y: 0, scale: tall ? 0.92 : 1, rotation: 0, rotationX: 0, transformPerspective: 1000 },
        { x: 0, y: yClosed, scale: tall ? 0.84 : 0.76, rotation: -4, rotationX: 14, duration: 1.2, ease: 'power2.inOut' }, 0)
      .to(title, { autoAlpha: 0, y: () => -innerHeight * 0.06, duration: 0.7, ease: 'power2.in' }, 0)
      .to(hint, { autoAlpha: 0, duration: 0.3 }, 0)
      .set(phr(1), { autoAlpha: 1 }, 0.69)
      .fromTo(words(1), { yPercent: 110, y: 0 }, { yPercent: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 0.7)
      .to(words(1), { yPercent: -110, stagger: 0.07, duration: 0.45, ease: 'power2.in' }, 1.6)
      .set(phr(1), { autoAlpha: 0 }, 2.2);

    // Apertura · el pan superior primero; la carne baja ligeramente
    layers.slice().reverse().forEach((layer, i) => {
      tl.to(layer, {
        y: () => S() * num(layer, 'spread') * amp,
        x: () => S() * num(layer, 'x'),
        rotation: num(layer, 'r'),
        duration: 1.4, ease: 'power2.out'
      }, 2.0 + i * 0.09);
    });
    tl.to(hb, { y: yOpen, scale: tall ? 0.78 : 0.76, duration: 1.4, ease: 'power2.inOut' }, 2.0)   // en vertical, algo más estrecha para que quepan las etiquetas
      .fromTo(shadow, { scaleX: 1, autoAlpha: 1 }, { scaleX: 0.62, autoAlpha: 0.45, duration: 1.3, immediateRender: false }, 2.0);
    // Gotas de salsa y migas: salen poco a poco hacia los lados, sin estallido
    fx.forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0, scale: 0.55, x: 0, y: 0, rotation: 0 }, {
        autoAlpha: 1, scale: 0.9,
        x: () => S() * num(el, 'x') * fxAmp,
        y: () => S() * num(el, 'y') * fxAmp,
        rotation: num(el, 'r') * 0.5, duration: 1.4, ease: 'power2.out'
      }, 2.3 + i * 0.06);
    });
    tl.set(phr(2), { autoAlpha: 1 }, 2.79)
      .fromTo(words(2), { yPercent: 110, y: 0 }, { yPercent: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 2.8);

    // Abierta · vaivén lateral muy pequeño de bacon, cebollas y migas; las gotas siguen derivando
    const sway = [null, null, -1, 1, -1, null];               // solo bacon (2), morada (3), crujiente (4)
    layers.forEach((layer, i) => {
      if (!sway[i]) return;
      tl.to(layer, {
        x: () => S() * (num(layer, 'x') + sway[i] * 0.022),
        rotation: num(layer, 'r') + sway[i] * 1.6,
        duration: 2.4, ease: 'sine.inOut'
      }, 3.5 + i * 0.05);
    });
    fx.forEach(el => tl.to(el, {
      x: () => S() * num(el, 'x') * fxAmp * 1.14,
      y: () => S() * (num(el, 'y') * fxAmp * 1.1 + 0.03),
      rotation: num(el, 'r') * 0.65, duration: 2.4, ease: 'sine.inOut'
    }, 3.5));
    // Etiquetas de ingredientes: aparecen una tras otra al terminar la apertura y se van antes del cierre
    const tags = gsap.utils.toArray('#hb .tag')
      .filter(t => !(tall && t.classList.contains('tag-hide-m')))
      .sort((a, b) => num(a, 'i') - num(b, 'i'));
    tags.forEach((t, i) => {
      const at = 3.5 + i * 0.28;
      const dir = t.classList.contains('tag-l') ? 1 : -1;
      tl.fromTo(t.querySelector('.tag-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, at)
        .fromTo(t.querySelector('.tag-dot'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'back.out(2)' }, at + 0.35)
        .fromTo(t.querySelector('.tag-txt'), { autoAlpha: 0, x: dir * 8 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }, at + 0.4)
        .to(t, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 5.45 + i * 0.04);
    });
    tl.to(words(2), { yPercent: -110, stagger: 0.07, duration: 0.45, ease: 'power2.in' }, 5.6)
      .set(phr(2), { autoAlpha: 0 }, 6.2);

    // Cierre pausado · las capas vuelven, las gotas se desvanecen cayendo un poco
    layers.forEach((layer, i) => tl.to(layer, { y: 0, x: 0, rotation: 0, duration: 2.0, ease: 'power2.inOut' }, 6.0 + i * 0.1));
    fx.forEach(el => tl.to(el, {
      x: () => S() * num(el, 'x') * fxAmp * 1.25,
      y: () => S() * (num(el, 'y') * fxAmp * 1.2 + 0.12),
      autoAlpha: 0, scale: 0.75, duration: 1.4, ease: 'power1.in'
    }, 6.0));
    tl.to(hb, { rotation: 0, rotationX: 0, scale: tall ? 0.9 : 0.86, y: yClosed, duration: 2.2, ease: 'power2.inOut' }, 6.0)
      .to(shadow, { scaleX: 1, autoAlpha: 1, duration: 1.6 }, 6.8)
      .fromTo(glow, { autoAlpha: 1 }, { autoAlpha: 0.75, duration: 1.0, immediateRender: false }, 2.0)
      .to(glow, { autoAlpha: 1, duration: 1.4 }, 7.0)
      // Vapor detrás de la hamburguesa: aparece al cerrarse y se disipa
      // Vapor detrás de las capas: nace en el pan, sube con un leve vaivén y se desvanece antes del final
      .fromTo(steam, { autoAlpha: 0, y: () => S() * 0.08, x: 0, scale: 0.86 },
                     { autoAlpha: tall ? 0.42 : 0.5, y: () => -S() * 0.06, x: () => S() * 0.015, scale: 0.98, duration: 1.4, ease: 'sine.out' }, 7.0)
      .to(steam, { autoAlpha: 0, y: () => -S() * 0.22, x: () => -S() * 0.01, scale: 1.1, duration: 1.4, ease: 'sine.in' }, 8.4)
      .set(phr(3), { autoAlpha: 1 }, 8.19)
      .fromTo(words(3), { yPercent: 110, y: 0 }, { yPercent: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out' }, 8.2);

    // Final · breve pausa antes de liberar el scroll
    tl.to({}, { duration: 0.6 }, 10.0);
    // En vertical, la hamburguesa se asienta un poco más abajo para enlazar con la cinta sin hueco
    if (tall) {
      tl.to(hb, { y: () => S() * 0.08, duration: 1.0, ease: 'power1.inOut' }, 9.6)
        // la frase final crece y baja un poco con la hamburguesa para no dejar un hueco negro arriba
        .fromTo(phr(3), { scale: 1, y: 0 }, { scale: 1.22, y: () => S() * 0.07, transformOrigin: '0% 0%', duration: 1.4, ease: 'power1.inOut', immediateRender: false }, 9.2);
    }

    return () => { intro.kill(); ScrollTrigger.removeEventListener('refresh', setFloat); html.classList.remove('is-cine'); };
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  // Al volver con el botón atrás (página restaurada de caché): reactivar el reloj de GSAP y recalcular
  addEventListener('pageshow', e => { if (e.persisted) { gsap.ticker.wake(); ScrollTrigger.refresh(); } });
})();
