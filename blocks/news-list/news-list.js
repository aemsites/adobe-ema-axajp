/**
 * news-list — news / notice list, shared by index and customer.
 *
 * Authoring rows:
 *   row 1: [heading]
 *   one row per item: [date <p>?] [link <p>]
 *   last row: [more link <p>…]
 *
 * Decode tier: reconstructive, classified by content: a row with a heading is the head, a row
 * with a non-link <p> (the date) and a link is an item, a row of links only holds the more
 * links. Authored nodes are MOVED (EW1); links move as their <p> (EW3). The arrow per item is
 * decorative (CSS).
 *
 * @variants dated (customer: date + title rows, 2×2 white buttons below);
 *   home (index `.list-block`: date + 2-line title rows, right-aligned arrow link — default
 *   decode); notice (index `.notice`: rows [title <p>] then one [link <p>] per notice — the
 *   title MOVES beside a decorative alert icon); recommended (index `.recommended`: rows [heading],
 *   then [picture][caption link <p>] per card — card-as-link EW6, the box is an <a> from the
 *   caption's href, the authored anchor is unwrapped, picture and caption MOVE into it)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';

// notice links are text links: a fully-bold link (authored <strong>, which the pipeline hoists
// around the <a>) was turned into a button by decorateButtons — put the authored <strong> back
function unbutton(p) {
  const a = p.querySelector('a.button');
  if (!a) return;
  if (a.classList.contains('primary') && !a.closest('strong')) {
    const strong = document.createElement('strong');
    a.replaceWith(strong);
    strong.append(a);
  }
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  if (!a.classList.length) a.removeAttribute('class');
  p.classList.remove('button-wrapper');
  if (!p.classList.length) p.removeAttribute('class');
}

function decorateNotice(block) {
  const title = el('div', 'news-list-notice-title');
  const list = el('div', 'news-list-notice-list');
  [...block.children].forEach((row) => {
    [...row.querySelectorAll(':scope > div > *')].forEach((n) => {
      if (n.querySelector('a[href]')) {
        unbutton(n);
        list.append(n);
      } else {
        title.append(n);
      }
    });
  });
  block.replaceChildren(el('div', 'news-list-inner', title, list));
}

function decorateCards(block) {
  const head = el('div', 'news-list-head');
  const grid = el('div', 'news-list-cards');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (nodes.some((n) => n.matches(HEADING))) {
      head.append(...nodes);
      return;
    }
    const caption = nodes.find((n) => n.querySelector('a[href]') && !n.querySelector('img'));
    const link = caption && caption.querySelector('a[href]');
    const box = el(link ? 'a' : 'div', 'news-list-card-link');
    if (link) {
      box.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
    }
    nodes.forEach((n) => {
      if (n === caption) box.append(el('div', 'news-list-card-caption', n));
      else box.append(el('div', 'news-list-card-image', n));
    });
    grid.append(el('div', 'news-list-card', box));
  });
  block.replaceChildren(el('div', 'news-list-inner', head.children.length ? head : null, grid));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .news-list-inner')) return;
  if (block.classList.contains('notice')) {
    decorateNotice(block);
    return;
  }
  if (block.classList.contains('recommended')) {
    decorateCards(block);
    return;
  }
  const head = el('div', 'news-list-head');
  const items = el('div', 'news-list-items');
  const more = el('div', 'news-list-more');
  const rows = [...block.children];
  rows.forEach((row, r) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const links = nodes.filter((n) => n.querySelector('a[href]'));
    if (nodes.some((n) => n.matches(HEADING))) {
      head.append(...nodes);
    } else if (links.length && (links.length < nodes.length || r < rows.length - 1)) {
      const dates = nodes.filter((n) => !links.includes(n));
      items.append(el(
        'div',
        'news-list-item',
        el(
          'div',
          'news-list-text',
          ...dates.map((d) => el('div', 'news-list-date', d)),
          ...links.map((p) => el('div', 'news-list-title', p)),
        ),
      ));
    } else {
      links.forEach((p) => more.append(el('div', 'news-list-more-item', el('div', 'news-list-btn', p))));
    }
  });
  block.replaceChildren(el(
    'div',
    'news-list-inner',
    head.children.length ? head : null,
    el(
      'div',
      'news-list-body',
      items.children.length ? items : null,
      more.children.length ? more : null,
    ),
  ));
}
