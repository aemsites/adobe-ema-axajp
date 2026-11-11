import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { icon, stripInstrumentation, el } from '../../scripts/chrome.js';

/**
 * Footer — www.axa.co.jp SharedFooter replica, slotted from the authored /footer document,
 * plus the floating CTA rail and the back-to-top button (both fixed-position page chrome).
 *
 * /footer sections, in order (default content only):
 *   1 sns      — <p>Follow AXA</p> <ul> social links (icon rendered from the link host)
 *   2 cats     — <ul> <li><a>category</a><ul>sub links</ul></li>…
 *   3 statics  — <ul> FAQ / contact (PC: last column of the category row; SP: own band)
 *   4,5 policy — <ul> policy link groups
 *   6 ext      — <ul> external group sites
 *   7 copy     — <p> copyright line
 *   8 rail     — <ul> CTA rail links (a tel: link is the SP variant of the link before it)
 * The rail shows when page metadata `cta-rail` is on, or by default on templates home and
 * prospect-hub; `cta-rail: off` hides it. Authored nodes are MOVED; SP twins are clones.
 * The recruitment microsite variant (template `recruitment`) lives in ./recruitment.js.
 */

const RAIL_TEMPLATES = ['home', 'prospect-hub'];
const itemLink = (li) => li.querySelector(':scope > a, :scope > p > a');

function cloneLink(a, className) {
  const c = stripInstrumentation(a.cloneNode(true));
  c.className = className;
  return c;
}

function snsIcon(a) {
  const { hostname } = new URL(a.href);
  if (hostname.includes('facebook')) return icon('facebook');
  if (hostname.includes('youtube')) return icon('youtube');
  if (hostname.includes('linkedin')) {
    const img = el('img');
    Object.assign(img, {
      src: `${window.hlx.codeBasePath}/icons/linkedin.png`, alt: '', width: 24, height: 20, loading: 'lazy',
    });
    return img;
  }
  return null;
}

function buildSns(section) {
  const sns = el('div', 'sns');
  const label = section.querySelector('p');
  if (label) sns.append(el('div', 'sns-label', label));
  const ul = section.querySelector('ul');
  if (ul) {
    ul.className = 'sns-logos';
    ul.querySelectorAll('a').forEach((a) => {
      a.className = 'sns-link';
      a.setAttribute('aria-label', a.textContent.trim());
      const ico = snsIcon(a);
      if (ico) a.prepend(ico);
    });
    sns.append(ul);
  }
  return sns;
}

function staticsList(links, linkClass) {
  return links.map((a) => {
    a.className = linkClass;
    const li = a.closest('li') || el('li', '', a);
    return el('ul', 'fnav-statics', li);
  });
}

