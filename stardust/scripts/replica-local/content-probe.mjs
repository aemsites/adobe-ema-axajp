import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const req = createRequire('/workspace/80b77690/stardust/scripts/replica/measure.mjs');
const pw = await import(req.resolve('playwright')); const chromium = pw.chromium || pw.default.chromium;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://www.axa.co.jp/company/', { waitUntil: 'networkidle', timeout: 90000 });
await p.waitForTimeout(2000);
const out = await p.evaluate(() => {
  const main = document.querySelector('main');
  const cls = new Set();
  main.querySelectorAll('[class]').forEach(e => e.classList.forEach(c => cls.add(c)));
  const hit = s => [...s.matchAll(/\.([A-Za-z0-9_-]+)/g)].some(m => cls.has(m[1]));
  const lines = [];
  const walk = (rules, media) => { for (const r of rules) {
    if (r.cssRules && r.media) walk(r.cssRules, r.media.mediaText);
    else if (r.selectorText && hit(r.selectorText)) lines.push((media ? '@media ' + media + ' { ' : '') + r.cssText + (media ? ' }' : ''));
  } };
  for (const ss of document.styleSheets) { try { walk(ss.cssRules, ''); } catch (e) {} }
  return { css: lines.join('\n'), html: main.outerHTML, title: document.title,
    meta: [...document.querySelectorAll('meta[name=description],meta[property^="og:"],link[rel=canonical]')].map(m => m.outerHTML).join('\n') };
});
writeFileSync('/workspace/80b77690/stardust/.work/replica/content-sc.css', out.css);
writeFileSync('/workspace/80b77690/stardust/.work/replica/content-main.html', out.html);
writeFileSync('/workspace/80b77690/stardust/.work/replica/content-head.txt', out.title + '\n' + out.meta);
console.log('css lines', out.css.split('\n').length, 'html', out.html.length);
await b.close();
