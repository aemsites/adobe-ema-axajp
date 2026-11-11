/* prospect.js — /prospect/ behaviours: simulation quiz progressive enable (same contract as home:
   GET → https://www.axa.co.jp/prospect/be-recommended/results) and the jump-menu anchors (live tabs have no
   href; click scrolls to the numbered section). */
(function () {
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
  Array.prototype.forEach.call(document.querySelectorAll('.jump__tab[data-jump]'), function (a) {
    a.addEventListener('click', function () {
      var t = document.getElementById(a.getAttribute('data-jump'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
