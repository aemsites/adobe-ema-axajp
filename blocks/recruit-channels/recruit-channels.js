/**
 * recruit-channels — "AXA Life" section of the recruitment top (live ServiceSection): full-bleed
 * key visual, inverse heading + lead, sales-channel grid, service feature items.
 * Content model (rows classified by content, never by index):
 *  - key visual: [picture] (a row holding only a picture)
 *  - head: [h2][lead p…]
 *  - channel (repeat): [channel group title h2 — may be empty][picture][h6 + p…]
 *  - service item (repeat): [picture][h3 + p…]
 * Decode tier: reconstructive — channel rows are grouped into .recruit-channels-grid, service
 * rows into .recruit-channels-group; every authored node is MOVED into its slot, anything
 * unclassified is appended in order (leftovers pass). In-view reveal via IntersectionObserver.
 * Line breaks: channel title breaks are PC-only (source br-pc, authored as plain <br>).
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

const el = (cls, ...kids) => {
  const d = document.createElement('div');
  d.className = cls;
  d.append(...kids);
  return d;
};

const isPicture = (n) => n.tagName === 'PICTURE' || n.tagName === 'IMG'
  || (n.tagName === 'P' && n.querySelector('picture, img') && !n.textContent.trim());

function channel(nodes) {
  const title = nodes.find((n) => n.tagName === 'H2');
  const pic = nodes.find(isPicture);
  const titleSlot = el('recruit-channel-title');
  if (title) titleSlot.append(title);
  else titleSlot.classList.add('is-empty');
  const row = el('recruit-channel-row');
  if (pic) row.append(el('recruit-channel-img', pic));
  row.append(el('recruit-channel-text', ...nodes.filter((n) => n !== title && n !== pic)));
  return el('recruit-channel', titleSlot, row);
}

function service(nodes) {
  const pic = nodes.find(isPicture);
  const item = el('recruit-service-item');
  if (pic) item.append(el('recruit-service-img', pic));
  item.append(el('recruit-service-detail', ...nodes.filter((n) => n !== pic)));
  return el('recruit-inview', item);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .recruit-container')) return;
  const container = el('recruit-container');
  let kv = null;
  let grid = null;
  let group = null;
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div')].flatMap((c) => [...c.children]);
    if (!nodes.length) return;
    const has = (tag) => nodes.some((n) => n.tagName === tag);
    if (nodes.every(isPicture) && !kv && !container.children.length) {
      kv = el('recruit-channels-kv', ...nodes);
    } else if (has('H6')) {
      if (!grid) {
        grid = el('recruit-channels-grid');
        container.append(el('recruit-inview', grid));
      }
      grid.append(channel(nodes));
    } else if (has('H3') && nodes.some(isPicture)) {
      if (!group) {
        group = el('recruit-channels-group');
        container.append(group);
      }
      group.append(service(nodes));
    } else if (has('H2')) {
      const h2 = nodes.find((n) => n.tagName === 'H2');
      const rest = nodes.filter((n) => n !== h2);
      const head = el('recruit-inview', el('recruit-heading', h2));
      if (rest.length) head.append(el('recruit-channels-lead', ...rest));
      container.append(head);
    } else {
      container.append(...nodes);
    }
  });
  block.replaceChildren(...(kv ? [kv, container] : [container]));
  reveal(block);
}
