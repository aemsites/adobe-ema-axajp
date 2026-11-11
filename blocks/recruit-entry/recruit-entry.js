/**
 * recruit-entry — recruitment information section (live RecruitmentInfo + RecruitmentSiteBanner).
 * Content model (rows classified by content, never by index):
 *  - heading: [h2]
 *  - card (repeat): [h3 (en label + em title) | p (title lines)][p > a "READ MORE"] — cards with
 *    a heading form the first nav, cards without one the second nav (new tab, like the source)
 *  - site: [p…, h3, p…, p > a (policy PDF)]
 *  - banner: [PC picture, SP picture][h2 (en lines + em sub-copy), p > a (link label)]
 * Decode tier: template-slotted; card / banner links keep the AUTHORED anchor (EW3: moved as its
 * <p>) and MOVE the card's heading / title nodes into it, the label text into a styling span.
 * Line breaks: the source's viewport-only breaks are authored as plain <br>; the block CSS hides
 * them per slot (banner sub-copy: SP-only; banner title: the first break is SP-only).
 * Unclassified nodes are appended to the site part in order.
 * @param {Element} block the block element
 */
function reveal(block) {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  block.classList.add('is-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-inview');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 25% 0px' });
  block.querySelectorAll('.recruit-inview').forEach((el) => io.observe(el));
}

const el = (cls, ...kids) => {
  const d = document.createElement('div');
  d.className = cls;
  d.append(...kids);
  return d;
};

const isPicture = (n) => n.tagName === 'PICTURE' || n.tagName === 'IMG'
  || (n.tagName === 'P' && n.querySelector('picture, img') && !n.textContent.trim());

const isLinkPara = (n) => n.tagName === 'P' && n.children.length === 1
  && n.firstElementChild.tagName === 'A'
  && n.textContent.trim() === n.firstElementChild.textContent.trim();

const setBlank = (a) => {
  a.target = '_blank';
  a.rel = 'noopener';
};

/** the anchor's own nodes (its label text) MOVED into a styling span */
function wrapLabel(anchor, cls) {
  const span = document.createElement('span');
  span.className = cls;
  span.append(...anchor.childNodes);
  anchor.append(span);
  return span;
}

/**
 * Card: the authored link paragraph is the card; its anchor (EW3: moved as its <p>) hosts the
 * card's heading / title nodes (MOVED in front of the "READ MORE" label).
 */
function card(nodes) {
  const linkP = nodes.find(isLinkPara);
  const anchor = linkP.querySelector('a');
  const heading = nodes.find((n) => /^H[2-4]$/.test(n.tagName));
  if (!heading) setBlank(anchor);
  else {
    // the heading's leading label text (before the em title) MOVED into a styling span
    const lead = [];
    for (let n = heading.firstChild; n && n.nodeName !== 'EM'; n = n.nextSibling) lead.push(n);
    if (lead.some((n) => n.textContent.trim())) {
      const en = document.createElement('span');
      en.className = 'recruit-entry-en';
      heading.prepend(en);
      en.append(...lead);
    }
  }
  wrapLabel(anchor, 'recruit-entry-more');
  anchor.prepend(...nodes.filter((n) => n !== linkP));
  const li = document.createElement('li');
  li.className = 'recruit-entry-item';
  li.append(linkP);
  return { li, second: !heading };
}

/** Banner: pictures in a background layer; the authored link hosts the copy (heading MOVED). */
function banner(nodes) {
  const pics = nodes.filter(isPicture);
  const linkP = nodes.find(isLinkPara);
  const box = el('recruit-entry-banner');
  const bg = el('recruit-entry-banner-bg');
  if (pics.length > 1) {
    bg.append(el('recruit-entry-banner-pc', pics[0]), el('recruit-entry-banner-sp', pics[1]));
  } else bg.append(...pics);
  box.append(bg);
  const rest = nodes.filter((n) => !pics.includes(n) && n !== linkP);
  if (linkP) {
    const anchor = linkP.querySelector('a');
    setBlank(anchor);
    const info = wrapLabel(anchor, 'recruit-entry-banner-info');
    anchor.append(el('recruit-entry-banner-content', ...rest, info));
    box.append(linkP);
  } else box.append(el('recruit-entry-banner-content', ...rest));
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .recruit-container')) return;
  const head = el('recruit-inview');
  const navs = [];
  const siteInview = el('recruit-inview');
  let lastNav = null;
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const nodes = cells.flatMap((c) => [...c.children]);
    if (!nodes.length) return;
    const lastCell = [...cells[cells.length - 1].children];
    if (nodes.some(isPicture)) {
      siteInview.append(banner(nodes));
    } else if (cells.length > 1 && lastCell.length === 1 && isLinkPara(lastCell[0])) {
      const { li, second } = card(nodes);
      if (!lastNav || lastNav.second !== second) {
        const nav = document.createElement('nav');
        nav.className = `recruit-entry-nav${second ? ' is-second' : ''}`;
        const ul = document.createElement('ul');
        ul.className = 'recruit-entry-list';
        nav.append(ul);
        lastNav = { nav, ul, second };
        navs.push(nav);
      }
      lastNav.ul.append(li);
    } else if (nodes.length === 1 && nodes[0].tagName === 'H2' && !navs.length) {
      head.append(el('recruit-heading', nodes[0]));
    } else {
      nodes.forEach((n) => {
        if (isLinkPara(n)) {
          setBlank(n.querySelector('a'));
          siteInview.append(el('recruit-entry-policy', n));
        } else if (n.tagName === 'P' && !siteInview.querySelector('h2, h3, h4')) {
          const desc = siteInview.querySelector(':scope > .recruit-entry-site-desc')
            || siteInview.appendChild(el('recruit-entry-site-desc'));
          desc.append(n);
        } else siteInview.append(n);
      });
    }
  });
  head.append(...navs);
  const container = el('recruit-container', head);
  if (siteInview.children.length) container.append(el('recruit-entry-site', siteInview));
  block.replaceChildren(container);
  reveal(block);
}
