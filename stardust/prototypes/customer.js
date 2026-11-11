/* customer.js — /customer/ behaviours observed on live: the banner slider (react-slick: infinite loop,
   slidesToShow 2 on a fresh load at every width (live 360 too; live drops to 1 only after a
   resize across 767px), 500ms slide, prev/next arrows, dots, autoplay when data-autoplay is set).
   Loop clones are presentational (no href, alt="", aria-hidden). */
(() => {
  const root = document.querySelector('[data-slider]');
  if (!root) return;
  const list = root.querySelector('.slick-list');
  const track = root.querySelector('.slick-track');
  const real = [...track.children];
  const n = real.length;
  const dots = [...root.querySelectorAll('.slick-dots li')];
  const mq = window.matchMedia('(max-width: 767px)');
  let index = Number(root.dataset.start || 0);
  let show = 2;
  let w = 0;
  let busy = false;

  const clone = (s) => {
    const c = s.cloneNode(true);
    c.classList.add('slick-cloned');
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a').forEach((a) => { a.removeAttribute('href'); a.setAttribute('tabindex', '-1'); });
    c.querySelectorAll('img').forEach((i) => { i.alt = ''; });
    return c;
  };

  const paint = (animate) => {
    const slides = [...track.children];
    w = Math.ceil(list.clientWidth / show);
    slides.forEach((s, i) => {
      s.style.width = `${w}px`;
      const pos = i - show;
      s.classList.toggle('slick-active', pos >= index && pos < index + show);
      s.classList.toggle('slick-current', pos === index);
    });
    track.style.width = `${w * slides.length}px`;
    track.style.transition = animate ? 'transform 500ms ease' : 'none';
    track.style.transform = `translate3d(${-(show + index) * w}px, 0px, 0px)`;
    const di = ((index % n) + n) % n;
    dots.forEach((d, i) => d.classList.toggle('slick-active', i === di));
  };

  const build = (e) => {
    track.querySelectorAll('.slick-cloned').forEach((c) => c.remove());
    show = e && e.matches ? 1 : 2;
    for (let i = 0; i < show; i += 1) {
      track.insertBefore(clone(real[n - 1 - i]), track.firstChild);
      track.appendChild(clone(real[i]));
    }
    paint(false);
  };

  const go = (to) => {
    if (busy) return;
    busy = true;
    index = to;
    paint(true);
    window.setTimeout(() => {
      if (index >= n || index < 0) { index = ((index % n) + n) % n; paint(false); }
      busy = false;
    }, 500);
  };

  root.querySelector('.slick-prev').addEventListener('click', () => go(index - 1));
  root.querySelector('.slick-next').addEventListener('click', () => go(index + 1));
  dots.forEach((d, i) => d.querySelector('button').addEventListener('click', () => go(i)));
  mq.addEventListener('change', build);
  window.addEventListener('resize', () => paint(false));
  build();

  const every = Number(root.dataset.autoplay || 0);
  if (every) {
    let paused = false;
    root.addEventListener('mouseenter', () => { paused = true; });
    root.addEventListener('mouseleave', () => { paused = false; });
    window.setInterval(() => { if (!paused) go(index + 1); }, every);
  }
})();
