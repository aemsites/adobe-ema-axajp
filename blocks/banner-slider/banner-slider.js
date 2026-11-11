/**
 * banner-slider — image banner carousel (customer.css `.ct-slider-section`, react-slick).
 * Re-authored from the source behaviour.
 *
 * Authoring rows: one row per slide: [link <p> wrapping a picture].
 *
 * Decode tier: reconstructive + JS. Each authored slide <p> is MOVED into a slide container;
 * the loop clones on both ends are presentational (EW4: stripInstrumentation, aria-hidden,
 * tabindex -1; link and alt kept as react-slick does). Behaviour as live: infinite loop,
 * 2 slides per view on a fresh load at every width (1 only after a resize across 767px),
 * 500 ms slide, prev/next arrows, dots, autoplay every 4 s (paused while hovered).
 */

const AUTOPLAY_MS = 4000;
const SPEED_MS = 500;
const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 32 32" '
  + 'aria-hidden="true"><path d="M16 28.067c-0.533 0-1-0.2-1.4-0.6l-14-14c-1.8-1.8 1-4.667 '
  + '2.8-2.8l12.6 12.533 12.6-12.533c1.8-1.8 4.667 1 2.8 2.8l-14 14c-0.333 0.4-0.867 0.6-1.4 '
  + '0.6z"/></svg>';

// EW4: presentational clones lose the editor instrumentation (scripts/chrome.js twin, inlined)
function stripInstrumentation(node) {
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll(attrs.map((a) => `[${a}]`).join(','))]
    .forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function arrow(dir, label) {
  const b = el('button', `banner-slider-arrow banner-slider-${dir}`);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.innerHTML = CHEVRON;
  return b;
}

function cloneSlide(slide) {
  const c = stripInstrumentation(slide.cloneNode(true));
  c.classList.add('banner-slider-cloned');
  c.setAttribute('aria-hidden', 'true');
  // as react-slick: the clone keeps its link and alt, but is out of the tab order
  c.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
  c.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
  return c;
}

function run(block, list, track, real, dots) {
  const n = real.length;
  const mq = window.matchMedia('(width <= 767px)');
  let index = 0;
  let show = 2;
  let busy = false;

  const paint = (animate) => {
    const slides = [...track.children];
    const w = Math.ceil(list.clientWidth / show);
    slides.forEach((s, i) => {
      s.style.width = `${w}px`;
      const pos = i - show;
      s.classList.toggle('banner-slider-active', pos >= index && pos < index + show);
    });
    track.style.width = `${w * slides.length}px`;
    track.style.transition = animate ? `transform ${SPEED_MS}ms ease` : 'none';
    track.style.transform = `translate3d(${-(show + index) * w}px, 0px, 0px)`;
    const di = ((index % n) + n) % n;
    dots.forEach((d, i) => d.classList.toggle('banner-slider-dot-active', i === di));
  };

  const build = (e) => {
    track.querySelectorAll('.banner-slider-cloned').forEach((c) => c.remove());
    show = e && e.matches ? 1 : 2;
    for (let i = 0; i < show; i += 1) {
      track.insertBefore(cloneSlide(real[(n - 1 - (i % n) + n) % n]), track.firstChild);
      track.append(cloneSlide(real[i % n]));
    }
    paint(false);
  };

  const go = (to) => {
    if (busy) return;
    busy = true;
    index = to;
    paint(true);
    window.setTimeout(() => {
      if (index >= n || index < 0) {
        index = ((index % n) + n) % n;
        paint(false);
      }
      busy = false;
    }, SPEED_MS);
  };

  block.querySelector('.banner-slider-prev').addEventListener('click', () => go(index - 1));
  block.querySelector('.banner-slider-next').addEventListener('click', () => go(index + 1));
  dots.forEach((d, i) => d.querySelector('button').addEventListener('click', () => go(i)));
  mq.addEventListener('change', build);
  // the section is still hidden while blocks decorate: paint again once the list has a width
  new ResizeObserver(() => paint(false)).observe(list);
  build();

  let paused = false;
  block.addEventListener('mouseenter', () => { paused = true; });
  block.addEventListener('mouseleave', () => { paused = false; });
  window.setInterval(() => {
    if (!paused && !document.hidden) go(index + 1);
  }, AUTOPLAY_MS);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .banner-slider-inner')) return;
  // a linked picture's title is the picture's whitespace: the link's name is the image alt
  block.querySelectorAll('a[title]').forEach((a) => {
    if (!a.title.trim()) a.removeAttribute('title');
  });
  const track = el('div', 'banner-slider-track');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (nodes.length) track.append(el('div', 'banner-slider-slide', ...nodes));
  });
  const real = [...track.children];
  if (!real.length) return;
  const list = el('div', 'banner-slider-list', track);
  const dots = real.map((_, i) => {
    const b = el('button');
    b.type = 'button';
    b.setAttribute('aria-label', `${i + 1}`);
    return el('li', '', b);
  });
  const slider = el(
    'div',
    'banner-slider-slider',
    arrow('prev', '前へ'),
    list,
    arrow('next', '次へ'),
    el('ul', 'banner-slider-dots', ...dots),
  );
  block.replaceChildren(el('div', 'banner-slider-inner', slider));
  run(block, list, track, real, dots);
}
