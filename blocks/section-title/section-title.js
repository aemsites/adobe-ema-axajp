/**
 * section-title — a section heading, shared by home, prospect, product and about-insurance.
 *
 * Authoring rows:
 *   1. [h2 (+ optional <p> text)]
 *   2. (optional, `with-link`) [link <p>] — e.g. 記事一覧
 *
 * Template-slotted: the heading (and any text) MOVES into `.section-title-head`, the link
 * paragraph into `.section-title-link`. With `with-link` the link sits beside the heading on
 * PC; the SP copy after the next block is a presentational clone (EW4, stripInstrumentation)
 * — the source renders the same pc-only / sp-only twin.
 *
 * @variants guide (about-insurance title bar), with-link, center, small, medium, blue-block,
 *   sp-break (home: authored line breaks apply on SP only, as the source's br.sp-br),
 *   no-rule (prospect `.p-title`: centred blue title, no accent rule),
 *   numbered (prospect `.p-sec__title` 1–4: the authored <em> number renders as the badge)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

// EW4: presentational clones drop the editor's indices.
function stripInstrumentation(node) {
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll(attrs.map((a) => `[${a}]`).join(','))]
    .forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}
export default function decorate(block) {
  if (block.querySelector(':scope > .section-title-head')) return;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')];
  const links = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a'));

  const head = el('div', 'section-title-head', heading, ...texts);
  const parts = [head];
  if (links.length) parts.push(el('div', 'section-title-link', ...links));
  block.replaceChildren(...parts);

  if (block.classList.contains('with-link') && links.length) {
    const linkBox = parts[1];
    linkBox.classList.add('pc-only');
    const twin = el('div', 'section-title-link-sp sp-only');
    links.forEach((p) => twin.append(stripInstrumentation(p.cloneNode(true))));
    const wrapper = block.parentElement;
    const anchor = (wrapper && wrapper.nextElementSibling) || wrapper;
    if (anchor) anchor.after(twin);
  }
}
