/**
 * breadcrumbs — page trail (content.css `.breadcrumbs`).
 * Content model: 1 row: [list of links; the last item is the current page as plain text].
 * Variants: default (content: `>` separators, bottom of the page), slash (prospect `.p-crumbs`:
 * inline 16px trail, orange `/` separators; CSS only).
 * Decode tier: reconstructive (list) — the authored `<ul>` is MOVED into a `<nav>`.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > nav')) return;
  const list = block.querySelector('ul, ol');
  if (!list) return;
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'パンくずリスト');
  nav.append(list);
  const items = list.querySelectorAll(':scope > li');
  const last = items[items.length - 1];
  if (last && !last.querySelector('a')) last.setAttribute('aria-current', 'page');
  block.replaceChildren(nav);
}
