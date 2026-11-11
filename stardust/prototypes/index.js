/* Home — hero carousel (autoplay 5 s, arrows, dots, pause) and the
   insurance-simulation quiz (progressive enable, GET to be-recommended/results). */
(function () {
  'use strict';
  var spQuery = window.matchMedia('(max-width: 767px)');

  /* ---------- Hero carousel ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var track = hero.querySelector('.hero__track');
    var slides = hero.querySelectorAll('.hero__slide');
    var dots = hero.querySelectorAll('.hero__dot');
    var pauseBtn = hero.querySelector('.hero__pause');
    var delay = parseInt(hero.getAttribute('data-autoplay'), 10) || 5000;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var n = slides.length;
    var index = 0;
    var timer = null;
    var paused = false;

    var render = function (dotIndex) {
      var sp = spQuery.matches;
      var offset = -index * 100;
      track.style.transform = 'translateX(' + offset + '%)';
      if (hero.classList.contains('is-capture-state') && sp) {
        /* capture state at SP: the live track is caught 6px short of the slide */
        track.style.transform = 'translateX(calc(' + offset + '% + 6px))';
      }
      var di = typeof dotIndex === 'number' ? dotIndex : index;
      Array.prototype.forEach.call(dots, function (d, i) {
        d.classList.toggle('is-active', i === di);
        d.setAttribute('aria-current', i === di ? 'true' : 'false');
      });
      Array.prototype.forEach.call(slides, function (s, i) {
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        var a = s.querySelector('a');
        if (a) a.tabIndex = i === index ? 0 : -1;
      });
    };
    var leaveCaptureState = function () {
      if (hero.classList.contains('is-capture-state')) hero.classList.remove('is-capture-state');
    };
    var go = function (i) {
      leaveCaptureState();
      index = (i + n) % n;
      /* restart the dot progress animation */
      Array.prototype.forEach.call(dots, function (d) { d.classList.remove('is-active'); });
      void track.offsetWidth;
      render();
    };
    var schedule = function () {
      clearTimeout(timer);
      if (!paused) timer = setTimeout(function () { go(index + 1); schedule(); }, delay);
    };

    /* Initial state: the instrument-observed slide (see progress.json captureState);
       delivery restores slide 1 as the initial state. */
    var start = parseInt(hero.getAttribute(spQuery.matches ? 'data-capture-start-sp' : 'data-capture-start'), 10);
    index = isNaN(start) ? 0 : start;
    var dotStart = spQuery.matches ? parseInt(hero.getAttribute('data-capture-dot-sp'), 10) : index;
    if (!hero.classList.contains('is-capture-state')) dotStart = index;
    render(isNaN(dotStart) ? index : dotStart);

    schedule();

    hero.querySelector('.hero__arrow--prev').addEventListener('click', function () { go(index - 1); schedule(); });
    hero.querySelector('.hero__arrow--next').addEventListener('click', function () { go(index + 1); schedule(); });
    Array.prototype.forEach.call(dots, function (d, i) {
      d.addEventListener('click', function () { go(i); schedule(); });
    });
    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      hero.classList.toggle('is-paused', paused);
      pauseBtn.setAttribute('aria-label', paused ? '再生' : '一時停止');
      schedule();
    });
    spQuery.addEventListener('change', function () { leaveCaptureState(); render(); });
    /* swipe */
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); schedule(); }
    }, { passive: true });
  }

  /* ---------- Simulation quiz ---------- */
  var form = document.querySelector('.sim__form');
  if (form) {
    var submit = form.querySelector('.sim__submit');
    var val = function (name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : null; };
    var setDisabled = function (name, dis) {
      Array.prototype.forEach.call(form.querySelectorAll('input[name="' + name + '"]'), function (i) {
        i.disabled = dis; if (dis) i.checked = false;
      });
    };
    var sync = function () {
      setDisabled('children', !val('maritalStatus'));
      setDisabled('age', !(val('maritalStatus') && val('children')));
      submit.disabled = !(val('gender') && val('maritalStatus') && val('children') && val('age'));
    };
    form.addEventListener('change', sync);
    sync();
  }
})();
