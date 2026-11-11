## product (archetype `product`, page type `product-listing`, live /product/) — 2026-11-09

- Files: `stardust/prototypes/product-proposed.html`, `product.css`, `product.js`. Not Prismic slices — a bespoke React page
  (Products/AnchorButtons/CategoryLink/ChooseYourOwnInsurance/ProductCategoryGroup/Consultation/ContactSectionsProduct
  styled-components + the Tailwind v4 UI kit). content.css does NOT apply.
- Body base = canon 16px/1.6 (like home, unlike content's 14px) → canon chrome fits as-is; no CTA rail (back-to-top only).
- Generator: `stardust/.work/replica/product-gen.py` (inputs from `product-probe.mjs`: main DOM + live CSSOM rules).
  Emits semantic markup and re-keys each styled-components hash to a semantic class (`pl-*`, `anchor-*`, `cat-*`, `cyo-*`,
  `pcg-*`, `cons-*`, `contact-*`, `sh-*`, `ds-btn*`), spliced into product.css below the GENERATED marker. A second hash on
  the same component becomes `<name>--2`. Re-run it rather than hand-editing the generated section.
- UI-kit modules hand-authored in product.css section 1 (reusable by any page built on the same kit): `.bc` breadcrumbs,
  `.btn2` (--primary / --outline / --full, disabled), `.acc` accordion (grid-rows 0fr→1fr 300ms, `.is-open`),
  `.field` select (native select overlaid on the trigger).
- Cascade quirk: live kit utilities live in a cascade layer, so page (styled-components) rules beat them — mirror with
  `:where()` on kit child selectors (e.g. `.acc__body > :where(:first-child)`), else SP `.cyo-wrapper` margin 3rem is lost (−96px).
- Live quirks mirrored: select triggers keep the React `aria-label="select:select-id-_r_N_:trigger"` (ids vary per render);
  39 two-line button labels clip inside 48px overflow:hidden buttons at 360 (same on live).
- No canon changes.
- Result: 1440 0.16% Δ0, 360 0.18% Δ0, content 🔴0, cap-probe PASS, motion parity (accordion 300ms, back-to-top fade).
