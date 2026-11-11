## about-insurance (archetype `about-insurance`, page type `insurance-guide`, live /about-insurance/) — 2026-11-09

- Files: `stardust/prototypes/about-insurance-proposed.html`, `about-insurance.css`, `about-insurance.js`. Assembled by
  `stardust/.work/replica/aboutins/build.py` (canon header + back-to-top line of rail.html + `part1.html` + generated rest + footer).
  Live values: `aboutins/probe.mjs` (computed 1440/360), `css2.mjs` → `sc2.css` (CSSOM; NOTE the prospect probe's class filter
  drops hashes starting with h/m/p/b/w… — use css2.mjs's `^[A-Za-z]{5,7}$` filter instead), `bubbles.mjs` (modal texts per bubble).
- NOT Prismic slices: bespoke AboutInsuranceTopPage (BlueBox+Bubble grid, CollapsableContainer Q&A, Testimonial cards, BottomBox
  HpButtons, BackToTopTextLink, ContactLinks strip). content.css not used. Body base 16px/1.6 → canon chrome unchanged.
- No CTA rail on this page type (back-to-top only, like company). ContactLinks strip (PC ≥995 only, green/orange tel boxes +
  3 gif banners) is authored here (`.ai-contact*`) — about-axa can lift it.
- Behaviours: bubble → modal (content only rendered on click on live; kept in `<template>`s so the static content-diff matches),
  SP Q&A accordion (body height 0 until title click; the title-less 「もっと知る」 list is never collapsed), text back-to-top link.
- Live quirks mirrored: 記事一覧 button sits inside the h2 (PC) + SP twin below the grid; ライフマネジメント button PC/SP twins
  (21px vs 15.96px); bold-text spans are blue weight 400 (the media rule overrides BoldText 700); phone icon `<i>` is inline → invisible.
- No canon changes.
- Result: 1440 0.08% Δ0, 360 0.20% Δ0, content 🔴0 🟡0, clipped 0, overflow ok, cap-probe PASS (2560) — all iteration 1 `--full`.
  Motion: back-to-top fade + bubble modal (overlay/panel 0.5s) parity; hovers dead on live probe.
