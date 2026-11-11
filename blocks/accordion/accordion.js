/**
 * accordion — collapsible panels, shared by product (`.acc`, ×12) and about-insurance
 * (`.ai-coll` Q&A lists).
 *
 * Authoring rows: one row per panel: [title h3 / <p>] [body: default content] [open?]
 *
 * Reconstructive: every row becomes one `.accordion-item`; the title nodes MOVE into a
 * div[role=button] (EW7 — no <button>/<summary> hosts authored text), the body nodes MOVE into
 * `.accordion-body` inside a grid-rows panel (0fr → 1fr, 300ms).
 *
 * @variants sp-collapse (about-insurance: always open ≥768, collapsible ≤767, no animation),
 *   products (product listing panels — see decorateProducts below)
 * @ew-exempt open — the optional third cell `open` marks a panel open on load (config)
 * @ew-exempt #id — `products`: a `#anchor` token in the flag cell is the panel's id (config)
 */

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
const CHEV_DOWN = '<svg aria-hidden="true" focusable="false" width="12" height="8" '
  + 'viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.59 '
  + '0.589996L6 5.17L1.41 0.589996L0 2L6 8L12 2L10.59 0.589996Z"></path></svg>';
const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M14.7 18.6007L13.4175 17.3407L17.5575 '
  + '13.2007H3V11.4007H17.5575L13.44 7.26073L14.7 6.00073L21 12.3007L14.7 18.6007Z"></path></svg>';
const LINE_ARROW = '<svg aria-hidden="true" focusable="false" width="15" height="15" '
  + 'viewBox="-1 0 14 7" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" '
  + 'fill-rule="evenodd" stroke-linecap="round" stroke-width="2">'
  + '<path d="M.5 3.5H11M9 7l2.798-3.5L9 0"></path></g></svg>';
function icon(markup, className) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup;
  const node = tpl.content.firstElementChild;
  if (className) node.setAttribute('class', className);
  return node;
}
let uid = 0;

