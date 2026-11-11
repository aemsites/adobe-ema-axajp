/* recruitment.js — recruitment microsite chrome behaviour (replica of live Header/EntryNav/MainNav/BackToTop). */
(() => {
  const entryBtn = document.querySelector('.rc-header__entry');
  const entryNav = document.getElementById('rc-entry-nav');
  const menuBtn = document.querySelector('.rc-header__toggle');
  const mainNav = document.getElementById('rc-main-nav');
  const toTop = document.querySelector('.rc-totop');

  const setEntry = (open) => {
    if (!entryBtn || !entryNav) return;
    entryBtn.setAttribute('aria-expanded', String(open));
    entryNav.setAttribute('aria-hidden', String(!open));
    requestAnimationFrame(() => entryNav.classList.toggle('is-open', open));
  };
  const setMenu = (open) => {
    if (!menuBtn || !mainNav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    const list = mainNav.querySelector('.rc-mainnav__list');
    mainNav.style.height = open ? `${list ? list.offsetHeight : 0}px` : '0px';
  };

  entryBtn?.addEventListener('click', () => {
    const open = entryBtn.getAttribute('aria-expanded') !== 'true';
    setMenu(false);
    setEntry(open);
  });
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    setEntry(false);
    setMenu(open);
  });

  // Hero video rendition (live Top-styles Video): portrait viewport → main-tall.mp4, landscape → main-wide.mp4.
  const video = document.querySelector('.rc-video__media');
  if (video) {
    const base = 'https://www.axa.co.jp/images/recruitment/career/video/';
    const pick = () => {
      const want = `${base}${window.innerWidth >= window.innerHeight ? 'main-wide' : 'main-tall'}.mp4`;
      if (video.getAttribute('src') !== want) { video.setAttribute('src', want); video.play?.().catch(() => {}); }
    };
    pick();
    window.addEventListener('resize', pick);
  }

  // InView reveal (live InView-styles): sections fade/translate in once they enter the viewport.
  const root = document.documentElement;
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('rc-js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-inview'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 25% 0px' });
    document.querySelectorAll('.rc-inview').forEach((el) => io.observe(el));
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('rc-ready')));
  }

  if (toTop) {
    const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
