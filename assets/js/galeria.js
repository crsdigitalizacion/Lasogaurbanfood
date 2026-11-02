/* =========================================================
   LASOGA URBAN FOOD · galeria.js
   1. Portada: entrada de las tres fotos desde distintas direcciones y
      separación ligada al scroll (la flotación continua es CSS).
   2. Galería: entradas variadas, parallax y escala ligados al scroll.
   3. Visor ampliado con flechas, teclado, deslizar y contador.
   Todas las animaciones GSAP viven en gsap.matchMedia → se limpian solas.
   ========================================================= */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showHero = () => document.documentElement.classList.remove('gh-wait');
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const heroReady = Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]);

  /* ================= Animaciones (solo con GSAP y sin movimiento reducido) ================= */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia();
    mm.add({ narrow: '(max-width: 860px)', motion: '(prefers-reduced-motion: no-preference)' }, ctx => {
      const { narrow, motion } = ctx.conditions;
      if (!motion) return;

      /* --- Portada: entrada al cargar --- */
      const cards = gsap.utils.toArray('.gh-card');
      const from = [
        { xPercent: 60, yPercent: -40, rotation: 8 },       // fondo: desde arriba a la derecha
        { xPercent: -70, yPercent: 30, rotation: -10 },     // medio: desde la izquierda
        { xPercent: 20, yPercent: 80, rotation: 6 }         // frente: desde abajo
      ];
      const intro = cards.map((c, i) => gsap.from(c, { ...from[i], autoAlpha: 0, scale: 0.9, duration: 1.3, delay: 0.25 + i * 0.16, ease: 'expo.out', paused: true }));
      heroReady.then(() => intro.forEach(t => t.play()));     // entran cuando la portada se muestra

      /* --- Portada: al bajar, las fotos se separan y dejan paso a la galería --- */
      const sep = [
        { xPercent: narrow ? 30 : 45, yPercent: -55, rotation: 10, scale: 0.85 },
        { xPercent: narrow ? -45 : -70, yPercent: 10, rotation: -12, scale: 0.92 },
        { xPercent: narrow ? 20 : 30, yPercent: 60, rotation: 5, scale: 1.12 }
      ];
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.gh', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      cards.forEach((c, i) => tl.fromTo(c, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1 },
        { ...sep[i], autoAlpha: i === 2 ? 1 : 0.25, ease: 'power1.in', immediateRender: false }, 0));
      tl.fromTo('.gh-copy', { yPercent: 0, autoAlpha: 1 }, { yPercent: -30, autoAlpha: 0, ease: 'power1.in', immediateRender: false }, 0);

      /* --- Galería: cada foto con una entrada distinta (data-a) --- */
      const kinds = {
        left:  { x: -70, rotation: -2 },
        right: { x: 70, rotation: 2 },
        up:    { y: 90 },
        zoom:  { scale: 0.86 },
        tilt:  { y: 60, rotationX: 12, transformPerspective: 900, transformOrigin: '50% 100%' }
      };
      gsap.utils.toArray('.gt').forEach(el => {
        const k = kinds[el.dataset.a] || kinds.up;
        const f = { ...k };
        if (narrow) { if (f.x) f.x *= 0.5; if (f.y) f.y *= 0.6; }
        gsap.fromTo(el, { ...f, autoAlpha: 0 },
          { x: 0, y: 0, rotation: 0, rotationX: 0, scale: 1, autoAlpha: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 62%', scrub: 0.5 } });
        // parallax + pequeño cambio de escala dentro del marco (más marcado en las grandes)
        const img = el.querySelector('img'), big = el.dataset.big === '1';
        gsap.fromTo(img, { yPercent: big ? -5 : -2, scale: big ? 1.1 : 1.05 },
          { yPercent: big ? 5 : 2, scale: 1, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    addEventListener('pageshow', e => { if (e.persisted) { gsap.ticker.wake(); ScrollTrigger.refresh(); } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  // Las entradas ya están preparadas: se muestra la portada (o enseguida si no hay GSAP)
  heroReady.then(showHero);

  /* ================= Visor ampliado ================= */
  const lb = document.getElementById('lb');
  if (!lb) return;
  const items = [...document.querySelectorAll('.gt button')].map(b => ({
    el: b, src: b.dataset.full, alt: b.querySelector('img').alt, cap: b.dataset.cap || ''
  }));
  const slide = lb.querySelector('.lb-slide'), img = lb.querySelector('.lb-img'), cap = lb.querySelector('.lb-cap');
  const num = lb.querySelector('.lb-count b'), tot = lb.querySelector('.lb-count span');
  const pad = n => String(n).padStart(2, '0');
  tot.textContent = pad(items.length);
  let cur = 0, busy = false, closing = 0;

  function show(i) {
    cur = (i + items.length) % items.length;
    const it = items[cur];
    img.src = it.src; img.alt = it.alt;
    cap.innerHTML = it.cap ? `<b>${it.cap}</b>` : '';
    num.textContent = pad(cur + 1);
    [items[cur + 1], items[cur - 1]].forEach(n => { if (n) (new Image()).src = n.src; });   // precarga vecinos
  }
  function originFrom(el) {
    if (reduce || !el) return;
    const r = el.getBoundingClientRect();
    const vis = r.bottom > 0 && r.top < innerHeight;
    slide.style.setProperty('--fx', vis ? Math.round(r.left + r.width / 2 - innerWidth / 2) + 'px' : '0px');
    slide.style.setProperty('--fy', vis ? Math.round(r.top + r.height / 2 - innerHeight / 2) + 'px' : '20px');
    slide.style.setProperty('--fs', vis ? Math.max(0.25, Math.min(0.8, r.width / Math.min(1100, innerWidth))).toFixed(2) : '.96');
  }
  function open(i) {
    show(i); originFrom(items[cur].el);
    document.documentElement.classList.add('lb-open');
    lb.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('show')));
  }
  function close() {
    if (!lb.open || closing) return;
    originFrom(items[cur].el);
    lb.classList.remove('show');
    closing = setTimeout(() => {
      closing = 0; lb.close(); document.documentElement.classList.remove('lb-open');
      items[cur].el.focus({ preventScroll: true });
    }, reduce ? 0 : 420);
  }
  // pasar de foto: sale entera por un lado y entra la siguiente por el otro
  const move = (x, ms, ease) => { slide.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none'; slide.style.transform = x ? `translate3d(${x}px,0,0)` : ''; };
  function go(dir) {
    if (!lb.open || busy) return;
    busy = true;
    if (reduce) { show(cur + dir); busy = false; return; }
    const d = innerWidth;
    move(-dir * d, 240, 'cubic-bezier(.4,0,1,1)');
    setTimeout(() => {
      show(cur + dir); move(dir * d, 0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        move(0, 420, 'cubic-bezier(.22,1,.36,1)');
        setTimeout(() => { slide.style.transition = ''; slide.style.transform = ''; busy = false; }, 420);
      }));
    }, 240);
  }

  items.forEach((it, i) => it.el.addEventListener('click', () => open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => go(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => go(1));
  lb.addEventListener('cancel', e => { e.preventDefault(); close(); });
  // cerrar al pulsar fuera de la foto (en el fondo, no en la imagen ni en los botones)
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage') || e.target === slide) close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  // deslizar con el dedo: la foto sigue al dedo y cambia al soltar
  const stage = lb.querySelector('.lb-stage');
  let sx = 0, sy = 0, dx = 0, axis = null;
  stage.addEventListener('touchstart', e => { if (busy) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; axis = null; }, { passive: true });
  stage.addEventListener('touchmove', e => {
    const x = e.touches[0].clientX - sx, y = e.touches[0].clientY - sy;
    if (!axis && Math.abs(x) + Math.abs(y) > 8) axis = Math.abs(x) > Math.abs(y) ? 'x' : 'y';
    if (axis === 'x' && !reduce) { dx = x; move(dx, 0); }
  }, { passive: true });
  stage.addEventListener('touchend', () => {
    if (axis !== 'x') return;
    if (Math.abs(dx) > Math.min(80, innerWidth * 0.2)) go(dx < 0 ? 1 : -1);
    else move(0, 300, 'cubic-bezier(.22,1,.36,1)');
    axis = null;
  });
})();
