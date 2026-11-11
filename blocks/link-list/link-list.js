/**
 * link-list — a list of links, shared by prospect (`.linkset`, link + description) and
 * about-insurance (`.ai-coll--plain`, links with a document icon).
 *
 * Authoring rows: one row per item: [link <p>] [description <p>?]; prospect authors the
 *   description inside the link (`<a>title<em>description</em></a>`, CSS only) because the
 *   source row is one link carrying both texts.
 *
 * Reconstructive: each row becomes a `.link-list-item`; the link and description paragraphs
 * MOVE into `.link-list-link` / `.link-list-desc` wrappers (classified by content, not position).
 *
 * @variants plain (about-insurance: links only, document icon + arrow rows)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}
export default function decorate(block) {
  if (block.querySelector(':scope > .link-list-items')) return;
  const list = el('div', 'link-list-items');
  [...block.children].forEach((row) => {
    const paras = [...row.querySelectorAll('p')];
    const link = paras.find((p) => p.querySelector('a'))
      || (row.querySelector('a') && row.querySelector('a').parentElement);
    if (!link) return;
    const rest = paras.filter((p) => p !== link);
    const item = el('div', 'link-list-item', el('div', 'link-list-link', link));
    if (rest.length) item.append(el('div', 'link-list-desc', ...rest));
    list.append(item);
  });
  block.replaceChildren(list);
}
