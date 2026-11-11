import { icon, el } from '../../scripts/chrome.js';

/**
 * Footer — recruitment microsite variant (page metadata `template: recruitment`,
 * `footer: /recruitment/footer`). Replica of the live microsite Footer + BackToTop.
 *
 * /recruitment/footer sections, in order:
 *   1 follow    — <p>FOLLOW AXA</p> <ul> social links (icon from the link host; text hidden)
 *   2 recruit   — <ul> recruitment links
 *   3 content   — <ul> other recruitment sites
 *   4 axa       — <ul> group recruitment sites
 *   5 corporate — <ul> corporate links
 *   6 copy      — <p> copyright line
 * Footer link lists (3–5) open in a new tab, as on live.
 */

const itemLink = (li) => li.querySelector(':scope > a, :scope > p > a');

function list(section, ulClass, prefix, blank) {
  const ul = section && section.querySelector('ul');
  if (!ul) return null;
  ul.className = ulClass;
  [...ul.children].forEach((li) => {
    li.className = `${prefix}-item`;
    const a = itemLink(li);
    if (!a) return;
    a.className = `${prefix}-link`;
    a.removeAttribute('title');
    a.target = blank ? '_blank' : '_self';
  });
  return ul;
}

function followIcon(a) {
  const { hostname } = new URL(a.href);
  if (hostname.includes('facebook')) return icon('rc-facebook', 'rc-follow-svg');
  if (hostname.includes('linkedin')) return icon('rc-linkedin', 'rc-follow-svg');
  if (hostname.includes('youtube')) return icon('rc-youtube', 'rc-follow-svg');
  if (hostname.includes('note.com')) a.classList.add('rc-follow-link-note');
  return null;
}

export default function decorateRecruitment(block, fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('a, p'));
  const [followSec, recruitSec, contentSec, axaSec, corpSec, copySec] = sections;

  const follow = el('div', 'rc-follow');
  const heading = followSec && followSec.querySelector('p');
  if (heading) follow.append(el('div', 'rc-follow-heading', heading));
  const followList = list(followSec, 'rc-follow-list', 'rc-follow', true);
  if (followList) {
    followList.querySelectorAll('a').forEach((a) => {
      const svg = followIcon(a);
      if (svg) a.append(svg);
    });
    follow.append(followList);
  }

  const navwrap = el(
    'div',
    'rc-footer-navwrap',
    el('nav', 'rc-footer-recruit', list(recruitSec, 'rc-footer-recruit-list', 'rc-footer-recruit', false)),
    el('nav', 'rc-footer-content', list(contentSec, 'rc-footer-list', 'rc-footer', true)),
  );
  const container = el(
    'div',
    'rc-footer-container',
    el('div', 'rc-footer-wrapper', follow, navwrap),
    el('nav', 'rc-footer-axa', list(axaSec, 'rc-footer-list', 'rc-footer', true)),
    el('nav', 'rc-footer-corporate', list(corpSec, 'rc-footer-list', 'rc-footer', true)),
  );
  const copyP = copySec && copySec.querySelector('p');
  const copy = el('div', 'rc-footer-copy', el('div', 'rc-footer-container', el('div', 'rc-footer-copytext', copyP)));

  const toTop = el('div', 'rc-totop', icon('totop'));
  toTop.setAttribute('aria-hidden', 'true');
  const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > 100);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  block.append(el('div', 'rc-footer', container, copy), toTop);
}
