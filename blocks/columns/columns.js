/**
 * columns — Prismic grid (content.css `.grid > .grid__col`): one row, one cell per column.
 * Cells hold default content: text, ※ notes, CTA buttons, text links and PC/SP picture pairs
 * (two pictures in one paragraph = PC then SP rendition; handled in-cell, no nested block).
 * Variants (block classes):
 *   w-<a>-<b>[-<c>…]  column widths in % at PC (e.g. w-15-85); none = equal columns
 *   sm-<a>-<b>…       widths at SP (≤ 767px); sm-stack = every column full width
 *   lead-l | lead-m | lead-s  size of the first text paragraph of a cell (the lead)
 *   text-s            14px body text (service rows)
 *   img-left | img-right, sp-img-left | sp-img-center | sp-img-right, img-indent
 *   rule              a divider line under the block
 * Decode tier: template-slotted per cell — every authored node is MOVED into a
 * `.columns-slice.columns-<role>` wrapper (media, text, lead, note, caption, cta, link);
 * roles come from content, never from position.
 * @param {Element} block the block element
 */
const BLOCK_TAGS = new Set(['P', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'PRE',
  'BLOCKQUOTE', 'TABLE', 'PICTURE']);
const NOTE = /^\s*(※|（注）|\(注\))/;

function isMediaOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/* bare-text cells (a single authored <p> is unwrapped by the pipeline): group inline runs */
function cellItems(cell) {
  const items = [];
  let run = null;
  [...cell.childNodes].forEach((node) => {
    const inline = node.nodeType === Node.TEXT_NODE
      || (node.nodeType === Node.ELEMENT_NODE && !BLOCK_TAGS.has(node.tagName));
    if (!inline) {
      run = null;
      if (node.nodeType === Node.ELEMENT_NODE) items.push(node);
      return;
    }
    if (!run) {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      run = document.createElement('p');
      items.push(run);
    }
    run.append(node);
  });
  return items;
}

/* a lone strong/em link in an unwrapped cell missed the foundation's button pass */
function buttonize(p) {
  if (p.querySelector('a.button')) return true;
  const a = p.querySelector('a[href]');
  if (!a || p.querySelectorAll('a').length !== 1) return false;
  if (p.textContent.trim() !== a.textContent.trim() || a.querySelector('img')) return false;
  const strong = a.parentElement.closest('strong');
  const em = a.parentElement.closest('em');
  if ((!strong || !p.contains(strong)) && (!em || !p.contains(em))) return false;
  p.className = 'button-wrapper';
  a.className = `button ${strong && p.contains(strong) ? 'primary' : 'secondary'}`;
  a.title = a.title || a.textContent;
  const outer = [strong, em].filter((x) => x && p.contains(x))
    .sort((x, y) => (x.contains(y) ? -1 : 1))[0];
  outer.replaceWith(a);
  return true;
}

function roleOf(el) {
  if (el.tagName === 'PICTURE' || isMediaOnly(el)) return 'media';
  if (el.tagName === 'P' && buttonize(el)) return 'cta';
  const links = el.querySelectorAll('a[href]');
  if (el.tagName === 'P' && links.length === 1
    && el.textContent.trim() === links[0].textContent.trim()) return 'link';
  if (NOTE.test(el.textContent)) return 'note';
  return 'text';
}

function mediaSlice(el, slice) {
  const pictures = el.tagName === 'PICTURE' ? [el] : [...el.querySelectorAll('picture')];
  const link = el.tagName === 'PICTURE' ? null : el.querySelector('a[href]');
  let host = slice;
  if (link) {
    host = document.createElement('a');
    host.href = link.getAttribute('href');
    host.className = 'columns-media-link';
    slice.append(host);
  }
  pictures.forEach((pic, i) => {
    const slot = document.createElement('div');
    if (pictures.length > 1) slot.className = i ? 'columns-sp' : 'columns-pc';
    else slot.className = 'columns-one';
    slot.append(pic);
    host.append(slot);
  });
  if (el !== pictures[0]) el.remove();
}

function decorateCell(cell, hasLead) {
  cell.classList.add('columns-cell');
  const items = cellItems(cell).map((el) => ({ el, role: roleOf(el) }));
  const hasCta = items.some((it) => it.role === 'cta');
  let leadDone = !hasLead || hasCta;
  const slices = items.map(({ el, role }) => {
    let r = role;
    if (hasCta && r === 'text') r = 'caption';
    if (hasCta && r === 'note') r = 'note caption';
    if (!leadDone && r === 'text') {
      r = 'lead';
      leadDone = true;
    }
    const slice = document.createElement('div');
    slice.className = `columns-slice ${r.split(' ').map((x) => `columns-${x}`).join(' ')}`;
    if (role === 'media') mediaSlice(el, slice);
    else slice.append(el);
    return slice;
  });
  cell.replaceChildren(...slices);
}

function widths(block, prefix) {
  const cls = [...block.classList].find((c) => new RegExp(`^${prefix}(-\\d+)+$`).test(c));
  return cls ? cls.split('-').slice(1).map(Number) : null;
}

export default function decorate(block) {
  if (block.querySelector('.columns-cell')) return;
  const lg = widths(block, 'w');
  const sm = block.classList.contains('sm-stack') ? null : widths(block, 'sm');
  const hasLead = [...block.classList].some((c) => /^lead-[lms]$/.test(c));
  [...block.children].forEach((row) => {
    row.classList.add('columns-row');
    [...row.children].forEach((cell, i) => {
      decorateCell(cell, hasLead);
      if (lg && lg[i]) cell.style.setProperty('--lg', `${lg[i]}%`);
      if (sm && sm[i]) cell.style.setProperty('--sm', `${sm[i]}%`);
    });
  });
}
