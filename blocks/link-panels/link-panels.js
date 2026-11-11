/**
 * link-panels — grey band of icon panels with arrow buttons (customer.css
 * `.ct-section-with-background .ct-two-column-section`: `.claim-block`, `.ct-styled-half-col`).
 *
 * Authoring rows: one row per panel: [icon picture] [h2-h4 title] [link <p>s] [note <p>?]
 *
 * Decode tier: reconstructive, classified by content (picture → icon, heading → title,
 * link <p> → button, other <p> → note). The first panel is the wide one (icon beside the title,
 * buttons in two columns); the rest are cards side by side. Authored nodes are MOVED (EW1);
 * buttons move as their <p> (EW3).
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function classify(row) {
  const parts = {
    icon: null, title: null, buttons: [], notes: [],
  };
  [...row.querySelectorAll(':scope > div > *')].forEach((node) => {
    if (!parts.icon && (node.matches('picture, img') || node.querySelector('picture, img'))) {
      parts.icon = node;
    } else if (!parts.title && node.matches('h1, h2, h3, h4, h5, h6')) {
      parts.title = node;
    } else if (node.querySelector('a[href]')) {
      parts.buttons.push(node);
    } else {
      parts.notes.push(node);
    }
  });
  return parts;
}

const btn = (p) => el('div', 'link-panels-btn', p);

function widePanel({
  icon, title, buttons, notes,
}) {
  const half = Math.ceil(buttons.length / 2);
  const cols = [buttons.slice(0, half), buttons.slice(half)].filter((c) => c.length)
    .map((c) => el('div', 'link-panels-col', ...c.map(btn)));
  return el(
    'div',
    'link-panels-panel link-panels-wide',
    el('div', 'link-panels-head', icon ? el('div', 'link-panels-icon', icon) : null, title),
    el('div', 'link-panels-buttons', el('div', 'link-panels-cols', ...cols)),
    ...notes.map((n) => el('div', 'link-panels-note', n)),
  );
}

function cardPanel({
  icon, title, buttons, notes,
}) {
  return el(
    'div',
    'link-panels-cell',
    el(
      'div',
      'link-panels-panel link-panels-card',
      icon ? el('div', 'link-panels-icon', icon) : null,
      title ? el('div', 'link-panels-title', title) : null,
      ...buttons.map((b) => el('div', 'link-panels-btn-wrap', btn(b))),
      ...notes.map((n) => el('div', 'link-panels-note', n)),
    ),
  );
}

export default function decorate(block) {
  if (block.querySelector(':scope > .link-panels-layout')) return;
  const panels = [...block.children].map(classify);
  const [first, ...rest] = panels;
  const grid = el('div', 'link-panels-grid');
  if (first) grid.append(widePanel(first));
  if (rest.length) grid.append(el('div', 'link-panels-row', ...rest.map(cardPanel)));
  block.replaceChildren(el('div', 'link-panels-layout', grid));
}
