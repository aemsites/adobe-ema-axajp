/**
 * testimonial-cards — image cards with an overlaid title, each a link
 * (about-insurance `.ai-testimonials > a.ai-tcard`).
 *
 * Authoring rows: one row per card: [picture] [link <p> with <strong> title]
 *
 * Reconstructive. Card-as-link (EW6): the card is an <a> built from the authored link's href;
 * the authored anchor is unwrapped (its children stay in the moved <p>). The picture and the
 * title paragraph MOVE into the card.
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}
export default function decorate(block) {
  if (block.querySelector(':scope > .testimonial-cards-card')) return;
  const cards = [...block.children].map((row) => {
    const picture = row.querySelector('picture') || row.querySelector('img');
    const link = row.querySelector('a[href]');
    const title = link ? link.closest('p') : row.querySelector('p');
    const card = el(link ? 'a' : 'div', 'testimonial-cards-card');
    if (link) {
      card.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
    }
    card.append(
      el('div', 'testimonial-cards-image', picture),
      el('div', 'testimonial-cards-shade'),
      el('div', 'testimonial-cards-text', title),
    );
    return card;
  });
  block.replaceChildren(...cards);
}
