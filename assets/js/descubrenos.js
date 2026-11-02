/* =========================================================
   LASOGA URBAN FOOD · descubrenos.js  (v2)
   1. Portada fijada (scrub, reversible): el titular crece y se abre,
      el entrecot aparece desde el centro y llena la pantalla,
      entra "El sabor no se negocia".
   2. Platos: entrada lateral con profundidad ligada al scroll (sin pin).
   Todo dentro de gsap.matchMedia → se revierte solo al cambiar de tamaño
   o de preferencia de movimiento; nada se acumula.
   ========================================================= */
(() => {
  const html = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('dz-cine', 'dz-wait'); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });   // la barra de Safari no recalcula los triggers

  const mm = gsap.matchMedia();
  mm.add({
    wide:   '(min-width: 861px) and (prefers-reduced-motion: no-preference)',
    narrow: '(max-width: 860px) and (prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, ctx => {
    const { narrow, reduce } = ctx.conditions;
    if (reduce) { html.classList.remove('dz-cine'); return; }
    html.classList.add('dz-cine');

    /* ---- 1 · Portada fijada: el titular se convierte en ventana y se abre por el punto ---- */
    const q = s => document.querySelector(s);
    const head = q('.dz-head:not(.dz-head-k)'), knock = q('.dz-knock'), kHead = q('.dz-head-k');
    const kTitle = q('.dz-head-k .dz-title'), dot = q('.dz-head-k .dot'), rimg = q('.dz-reveal img');
    // centro del punto, medido sin transformaciones (offsetLeft/Top), relativo a la capa de recorte
    const dotCenter = () => {
      let x = dot.offsetWidth / 2, y = dot.offsetHeight / 2, el = dot;
      while (el && el !== knock) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x, y };
    };
    const origin = () => { const c = dotCenter(); return `${c.x}px ${c.y}px`; };
    // escala para que el punto cubra toda la pantalla desde su posición
    const zoom = () => {
      const c = dotCenter(), w = knock.offsetWidth, h = knock.offsetHeight;
      const far = Math.max(Math.hypot(c.x, c.y), Math.hypot(w - c.x, c.y), Math.hypot(c.x, h - c.y), Math.hypot(w - c.x, h - c.y));
      return (far * 2 / dot.offsetWidth) * 1.08;
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.dz-cine', start: 'top top',
        end: () => '+=' + Math.round(innerHeight * (narrow ? 1.6 : 2.1)),
        pin: '.dz-stage', scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true
      }
    });
    // fromTo en todo: con invalidateOnRefresh, un .to() volvería a leer como inicio el estado final
    tl.fromTo(['.dz-head:not(.dz-head-k) .dz-sub', '.dz-head:not(.dz-head-k) .eyebrow', '.dz-hint'], { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.35 }, 0)
      .fromTo('.dz-lights', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.7 }, 0.1)
      // 1) las letras se rellenan con la foto: el titular visible se funde mientras las ventanas se abren
      .fromTo(kHead, { color: '#0e0d0c' }, { color: '#ffffff', duration: 0.55, ease: 'power1.inOut' }, 0.15)
      .fromTo(head, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, ease: 'power1.inOut' }, 0.3)
      .fromTo(kTitle, { scale: 1 }, { scale: 1.06, duration: 0.6, ease: 'power1.out' }, 0.15)
      .fromTo(rimg, { scale: 1.3 }, { scale: 1.22, duration: 0.6 }, 0.15)
      // 2) la cámara entra por el punto de "COMER." hasta que la foto llena la pantalla
      .fromTo(knock, { scale: 1, transformOrigin: origin }, { scale: zoom, transformOrigin: origin, duration: 1.2, ease: 'power3.in' }, 0.75)
      .fromTo(rimg, { scale: 1.22 }, { scale: 1.03, duration: 1.2, ease: 'power2.inOut', immediateRender: false }, 0.75)
      .fromTo(knock, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 1.88)
      // 3) entra "El sabor no se negocia"
      .fromTo('.dz-reveal-txt .eyebrow', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.95)
      .fromTo('.dz-h2 .w > span', { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 2.0)
      .to({}, { duration: 0.35 });

    /* ---- 2 · Platos: entrada lateral con profundidad ---- */
    gsap.utils.toArray('.dz-dish').forEach(d => {
      const dir = d.classList.contains('rev') ? 1 : -1;      // lado desde el que entra
      const fig = d.querySelector('.dz-dish-img'), img = fig.querySelector('img');
      const words = d.querySelectorAll('.dz-dish-t .w');
      gsap.timeline({ scrollTrigger: { trigger: d, start: 'top 95%', end: 'top 40%', scrub: 0.6 } })
        .fromTo(fig, { xPercent: dir * (narrow ? 12 : 18), rotationY: -dir * (narrow ? 8 : 14), scale: 0.86, autoAlpha: 0.25, transformPerspective: 1200 },
                     { xPercent: 0, rotationY: 0, scale: 1, autoAlpha: 1, ease: 'power2.out' }, 0)
        .fromTo(words, { x: -dir * (narrow ? 40 : 90), autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.12, ease: 'power2.out' }, 0.15);
      gsap.fromTo(img, { yPercent: narrow ? -4 : -8 }, { yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    return () => html.classList.remove('dz-cine');
  });

  // Volver con el botón atrás (página restaurada de caché): recalcular sin crear nada nuevo
  addEventListener('pageshow', e => { if (e.persisted) ScrollTrigger.refresh(); });
  // La pantalla fija ya está montada (al montarla el navegador reinicia las animaciones CSS):
  // ahora, con la tipografía lista (máx. 1,5 s), se muestra la portada y su entrada arranca una sola vez.
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(() => {
    ScrollTrigger.refresh();
    html.classList.remove('dz-wait');
  });
})();
