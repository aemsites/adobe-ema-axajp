/**
 * product-cards — home product tiles (index.css `.products`).
 *
 * Authoring rows:
 *   one row per card: [icon picture (PC) + optional SP picture] [h3 with the link] [desc <p>]
 *   trailing CTA row: [link <p>] (em = the canon white button)
 *
 * Decode tier: reconstructive, classified by content: a row with a heading is a card, a row
 * with only link paragraphs is the CTA row. Card-as-link (EW6): the card box is an <a> built
 * from the heading link's href, the authored anchor is unwrapped, the pictures, heading and
 * description MOVE into it (EW1). The CTA paragraph MOVES as is (EW3).
 * Composition as live: PC shows the first six cards in a 3-column grid; SP shows the first card
 * as a large single tile above a 2-column grid of the following six. The SP single tile is a
 * presentational clone (EW4, stripInstrumentation) of the first card, which the source also
 * renders twice (pc-only / sp-only twins).
 *
 * @variants icons (prospect `.tiles`: one row per tile: [icon picture] [link title <p>]; the
 *   tile is an <a> built from the link's href (EW6), picture and title <p> MOVE into it; a row
 *   with only a link <p> is the CTA row — strong = the blue `.p-btn`; no SP single clone)
 */

const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M14.7 18.6007L13.4175 17.3407L17.5575 '
  + '13.2007H3V11.4007H17.5575L13.44 7.26073L14.7 6.00073L21 12.3007L14.7 18.6007Z"></path></svg>';
const HEADING = 'h1, h2, h3, h4, h5, h6';
const PC_COUNT = 6;

// EW4: presentational clones drop the editor's indices.
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

function arrow() {
  const tpl = document.createElement('template');
  tpl.innerHTML = ARROW;
  return tpl.content.firstElementChild;
}

function buildCard(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const heading = nodes.find((n) => n.matches(HEADING));
  const link = heading.querySelector('a[href]');
  const card = el(link ? 'a' : 'div', 'product-cards-card');
  if (link) {
    card.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  const pictures = [];
  const texts = [];
  nodes.forEach((n) => {
    if (n === heading) return;
    if (n.matches('picture') || n.querySelector('picture, img')) pictures.push(n);
    else texts.push(n);
  });
  const frame = el('div', 'product-cards-frame');
  pictures.forEach((p, i) => {
    let cls = 'product-cards-icon';
    if (pictures.length > 1) cls += i ? ' product-cards-sp' : ' product-cards-pc';
    frame.append(el('div', cls, p));
  });
  card.append(
    frame,
    el(
      'div',
      'product-cards-body',
      el('div', 'product-cards-head', heading, arrow()),
      texts.length ? el('div', 'product-cards-text', ...texts) : null,
    ),
  );
  return el('div', 'product-cards-item', card);
}

function buildTile(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const titleP = nodes.find((n) => !n.querySelector('picture, img') && n.querySelector('a[href]'));
  const link = titleP && titleP.querySelector('a[href]');
  const tile = el(link ? 'a' : 'div', 'product-cards-tile');
  if (link) {
    tile.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  const icon = el('div', 'product-cards-tile-icon');
  const text = el('div', 'product-cards-tile-text');
  nodes.forEach((n) => {
    if (n.matches('picture') || n.querySelector('picture, img')) icon.append(n);
    else text.append(n);
  });
  tile.append(icon, text, el('div', 'product-cards-tile-arrow', arrow()));
  return tile;
}

function decorateIcons(block) {
  const tiles = el('div', 'product-cards-tiles');
  const cta = el('div', 'product-cards-cta');
  [...block.children].forEach((row) => {
    const hasPic = !!row.querySelector('picture, img');
    if (hasPic) tiles.append(buildTile(row));
    else cta.append(...row.querySelectorAll(':scope > div > *'));
  });
  block.replaceChildren(tiles, cta.children.length ? cta : '');
}

export default function decorate(block) {
  if (block.querySelector(':scope > :is(.product-cards-grid, .product-cards-tiles)')) return;
  if (block.classList.contains('icons')) {
    decorateIcons(block);
    return;
  }
  const items = [];
  const ctas = [];
  [...block.children].forEach((row) => {
    if (row.querySelector(HEADING)) items.push(buildCard(row));
    else ctas.push(...row.querySelectorAll(':scope > div > *'));
  });
  items.forEach((item, i) => {
    if (i === 0) item.classList.add('product-cards-first');
    if (i >= PC_COUNT) item.classList.add('product-cards-extra');
  });
  const parts = [];
  if (items.length > 1) {
    const single = stripInstrumentation(items[0].cloneNode(true));
    single.className = 'product-cards-item product-cards-single-item';
    parts.push(el('div', 'product-cards-single', single));
  }
  parts.push(el('div', 'product-cards-grid', ...items));
  if (ctas.length) parts.push(el('div', 'product-cards-cta', ...ctas));
  block.replaceChildren(...parts);
}
