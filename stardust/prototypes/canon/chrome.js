/* AXA Life Japan replica — shared chrome behaviour (header mega-menus,
   search box, SP drawer + accordions, footer SP accordions, back-to-top).
   No dependencies. Include with <script src="canon/chrome.js" defer>. */
(function () {
  'use strict';
  var doc = document;
  var pcQuery = window.matchMedia('(min-width: 768px)');

  /* ---------- PC mega-menus: hover (desktop pointer), click, keyboard ---------- */
  var items = Array.prototype.slice.call(doc.querySelectorAll('.gnav__item[data-menu]'));
  var closeTimer = null;
  function setOpen(item, open) {
    var btn = item.querySelector('.gnav__btn');
    item.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    items.forEach(function (it) { if (it !== except) setOpen(it, false); });
  }
  items.forEach(function (item) {
    var btn = item.querySelector('.gnav__btn');
    item.addEventListener('mouseenter', function () {
      if (!pcQuery.matches) return;
      clearTimeout(closeTimer);
      closeAll(item);
      setOpen(item, true);
    });
    item.addEventListener('mouseleave', function () {
      if (!pcQuery.matches) return;
      closeTimer = setTimeout(function () { setOpen(item, false); }, 100);
    });
    btn.addEventListener('click', function () {
      /* live: a click opens the panel (it never closes an open one) */
      clearTimeout(closeTimer);
      closeAll(item);
      setOpen(item, true);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(item, false); btn.focus(); }
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.gnav__item')) closeAll(null);
  });

  /* ---------- Header search (click opens the field under the icon) ---------- */
  var searchBtn = doc.querySelector('.search-btn');
  var searchForm = doc.getElementById('header-search');
  if (searchBtn && searchForm) {
    searchBtn.addEventListener('click', function () {
      var open = !searchForm.classList.contains('is-open');
      searchForm.classList.toggle('is-open', open);
      searchBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    searchForm.addEventListener('submit', function (e) {
      var q = searchForm.querySelector('input[name="q"]');
      if (q && !q.value.trim()) e.preventDefault();
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest('.gnav__search')) {
        searchForm.classList.remove('is-open');
        searchBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- SP drawer ---------- */
  var menuBtn = doc.querySelector('.sp-header__menu');
  var drawer = doc.getElementById('drawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.classList.toggle('is-drawer-open', open);
    });
    pcQuery.addEventListener('change', function (e) {
      if (e.matches) {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        doc.body.classList.remove('is-drawer-open');
      }
    });
  }

  /* ---------- Accordions (drawer + SP footer) ---------- */
  function accordion(btnSel, wrapSel) {
    Array.prototype.forEach.call(doc.querySelectorAll(btnSel), function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.closest(wrapSel);
        var open = !wrap.classList.contains('is-open');
        wrap.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }
  accordion('.drawer__btn', '.drawer__acc');
  accordion('.fnav__acc', '.fnav__cat');

  /* ---------- Back to top ---------- */
  var toTop = doc.querySelector('.back-to-top');
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle('is-visible', window.scrollY > 300); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
