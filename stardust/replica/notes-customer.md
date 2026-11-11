## customer (archetype `customer`, page type `customer-hub`, live /customer/) — 2026-11-09

- Files: `stardust/prototypes/customer-proposed.html`, `customer.css`, `customer.js`. Generator `stardust/.work/replica/customer/gen.py`
  (inputs dumped by `customer/probe.mjs`: main DOM + live CSSOM rules). Re-keys styled-components hashes to semantic classes
  (`ct-*`, `banner-*`, `mylogin-*`, `claim-*`, `inquiry-*`, `guide-*`, `swi-*`, `report-*`, `ameasa-*`, `cinfo-*`, `before-*`,
  `hpbtn-*`, `ccontact-*`, `lbtn-*`, `bcr*`, `layout`, `bordered-title`) and the shared button lib (`.db--orange|blue|white`,
  `.ds-btn--*`, `.ds-btn__label--sm|lg|arrow`, `.ds-btn__icon--sm|lg`, `.ds-link--arrow`); `[class^="DirectButton"]` → `.db`.
  Unknown lib sc-ids in selector lists are dropped per selector. Re-run the generator rather than hand-editing the GENERATED section.
- Not Prismic slices (content.css unused). Body base canon 16px/1.6; no CTA rail (back-to-top only). No canon changes.
- Slider: react-slick re-authored (real slides only in HTML; customer.js builds presentational clones, slick geometry, autoplay
  4 s, 500ms slide, arrows/dots). Live shows slidesToShow 2 on a fresh load at EVERY width (1 only after a resize across 767px).
  SP dots sit at bottom:-12rem inside an overflow:hidden section → hidden on live too (clip-probe ×5 justified).
- Live SP overflow +8px (MyAXA logo svg translateX(68px)) — clipped via `overflow-x:clip` on `.ct-customer-contents-wrapper`
  at SP; inconsistency-register entry added (pixel-identical).
- Result: 1440 0.08% Δ0, 360 0.15% Δ0, content 🔴 only the OneTrust footer pair (justified), cap-probe PASS, units 45/45, motion parity.
