# notes — home (index) archetype, canon author

## Canon (stardust/prototypes/canon/) — later archetypes reuse, do not re-author
- `canon.css`: tokens (`--blue #00008f`, `--text #343c3d`, `--accent #d24723`, …), self-hosted Noto Sans JP 400/700
  (`../fonts/`), Tailwind-preflight base, header, footer, CTA rail, back-to-top, shared modules:
  `.page-layout` (1142 max, 0 32 padding; `--full-sp` drops padding ≤767), `.section-title` (PC/SP h2 twins:
  `<h2 class="pc-only">` + `<h2 class="sp-only">` — live renders both, content-diff counts both),
  `.btn` / `.btn--primary` / `.btn-row`, `.cta-consult` (オンライン/対面 block), `.list-heading`, `.items-list`
  (2-line clamp), `.bold-link`, `.align-right > div > .bold-link`, `.verification`.
- Breakpoint: SP = max-width 767px (`.pc-only` / `.sp-only` / `br.pc-br` / `br.sp-br`).
- Header/footer/rail markup: paste `canon/header.html` (before `<main>`), `canon/rail.html` (FIRST inside
  `<main>` — live has the rail + back-to-top inside main), `canon/footer.html` (after `</main>`).
  Generated from the captured DOM (links absolutised except the 10 in-scope pages). Include
  `<script src="canon/chrome.js" defer>` (mega-menus hover/click/Esc, search toggle, SP drawer +
  accordions, footer SP accordions, back-to-top at scrollY>300).
- Mirrors of live quirks kept on purpose: svg `;` text nodes (SP menu button accessible name is ";"),
  footer FAQ/お問い合わせ twins (PC li + SP-only block), `.site-footer` is flow-root so the 56px copyright
  margin stays inside the footer box.
- Only observed hovers exist: rail CTA bg `#00006d`, `.bold-link` and recommended cards colour `#00006d`.

## Home specifics
- `index.css` / `index.js`: hero carousel (autoplay 5 s), notice, entry links, products, simulation quiz
  (GET → https://www.axa.co.jp/prospect/be-recommended/results, fields gender/maritalStatus/children/age,
  progressive enable), strengths, consultation services, news/notices, recommended, partner banners.
- CAPTURE STATE: `.hero.is-capture-state` + `data-capture-start*` reproduce the instrument-observed
  slide (PC slide 5; SP 26px collapsed list). Remove at delivery → slide 1 initial (progress.json).
- Second simulation tab (ライフイベントから) panel was never captured — button present, no panel (flag for dynamics).
- Open: header contract re-run (chrome-explore was still running at wrap-up); mega panel crops were 4–7% vs
  2% bar before the spacing fix (group margin 36 / subs padding-top 10 / panel padding-bottom 18).
