## prospect (archetype `prospect`, page type `prospect-hub`, live /prospect/) — 2026-11-09

- Files: `stardust/prototypes/prospect-proposed.html`, `prospect.css`, `prospect.js`. Assembled by
  `stardust/.work/replica/prospect/build.py` (canon header/rail/footer + `main.part.html`); live values from
  `stardust/.work/replica/prospect/probe.mjs` (CSSOM dump `sc.css` + per-element computed styles at 1440/360).
- NOT Prismic slices: bespoke ProspectTop components (HeroBanner, ProspectTabs/ProspectForm, JumpSection, ProductsSection,
  ConsultationSection, StrengthsSection, LinkSet, tailwind breadcrumb). content.css not used.
- Body base 16px/1.6 like home (not 14px like company) → canon chrome fits unchanged; CTA rail present (canon rail.html).
- Simulation widget is the same component as home: `.sim` rules lifted from index.css into prospect.css (+ SP submit icon
  right 12.8px). Candidate for a canon shared module at delivery.
- Probe gotcha: `form.children` is shadowed by the radio named `children` — walk `childNodes` when crawling forms.
- Live quirks mirrored: jump tabs are `<a>` without href (prospect.js scrolls on click); PC jump arrow is a 100%-wide svg
  rotated 90°; SP product tile text translateX(-20px); consultation link 15px/22.5 at both widths, strengths links 16/24;
  breadcrumb separator "/" weight 800 #d24723; stat label translateY(3px).
- No canon changes.
- Result: 1440 2.73% Δ-3, 360 0.67% Δ0, content 🔴0 🟡0, clipped 0, chrome crops ≥98.66%, cap-probe PASS (2560).
  Motion: back-to-top fade + jump-tab hover colour (parity).
