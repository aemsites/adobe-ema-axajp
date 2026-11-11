import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { icon, stripInstrumentation, el } from '../../scripts/chrome.js';

/**
 * Header — www.axa.co.jp SharedHeader replica, slotted from the authored /nav document.
 *
 * /nav sections, in order (default content only):
 *   1 brand   — <p><a href="/">:axa-logo: label</a></p>
 *   2 tools   — <ul> utility links (last item = login button) + <p><a>検索</a></p> (search action)
 *   3 sp      — <ul> SP header links (login, support)
 *   4..n menu — <p>trigger label</p> <p><a>panel top link</a></p> then one <ul> per panel column:
 *               <li><a>group title</a><ul><li><a>sub link</a></li>…</ul></li>
 * Authored nodes are MOVED into the canon chrome DOM; the SP drawer is built from presentational
 * clones (stripInstrumentation). Trigger labels move inside a div[role=button] (EW7).
 * The recruitment microsite variant (template `recruitment`) lives in ./recruitment.js.
 * @ew-exempt <p> search label (section 2) — read as the search field placeholder / action
 */

const pcQuery = window.matchMedia('(min-width: 768px)');

/** the link of an authored list item; the pipeline wraps it in a <p> in loose lists (#98) */
const itemLink = (li) => li.querySelector(':scope > a, :scope > p > a');

function cloneLink(a, className) {
  const c = stripInstrumentation(a.cloneNode(true));
  c.className = className;
  c.removeAttribute('title');
  return c;
}

function parseMenu(section) {
  const wrap = section.querySelector('.default-content-wrapper') || section;
  const ps = [...wrap.querySelectorAll(':scope > p')];
  return {
    label: ps.find((p) => !p.querySelector('a')),
    top: ps.find((p) => p.querySelector('a')),
    cols: [...wrap.querySelectorAll(':scope > ul')],
  };
}

function buildTopbar(tools) {
  const topbar = el('nav', 'topbar');
  topbar.setAttribute('aria-label', 'ユーティリティ');
  const list = tools.querySelector('ul');
  if (!list) return topbar;
  list.className = 'topbar-list';
  const items = [...list.children];
  items.forEach((li, i) => {
    const a = itemLink(li);
    if (!a) return;
    if (i === items.length - 1 && items.length > 1) {
      a.className = 'topbar-login';
      a.append(icon('login'));
      return;
    }
    li.className = 'topbar-item';
    a.className = 'topbar-link';
    const next = items[i + 1];
    if (next && i + 1 < items.length - 1) {
      const sep = el('li', 'topbar-sep');
      sep.setAttribute('aria-hidden', 'true');
      li.after(sep);
    }
  });
  topbar.append(list);
  return topbar;
}

function buildSearch(tools) {
  const link = tools.querySelector('p a');
  const li = el('li', 'gnav-search');
  if (!link) return li;
  const label = link.textContent;
  const btn = el('button', 'search-btn', icon('search'));
  btn.type = 'button';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'header-search');
  const form = el('form', 'search-form');
  form.id = 'header-search';
  form.action = link.href;
  form.method = 'GET';
  form.setAttribute('role', 'search');
  const input = el('input', 'search-form-input');
  Object.assign(input, {
    id: 'q', type: 'text', name: 'q', placeholder: label,
  });
  input.setAttribute('aria-label', label);
  form.append(input);
  link.closest('p').remove();
  li.append(btn, form);

  btn.addEventListener('click', () => {
    const open = !form.classList.contains('is-open');
    form.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) e.preventDefault();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('.gnav-search')) {
      form.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  return li;
}

function buildMega(menu, i) {
  const item = el('li', 'gnav-item');
  item.dataset.menu = '';
  const id = `mega-${i + 1}`;
  const btn = el('div', 'gnav-btn', menu.label);
  btn.setAttribute('role', 'button');
  btn.tabIndex = 0;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', id);
  const inner = el('div', 'mega-inner');
  const topLink = menu.top && menu.top.querySelector('a');
  if (topLink) {
    topLink.className = 'mega-top';
    inner.append(menu.top);
  }
  const cols = el('div', 'mega-cols');
  menu.cols.forEach((ul) => {
    ul.className = 'mega-col';
    [...ul.children].forEach((li) => {
      li.className = 'mega-group';
      const a = itemLink(li);
      if (a) a.className = 'mega-title';
      const subs = li.querySelector('ul');
      if (!subs) return;
      subs.className = 'mega-subs';
      subs.querySelectorAll('a').forEach((s) => { s.className = 'mega-sub'; });
    });
    cols.append(ul);
  });
  inner.append(cols);
  const mega = el('div', 'mega', inner);
  mega.id = id;
  item.append(btn, mega);
  return item;
}

