/**
 * art-image — one artwork image with an optional SP rendition (Prismic Image slice,
 * content.css `.slice-media`).
 * Content model: 1 row: [PC picture][SP picture (optional)]. A link authored around a
 * picture links the whole artwork. Variants: left (default) | center | right,
 * sp-left | sp-center | sp-right (SP alignment), indent | indent-s (PC image inset),
 * banner (home `.home-banner`: full-width 280px cover image, SP rendition at its own ratio).
 * Decode tier: template-slotted — .art-image-frame > [a.art-image-link >]
 * .art-image-pc > picture + .art-image-sp > picture; the authored pictures are MOVED.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .art-image-frame')) return;
  const pictures = [...block.querySelectorAll('picture')];
  if (!pictures.length) return;
  const link = block.querySelector('a[href]');
  const frame = document.createElement('div');
  frame.className = 'art-image-frame';
  let host = frame;
  if (link) {
    const a = document.createElement('a');
    a.className = 'art-image-link';
    a.href = link.getAttribute('href');
    const alt = pictures[0].querySelector('img')?.getAttribute('alt');
    if (alt) a.setAttribute('aria-label', alt);
    frame.append(a);
    host = a;
  }
  pictures.slice(0, 2).forEach((pic, i) => {
    const slot = document.createElement('div');
    if (pictures.length > 1) slot.className = i ? 'art-image-sp' : 'art-image-pc';
    else slot.className = 'art-image-one';
    slot.append(pic);
    host.append(slot);
  });
  block.replaceChildren(frame);
}
