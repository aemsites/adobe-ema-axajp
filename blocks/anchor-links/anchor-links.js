/**
 * anchor-links — in-page jump buttons (content.css `.anchor-buttons > .anchor-btn`).
 * Content model: one row per link: [link `<p>` to `#<anchor>`]. Variants: default (content),
 * jump (prospect `nav.jump` tabs: the authored <em> number in the link renders as the badge;
 * CSS only).
 * Decode tier: reconstructive (repeat group) — every authored link `<p>` is MOVED into an
 * `.anchor-links-item` wrapper; the arrow is CSS.
 * A target `#<anchor>` with no element of that id resolves to the section whose
 * section-metadata `anchor` key is that value (data-anchor), which then gets the id.
 * @variants icons (product `.anchor-button-wrapper`: one row per link [icon picture][link <p>];
 *   card-as-link (EW6) — the box is an <a> built from the authored href, the inner anchor is
 *   unwrapped, the picture and the link <p> MOVE into icon / text slots; the chevron is
 *   decorative)
 * @param {Element} block the block element
 */
const CHEV = '<svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M16 28.067c-0.533 0-1-0.2-1.4-0.6l-14-14c-1.8-1.8 '
  + '1-4.667 2.8-2.8l12.6 12.533 12.6-12.533c1.8-1.8 4.667 1 2.8 2.8l-14 14c-0.333 0.4-0.867 '
  + '0.6-1.4 0.6z"></path></svg>';

function resolveTarget(href) {
  if (!href || !href.startsWith('#') || href.length < 2) return;
  const key = decodeURIComponent(href.slice(1));
  if (document.getElementById(key)) return;
  const target = [...document.querySelectorAll('main [data-anchor]')]
    .find((el) => el.dataset.anchor === key);
  if (target) target.id = key;
}

function decorateIcons(block) {
  if (block.querySelector(':scope > .anchor-links-button')) return;
  const items = [...block.children].map((row) => {
    const link = row.querySelector('a[href]');
    if (!link) return null;
    const p = link.closest('p') || link;
    const pic = row.querySelector('picture') || row.querySelector('img');
    const box = document.createElement('a');
    box.className = 'anchor-links-button';
    box.href = link.getAttribute('href');
    const iconSlot = document.createElement('div');
    iconSlot.className = 'anchor-links-icon';
    if (pic) iconSlot.append(pic.closest('p') || pic);
    const text = document.createElement('div');
    text.className = 'anchor-links-text';
    text.append(p);
    link.replaceWith(...link.childNodes);
    const arrow = document.createElement('div');
    arrow.className = 'anchor-links-arrow';
    arrow.innerHTML = CHEV;
    box.append(iconSlot, text, arrow);
    resolveTarget(box.getAttribute('href'));
    return box;
  }).filter(Boolean);
  if (items.length) block.replaceChildren(...items);
}

export default function decorate(block) {
  if (block.classList.contains('icons')) {
    decorateIcons(block);
    return;
  }
  if (block.querySelector(':scope > .anchor-links-item')) return;
  const items = [];
  [...block.querySelectorAll('a[href]')].forEach((a) => {
    const item = document.createElement('div');
    item.className = 'anchor-links-item';
    item.append(a.closest('p') || a);
    items.push(item);
    resolveTarget(a.getAttribute('href'));
  });
  if (items.length) block.replaceChildren(...items);
}
