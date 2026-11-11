/**
 * strengths — home "アクサ生命の強み" cards (index.css `.strengths-block`).
 *
 * Authoring rows:
 *   one row per card: [picture?] [h3 title (strong = blue, strong > em = large figure)]
 *     [text <p>] [link <p>…]
 *   trailing button rows: [link <p>] (em = the canon white button), one row per button row
 *
 * Decode tier: reconstructive, classified by content: a row with a heading is a card (picture →
 * tile image, heading → tile, link paragraphs → arrow links, other paragraphs → text), a row
 * without one is a button row. Authored nodes MOVE (EW1), links as their <p> (EW3).
 *
 * @variants stats (prospect `.strong`: a single-cell text row = intro; a two-cell row without
 *   a heading = stat [label <p>] [value run <p>s: digits = large figure]; a row with a heading =
 *   pro card [picture] [h3] [text <p>…] [※ note <p>] [link <p>]; classified by content,
 *   authored nodes MOVE (EW1), links as their <p> (EW3))
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function decorateStats(block) {
  const intro = el('div', 'strengths-intro');
  const stats = el('div', 'strengths-stats');
  const pros = el('div', 'strengths-pros');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const nodes = cells.flatMap((c) => [...c.children]);
    const heading = nodes.find((n) => n.matches(HEADING));
    if (heading) {
      const img = el('div', 'strengths-pro-img');
      const body = el('div', 'strengths-pro-body');
      nodes.forEach((n) => {
        if (n.matches('picture') || n.querySelector('picture, img')) img.append(n);
        else if (n === heading) body.append(el('div', 'strengths-pro-head', n));
        else if (n.querySelector('a[href]')) body.append(el('div', 'strengths-pro-link', n));
        else if (n.textContent.trimStart().startsWith('※')) {
          body.append(el('div', 'strengths-pro-note', n));
        } else body.append(el('div', 'strengths-pro-text', n));
      });
      pros.append(el('div', 'strengths-pro', img.children.length ? img : null, body));
    } else if (cells.length > 1) {
      const [label, ...values] = cells;
      // value runs: one <p> per run (as the source's inline stat__lg / stat__sm), a run of
      // digits is the large figure — classified by content, each <p> MOVES into its wrapper
      const runs = values.flatMap((c) => [...c.children]).map((n) => el(
        'div',
        /^[\d,.]+$/.test(n.textContent.trim()) ? 'strengths-stat-lg' : 'strengths-stat-sm',
        n,
      ));
      stats.append(el(
        'div',
        'strengths-stat',
        el('div', 'strengths-stat-label', ...label.children),
        el('div', 'strengths-stat-value', ...runs),
      ));
    } else {
      intro.append(...nodes);
    }
  });
  block.replaceChildren(...[intro, stats, pros].filter((n) => n.children.length));
}

export default function decorate(block) {
  if (block.querySelector(':scope > :is(.strengths-cards, .strengths-intro, .strengths-stats)')) {
    return;
  }
  if (block.classList.contains('stats')) {
    decorateStats(block);
    return;
  }
  const cards = el('div', 'strengths-cards');
  const buttons = el('div', 'strengths-buttons');
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const heading = nodes.find((n) => n.matches(HEADING));
    if (!heading) {
      if (nodes.length) buttons.append(el('div', 'strengths-btn-row', ...nodes));
      return;
    }
    const tile = el('div', 'strengths-tile');
    const body = el('div', 'strengths-body');
    nodes.forEach((n) => {
      if (n === heading) tile.append(n);
      else if (n.matches('picture') || n.querySelector('picture, img')) tile.prepend(n);
      else if (n.querySelector('a[href]')) body.append(el('div', 'strengths-link', n));
      else body.append(el('div', 'strengths-text', n));
    });
    cards.append(el('div', 'strengths-card', tile, body));
  });
  block.replaceChildren(cards, buttons.children.length ? buttons : '');
}
