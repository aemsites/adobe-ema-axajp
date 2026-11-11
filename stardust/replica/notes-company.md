## company (archetype `company`, page type `content`, live /company/) — 2026-11-09

- Files: `stardust/prototypes/company-proposed.html`, `content.css` (shared slice modules), `company.css` (chrome overrides only).
  Markup is generated from the live slice DOM by `stardust/.work/replica/content-gen.py` (inputs: `content-main.html` + `content-sc.css`,
  dumped from the live CSSOM by `content-probe.mjs` — the captured HTML has an empty styled-components `<style>`). Re-run per sibling page.
- Module contract (content.css): `.band-outer > .band-outer__inner > .band` (Background wrappers; params `--band-pad/-bg/-border/-img/-img-sp`),
  `.slice` (1078 cap, 1.0938rem margin), `.slice-heading` (`--fs`, `__text--bordered` = BorderedTitleSlice), `.slice-text` (`--ta --pl --fs` + `-sp`),
  `.slice-media` (`--jc[-sp]`, img `--img-pl`, PC/SP pair), `.slice-rule` (`--hr-m`, `--hr-color`), `.anchor-buttons > .anchor-btn`,
  `.cta-button > .hp-btn--primary|--secondary` (`--ta[-sp] --rot`, `--fs`), `.custom-link` (`__a--plain`), `.note-list` (※), `.grid > .grid__col`
  (`--lg --md --sm` %; `--sm-full` modifier), `.breadcrumbs`. Contact section (about-axa only) NOT authored — probe its CSS when rendering about-axa.
- Page-type base differs from home: html 16px but **body 14px / line-height 1.4 / #333**, h1 1.75rem, h2 1.4rem, h3 1.225rem (in content.css).
- Live quirks mirrored: `.col * + *` 0.875rem flow margin (kept last in content.css), SP stacked full-width column gets +0.875rem
  (rule from an unreadable sheet, measured), hr is a 1px transparent spacer unless coloured (#aabdd0).
- CANON BACK-PORT (chrome differs measurably with the 14px body): SP `.sp-header__menu` 14px/1.15, `.fnav__strong` 14px/19.6px,
  SP footer statics li 19.6px, SP policy li 19.6px (canon has 16px/25.6 and 20.6) — currently in company.css; siblings need the same
  (move to canon behind a page-type class, or into content.css). No CTA rail on this page type (back-to-top only).
- Result: 1440 0.19% Δ0, 360 8.58% Δ-4, content 🔴0 🟡0, clipped 0, cap-probe PASS. Motion: back-to-top fade only (parity).