const FLAG = /^(open|#[\w-]+)(\s+(open|#[\w-]+))*$/i;
const isFlagCell = (cell) => !!cell
  && !cell.querySelector('picture, img, a, ul, ol, h1, h2, h3, h4')
  && FLAG.test(cell.textContent.trim());

/**
 * products body (reconstructive, segmented on picture groups): a picture paragraph after
 * non-picture content starts a product card; the first picture paragraph holds the logos, a
 * further picture paragraph is the side badge; button paragraphs (strong = primary, em =
 * outline) go into the button row, a lone link paragraph after the buttons is the digital
 * terms link, every other paragraph is the description. A list becomes the 2-column link
 * grid (archive panel). Every authored node is MOVED (EW1); nothing is left behind.
 */
function buildProducts(body) {
  const nodes = [...body.children];
  if (!nodes.length) return;
  const isPic = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
  const isBtn = (n) => n.matches('p') && !!n.querySelector('a.button, strong a, em a');
  // a panel without any picture (corporate) is one card with an empty image column
  const picless = !nodes.some(isPic) && nodes.some(isBtn);
  const out = [];
  let grid = null;
  let card = null;
  nodes.forEach((n) => {
    if (n.matches('ul, ol')) {
      card = null;
      n.querySelectorAll(':scope > li > a').forEach((a) => a.append(icon(LINE_ARROW)));
      out.push(el('div', 'accordion-links', n));
      grid = null;
      return;
    }
    if ((isPic(n) && (!card || card.started)) || (picless && !card)) {
      if (!grid) {
        grid = el('div', 'accordion-products');
        out.push(grid);
      }
      card = {
        root: el('div', 'accordion-product'),
        images: el('div', 'accordion-product-images'),
        logos: el('div', 'accordion-product-logos'),
        name: el('div', 'accordion-product-name'),
        buttons: el('div', 'accordion-product-buttons'),
        links: el('div', 'accordion-product-links'),
        started: false,
      };
      card.images.append(card.logos);
      card.root.append(card.images, card.name, card.buttons, card.links);
      grid.append(card.root);
      if (isPic(n)) {
        card.logos.append(n);
        return;
      }
    }
    if (!card) {
      out.push(n);
      return;
    }
    if (isPic(n)) {
      card.images.append(el('div', 'accordion-product-badge', n));
    } else if (isBtn(n)) {
      card.started = true;
      n.querySelectorAll('a.button').forEach((a) => {
        const kind = a.classList.contains('primary') ? 'primary' : 'outline';
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        n.classList.add(`accordion-btn-${kind}`);
      });
      n.classList.remove('button-wrapper');
      card.buttons.append(n);
    } else if (card.started && n.querySelector('a[href]')
      && n.textContent.trim() === n.querySelector('a[href]').textContent.trim()) {
      card.links.append(el('div', 'accordion-product-link', n, icon(ARROW)));
    } else {
      card.name.append(n);
    }
  });
  out.forEach((o) => body.append(o));
  body.querySelectorAll('.accordion-product').forEach((c) => {
    [...c.children].forEach((part) => {
      if (!part.children.length) part.remove();
    });
  });
}

function openTarget(block, hash) {
  if (!hash || hash.length < 2) return;
  const item = block.querySelector(`:scope > .accordion-item[id="${CSS.escape(hash.slice(1))}"]`);
  if (item && !item.classList.contains('is-open')) item.querySelector('.accordion-head').click();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .accordion-item')) return;
  const spOnly = block.classList.contains('sp-collapse');
  const products = block.classList.contains('products');
  const sp = window.matchMedia('(width <= 767px)');

  const items = [...block.children].map((row) => {
    let [titleCell, bodyCell, flagCell] = [...row.children];
    let anchorId = '';
    if (products) {
      const [first, ...rest] = [...row.children];
      titleCell = first;
      flagCell = rest.find(isFlagCell);
      bodyCell = rest.find((c) => c !== flagCell);
      const tokens = flagCell ? flagCell.textContent.trim().split(/\s+/) : [];
      anchorId = (tokens.find((t) => t.startsWith('#')) || '').slice(1);
      flagCell = tokens.some((t) => t.toLowerCase() === 'open') ? { textContent: 'open' } : null;
    }
    const isOpen = !!flagCell && flagCell.textContent.trim().toLowerCase() === 'open';
    uid += 1;
    const id = `accordion-panel-${uid}`;

    const title = el('div', 'accordion-title', ...(titleCell ? titleCell.childNodes : []));
    const head = el('div', 'accordion-head', title);
    if (products) head.append(el('span', 'accordion-icon', icon(CHEV_DOWN)));
    else if (!spOnly) head.append(el('span', 'accordion-icon', chevron()));
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-controls', id);

    const body = el('div', 'accordion-body', ...(bodyCell ? bodyCell.childNodes : []));
    if (products) buildProducts(body);
    const panel = el('div', 'accordion-panel', el('div', 'accordion-clip', body));
    panel.id = id;

    const item = el('div', 'accordion-item', head, panel);
    if (anchorId) item.id = anchorId;
    const set = (on) => {
      item.classList.toggle('is-open', on);
      const shown = on || (spOnly && !sp.matches);
      head.setAttribute('aria-expanded', shown ? 'true' : 'false');
    };
    set(isOpen);
    if (spOnly) sp.addEventListener('change', () => set(item.classList.contains('is-open')));
    const toggle = () => {
      if (spOnly && !sp.matches) return;
      set(!item.classList.contains('is-open'));
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    return item;
  });

  block.replaceChildren(...items);

  if (products) {
    // a block placed right after the accordion (simulation-quiz compact) moves into the
    // first panel left empty by the author — the product page hosts its quiz in panel 1
    const wrapper = block.parentElement;
    const next = wrapper && wrapper.nextElementSibling;
    const empty = items.map((i) => i.querySelector('.accordion-body'))
      .find((b) => !b.children.length);
    if (next && next.querySelector(':scope > .block') && empty) empty.append(next);
    // in-page links to a panel id open that panel (anchor buttons, category links)
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) openTarget(block, a.getAttribute('href'));
    });
    if (window.location.hash) openTarget(block, window.location.hash);
  }
}
