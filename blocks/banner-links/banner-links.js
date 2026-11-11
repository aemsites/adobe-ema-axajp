/**
 * banner-links — partner / external banner row (index.css `.partners`).
 *
 * Authoring rows: optional row 1: [heading]; one row per banner: [link <p> wrapping a picture]
 * (the picture's alt names the link).
 *
 * Decode tier: reconstructive: a row with a heading is the head, any other row is a banner.
 * The authored link paragraphs MOVE into the list (EW1, EW3).
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .banner-links-list')) return;
  const head = el('div', 'banner-links-head');
  const list = el('div', 'banner-links-list');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (nodes.some((n) => n.matches(HEADING))) head.append(...nodes);
    else if (nodes.length) list.append(el('div', 'banner-links-item', ...nodes));
  });
  block.replaceChildren(...(head.children.length ? [head] : []), list);
}