function buildDrawer(menus, extras) {
  const drawer = el('div', 'drawer');
  drawer.id = 'drawer';
  menus.forEach((menu, i) => {
    const open = i === 0; // live opens the first accordion by default
    const acc = el('div', `drawer-acc${open ? ' is-open' : ''}`);
    const panelId = `drawer-acc-${i + 1}`;
    const label = stripInstrumentation(menu.label.cloneNode(true));
    const btn = el('button', 'drawer-btn', ...label.childNodes, el('span', 'drawer-chev', icon('chev')));
    btn.type = 'button';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-controls', panelId);
    const panel = el('ul', 'drawer-panel');
    panel.id = panelId;
    const top = menu.top && menu.top.querySelector('a');
    if (top) panel.append(el('li', '', cloneLink(top, 'drawer-link drawer-link-top')));
    menu.cols.forEach((ul) => [...ul.children].forEach((li) => {
      const a = itemLink(li);
      if (a) panel.append(el('li', '', cloneLink(a, 'drawer-link')));
    }));
    acc.append(btn, panel);
    btn.addEventListener('click', () => {
      const isOpen = !acc.classList.contains('is-open');
      acc.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    drawer.append(acc);
  });
  extras.forEach((a) => {
    const x = cloneLink(a, 'drawer-extra');
    x.replaceChildren(el('span', '', ...x.childNodes));
    drawer.append(x);
  });
  return drawer;
}

function buildSpHeader(logo, sp, drawer) {
  const nav = el('nav', 'sp-header');
  nav.setAttribute('aria-label', 'モバイルナビゲーション');
  const list = el('div', 'sp-header-list');
  const icons = ['sp-login', 'sp-help'];
  const links = sp ? [...sp.querySelectorAll('li')].map(itemLink).filter(Boolean) : [];
  links.forEach((a, i) => {
    a.className = 'sp-header-item';
    a.removeAttribute('title');
    a.replaceChildren(icon(icons[i] || 'sp-help'), el('span', '', ...a.childNodes));
    const sep = el('span', 'sp-header-sep');
    sep.setAttribute('aria-hidden', 'true');
    list.append(a, sep);
  });
  const menuBtn = el('button', 'sp-header-menu', icon('menu'));
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'drawer');
  list.append(menuBtn);
  sp?.closest('.section')?.remove();

  const spLogo = logo ? cloneLink(logo, 'sp-header-logo') : null;
  if (spLogo) {
    spLogo.setAttribute('aria-label', logo.textContent.trim());
    spLogo.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  }
  nav.append(...[spLogo, list, drawer].filter(Boolean));

  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('is-drawer-open', open);
  };
  menuBtn.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
  pcQuery.addEventListener('change', (e) => { if (e.matches) setDrawer(false); });
  return nav;
}

function wireMega(items) {
  let closeTimer = null;
  const setOpen = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.gnav-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  const closeAll = (except) => items.forEach((it) => { if (it !== except) setOpen(it, false); });
  items.forEach((item) => {
    const btn = item.querySelector('.gnav-btn');
    const open = () => {
      clearTimeout(closeTimer);
      closeAll(item);
      setOpen(item, true);
    };
    item.addEventListener('mouseenter', () => { if (pcQuery.matches) open(); });
    item.addEventListener('mouseleave', () => {
      if (!pcQuery.matches) return;
      closeTimer = setTimeout(() => setOpen(item, false), 100);
    });
    // live: a click opens the panel (it never closes an open one)
    btn.addEventListener('click', open);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setOpen(item, false);
        btn.focus();
      }
    });
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('.gnav-item')) closeAll(null);
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const template = (getMetadata('template') || '').toLowerCase();
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;
  if (template === 'recruitment') {
    const { default: decorateRecruitment } = await import('./recruitment.js');
    decorateRecruitment(block, fragment);
    return;
  }

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('a, p'));
  const [brand, tools, sp, ...menuSections] = sections;
  const menus = menuSections.map(parseMenu).filter((m) => m.label && m.cols.length);

  const logo = brand && brand.querySelector('a');
  if (logo) {
    logo.className = 'gnav-logo';
    logo.removeAttribute('title');
    logo.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  }
  const extras = tools
    ? [...tools.querySelectorAll('ul > li')].slice(0, -1).map(itemLink).filter(Boolean) : [];

  const drawer = buildDrawer(menus, extras);
  const spHeader = buildSpHeader(logo, sp, drawer);
  const topbar = tools ? buildTopbar(tools) : el('nav', 'topbar');

  const list = el('ul', 'gnav-list');
  const items = menus.map(buildMega);
  const sep = el('li', 'gnav-sep');
  sep.setAttribute('aria-hidden', 'true');
  list.append(...items, sep);
  if (tools) list.append(buildSearch(tools));
  const gnav = el('nav', 'gnav', logo, list);
  gnav.setAttribute('aria-label', 'グローバルナビゲーション');
  wireMega(items);

  const root = el('div', 'site-header', topbar, el('div', 'gnav-bar', gnav), spHeader);
  root.id = 'site-header';
  root.querySelectorAll('a[title]').forEach((a) => a.removeAttribute('title'));
  block.append(root);
}
