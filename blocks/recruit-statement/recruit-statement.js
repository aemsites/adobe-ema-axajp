/**
 * recruit-statement — centred recruitment statement band (live PurposeSection / MessageSection).
 * Content model: row 1: [h2 (purpose: label text + em sub-label)]; row 2: [h3 / p…].
 * Variants: `purpose` (blue band, serif statement), `message` (translucent navy band over the
 * fixed hero video, serif em hint in the last paragraph).
 * Decode tier: template-slotted — .recruit-container > .recruit-inview >
 * .recruit-statement-head (the first h2, MOVED) + .recruit-statement-body (every other authored
 * node, MOVED in order). In-view reveal (live InView-styles) via IntersectionObserver.
 * Line breaks: `message` heading breaks are SP-only (source br-sp, authored as plain <br>).
 * @param {Element} block the block element
 */
function reveal(block) {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  block.classList.add('is-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-inview');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 25% 0px' });
  block.querySelectorAll('.recruit-inview').forEach((el) => io.observe(el));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .recruit-container')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children]);
  const heading = nodes.find((n) => n.tagName === 'H2');

  const container = document.createElement('div');
  container.className = 'recruit-container';
  const inview = document.createElement('div');
  inview.className = 'recruit-inview';
  const head = document.createElement('div');
  head.className = 'recruit-statement-head';
  const body = document.createElement('div');
  body.className = 'recruit-statement-body';
  if (heading) head.append(heading);
  nodes.filter((n) => n !== heading).forEach((n) => body.append(n));
  inview.append(head, body);
  container.append(inview);
  block.replaceChildren(container);
  reveal(block);
}
