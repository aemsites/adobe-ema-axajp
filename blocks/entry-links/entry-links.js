/**
 * entry-links — entry points, shared by home (`ul.entry-links`: bordered link boxes with a
 * sub line) and about-insurance (`.ai-bottom`: caption above a coloured button).
 *
 * Authoring rows: one row per item: [link <p> title] [sub <p>]
 *
 * Reconstructive, classified by content (the link paragraph vs the plain text paragraph).
 * Default: card-as-link (EW6) — the box is an <a> built from the authored href, the authored
 * anchor is unwrapped, both paragraphs MOVE into it. `buttons`: the caption MOVES above the CTA
 * paragraph, which keeps its authored link (strong = blue primary, em = coral secondary, EW3);
 * a coral CTA gets the source's smaller SP twin as a presentational clone (EW4).
 *
 * @variants buttons (about-insurance caption + button pairs), arrow (home: the 16px text-colour
 *   arrow of the source `ul.entry-links` instead of the chevron — CSS only)
 */

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

const CHEV = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M10.332 6.00073L9 7.41073L13.3266 12.0007L9 '
  + '16.5907L10.332 18.0007L16 12.0007L10.332 6.00073Z"></path></svg>';
function chevron(className) {
  const tpl = document.createElement('template');
  tpl.innerHTML = CHEV;
  const svg = tpl.content.firstElementChild;
  if (className) svg.setAttribute('class', className);
  return svg;
}
export default function decorate(block) {
  if (block.querySelector(':scope > .entry-links-item')) return;
  const buttons = block.classList.contains('buttons');
  const items = [...block.children].map((row) => {
    const paras = [...row.querySelectorAll('p')];
    const cta = paras.find((p) => p.querySelector('a[href]'));
    const subs = paras.filter((p) => p !== cta);
    if (buttons) {
      const item = el(
        'div',
        'entry-links-item',
        subs.length ? el('div', 'entry-links-sub', ...subs) : null,
        cta ? el('div', 'entry-links-cta', cta) : null,
      );
      // secondary (coral) CTA: the source renders a smaller SP twin — presentational clone
      if (cta && cta.querySelector('a.secondary, em a')) {
        const box = cta.parentElement;
        const twin = stripInstrumentation(cta.cloneNode(true));
        box.classList.add('pc-only');
        item.append(el('div', 'entry-links-cta entry-links-cta-small sp-only', twin));
      }
      return item;
    }
    const link = cta && cta.querySelector('a[href]');
    const box = el(link ? 'a' : 'div', 'entry-links-link');
    if (link) {
      box.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
    }
    box.append(
      el(
        'div',
        'entry-links-text',
        cta ? el('div', 'entry-links-title', cta) : null,
        subs.length ? el('div', 'entry-links-sub', ...subs) : null,
      ),
      chevron('entry-links-icon'),
    );
    return el('div', 'entry-links-item', box);
  });
  block.replaceChildren(...items);
}
