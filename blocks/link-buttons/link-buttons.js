/**
 * link-buttons — rows of arrow buttons, shared by product and customer.
 *
 * Authoring rows:
 *   optional head row: [picture?] [h2/h3 heading]
 *   one row per button: [link <p>] [sub text <p>?]
 *   grouped: one row per group: [h3/h4 group title] [link <p>…]
 *
 * Decode tier: reconstructive, classified by content: a row with a heading and no link is the
 * head, a row with a heading and links is a group, any other row is a button. Authored nodes
 * are MOVED (EW1); buttons move as their <p> (EW3).
 *
 * @variants white (customer contractor grid: grey band, white 2-column list), grouped
 *   (customer report: icon + heading, groups of a title + 2 buttons side by side),
 *   category (product `.cat-category-links-row`: one row per link; card-as-link (EW6) — the
 *   box is an <a> from the authored href, the inner anchor unwrapped, the link <p> MOVED into
 *   the label slot; a label with a line break spans two columns on PC),
 *   outline (product other-products grid: runs of emphasised links = outline buttons in a
 *   2-column grid, a lone run = one full-width button, a plain link = the right-aligned
 *   text link; the <p>s MOVE into their slots, EW3)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';
const CHEV = '<svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M16 28.067c-0.533 0-1-0.2-1.4-0.6l-14-14c-1.8-1.8 '
  + '1-4.667 2.8-2.8l12.6 12.533 12.6-12.533c1.8-1.8 4.667 1 2.8 2.8l-14 14c-0.333 0.4-0.867 '
  + '0.6-1.4 0.6z"></path></svg>';
const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M14.7 18.6007L13.4175 17.3407L17.5575 '
  + '13.2007H3V11.4007H17.5575L13.44 7.26073L14.7 6.00073L21 12.3007L14.7 18.6007Z"></path></svg>';

function decorateCategory(block) {
  if (block.querySelector(':scope > .link-buttons-cat')) return;
  const items = [...block.querySelectorAll('a[href]')].map((link) => {
    const p = link.closest('p') || link;
    const box = el('a', 'link-buttons-cat');
    box.href = link.getAttribute('href');
    if (link.querySelector('br')) box.classList.add('link-buttons-cat-wide');
    box.insertAdjacentHTML('afterbegin', CHEV);
    box.append(el('div', 'link-buttons-cat-label', p));
    link.replaceWith(...link.childNodes);
    return box;
  });
  if (items.length) block.replaceChildren(...items);
}

function decorateOutline(block) {
  if (block.querySelector(':scope > .link-buttons-run, :scope > .link-buttons-more')) return;
  const parts = [];
  let run = null;
  [...block.querySelectorAll(':scope > div > div > p')].forEach((p) => {
    const a = p.querySelector('a[href]');
    if (!a) return;
    const button = a.classList.contains('button') || !!a.closest('em, strong');
    if (!button) {
      run = null;
      parts.push(el('div', 'link-buttons-more', p));
      return;
    }
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    p.classList.remove('button-wrapper');
    a.insertAdjacentHTML('beforeend', ARROW);
    if (!run) {
      run = el('div', 'link-buttons-run');
      parts.push(run);
    }
    run.append(el('div', 'link-buttons-outline-btn', p));
  });
  parts.forEach((part) => {
    if (part.classList.contains('link-buttons-run') && part.children.length === 1) {
      part.classList.add('link-buttons-run-single');
    }
  });
  if (parts.length) block.replaceChildren(...parts);
}
const btn = (p) => el('div', 'link-buttons-btn', p);

function buildGroup(nodes) {
  const title = nodes.find((n) => n.matches(HEADING));
  const links = nodes.filter((n) => n !== title && n.querySelector('a[href]'));
  const rest = nodes.filter((n) => n !== title && !links.includes(n));
  return el(
    'div',
    'link-buttons-group',
    title ? el('div', 'link-buttons-group-title', title) : null,
    ...rest.map((n) => el('div', 'link-buttons-note', n)),
    el('div', 'link-buttons-group-list', ...links.map((p) => el('div', 'link-buttons-item', btn(p)))),
  );
}

export default function decorate(block) {
  if (block.classList.contains('category')) {
    decorateCategory(block);
    return;
  }
  if (block.classList.contains('outline')) {
    decorateOutline(block);
    return;
  }
  if (block.querySelector(':scope > .link-buttons-inner')) return;
  const head = el('div', 'link-buttons-head');
  const groups = el('div', 'link-buttons-groups');
  const list = el('div', 'link-buttons-list');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const heading = nodes.some((n) => n.matches(HEADING));
    const linked = nodes.some((n) => n.querySelector('a[href]'));
    if (heading && !linked) {
      nodes.forEach((n) => {
        if (n.matches('picture, img') || n.querySelector('picture, img')) {
          head.append(el('div', 'link-buttons-icon', n));
        } else if (n.matches(HEADING)) {
          head.append(el('div', 'link-buttons-title', n));
        } else {
          head.append(el('div', 'link-buttons-note', n));
        }
      });
    } else if (heading) {
      groups.append(buildGroup(nodes));
    } else {
      const links = nodes.filter((n) => n.querySelector('a[href]'));
      const subs = nodes.filter((n) => !links.includes(n));
      links.forEach((p, i) => {
        const item = el('div', 'link-buttons-item', btn(p));
        if (i === links.length - 1) item.append(...subs.map((s) => el('div', 'link-buttons-sub', s)));
        list.append(item);
      });
    }
  });
  const groupEls = [...groups.children];
  if (groupEls.length) {
    groupEls[0].classList.add('link-buttons-group-first');
    groupEls[groupEls.length - 1].classList.add('link-buttons-group-last');
  }
  block.replaceChildren(el(
    'div',
    'link-buttons-inner',
    head.children.length ? head : null,
    groupEls.length ? groups : null,
    list.children.length ? list : null,
  ));
}
