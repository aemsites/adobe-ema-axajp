/* product.js — /product/ behaviours observed on live: category accordions (toggle, 0.3s grid-rows transition),
   anchor buttons open their target accordion, quiz selects (enable submit when all four are chosen). */
(() => {
  const setOpen = (acc, open) => {
    const btn = acc.querySelector('.acc__btn');
    acc.querySelector('.acc__panel').classList.toggle('is-open', open);
    acc.querySelector('.acc__icon').classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  document.querySelectorAll('.acc').forEach((acc) => {
    acc.querySelector('.acc__btn').addEventListener('click', () => {
      setOpen(acc, acc.querySelector('.acc__btn').getAttribute('aria-expanded') !== 'true');
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      const acc = target && target.querySelector('.acc');
      if (acc) setOpen(acc, true);
    });
  });

  const form = document.querySelector('.cyo-form');
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const selects = [...form.querySelectorAll('.field__native')];
  const sync = () => { submit.disabled = !selects.every((s) => s.value); };
  selects.forEach((sel) => {
    const btn = sel.parentElement.querySelector('.field__btn');
    const val = btn.querySelector('.field__value');
    sel.addEventListener('change', () => {
      const opt = sel.options[sel.selectedIndex];
      val.textContent = sel.value ? opt.textContent : '---';
      if (sel.value) btn.removeAttribute('data-empty'); else btn.setAttribute('data-empty', '');
      sync();
    });
    btn.addEventListener('click', () => {
      try { sel.showPicker(); } catch (e) { sel.focus(); }
    });
  });
  sync();
})();
