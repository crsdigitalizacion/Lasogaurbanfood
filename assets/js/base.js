/* =========================================================
   LASOGA URBAN FOOD · base.js
   Comportamiento compartido: menú fijo, menú móvil, barra de
   progreso, apariciones al desplazarse y enlaces a páginas
   aún en preparación (data-soon).
   ========================================================= */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Empezar siempre arriba.
     El navegador (o el visor que aloja la web) puede restaurar la posición de la
     página anterior al cargar o al volver atrás. Mientras el usuario no haya tocado,
     cualquier desplazamiento que no provoque él se anula. Se basa en eventos, no en
     temporizadores, y se desactiva en cuanto hay interacción real. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const anchorTarget = () => location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  let userMoved = false;
  const onUser = () => { userMoved = true; };
  const guard = () => { if (!userMoved && scrollY !== 0 && !anchorTarget()) scrollTo(0, 0); };
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(t => addEventListener(t, onUser, { passive: true, capture: true }));
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') onUser(); }, { passive: true, capture: true });
  addEventListener('scroll', guard, { passive: true });
  addEventListener('load', guard);
  addEventListener('pageshow', e => { if (e.persisted) { userMoved = false; guard(); } });
  guard();

  /* Menú fijo + barra de progreso */
  const nav = document.querySelector('.nav');
  const bar = document.querySelector('.progress');
  let ticking = false;
  function onScroll() {
    const y = scrollY;
    nav && nav.classList.toggle('solid', y > 40);
    const max = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* Menú móvil */
  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  function setMenu(open) {
    if (!btn || !drawer) return;
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn && btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Páginas interiores todavía no publicadas en esta vista previa */
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let tTimer;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-soon]');
    if (!a) return;
    e.preventDefault();
    toast.textContent = `“${a.dataset.soon}” estará disponible en la siguiente fase.`;
    toast.classList.add('show');
    clearTimeout(tTimer); tTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  });

  /* Transición entre páginas: fundido de salida antes de cambiar de página */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || reduce || e.defaultPrevented || a.hasAttribute('data-soon') || a.target === '_blank' ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:|^file:/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;   // anclas de la misma página
    e.preventDefault();
    root.classList.add('leaving');
    setTimeout(() => { location.href = url.href; }, 200);
  });
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('leaving'); });   // volver atrás desde caché

  /* Aparición progresiva */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(el => io.observe(el));
  } else {
    rv.forEach(el => el.classList.add('in'));
  }
})();
