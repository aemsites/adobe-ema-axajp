/**
 * page-banner — page title banner, shared by prospect, product and customer.
 *
 * Authoring rows:
 *   row 1: [picture?] [h1/h2] [lead p?]        — the picture is the banner background
 *   row 2 (aside, optional): [p…] — login card: heading p, logo picture p, note p,
 *     CTA p's (strong = orange, em = blue), plain link p (text link)
 *
 * Decode tier: template-slotted. The banner skeleton is built from empty slot containers and
 * the authored nodes are MOVED in by role (EW1); CTAs move as their <p> (EW3).
 *
 * @variants login (customer: MyAXA card beside / below the title),
 *   image (prospect `.p-hero`: row 1 [PC picture][SP picture?] [h1]; heading over the
 *   picture on PC, below it on SP; the pictures MOVE into pc / sp wrappers)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function ctaKind(p) {
  const a = p.querySelector('a[href]');
  if (!a) return '';
  if (a.closest('strong') || a.classList.contains('primary')) return 'orange';
  if (a.closest('em') || a.classList.contains('secondary')) return 'blue';
  return '';
}

function buildAside(cells) {
  const aside = el('div', 'page-banner-aside');
  const ctas = el('div', 'page-banner-ctas');
  let headDone = false;
  cells.forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (node.querySelector('picture, img')) {
        aside.append(el('div', 'page-banner-logo', node));
      } else if (node.querySelector('a[href]')) {
        const kind = ctaKind(node);
        if (kind) {
          node.querySelectorAll('a.button').forEach((a) => a.classList.remove('button'));
          node.classList.remove('button-wrapper');
          ctas.append(el('div', `page-banner-cta page-banner-cta-${kind}`, node));
          if (!ctas.parentElement) aside.append(ctas);
        } else {
          aside.append(el('div', 'page-banner-link', node));
        }
      } else if (!headDone && !aside.children.length) {
        headDone = true;
        aside.append(el('div', 'page-banner-aside-head', node));
      } else {
        aside.append(el('div', 'page-banner-note', node));
      }
    });
  });
  return aside;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .page-banner-layout')) return;
  const rows = [...block.children];
  const bg = el('div', 'page-banner-bg');
  const title = el('div', 'page-banner-title');
  const layout = el('div', 'page-banner-layout', title);
  const [first, ...rest] = rows;
  if (first) {
    [...first.children].forEach((cell) => {
      [...cell.children].forEach((node) => {
        const pic = node.matches('picture, img') ? node : null;
        if (pic || (node.querySelector('picture, img') && !node.querySelector('a'))) {
          bg.append(node);
        } else {
          title.append(node);
        }
      });
    });
  }
  if (block.classList.contains('image')) {
    // one <p> may carry both pictures: wrap each <picture> on its own (PC first, SP second)
    const pics = [...bg.querySelectorAll('picture, img:not(picture img)')];
    if (pics.length > 1) {
      const [pc, ...sp] = pics;
      bg.replaceChildren(el('div', 'page-banner-pc', pc), el('div', 'page-banner-sp', ...sp));
    }
  }
  const asideCells = rest.flatMap((row) => [...row.children]);
  if (asideCells.length) layout.append(buildAside(asideCells));
  block.replaceChildren(...(bg.children.length ? [bg] : []), layout);
}
