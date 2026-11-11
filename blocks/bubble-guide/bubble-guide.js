/**
 * bubble-guide — "保険を考えるタイミング" box: a grid of speech-bubble triggers, each opening a
 * modal with its explanation (about-insurance `.ai-bluebox` + `.ai-modal`).
 *
 * Authoring rows:
 *   1. [h2 + intro <p>]
 *   2..n. one row per bubble: [label <p>] [modal content: h2 + <p>…] [colour]
 *        colour = red | ltblue | dkblue
 *
 * Template-slotted (fixed 7-bubble composition; any other count falls back to an auto grid).
 * The label <p> MOVES into a div[role=button] (EW7 — no <button> hosts authored text). The modal
 * content MOVES into the dialog on open and back into its hidden panel on close (never
 * cloned, never interpolated). Motion: overlay #333 opacity 0→.5 and panel top 100vh→50% (0.5s).
 *
 * @ew-exempt colour — cell 3 is a colour keyword (config, never displayed)
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}
const COLOURS = ['red', 'ltblue', 'dkblue'];
const CLOSE_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';

function buildModal(block) {
  const overlay = el('div', 'bubble-guide-overlay');
  overlay.hidden = true;
  const close = el('button', 'bubble-guide-close');
  close.type = 'button';
  close.setAttribute('aria-label', '閉じる');
  close.innerHTML = CLOSE_SVG;
  const content = el('div', 'bubble-guide-content');
  const modal = el('div', 'bubble-guide-modal', el('div', 'bubble-guide-box', close, content));
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;
  block.append(overlay, modal);

  let current = null;
  const closeModal = () => {
    if (!current) return;
    const { panel, trigger } = current;
    panel.append(...content.childNodes);
    modal.classList.remove('is-open');
    overlay.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    document.body.classList.remove('bubble-guide-open');
    setTimeout(() => {
      if (overlay.classList.contains('is-open')) return;
      overlay.hidden = true;
      modal.hidden = true;
    }, 450);
    current = null;
    trigger.focus();
  };
  const openModal = (panel, trigger) => {
    if (current) closeModal();
    content.append(...panel.childNodes);
    current = { panel, trigger };
    overlay.hidden = false;
    modal.hidden = false;
    modal.setAttribute('aria-modal', 'true');
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      modal.classList.add('is-open');
    });
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('bubble-guide-open');
    close.focus();
  };
  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  return openModal;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .bubble-guide-inner')) return;
  const rows = [...block.children];
  if (!rows.length) return;

  const headRow = rows.find((r) => r.querySelector('h1, h2, h3') && r.children.length === 1);
  const bubbleRows = rows.filter((r) => r !== headRow && r.children.length >= 2);

  const head = el('div', 'bubble-guide-head');
  if (headRow) head.append(...headRow.firstElementChild.childNodes);

  const grid = el('div', 'bubble-guide-bubbles');
  if (bubbleRows.length === 7) grid.classList.add('bubble-guide-bubbles-7');
  const inner = el('div', 'bubble-guide-inner', head, grid);
  block.replaceChildren(inner);
  const openModal = buildModal(block);

  bubbleRows.forEach((row, i) => {
    const [labelCell, bodyCell, colourCell] = [...row.children];
    const colourWord = colourCell ? colourCell.textContent.trim().toLowerCase() : '';
    const colour = COLOURS.includes(colourWord) ? colourWord : COLOURS[i % 2 ? 1 : 0];

    const trigger = el('div', `bubble-guide-btn bubble-guide-btn-${colour}`, ...labelCell.childNodes);
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-haspopup', 'dialog');

    const title = el('div', 'bubble-guide-title');
    const text = el('div', 'bubble-guide-text');
    [...bodyCell.children].forEach((node) => {
      if (/^H[1-6]$/.test(node.tagName) && !title.childNodes.length) title.append(node);
      else text.append(node);
    });
    const panel = el('div', 'bubble-guide-panel', title, text);
    panel.hidden = true;

    const open = () => openModal(panel, trigger);
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    grid.append(el('div', `bubble-guide-bubble bubble-guide-bubble-${i + 1}`, trigger, panel));
  });
}
