/* =========================================================
   LASOGA URBAN FOOD · carta.js
   Pinta la carta desde assets/data/carta.js: pestañas por categoría
   (enlazables con #categoria), búsqueda y aparición de tarjetas.
   ========================================================= */
(() => {
  const DATA = window.LASOGA_CARTA;
  const ROOT = '../';                                   // rutas de fotos relativas a la raíz de la web
  const cats = document.getElementById('cats');
  const grid = document.getElementById('grid');
  const title = document.getElementById('listTitle');
  const count = document.getElementById('listCount');
  const empty = document.getElementById('empty');
  const q = document.getElementById('q');
  if (!DATA || !grid) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ALL = { id: 'todo', nombre: 'Toda la carta' };
  const CATS = [ALL, ...DATA.categorias];
  const order = id => DATA.categorias.findIndex(c => c.id === id);
  const ALL_SORTED = DATA.productos.map((p, i) => [p, i]).sort((a, b) => order(a[0].categoria) - order(b[0].categoria) || a[1] - b[1]).map(x => x[0]);
  const byCat = id => (id === 'todo' ? ALL_SORTED : DATA.productos.filter(p => p.categoria === id));
  const catName = id => (CATS.find(c => c.id === id) || {}).nombre || '';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const price = n => (typeof n === 'number' ? n.toFixed(2).replace('.', ',') + ' ' + DATA.moneda : 'Precio por confirmar');

  /* ---- Tarjeta compacta ---- */
  const IMG = ROOT + 'assets/carta/';
  const ph = (i, big) => `<div class="ph" style="--px:${20 + (i * 23) % 60}%;--py:${15 + (i * 37) % 50}%">
      <span class="ph-mark" aria-hidden="true">Lasoga</span><span class="ph-tag">Fotografía pendiente</span></div>`;
  const byId = id => DATA.productos.find(p => p.id === id);
  function card(p, i) {
    const media = p.foto
      ? `<img src="${IMG}${esc(p.foto)}-480.webp" srcset="${IMG}${esc(p.foto)}-480.webp 480w, ${IMG}${esc(p.foto)}-960.webp 960w"
           sizes="(max-width:600px) 46vw, (max-width:1100px) 32vw, 320px" width="480" height="384" alt="" loading="lazy" decoding="async">`
      : ph(i);
    return `
      <button type="button" class="dish${p.foto ? ' has-photo' : ''}${reduce ? '' : ' pre'}" data-id="${esc(p.id)}"
        aria-haspopup="dialog" aria-label="${esc(p.nombre)}, ${typeof p.precio === 'number' ? price(p.precio) : 'precio pendiente'}. Ver detalle">
        <span class="dish-media">${p.destacado ? '<span class="dish-flag">La de la casa</span>' : ''}${media}</span>
        <span class="dish-body">
          <span class="dish-name">${esc(p.nombre)}</span>
          <span class="dish-price${typeof p.precio === 'number' ? '' : ' is-pending'}">${price(p.precio)}</span>
        </span>
      </button>`;
  }

  /* ---- Detalle del plato (modal con <dialog>) ---- */
  const modal = document.getElementById('dishModal');
  const mBody = document.getElementById('dmContent');
  const panel = modal && modal.querySelector('.dm-panel');
  const counter = document.getElementById('dmCount');
  let lastCard = null, shown = [], cur = 0;

  function renderDish(p, i) {
    const alg = (p.alergenos || []).length
      ? p.alergenos.map(k => `<span class="chip alg">${esc(DATA.ALERGENOS[k] || k)}</span>`).join('')
      : '<span class="chip pend">Pendiente de confirmar</span>';
    const ingr = (p.ingredientes || []).length
      ? `<div><dt>Ingredientes</dt><dd>${p.ingredientes.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</dd></div>` : '';
    const notes = [p.nombreProvisional && 'Nombre provisional', p.fotoProbable && 'Foto por confirmar']
      .filter(Boolean).map(t => `<span class="chip pend">${t}</span>`).join('');
    mBody.innerHTML = `
      <figure class="dm-media">${p.foto
        ? `<img src="${IMG}${esc(p.foto)}-960.webp" srcset="${IMG}${esc(p.foto)}-480.webp 480w, ${IMG}${esc(p.foto)}-960.webp 960w"
             sizes="(max-width:600px) 100vw, 560px" width="960" height="768" alt="${esc(p.nombre)}" draggable="false" onload="this.classList.add('ok')">`
        : ph(i, true)}</figure>
      <div class="dm-body">
        <p class="dm-cat">${esc(catName(p.categoria))}</p>
        <div class="dm-top"><h2 class="dm-name" id="dmTitle">${esc(p.nombre)}</h2>
          <span class="dm-price${typeof p.precio === 'number' ? '' : ' is-pending'}">${price(p.precio)}</span></div>
        ${p.descripcion ? `<p class="dm-desc">${esc(p.descripcion)}</p>` : ''}
        ${notes ? `<div class="dm-notes">${notes}</div>` : ''}
        <dl class="dish-meta">${ingr}<div><dt>Alérgenos</dt><dd>${alg}</dd></div></dl>
      </div>`;
    counter.textContent = `${i + 1} / ${shown.length}`;
    // precarga de los vecinos para que el deslizamiento sea inmediato
    [shown[i + 1], shown[i - 1]].forEach(n => { if (n && n.foto) (new Image()).src = `${IMG}${n.foto}-960.webp`; });
  }
  // la tarjeta del plato visible: punto de origen al abrir y destino al cerrar
  function originFrom(card) {
    if (!card || reduce) return;
    const r = card.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < innerHeight;
    panel.style.setProperty('--fx', visible ? Math.round(r.left + r.width / 2 - innerWidth / 2) + 'px' : '0px');
    panel.style.setProperty('--fy', visible ? Math.round(r.top + r.height / 2 - innerHeight / 2) + 'px' : '18px');
    panel.style.setProperty('--fs', visible ? Math.max(0.3, Math.min(0.7, r.width / Math.min(560, innerWidth - 32))).toFixed(2) : '.97');
  }
  function openDish(i) {
    cur = i; renderDish(shown[i], i);
    panel.scrollTop = 0;
    document.documentElement.classList.add('modal-open');
    originFrom(lastCard);
    modal.showModal();
    requestAnimationFrame(() => modal.classList.add('show'));
  }
  // pasar al plato siguiente/anterior: el contenido sale entero por un lado y entra por el otro
  let busy = false;
  const W = () => panel.clientWidth;
  function slide(x, ms, ease) {
    mBody.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
    mBody.style.transform = x ? `translate3d(${x}px,0,0)` : '';
  }
  function go(dir, fromX) {
    if (!modal.open || busy || shown.length < 2) return;
    busy = true;
    const next = (cur + dir + shown.length) % shown.length;
    const swap = () => {
      cur = next; renderDish(shown[cur], cur); panel.scrollTop = 0;
      lastCard = grid.querySelector(`.dish[data-id="${CSS.escape(shown[cur].id)}"]`);
    };
    if (reduce) { swap(); busy = false; return; }
    const dist = W() * (fromX ? 1 : 0.9);
    slide(-dir * dist, 220, 'cubic-bezier(.4,0,1,1)');                 // sale
    setTimeout(() => {
      swap();
      slide(dir * dist, 0);                                            // entra por el otro lado
      requestAnimationFrame(() => requestAnimationFrame(() => {
        slide(0, 380, 'cubic-bezier(.22,1,.36,1)');
        setTimeout(() => { mBody.style.transition = ''; busy = false; }, 380);
      }));
    }, 220);
  }
  let closing = 0;
  function closeDish() {
    if (!modal.open || closing) return;
    originFrom(lastCard);
    modal.classList.remove('show');
    closing = setTimeout(() => {
      closing = 0; modal.close();
      document.documentElement.classList.remove('modal-open');
      if (lastCard && lastCard.isConnected) lastCard.focus({ preventScroll: true });
    }, reduce ? 0 : 420);
  }
  if (modal) {
    grid.addEventListener('click', e => {
      const c = e.target.closest('.dish'); if (!c) return;
      lastCard = c; openDish(shown.findIndex(p => p.id === c.dataset.id));
    });
    modal.addEventListener('cancel', e => { e.preventDefault(); closeDish(); });           // Escape
    modal.addEventListener('click', e => { if (e.target === modal) closeDish(); });          // fuera del panel
    modal.querySelector('.dm-close').addEventListener('click', closeDish);
    modal.querySelector('.dm-prev').addEventListener('click', () => go(-1));
    modal.querySelector('.dm-next').addEventListener('click', () => go(1));
    modal.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    // Deslizar con el dedo: el contenido sigue al dedo y cambia de plato al soltar
    let sx = 0, sy = 0, dx = 0, axis = null;
    panel.addEventListener('touchstart', e => {
      if (busy) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; axis = null;
    }, { passive: true });
    panel.addEventListener('touchmove', e => {
      const x = e.touches[0].clientX - sx, y = e.touches[0].clientY - sy;
      if (!axis && Math.abs(x) + Math.abs(y) > 8) axis = Math.abs(x) > Math.abs(y) * 1.2 ? 'x' : 'y';
      if (axis !== 'x' || reduce) return;
      dx = x;
      slide(dx, 0);
    }, { passive: true });
    panel.addEventListener('touchend', () => {
      if (axis !== 'x') return;
      if (Math.abs(dx) > Math.min(80, W() * 0.2)) go(dx < 0 ? 1 : -1, true);
      else slide(0, 300, 'cubic-bezier(.22,1,.36,1)');                  // vuelve a su sitio
      axis = null;
    });
  }

  /* ---- Aparición al desplazarse ---- */
  const io = !reduce && 'IntersectionObserver' in window
    ? new IntersectionObserver(es => {
        let k = 0;
        es.filter(e => e.isIntersecting).forEach(e => {
          e.target.style.setProperty('--d', (Math.min(k++, 7) * 50) + 'ms');   // 50 ms entre tarjetas del mismo lote
          e.target.classList.add('in'); io.unobserve(e.target);
        });
      },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;

  function paint(list, heading) {
    shown = list;
    grid.innerHTML = list.map(card).join('');
    title.textContent = heading;
    count.textContent = list.length === 1 ? '1 plato' : `${list.length} platos`;
    empty.hidden = list.length > 0;
    const cards = grid.querySelectorAll('.dish.pre');
    if (io) cards.forEach(c => io.observe(c));
    else cards.forEach(c => c.classList.add('in'));
  }

  // Transición suave entre categorías: fundido de la rejilla
  let swapTimer;
  function swap(list, heading) {
    if (reduce || !grid.children.length) return paint(list, heading);
    grid.style.minHeight = grid.offsetHeight + 'px';
    grid.classList.add('out');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      paint(list, heading); grid.classList.remove('out');
      requestAnimationFrame(() => { grid.style.minHeight = ''; });
    }, 180);
  }

  /* ---- Pestañas ---- */
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cat'; b.id = 'tab-' + c.id; b.dataset.cat = c.id;
    b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'grid'); b.setAttribute('aria-selected', 'false');
    b.innerHTML = `${esc(c.nombre)} <small>${byCat(c.id).length}</small>`;
    b.addEventListener('click', () => {
      if (location.hash !== '#' + c.id) location.hash = c.id; else select(c.id);   // el hash permite enlazar y volver atrás
    });
    cats.appendChild(b);
  });
  // Flechas izquierda/derecha entre pestañas
  cats.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = [...cats.children]; const i = tabs.indexOf(document.activeElement);
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus(); next.click();
  });

  let current = null;
  function select(id, scroll) {
    if (!CATS.some(c => c.id === id)) id = 'todo';
    current = id;
    if (q.value) q.value = '';
    [...cats.children].forEach(b => {
      const on = b.dataset.cat === id;
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      if (on && scroll !== false) cats.scrollTo({ left: b.offsetLeft - (cats.clientWidth - b.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    });
    swap(byCat(id), catName(id));
    // si el listado ya quedó por encima, vuelve a su inicio (bajo la barra de categorías)
    const bar = document.querySelector('.cat-bar');
    const top = grid.parentElement.getBoundingClientRect().top - bar.getBoundingClientRect().bottom - 16;
    if (scroll !== false && top < 0) scrollBy({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
  const fromHash = () => select(decodeURIComponent(location.hash.slice(1)));
  addEventListener('hashchange', fromHash);

  /* ---- Búsqueda en toda la carta ---- */
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let qTimer;
  q.addEventListener('input', () => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      const term = norm(q.value.trim());
      if (!term) return select(current, false);
      [...cats.children].forEach(b => b.setAttribute('aria-selected', 'false'));
      const hits = DATA.productos.filter(p =>
        [p.nombre, p.descripcion, catName(p.categoria)].some(v => norm(v).includes(term)));
      swap(hits, `Resultados: “${q.value.trim()}”`);
    }, 160);
  });

  location.hash ? fromHash() : select('todo', false);

  /* ---- Fotografías recibidas sin plato asignado (solo para la demo) ---- */
  const loose = document.getElementById('loose');
  if (loose && (DATA.fotosSinAsignar || []).length) {
    loose.querySelector('.loose-grid').innerHTML = DATA.fotosSinAsignar.map(h =>
      `<figure><img src="${IMG}pendientes/${esc(h)}-480.webp" width="480" height="384" alt="Fotografía pendiente de asignar a un plato" loading="lazy" decoding="async"></figure>`).join('');
    loose.hidden = false;
  }
})();
