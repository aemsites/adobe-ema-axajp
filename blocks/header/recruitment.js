import { stripInstrumentation, el } from '../../scripts/chrome.js';

/**
 * Header — recruitment microsite variant (page metadata `template: recruitment`,
 * `nav: /recruitment/nav`). Replica of the live Header / MainNav / EntryNav.
 *
 * /recruitment/nav sections, in order:
 *   1 brand  — <p><a href="/recruitment">site name (with <br>)</a></p>
 *   2 nav    — <ul> PC header links
 *   3 drawer — <ul> SP menu links (SP labels)
 *   4 entry  — <p>ENTRY</p> <ul> entry links (a text-only item renders as a disabled entry)
 * External hosts open in a new tab (live target=_blank); entry links always do.
 * @ew-exempt <p> ENTRY label (section 4) — rendered inside the toggle button (EW7)
 */

const itemLink = (li) => li.querySelector(':scope > a, :scope > p > a');
const isExternal = (a) => new URL(a.href, window.location).hostname !== 'www.axa.co.jp'
  && !a.href.startsWith(window.location.origin);

function decorateList(ul, prefix, blank) {
  ul.className = `${prefix}-list`;
  [...ul.children].forEach((li) => {
    li.className = `${prefix}-item`;
    const a = itemLink(li);
    if (!a) {
      const span = el('span', `${prefix}-nolink`, ...li.childNodes);
      li.append(span);
      return;
    }
    a.className = `${prefix}-link`;
    a.removeAttribute('title');
    a.target = blank || isExternal(a) ? '_blank' : '_self';
  });
  return ul;
}

export default function decorateRecruitment(block, fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('a, p, li'));
  const [brand, navSec, drawerSec, entrySec] = sections;

  const bar = el('div', 'rc-header-bar');
  const logo = brand && brand.querySelector('a');
  if (logo) {
    logo.className = 'rc-header-logo';
    logo.removeAttribute('title');
    logo.querySelectorAll('br').forEach((br) => { br.className = 'br-lg'; });
    const img = el('img', 'rc-header-logo-img');
    Object.assign(img, {
      src: `${window.hlx.codeBasePath}/icons/rc-logo.png`, alt: 'アクサ', width: 45, height: 45,
    });
    logo.replaceChildren(img, el('em', 'rc-header-logo-text', ...logo.childNodes));
    bar.append(logo);
  }

  const navwrap = el('nav', 'rc-header-navwrap');
  const navList = navSec && navSec.querySelector('ul');
  if (navList) {
    decorateList(navList, 'rc-header', false);
    navList.className = 'rc-header-nav';
    navwrap.append(navList);
  }

  const entryLabel = entrySec && entrySec.querySelector('p');
  const entryBtn = el('button', 'rc-header-entry');
  entryBtn.type = 'button';
  entryBtn.setAttribute('aria-expanded', 'false');
  entryBtn.setAttribute('aria-controls', 'rc-entry-nav');
  if (entryLabel) entryBtn.append(...stripInstrumentation(entryLabel.cloneNode(true)).childNodes);
  const toggle = el('button', 'rc-header-toggle', el('i'), el('i'), el('i'));
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'rc-main-nav');
  navwrap.append(entryBtn, toggle);
  bar.append(navwrap);

  const mainNav = el('div', 'rc-mainnav');
  mainNav.id = 'rc-main-nav';
  const drawerList = drawerSec && drawerSec.querySelector('ul');
  if (drawerList) mainNav.append(el('nav', 'rc-mainnav-nav', decorateList(drawerList, 'rc-mainnav', false)));

  const entryNav = el('div', 'rc-entrynav');
  entryNav.id = 'rc-entry-nav';
  entryNav.setAttribute('aria-hidden', 'true');
  const entryList = entrySec && entrySec.querySelector('ul');
  if (entryList) entryNav.append(el('nav', 'rc-entrynav-nav', decorateList(entryList, 'rc-entrynav', true)));
  bar.append(mainNav, entryNav);

  const setEntry = (open) => {
    entryBtn.setAttribute('aria-expanded', String(open));
    entryNav.setAttribute('aria-hidden', String(!open));
    requestAnimationFrame(() => entryNav.classList.toggle('is-open', open));
  };
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    const list = mainNav.querySelector('.rc-mainnav-list');
    mainNav.style.height = open ? `${list ? list.offsetHeight : 0}px` : '0px';
  };
  entryBtn.addEventListener('click', () => {
    const open = entryBtn.getAttribute('aria-expanded') !== 'true';
    setMenu(false);
    setEntry(open);
  });
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setEntry(false);
    setMenu(open);
  });

  block.append(el('div', 'rc-header', bar));
}
