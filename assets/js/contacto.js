/* =========================================================
   LASOGA URBAN FOOD · contacto.js  (v2)
   - Horario desde assets/data/negocio.js (mismos datos que el pie);
     marca el día de hoy según la fecha de Logroño. No muestra
     "abierto ahora": el horario es de Google y puede no estar vigente.
   - Líneas de luz de la portada ligadas al scroll (variable --p).
   - Titular: espera a la tipografía (máx. 1,5 s) para entrar una sola vez.
   - "Copiar número" como alternativa al botón de llamar.
   ========================================================= */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = window.LASOGA_NEGOCIO;

  /* Titular: arranque único con la tipografía cargada */
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(() => html.classList.remove('ct-wait'));

  /* Horario con el día de hoy (fecha en Logroño) */
  const dl = document.getElementById('ctHours');
  if (N && dl) {
    const wd = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long' }).format(new Date()).toLowerCase();
    dl.innerHTML = N.horario.map(d => {
      const isToday = d.dias.toLowerCase() === wd;
      const slots = d.horas ? d.horas.map(h => `<span class="ct-slot">${h}</span>`).join('') : '<span class="ct-slot">Cerrado</span>';
      return `<div class="ct-day${d.horas ? '' : ' off'}${isToday ? ' today' : ''}"><dt>${d.dias}${isToday ? '<span class="ct-today">Hoy</span>' : ''}</dt><dd>${slots}</dd></div>`;
    }).join('');
  }

  /* Líneas de luz que reaccionan al scroll (solo mientras la portada está en pantalla) */
  const hero = document.querySelector('.ct-hero');
  if (hero && !reduce) {
    let ticking = false, visible = true;
    const update = () => {
      const p = Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight)));
      hero.style.setProperty('--p', p.toFixed(3));
      ticking = false;
    };
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(hero);
    addEventListener('scroll', () => { if (visible && !ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Copiar número */
  const btn = document.getElementById('ctCopy');
  if (btn && N) btn.addEventListener('click', () => {
    const done = () => { btn.classList.add('ok'); btn.textContent = 'Número copiado'; setTimeout(() => { btn.classList.remove('ok'); btn.textContent = 'Copiar número'; }, 2200); };
    const fallback = () => {
      const num = document.querySelector('.ct-num'), r = document.createRange(); r.selectNodeContents(num);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Número seleccionado';
    };
    try { navigator.clipboard.writeText(N.telefono).then(done, fallback); } catch (e) { fallback(); }
  });
})();
