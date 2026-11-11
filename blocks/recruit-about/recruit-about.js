/**
 * recruit-about — "AXA group" section of the recruitment top (live AboutSection).
 * Content model (one row per part, classified by content, never by row index):
 *  - head: [h2][lead p]
 *  - overview: [h3, then per item: h4, picture p, h5, p…] (contains h4 and text p)
 *  - position: [h3, PC picture p, SP picture p, then per item: h4, h5] (h4 without text p)
 *  - note: [p…] (text only; links open in a new tab like the source)
 *  - business: [h3, lead p, PC picture p, SP picture p, note p] (h3, no h4)
 * Decode tier: template-slotted — authored nodes are MOVED into .recruit-heading /
 * .recruit-about-* slots; overview/position items are segmented on h4 (reconstructive inside the
 * slot). In-view reveal (live InView-styles) via IntersectionObserver.
 * Line breaks (plain <br> authored for the source viewport-only breaks): business heading
 * breaks are SP-only, position title breaks PC-only.
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

/** PC / SP figure pair: first picture = PC, second = SP; one picture serves both. */
function figure(cls, pics) {
  const fig = el(cls);
  if (pics.length > 1) {
    fig.append(el('recruit-about-figure-pc', pics[0]), el('recruit-about-figure-sp', pics[1]));
    pics.slice(2).forEach((p) => fig.append(p));
  } else fig.append(...pics);
  return fig;
}

/** split nodes into items, each starting at an h4 */
function segment(nodes) {
  const items = [];
  nodes.forEach((n) => {
    if (n.tagName === 'H4' || !items.length) items.push([]);
    items[items.length - 1].push(n);
  });
  return items;
}

function buildHead(nodes) {
  const h2 = nodes.find((n) => /^H[1-3]$/.test(n.tagName));
  const wrap = el('recruit-inview');
  if (h2) wrap.append(el('recruit-heading', h2));
  const rest = nodes.filter((n) => n !== h2);
  if (rest.length) wrap.append(el('recruit-about-lead', ...rest));
  return wrap;
}

function buildOverview(nodes) {
  const title = nodes.find((n) => n.tagName === 'H3');
  const inview = el('recruit-inview');
  if (title) inview.append(el('recruit-about-box-title', title));
  const group = el('recruit-about-overview-group');
  segment(nodes.filter((n) => n !== title)).forEach((item) => {
    const h4 = item[0].tagName === 'H4' ? item.shift() : null;
    const box = el('recruit-about-overview-item');
    if (h4) box.append(el('recruit-about-item-heading', h4));
    box.append(el('recruit-about-overview-detail', ...item));
    group.append(box);
  });
  inview.append(group);
  return el('recruit-about-overview', inview);
}

function buildPosition(nodes) {
  const title = nodes.find((n) => n.tagName === 'H3');
  const pics = nodes.filter(isPicture);
  const inview = el('recruit-inview');
  if (title) inview.append(el('recruit-about-box-title recruit-about-position-heading', title));
  if (pics.length) inview.append(figure('recruit-about-position-figure', pics));
  const group = el('recruit-about-position-group');
  segment(nodes.filter((n) => n !== title && !pics.includes(n))).forEach((item) => {
    const h4 = item[0].tagName === 'H4' ? item.shift() : null;
    const box = el('recruit-about-position-item');
    if (h4) box.append(el('recruit-about-item-heading', h4));
    box.append(el('recruit-about-position-title', ...item));
    group.append(box);
  });
  inview.append(group);
  return el('recruit-about-position', inview);
}

function buildNote(nodes) {
  nodes.forEach((n) => n.querySelectorAll('a[href]').forEach((a) => {
    a.target = '_blank';
    a.classList.add('recruit-textlink');
  }));
  return el('recruit-about-note', el('recruit-inview', ...nodes));
}

function buildBusiness(nodes) {
  const title = nodes.find((n) => /^H[2-4]$/.test(n.tagName));
  const pics = nodes.filter(isPicture);
  const box = el('recruit-about-business');
  if (title) box.append(el('recruit-about-business-heading', title));
  const firstPic = nodes.indexOf(pics[0]);
  const text = nodes.filter((n) => n !== title && !pics.includes(n));
  const lead = firstPic < 0 ? text : text.filter((n) => nodes.indexOf(n) < firstPic);
  const note = text.filter((n) => !lead.includes(n));
  if (lead.length) box.append(el('recruit-about-business-lead', ...lead));
  if (pics.length) box.append(figure('recruit-about-business-figure', pics));
  if (note.length) box.append(el('recruit-about-business-note', ...note));
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .recruit-container')) return;
  const container = el('recruit-container');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div')].flatMap((c) => [...c.children]);
    if (!nodes.length) return;
    const has = (tag) => nodes.some((n) => n.tagName === tag);
    const textP = nodes.some((n) => n.tagName === 'P' && !isPicture(n));
    let part;
    if (has('H2')) part = buildHead(nodes);
    else if (has('H4') && has('H5') && textP) part = buildOverview(nodes);
    else if (has('H4')) part = buildPosition(nodes);
    else if (has('H3')) part = buildBusiness(nodes);
    else part = buildNote(nodes);
    container.append(part);
  });
  block.replaceChildren(container);
  reveal(block);
}
