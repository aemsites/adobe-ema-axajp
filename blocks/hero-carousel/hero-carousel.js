/**
 * hero-carousel — home key-visual carousel (index.css `.hero`, live react-slick re-authored).
 *
 * Authoring rows: one row per slide: [link <p> wrapping the PC picture] [SP picture].
 *
 * Decode tier: reconstructive + JS. Per row the authored link <p> is MOVED into a slide; the
 * PC picture stays inside the authored link (wrapped in a PC slot) and the SP picture is MOVED
 * into the same link (SP slot), so one link serves both renditions as on live (<picture> with an
 * SP <source>). Arrows, dots and the pause button are generated controls without authored
 * text (EW7). Behaviour as observed on live: starts on slide 1, autoplay every 5 s (the active
 * dot's progress bar runs 5 s linear), track transform 0.5 s, prev / next arrows, dots,
 * pause / play, swipe.
 */

const AUTOPLAY_MS = 5000;
const CHEVRON = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M10.332 6.00073L9 7.41073L13.3266 12.0007L9 '
  + '16.5907L10.332 18.0007L16 12.0007L10.332 6.00073Z"></path></svg>';

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function button(className, label, html = '') {
  const b = el('button', className);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.innerHTML = html;
  return b;
}

function buildSlide(row) {
  const link = row.querySelector('a[href]');
  const pictures = [...row.querySelectorAll('picture')];
  const host = link || el('div', 'hero-carousel-link');
  const holder = (link && link.closest('p')) || host;
  pictures.forEach((pic, i) => {
    const slot = el('div', pictures.length > 1 && i ? 'hero-carousel-sp' : 'hero-carousel-pc');
    if (pictures.length === 1) slot.className = 'hero-carousel-one';
    slot.append(pic);
    host.append(slot);
  });
  return el('div', 'hero-carousel-slide', holder);
}

function run(block, track, slides, dots, pause) {
  const n = slides.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;
  let paused = false;

  const render = () => {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      s.querySelectorAll('a').forEach((a) => { a.tabIndex = i === index ? 0 : -1; });
    });
  };
  const go = (i) => {
    index = (i + n) % n;
    // restart the dot progress animation
    dots.forEach((d) => d.classList.remove('is-active'));
    // eslint-disable-next-line no-unused-expressions
    track.offsetWidth;
    render();
  };
  const schedule = () => {
    clearTimeout(timer);
    if (!paused && !reduce) {
      timer = setTimeout(() => {
        go(index + 1);
        schedule();
      }, AUTOPLAY_MS);
    }
  };

  block.querySelector('.hero-carousel-prev').addEventListener('click', () => {
    go(index - 1);
    schedule();
  });
  block.querySelector('.hero-carousel-next').addEventListener('click', () => {
    go(index + 1);
    schedule();
  });
  dots.forEach((d, i) => d.addEventListener('click', () => {
    go(i);
    schedule();
  }));
  pause.addEventListener('click', () => {
    paused = !paused;
    block.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-label', paused ? '再生' : '一時停止');
    schedule();
  });
  let x0 = null;
  block.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) {
      go(index + (dx < 0 ? 1 : -1));
      schedule();
    }
  }, { passive: true });

  render();
  schedule();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-carousel-wrap')) return;
  const slides = [...block.children].map(buildSlide);
  const track = el('div', 'hero-carousel-track', ...slides);
  const bar = '<span class="hero-carousel-bar"></span>';
  const dots = slides.map((s, i) => button('hero-carousel-dot', `スライド ${i + 1}`, bar));
  const pause = button(
    'hero-carousel-pause',
    '一時停止',
    '<span class="hero-carousel-pause-icon"><span></span><span></span></span>',
  );
  const wrap = el(
    'div',
    'hero-carousel-wrap',
    button('hero-carousel-arrow hero-carousel-prev', 'Previous Slide', CHEVRON),
    el('div', 'hero-carousel-list', track),
    button('hero-carousel-arrow hero-carousel-next', 'Next Slide', CHEVRON),
    el('div', 'hero-carousel-dots', el('ul', 'hero-carousel-dots-list', ...dots.map((d) => el('li', '', d)))),
    pause,
  );
  block.replaceChildren(wrap);
  // first slide is the LCP candidate: load it eagerly
  slides[0]?.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  if (slides.length) run(block, track, slides, dots, pause);
}
