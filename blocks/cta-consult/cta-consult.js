/**
 * cta-consult — consultation CTA panel (canon `.cta-consult`): title, a wide main CTA with the
 * consultant illustration, and two sub-CTAs (brochure, phone) with their notes.
 *
 * Authoring rows:
 *   row 1: [title heading]
 *   row 2: [main CTA <p>] (strong = blue button; em inside the link = the small 「（無料）」 note)
 *   one row per sub: [sub heading] [CTA <p> (a second CTA <p> = the SP wording)] [note <p>…]
 *
 * Decode tier: template-slotted. Headings, CTA paragraphs and notes MOVE into their slots
 * (EW1, EW3). When a sub carries two CTA paragraphs (the phone: PC 「番号」 wording vs the SP
 * wording), the first is shown on PC and the second on SP, as the source's pc-only / sp-only
 * twins. The illustration and the button icons are decorative (CSS).
 *
 * @variants two-up (product `.cons-wrap`: one row per consultation box —
 *   [heading, picture, text] [tel link <p> + hours <p>s | CTA <p>] [contract lead <p>, number
 *   <p>, hours <p>s]; template-slotted, every node MOVED; the phone row renders as the PC tel
 *   line and, ≤767, as the source's blue phone button — one authored copy, two looks)
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

const TEL = /^[\d０-９\-－‐ ()（）]{9,}$/;
const PHONE = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c'
  + '.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 '
  + '0-17-7.61'
  + '-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 '
  + '2.2z"></path></svg>';

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function icon(className) {
  const box = el('span', className);
  box.innerHTML = PHONE;
  return box;
}

// EW4: presentational clones drop the editor's indices.
function stripInstrumentation(node) {
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll(attrs.map((a) => `[${a}]`).join(','))]
    .forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}

function buildPhone(nodes) {
  const [tel, ...hours] = nodes;
  const a = tel.querySelector('a[href]');
  const main = el(
    'div',
    'cta-consult-phone-main',
    el('div', 'cta-consult-phone-number', tel),
    hours.length ? el('div', 'cta-consult-phone-hours', ...hours) : null,
  );
  const pc = el('div', 'cta-consult-phone cta-consult-phone-pc', main);
  if (!a) return [pc];
  // the source's SP twin: one phone button <a> around the number and the hours — an EW4
  // presentational clone of the authored nodes (shown ≤767; the authored copy shows ≥768)
  const twin = stripInstrumentation(main.cloneNode(true));
  twin.querySelectorAll('a').forEach((x) => x.replaceWith(...x.childNodes));
  const sp = el('a', 'cta-consult-phone cta-consult-phone-sp', twin);
  sp.append(icon('cta-consult-phone-sp-icon'));
  sp.href = a.getAttribute('href');
  a.prepend(icon('cta-consult-phone-pc-icon'));
  return [pc, sp];
}

function buildContract(nodes) {
  const telIndex = nodes.findIndex((n) => TEL.test(n.textContent.trim()));
  if (telIndex < 0) return el('div', 'cta-consult-contract', ...nodes);
  const lead = nodes.slice(0, telIndex);
  const hours = nodes.slice(telIndex + 1);
  return el(
    'div',
    'cta-consult-contract',
    el(
      'div',
      'cta-consult-contract-line',
      ...lead.map((n) => el('div', 'cta-consult-contract-lead', n)),
      el('div', 'cta-consult-contract-number', icon(''), nodes[telIndex]),
    ),
    hours.length ? el('div', 'cta-consult-contract-hours', ...hours) : null,
  );
}

function decorateTwoUp(block) {
  if (block.querySelector(':scope > .cta-consult-blocks')) return;
  const boxes = [...block.children].map((row) => {
    const box = el('div', 'cta-consult-block');
    const info = el('div', 'cta-consult-phone-info');
    [...row.children].forEach((cell) => {
      const nodes = [...cell.children];
      if (!nodes.length) return;
      const tel = nodes[0].querySelector('a[href^="tel:"]');
      const cta = nodes.find((n) => n.querySelector('a[href]'));
      if (nodes.some((n) => n.matches('h1, h2, h3, h4, h5, h6'))) {
        nodes.forEach((n) => {
          let role = 'text';
          if (n.matches('h1, h2, h3, h4, h5, h6')) role = 'title';
          else if (n.querySelector('picture, img')) role = 'img';
          box.append(el('div', `cta-consult-block-${role}`, n));
        });
      } else if (tel) {
        info.append(...buildPhone(nodes));
      } else if (cta) {
        cta.querySelectorAll('a.button').forEach((a) => a.classList.remove('button', 'primary'));
        cta.classList.remove('button-wrapper');
        box.append(el('div', 'cta-consult-block-cta', ...nodes));
      } else {
        info.append(buildContract(nodes));
      }
    });
    if (info.children.length) box.append(info);
    return box;
  });
  block.replaceChildren(el('div', 'cta-consult-blocks', ...boxes));
}

export default function decorate(block) {
  if (block.classList.contains('two-up')) {
    decorateTwoUp(block);
    return;
  }
  if (block.querySelector(':scope > .cta-consult-inner')) return;
  const inner = el('div', 'cta-consult-inner');
  const subs = el('div', 'cta-consult-subs');
  let titled = false;
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const heading = nodes.find((n) => n.matches(HEADING));
    const ctas = nodes.filter((n) => n !== heading && n.querySelector('a[href]'));
    const notes = nodes.filter((n) => n !== heading && !ctas.includes(n));
    if (heading && !ctas.length && !titled) {
      titled = true;
      inner.append(el('div', 'cta-consult-title', heading, ...notes));
    } else if (!heading && ctas.length) {
      inner.append(el('div', 'cta-consult-main', ...ctas, ...notes));
    } else {
      const title = heading ? el('div', 'cta-consult-subtitle', heading) : null;
      const sub = el('div', 'cta-consult-sub', title);
      if (ctas.some((p) => p.querySelector('a[href^="tel:"]'))) sub.classList.add('cta-consult-tel');
      if (ctas.length > 1) {
        sub.append(
          el('div', 'cta-consult-cta cta-consult-cta-pc', ctas[0]),
          el('div', 'cta-consult-cta cta-consult-cta-sp', ...ctas.slice(1)),
        );
      } else if (ctas.length) {
        sub.append(el('div', 'cta-consult-cta', ctas[0]));
      }
      if (notes.length) sub.append(el('div', 'cta-consult-note', ...notes));
      subs.append(sub);
    }
  });
  if (subs.children.length) inner.append(subs);
  // the link text (an authored run with its 「（無料）」 note) MOVES into a text box inside the
  // same link, as the canon .btn__text (the link stays the authored element)
  inner.querySelectorAll('a[href]').forEach((a) => {
    if (!a.querySelector(':scope > .cta-consult-btn-text')) {
      a.append(el('span', 'cta-consult-btn-text', ...a.childNodes));
    }
  });
  block.replaceChildren(inner);
}
