/**
 * contact-links — contact boxes + banner links, shared by product, about-insurance, customer
 * and about-axa.
 *
 * Authoring rows:
 *   one row per box: [eyebrow <p>] [tel <p>] [hours <p>] [link <p>]
 *   trailing row(s): [linked picture <p>]… (banners) or [ul of links]
 *   optional heading row (no link): [h2…] — moved into a title cell above the boxes
 *
 * Reconstructive, classified by content: a row holding pictures is a banner row, any other
 * row is a box. Inside a box the link paragraph is the CTA, a phone-number paragraph is the
 * tel line, the first other paragraph the eyebrow and the rest the hours. Card-as-link (EW6):
 * a box with a CTA becomes an <a> built from its href; the authored anchor is unwrapped
 * (`card` keeps the authored anchor: the box is a button wrapper).
 *
 * @variants tel-boxes (about-insurance: green / orange boxes + gif banners, floated strip),
 *   pc-only (hidden ≤994), card (customer), strip (product `.contact-content-wrapper`: the
 *   boxes keep their authored links, side by side with a rule between, the link list as
 *   outline buttons on the right; a tel line may carry an <em> note, e.g. （無料）)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}
const TEL = /^[\d０-９\-－‐ ()（）]{9,}$/;
const TEL_START = /^[\d０-９\-－‐]{9,}/;
const LINE_ARROW = '<svg aria-hidden="true" focusable="false" width="15" height="15" '
  + 'viewBox="-1 0 14 7" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" '
  + 'fill-rule="evenodd" stroke-linecap="round" stroke-width="2">'
  + '<path d="M.5 3.5H11M9 7l2.798-3.5L9 0"></path></g></svg>';

function buildBox(row, index, keepLink, strip) {
  const paras = [...row.querySelectorAll('p')];
  const cta = paras.find((p) => p.querySelector('a[href]'));
  const telRe = strip ? TEL_START : TEL;
  const tel = paras.find((p) => p !== cta && telRe.test(p.textContent.trim()));
  const rest = paras.filter((p) => p !== cta && p !== tel);
  const [eyebrow, ...hours] = rest;
  const link = cta && cta.querySelector('a[href]');
  const asLink = link && !keepLink;
  const box = el(asLink ? 'a' : 'div', `contact-links-box contact-links-box-${index + 1}`);
  if (asLink) {
    box.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  box.append(...[
    eyebrow ? el('div', 'contact-links-head', eyebrow) : null,
    tel ? el('div', 'contact-links-tel', tel) : null,
    hours.length ? el('div', 'contact-links-time', ...hours) : null,
    cta ? el('div', 'contact-links-more', cta) : null,
  ].filter(Boolean));
  return el('div', 'contact-links-cell contact-links-cell-wide', box);
}

export default function decorate(block) {
  const done = ':scope > .contact-links-cell, :scope > .contact-links-list, :scope > .contact-links-title';
  if (block.querySelector(done)) return;
  const cells = [];
  let boxIndex = 0;
  [...block.children].forEach((row) => {
    if (row.querySelector('h1, h2, h3, h4, h5, h6') && !row.querySelector('a[href]')) {
      // heading row (customer `card`): the section title moves above the boxes
      cells.push(el('div', 'contact-links-title', ...row.querySelectorAll(':scope > div > *')));
    } else if (row.querySelector('picture, img')) {
      [...row.children].forEach((cell) => {
        if (cell.querySelector('picture, img')) {
          const link = cell.querySelector('a[href]');
          if (link && /^https?:/.test(link.getAttribute('href')) && !link.href.startsWith(window.location.origin)) {
            link.target = '_blank';
            link.rel = 'noreferrer';
          }
          cells.push(el('div', 'contact-links-cell contact-links-banner', ...cell.childNodes));
        }
      });
    } else if (row.querySelector('ul')) {
      cells.push(el('div', 'contact-links-list', ...row.querySelectorAll('ul')));
    } else {
      const strip = block.classList.contains('strip');
      cells.push(buildBox(row, boxIndex, block.classList.contains('card') || strip, strip));
      boxIndex += 1;
    }
  });
  if (block.classList.contains('strip')) {
    const boxes = cells.filter((c) => c.classList.contains('contact-links-cell'));
    const group = el('div', 'contact-links-boxes');
    boxes.forEach((b, i) => {
      if (i) group.append(el('div', 'contact-links-separator'));
      group.append(b);
    });
    cells.forEach((c) => c.querySelectorAll('.contact-links-more a, li > a').forEach((a) => {
      if (a.querySelector('svg')) return;
      // the link text MOVES into a label box inside the same link (the link stays authored)
      if (a.closest('li')) a.append(el('span', 'contact-links-label', ...a.childNodes));
      a.insertAdjacentHTML('beforeend', LINE_ARROW);
    }));
    block.replaceChildren(group, ...cells.filter((c) => !boxes.includes(c)));
    return;
  }
  if (cells.length) {
    cells[0].classList.add('contact-links-first');
    cells[cells.length - 1].classList.add('contact-links-last');
  }
  block.replaceChildren(...cells);
}
