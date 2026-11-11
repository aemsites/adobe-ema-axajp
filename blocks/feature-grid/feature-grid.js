/**
 * feature-grid — icon feature grid, shared by index, prospect and customer.
 *
 * Authoring rows:
 *   optional intro row: [h2/h3 heading?] [picture?] [text <p>…]
 *   one row per item: [icon picture] [text <p>]
 *   optional closing row: [link <p>] [note <p>?]
 *
 * Decode tier: reconstructive, classified by content: a row with a heading is the intro, a row
 * with a link is the closing row, any other row is an item. Authored nodes are MOVED (EW1);
 * the link moves as its <p> (EW3).
 *
 * @variants services (customer medical-assistance: intro image + text, 7 round icons, button);
 *   icons (home 相談サービス: a text-only row before the items is the lead, 6 round white icon
 *   tiles, the closing link <p> is a canon button — em = white `.button`);
 *   bullets (prospect `.consult`: text rows before the heading = lead, link row = text link,
 *   heading row = panel heading + PC / SP pictures, text rows after it = check bullets; the
 *   check icon is decorative JS-built SVG; authored nodes MOVE)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';
const isPic = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');

const CHECK = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M12 3.00073C16.968 3.00073 21 7.03273 21 '
  + '12.0007C20.9999 16.9686 16.9679 21.0007 12 21.0007C7.03207 21.0007 3.00012 16.9686 3 '
  + '12.0007C3 7.03273 7.032 3.00073 12 3.00073ZM10.2324 13.6257L7.46289 10.8425L6.375 '
  + '11.9392L10.2324 15.8259L17.1748 8.82983L16.0869 7.72534L10.2324 13.6257Z"></path></svg>';

function check() {
  const tpl = document.createElement('template');
  tpl.innerHTML = CHECK;
  return el('div', 'feature-grid-bullet-icon', tpl.content.firstElementChild);
}

function decorateBullets(block) {
  const lead = el('div', 'feature-grid-lead');
  const more = el('div', 'feature-grid-link');
  const head = el('div', 'feature-grid-panel-head');
  const list = el('div', 'feature-grid-bullets');
  const pics = [];
  let afterHead = false;
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (nodes.some((n) => n.matches(HEADING))) {
      afterHead = true;
      nodes.forEach((n) => {
        if (isPic(n)) pics.push(n);
        else head.append(n);
      });
    } else if (nodes.some((n) => n.querySelector('a[href]'))) {
      more.append(...nodes);
    } else if (nodes.some(isPic)) {
      pics.push(...nodes);
    } else if (afterHead) {
      nodes.forEach((n) => list.append(
        el('div', 'feature-grid-bullet', check(), el('div', 'feature-grid-bullet-text', n)),
      ));
    } else {
      lead.append(...nodes);
    }
  });
  // one <p> may carry both pictures: wrap each <picture> on its own (PC first, SP second)
  const pictures = pics.flatMap((n) => (n.matches('picture, img') ? [n]
    : [...n.querySelectorAll('picture, img:not(picture img)')]));
  const media = el('div', 'feature-grid-media');
  pictures.forEach((n, i) => {
    let cls = 'feature-grid-pic';
    if (pictures.length > 1) cls += i ? ' feature-grid-pic-sp' : ' feature-grid-pic-pc';
    media.append(el('div', cls, n));
  });
  const panel = el('div', 'feature-grid-panel', head, list);
  block.replaceChildren(el(
    'div',
    'feature-grid-inner',
    lead.children.length ? lead : null,
    more.children.length ? more : null,
    el('div', 'feature-grid-main', panel, pictures.length ? media : null),
  ));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .feature-grid-inner')) return;
  if (block.classList.contains('bullets')) {
    decorateBullets(block);
    return;
  }
  const head = el('div', 'feature-grid-head');
  const intro = el('div', 'feature-grid-intro');
  const items = el('div', 'feature-grid-items');
  const outro = el('div', 'feature-grid-outro');
  const icons = block.classList.contains('icons');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const lead = icons && !items.children.length && !nodes.some(isPic)
      && !nodes.some((n) => n.querySelector('a[href]'));
    if (lead) {
      intro.append(...nodes);
    } else if (icons && nodes.some((n) => n.querySelector('a[href]'))) {
      outro.append(el('div', 'feature-grid-cta', ...nodes));
    } else if (nodes.some((n) => n.matches(HEADING))) {
      nodes.forEach((n) => {
        if (n.matches(HEADING)) head.append(n);
        else if (isPic(n)) intro.append(el('div', 'feature-grid-image', n));
        else intro.append(n);
      });
    } else if (nodes.some((n) => n.querySelector('a[href]'))) {
      nodes.forEach((n) => {
        if (n.querySelector('a[href]')) {
          outro.append(el('div', 'feature-grid-more', el('div', 'feature-grid-btn', n)));
        } else {
          outro.append(el('div', 'feature-grid-note', n));
        }
      });
    } else {
      const item = el('div', 'feature-grid-item');
      nodes.forEach((n) => {
        if (isPic(n)) item.append(el('div', 'feature-grid-icon', n));
        else item.append(el('div', 'feature-grid-text', n));
      });
      if (icons && !items.children.length) item.classList.add('feature-grid-item-first');
      items.append(item);
    }
  });
  const body = el(
    'div',
    'feature-grid-body',
    intro.children.length ? intro : null,
    items.children.length ? items : null,
    outro.children.length ? outro : null,
  );
  block.replaceChildren(el('div', 'feature-grid-inner', head.children.length ? head : null, body));
}
