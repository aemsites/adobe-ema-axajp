/**
 * recruit-hero — recruitment key visual (live Top-styles: fixed full-viewport video backdrop,
 * bottom-left serif title + subtitle with a one-time entrance).
 * Content model: row 1: [h1 (em = title line, following text = subtitle line)];
 * row 2: [landscape video link][portrait video link] (root-relative, served from the code origin).
 * Decode tier: template-slotted — .recruit-hero-video > video (presentational, src read from the
 * authored hrefs) + .recruit-hero-container > .recruit-hero-content > h1 (MOVED); the subtitle
 * text node is MOVED into span.recruit-hero-sub so it can enter on its own delay.
 * @ew-exempt video link text — the hrefs drive the backdrop video; the link paragraphs are kept
 * (hidden) in .recruit-hero-sources so authors can swap the files.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .recruit-hero-container')) return;
  const heading = block.querySelector('h1, h2');
  const linkParas = [...block.querySelectorAll('a[href]')].map((a) => a.closest('p') || a);
  const hrefs = [...block.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const [wide, tall = wide] = hrefs;

  const container = document.createElement('div');
  container.className = 'recruit-hero-container';
  const content = document.createElement('div');
  content.className = 'recruit-hero-content';
  container.append(content);
  if (heading) {
    [...heading.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      .forEach((n) => {
        const sub = document.createElement('span');
        sub.className = 'recruit-hero-sub';
        n.before(sub);
        sub.append(n);
      });
    content.append(heading);
  }

  const sources = document.createElement('div');
  sources.className = 'recruit-hero-sources';
  sources.hidden = true;
  linkParas.forEach((p) => sources.append(p));

  const nodes = [];
  if (wide) {
    const frame = document.createElement('div');
    frame.className = 'recruit-hero-video';
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.setAttribute('aria-hidden', 'true');
    frame.append(video);
    nodes.push(frame);
    // live Video rendition: portrait viewport -> tall file, landscape -> wide file
    const pick = () => {
      const want = window.innerWidth >= window.innerHeight ? wide : tall;
      if (video.getAttribute('src') !== want) {
        video.setAttribute('src', want);
        video.play()?.catch(() => {});
      }
    };
    pick();
    window.addEventListener('resize', pick);
  }
  nodes.push(container, sources);
  block.replaceChildren(...nodes);

  // heading entrance (live MainHeadingText / SubText transitions), once the block is on screen
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    block.classList.add('is-pending');
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(() => block.classList.remove('is-pending')));
    });
    io.observe(block);
  }
}
