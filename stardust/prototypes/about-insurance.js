/* about-insurance.js — observed behaviours on /about-insurance/:
   bubble → modal (overlay fade, panel slide, close button / Esc / overlay), SP Q&A accordion toggle,
   "ページの先頭に戻る" text link scrolls to top. */
(function () {
  var doc = document;
  var modal = doc.querySelector('.ai-modal');
  var overlay = doc.querySelector('.ai-overlay');
  var content = modal && modal.querySelector('.ai-modal__content');
  var lastTrigger = null;

  function open(id, trigger) {
    var tpl = doc.getElementById(id);
    if (!tpl || !modal) return;
    content.innerHTML = '';
    content.appendChild(tpl.content.cloneNode(true));
    lastTrigger = trigger;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      modal.classList.add('is-open');
    });
    modal.setAttribute('aria-hidden', 'false');
    doc.body.classList.add('ai-modal-open');
    modal.querySelector('.ai-modal__close').focus();
  }
  function close() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    overlay.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    doc.body.classList.remove('ai-modal-open');
    setTimeout(function () { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 500);
    if (lastTrigger) lastTrigger.focus();
  }
  doc.querySelectorAll('.ai-bubble__btn').forEach(function (b) {
    b.addEventListener('click', function () { open(b.getAttribute('data-modal'), b); });
  });
  if (modal) {
    modal.querySelector('.ai-modal__close').addEventListener('click', close);
    overlay.addEventListener('click', close);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  var sp = window.matchMedia('(max-width: 767px)');
  doc.querySelectorAll('.ai-coll__title').forEach(function (t) {
    t.addEventListener('click', function () {
      if (!sp.matches) return;
      var c = t.closest('.ai-coll');
      var on = c.classList.toggle('is-open');
      t.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  });

  var top = doc.querySelector('.ai-pagetop');
  function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  if (top) {
    top.addEventListener('click', toTop);
    top.addEventListener('keydown', function (e) { if (e.key === 'Enter') toTop(); });
  }
})();