function buildCats(section, staticsSection) {
  const ul = section.querySelector('ul');
  ul.className = 'fnav-list fnav-list-cats';
  [...ul.children].forEach((li, i) => {
    li.className = 'fnav-cat';
    const a = itemLink(li);
    const subs = li.querySelector('ul');
    const id = `fnav-acc-${i + 1}`;
    if (a) {
      a.className = 'fnav-title';
      li.prepend(el('div', 'fnav-title-wrap', a.closest('p') || a));
      const label = stripInstrumentation(a.cloneNode(true));
      const btn = el('button', 'fnav-acc', ...label.childNodes, el('span', 'fnav-chev', icon('chev')));
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', id);
      btn.addEventListener('click', () => {
        const open = !li.classList.contains('is-open');
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      li.querySelector('.fnav-title-wrap').after(btn);
    }
    if (subs) {
      subs.className = 'fnav-subs';
      subs.id = id;
      subs.querySelectorAll('a').forEach((s) => { s.className = 'fnav-sub'; });
    }
  });
  let sp = null;
  if (staticsSection) {
    const links = [...staticsSection.querySelectorAll('li')].map(itemLink).filter(Boolean);
    sp = el('div', 'fnav-sp-statics sp-only', ...staticsList(links.map((a) => cloneLink(a, '')), 'fnav-strong'));
    ul.append(el('li', 'fnav-static pc-only', ...staticsList(links, 'fnav-strong')));
  }
  return [ul, sp];
}

function buildPolicy(policySections, extSection) {
  const ul = el('ul', 'fnav-list fnav-list-policy');
  policySections.forEach((s) => {
    const list = s.querySelector('ul');
    list.className = 'fnav-statics';
    list.querySelectorAll('a').forEach((a) => { a.className = 'fnav-policy'; });
    ul.append(el('li', 'fnav-static', list));
  });
  if (extSection) {
    const links = [...extSection.querySelectorAll('li')].map(itemLink).filter(Boolean);
    links.forEach((a) => a.append(icon('ext', 'icon16')));
    ul.append(el('li', 'fnav-static fnav-static-ext', ...staticsList(links, 'fnav-ext')));
  }
  return ul;
}

function buildRail(section) {
  const ul = section.querySelector('ul');
  if (!ul) return null;
  ul.className = 'cta-rail';
  const items = [...ul.children];
  items.forEach((li, i) => {
    const a = itemLink(li);
    if (!a) return;
    const isTel = a.href.startsWith('tel:');
    const nextA = items[i + 1] && itemLink(items[i + 1]);
    const beforeTel = nextA && nextA.href.startsWith('tel:');
    let iconName = 'rail-phone';
    if (i === 0) iconName = 'rail-mobile';
    else if (i === 1) iconName = 'rail-doc';
    a.className = `cta-rail-btn${isTel ? ' cta-rail-btn-sp' : ''}${beforeTel ? ' cta-rail-btn-pc' : ''}`;
    a.replaceChildren(el('span', 'cta-rail-label', ...a.childNodes), icon(iconName, 'cta-rail-icon'));
  });
  return ul;
}

function buildBackToTop() {
  const btn = el('button', 'back-to-top', icon('totop'));
  btn.type = 'button';
  btn.setAttribute('aria-label', 'ページの先頭へ');
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 300);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  return btn;
}

function railEnabled(template) {
  const meta = (getMetadata('cta-rail') || '').toLowerCase();
  if (['on', 'true', 'yes'].includes(meta)) return true;
  if (['off', 'false', 'no'].includes(meta)) return false;
  return RAIL_TEMPLATES.includes(template);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const template = (getMetadata('template') || '').toLowerCase();
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;
  if (template === 'recruitment') {
    const { default: decorateRecruitment } = await import('./recruitment.js');
    decorateRecruitment(block, fragment, buildBackToTop);
    return;
  }

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('a, p'));
  const [snsSec, catsSec, staticsSec, policyA, policyB, extSec, copySec, railSec] = sections;

  const fnav = el('div', 'fnav');
  if (catsSec) fnav.append(...buildCats(catsSec, staticsSec).filter(Boolean));
  fnav.append(buildPolicy([policyA, policyB].filter(Boolean), extSec));
  const sep = el('div', 'fnav-sep');
  sep.setAttribute('aria-hidden', 'true');
  fnav.append(sep);

  const content = el('div', 'site-footer-content', snsSec ? buildSns(snsSec) : null, fnav);
  const copy = el('div', 'site-footer-copy', copySec && copySec.querySelector('p'));
  const root = el('div', 'site-footer', el('div', 'site-footer-main', content), copy);
  root.querySelectorAll('a[title]').forEach((a) => a.removeAttribute('title'));
  block.append(root);

  const rail = railSec && railEnabled(template) ? buildRail(railSec) : null;
  if (rail) {
    rail.querySelectorAll('a[title]').forEach((a) => a.removeAttribute('title'));
    // live renders the rail inside <main>; it is fixed-position, so only its DOM home moves
    (document.querySelector('main') || block).append(rail);
  }
  block.append(buildBackToTop());
}
