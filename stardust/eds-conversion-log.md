# EDS conversion log — axa.co.jp replica

## Publish decision (2026-11-09)

Decided before the run: **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer and any locale variants) go live on the aem.live origin — `deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`.

## archetype-company — /company (template `content`), blocks art-image, anchor-links, columns, breadcrumbs

Content: `content/company.html`, generated from the gated prototype by
`stardust/.work/rollout/archetype-company/probes/{dump,gen-content}.mjs` (text verbatim; Prismic
per-instance params → block variants / section-metadata). One prototype `.band` = one section
(`style: band` + `band-pad|band-bg|band-border|band-img|band-img-sp` keys, images authored as `<img>`
in the cell; `anchor: NN` on the six topic heading bands). Empty band dropped; rule-only bands =
`band, spacer` sections; a band whose trailing text is the 0.7rem inset ※ source note (or the inset
1.4875rem lead of band 31) is split at that text into a `notes` / `lead-txt` section (+4px border).
Turquoise `.turquoise-txt` highlights are authored as `<em>` (rendered #00adc6, upright); the 無料 badge
is an `<em>` inside the primary CTA link. Images: 34 rehosted to DA `media/company/`
(ledger `stardust/deploy/media-ledger-company.json`).

| block | decode tier | notes |
|---|---|---|
| art-image | template-slotted | 1 row [PC pic][SP pic?]; link around a picture links the frame (EW6: href read, anchor dropped); variants left/center/right, sp-*, indent, indent-s |
| anchor-links | reconstructive | one row per link `<p>`; each `<p>` MOVED into `.anchor-links-item`; arrow + hover sweep in CSS; `#NN` with no id resolves to the section with `data-anchor="NN"` and gives it the id |
| columns | template-slotted per cell | replaces the boilerplate block. Widths from `w-a-b` / `sm-a-b` / `sm-stack` classes (→ `--lg`/`--sm` on cells). Every authored node MOVED into `.columns-slice.columns-<role>`; roles by content: media (picture-only p; 2 pictures = PC+SP), cta (button p; a lone strong/em link in an unwrapped cell is buttonized like decorateButtons), link, note (※ / （注）), caption (text in a CTA cell), lead (first text of a cell under lead-l/m/s), text |
| breadcrumbs | reconstructive (list) | authored `<ul>` MOVED into `<nav aria-label>`; last text item `aria-current`; `>` separators in CSS. D1 🟡 (1-row prose block) kept: shared trail component across 5 templates (block-map) |

Local QA: block-roundtrip --ew exit 0 (per block and whole page, 0 dead/duplicated). qa-gate on the
harness: 96 ok, 1 fail = content cap 1078 vs DESIGN.json 1142 — the content template's live module
cap is 1078 (DESIGN.json capRegister); with `--schema` the unit asserts also mis-map every generic
prototype `band` section to the first block (instrument artefact, not a decode gap).
Foundation gap → foundation-requests.md line + scoped override in breadcrumbs.css.

## archetype-about-insurance — /about-insurance (template insurance-guide, 2026-11-09)

Content: `content/about-insurance.html`, generated verbatim from the gated prototype by
`stardust/.work/rollout/archetype-about-insurance/probes/build-content.mjs` (bubble modal texts from
the prototype `<template>`s = live clicks). Media: 13 images rehosted to DA `media/about-insurance/`
(ledger `stardust/deploy/media-ledger-archetype-about-insurance.json`). Decorative icons/bars stay
CSS-only (`www.axa.co.jp/images/…` as in the prototype).

| block | tier | decode | variants authored here |
|---|---|---|---|
| section-title | template-slotted | h2 (+text) → `.section-title-head`, link `<p>` → `.section-title-link`; `with-link` SP twin = EW4 clone after the next block (source has the same pc/sp pair) | default (canon), `guide` (ai-h2 title bar — new variant name), `with-link`, `center`/`small`/`medium`/`blue-block` |
| bubble-guide | template-slotted + JS modal | row 1 → head; per bubble: label `<p>` moved into div[role=button] (EW7); modal h2/p moved into a hidden panel, moved into the dialog on open and back on close; colour cell `@ew-exempt` | 7-bubble grid areas (other counts: auto grid) |
| accordion | reconstructive | per row: title → div[role=button], body → grid-rows panel; optional cell 3 `open` (`@ew-exempt`) | default (product `.acc`), `sp-collapse` (about-ins Q&A; block-map called it `sp-only`, renamed: `sp-only` collides with the foundation utility class that hides ≥768) |
| link-list | reconstructive | per row: link `<p>` / desc `<p>` by content | default (prospect linkset), `plain` |
| testimonial-cards | reconstructive | EW6 card-as-link: `<a>` from the authored href, inner anchor unwrapped, picture + title `<p>` moved | — |
| entry-links | reconstructive | default: EW6 card-as-link box + chevron; `buttons`: caption above CTA `<p>` (strong = blue, em = coral); coral CTA gets the source's smaller SP twin (EW4 clone) | default (home), `buttons` |
| contact-links | reconstructive | rows classified: picture rows → banner cells (external links get target _blank), ul rows → list, else a box (CTA = EW6 card-as-link, tel by pattern, eyebrow, hours) | `tel-boxes`, `pc-only` (hidden ≤994); default = generic boxes |

Reused (archetype-company): breadcrumbs, art-image — insurance-guide look (`/` orange separators at the
top; full-width figure, 2rem rhythm) shipped as a `body.insurance-guide` scoped override in
section-title.css. Template default content (h1, p, `em`, section style `pagetop`) likewise —
foundation-requests.md line.

davids-model-lint 🟡 justified: D1 section-title / breadcrumbs / link-list are catalogued blocks
(block-map) with variant styling and a JS twin, not default content; D3 bubble-guide (head row 1
cell, bubble rows 3) and contact-links (box rows 4 cells, banner row 3) are the block-map content
models. qa-gate: 1 fail is a schema artifact — section-schema finds only the prototype's one
`<section>` (`.ai-contact`) and maps it onto EDS section 1 (breadcrumbs).

Open for the reusing templates: `products` accordion body styling (product), section-title
`numbered` (prospect), contact-links default/`card` styling (product/customer) — decode is generic,
look not yet lifted.

### archetype-company — delivery rounds (published origin, main--80b77690--aemcoder.aem.page)
- R1 1440 26.98 % / Δh 347: in-band Prismic rules and top-level full-bleed bands missing → section
  styles `wide`, `join` (band split at a text-size change), `rule-top|rule-bottom[-l]`, `spacer`,
  `empty`, `lead-l`; columns variants `rule|rule-m|space|space-m|note-gap`; anchor-links `rule-before`.
- R2 1440 10.39 %: inset images (live: border-box padding over intrinsic width; EDS img width attr)
  → `width: auto`; `<br>` closing a `<strong>` moved after it (DA drops it); nested label strong dropped.
- R3 360 18–20 %: live keeps a 0.875rem flow gap above every SP column image (hidden PC twin) →
  `.columns-media` SP padding-top; SP image inset (`sp-img-indent`); SP CTA min-height 49px; empty ※
  note list in the prototype filled from the live capture (company.json body).
- Final: 1440 0.27 % Δh 0, 360 2.27 % Δh −20, clipped 0, MISSING/HIDDEN 0; only
  `font-not-loaded:noto-sans-jp-fallback` (known, queued for C-final). ai-readability code 100 %.
- White-txt h2 blank first line is CSS (`h2::before` 1lh), the authored leading `<br>` removed (DA drops
  it in a heading without inline wrapper).

## archetype-customer — /customer (template customer-hub, 2026-11-09)

Content: `content/customer.html`, authored verbatim from the gated prototype (texts, hrefs, alts;
the dates keep live's leading U+200B). Media: 19 images rehosted to DA `media/customer/` (ledger
`stardust/deploy/media-ledger-archetype-customer.json`): banner bg, 5 slider banners, 4 panel icons,
the ameasa photo, plus the MyAXA logo and 7 service icons as pure-vector SVGs (fill baked in, < 3 KB).
Button arrows / slider chevrons / notice arrows are decorative (CSS masks / JS chevron).

| block | tier | decode | variants authored here |
|---|---|---|---|
| page-banner | template-slotted | row 1: picture → bg slot, h1 + lead → title slot; row 2 (aside): first plain p → head, picture p → logo, other p → note, strong/em link p → orange/blue CTA (EW3, foundation `.button` class dropped), plain link p → text link | `login` (customer MyAXA card; SP card overlaps below the 200px banner) |
| banner-slider | reconstructive + JS | one row per slide, the authored link (or its p) MOVED into a slide; loop clones EW4 (stripInstrumentation, aria-hidden, tabindex -1; link + alt kept as react-slick); 2 per view, 500 ms, autoplay 4 s (live interval), pause on hover, arrows + dots; ResizeObserver repaint (sections are hidden at decorate) | — (the section's default-content arrow link is styled from banner-slider.css via `.banner-slider-container`) |
| link-panels | reconstructive | per row by content: picture → icon, heading → title, link p → button, other p → note; first panel wide (buttons split into 2 columns), rest cards | — |
| link-buttons | reconstructive | heading-only row → head (picture → icon), heading + links row → group, link rows → buttons (+ sub p) | default (customer `.before-*`), `grouped` (report: icon head + 2 groups), `white` (contractor grid band) |
| feature-grid | reconstructive | heading row → head + intro (picture, p), link row → button + note, other rows → items (icon picture + text p) | `services` (ameasa) |
| news-list | reconstructive | heading row → head, rows with a non-link p (date) or not last → items, last links-only row → more buttons (2×2) | `dated` |
| contact-links (reuse, additive) | reconstructive | NEW: a heading row without a link → `.contact-links-title`; `card` keeps the authored anchor (box = button wrapper, no EW6 unwrap); empty slots no longer appended as "null" text (only reachable by boxes missing a part — about-insurance boxes have all four) | `card` styling |

Reused as-is: breadcrumbs (archetype-company) — its content.css look equals customer `.bcr-*`, no override.
Template layer (1078 cap, 0 / 14px gutters) shipped as per-block wrapper overrides — foundation-requests.md.

block-roundtrip --ew (whole page, 1440): 0 structural 🔴, EW editable 55/55, dead 0, duplicated 0;
🟡 slider dot numbers (generated, not authored), IMG COUNT (bg/logo/icons are pictures here, svg/CSS
in the prototype). davids-model-lint 🟡 justified: D1 link-buttons / contact-links / breadcrumbs are
catalogued blocks with variant styling; D3 differing cell counts are the block-map content models; D4
the 8 SVGs are pure vector. qa-gate: content cap 1082 = the source slider cap (live `.ct-slider-section`
max-width 1082), not a defect.

Gate (published, gate-all --only customer): 1440 pixel 0.39 %, Δh 0, clipped 0, MISSING/HIDDEN 0;
360 pixel 8.13 %, Δh −95 (1.2 %), clipped 5 (allow 5 — prototype-stage live-parity override carried
into gates/all-360/clip-allow.json), MISSING/HIDDEN 0. The 360 residue: in the gate's chrome tier live
now renders 7647px tall (white DirectButton labels fit one line) while a chromium load of live and the
prototype give 7741 (two lines) — live variance, the replica follows the gated prototype. Units: the
customer families in stardust/replica/units.json gained the EDS selectors (prototype selector kept
first); remaining unit "missing" rows are the decorative arrow svgs (CSS-drawn here).

## archetype-recruitment — /recruitment (template recruitment, 2026-11-09)

Content: `content/recruitment.html`, hand-authored verbatim from the gated prototype (live
/recruitment/career). Chrome = /recruitment/nav + /recruitment/footer via page metadata `nav` /
`footer`, `Template: recruitment`. Media: 16 images rehosted to DA `media/recruitment/`
(ledger `stardust/deploy/media-ledger-archetype-recruitment.json`); the four position/business
diagram SVGs (56–96 KB, over the ~40 KB SVG cap) were rasterized to 2x/3x PNG. Hero videos
(`main-wide.mp4` 12.9 MB / `main-tall.mp4` 6.6 MB) are served root-relative from the code origin at
the source path `/images/recruitment/career/video/` (block-map: never content.da.live). Section
style `kv` (styles.css) carries the home key visual.

| block | decode tier | notes |
|---|---|---|
| recruit-hero | template-slotted | row 1 h1 (em = title, following text MOVED into `.recruit-hero-sub`); row 2 [landscape][portrait] video links → fixed backdrop `<video>` (orientation re-pick on resize); link paragraphs kept hidden, `@ew-exempt`; heading entrance once on screen |
| recruit-statement | template-slotted | head h2 / body nodes MOVED; variants `purpose`, `message`; in-view reveal |
| recruit-about | template-slotted (items segmented on h4) | rows classified by content: head (h2), overview (h4+h5+text p), position (h4, pictures PC/SP), note (text; links new tab), business (h3, lead, PC/SP pictures, note) |
| recruit-channels | reconstructive | rows: kv picture, head (h2+lead), channel (title h2 or empty cell → PC spacer, picture, h6+p), service item (picture, h3+p); leftovers appended |
| recruit-entry | template-slotted | heading row; card rows [h3 en+em \| p title][p > a READ MORE] — the AUTHORED anchor hosts the card (heading/title MOVED in, label wrapped) so the link label equals the source's; cards without a heading = second nav (new tab); site row; banner row [PC/SP pictures][h2 + p > a] |

Source viewport-only line breaks (`br-sp` / `br-pc`): authored as plain `<br>` (keeps the text-node
split the live headings/links have, so the content gate matches) and hidden per viewport in block CSS
(“source line-break map” in recruit-statement.css; recruit-about business heading/lead + position
titles; recruit-channels titles; recruit-entry banner). The message/purpose/business-lead rules are
positional (`:nth-of-type`) — presentational only, every text stays editable; an author who
restructures those paragraphs gets plain breaks at both widths.

davids-model-lint 🟡 justified: D3 (rows with differing cell counts) is the block-map content model of
each recruit-* block; D1 recruit-statement is a catalogued bespoke band (variant styling + reveal).
Local QA: block-roundtrip --ew exit 0 (whole page, 0 dead/duplicated). Gate sidecars: presence.json
`recruitment.main` (live keeps its chrome inside `<main>`; root = TopPageContainer vs EDS main) and
units.json build selectors for the five recruitment unit families (EDS class names appended).

## archetype-index — /index (template home, 2026-11-09)

Content: `content/index.html` from the gated prototype; 42 media rehosted to DA `media/index/`
(ledger `stardust/deploy/media-ledger-archetype-index.json`). The CTA rail is the foundation's last
/footer section (default on home + prospect-hub), not in-page content.

| block | decode tier | notes |
|---|---|---|
| hero-carousel | reconstructive + JS | one row per slide (picture PC/SP, link); autoplay + dots + prev/next |
| product-cards | reconstructive (EW6) | repeat group; SP single-card clone (EW4) for the carousel view |
| simulation-quiz | template-slotted | question/answers MOVED into the form chrome; action URL `@ew-exempt` |
| cta-consult | template-slotted | heading + lead + button nodes MOVED |
| strengths | reconstructive | repeat group of icon + heading + text; `body.home` button-row override (foundation request) |
| banner-links | reconstructive | partner banners, picture + link per row |

Additive variants on shared blocks: news-list `home` / `notice` / `recommended`, feature-grid `icons`,
section-title `sp-break`, art-image `banner`, entry-links `arrow`. block-roundtrip `--ew`: 0 structural red
(maps: hero-carousel=section.hero, news-list=:is(.notice,.list-block), product-cards=.products,
simulation-quiz=.sim, art-image=.home-banner, feature-grid=.consult, banner-links=.partners).

## archetype-prospect — /prospect (template prospect-hub, 2026-11-09)

Content: `content/prospect.html` from the gated prototype (no `convert` blocks — reuse only);
13 media rehosted to DA `media/prospect/` (ledger `stardust/deploy/media-ledger-archetype-prospect.json`).
The CTA rail is the foundation's last /footer section (default on prospect-hub), not in-page content.
The banner title is authored as `<h1>` (live has no h1; delivery-lint P0 requires exactly one).
Jump targets: section-metadata `anchor: p-sec-1..4` → anchor-links resolves `#p-sec-N` to the section.

| block (variant) | decode tier | notes |
|---|---|---|
| page-banner `image` | template-slotted | PC / SP pictures MOVE into pc / sp wrappers; h1 over the picture on PC, below it on SP |
| section-title `no-rule`, `numbered` | template-slotted | numbered: the authored `<em>N</em>` in the h2 is the badge (heading text = live "1保険商品から探す") |
| simulation-quiz | template-slotted | as home; `body.prospect-hub` shrink-to-fit width (auto-margin flex item in the source) |
| anchor-links `jump` | reconstructive | CSS-only; `<em>N</em>` in each link = badge |
| product-cards `icons` | reconstructive (EW6) | tile = `<a>` from the title link (unwrapped); trailing strong link = blue `.p-btn` |
| feature-grid `bullets` | reconstructive | lead / link / heading+pictures / bullets classified by content; check icon decorative SVG |
| strengths `stats` | reconstructive | intro / stat rows (value runs, digits = large) / pro cards (※ note classified by text) |
| link-list (default) | reconstructive | description authored inside the link as `<em>` (source row is one link) |
| breadcrumbs `slash` | reconstructive (list) | inline trail, orange `/` |

Default content + section styles: `lead` (the two `.p-sub` h2 lines, rules in section-title.css under
`body.prospect-hub`), verification code `p` before the trail (breadcrumbs.css, `body.prospect-hub`).
Value runs: the pipeline inserts spaces around inline `<strong>` in CJK text (`約 **9,500** 万人`), so stat
values are authored as one `<p>` per run. block-roundtrip `--ew`: 0 structural red (maps:
page-banner=.p-hero__image, simulation-quiz=.sim, anchor-links=.jump, product-cards=.tiles,
feature-grid=.consult, strengths=.strong, link-list=.linkset, breadcrumbs=.p-crumbs, section-title=.p-title).
Published gate: 1440 pixel 1.95 %, Δh -1; 360 pixel 0.90 %, Δh 0; clipped 0; MISSING 3 = CTA rail
(override). `stardust/replica/units.json` prospect families gained EDS build selectors.

## archetype-product — /product (template product-listing, 2026-11-09)

Content: `content/product.html` from the gated prototype by
`stardust/.work/rollout/archetype-product/probes/build-content.mjs` (every visible prototype text run
present — `probes/textcheck.mjs`, only the `---` select placeholder is UI chrome). Media: 36 images
(29 product logos/badges, 2 consultation photos, 6 anchor pictograms as pure-vector SVG) rehosted to
DA `media/product/` (ledger `stardust/deploy/media-ledger-archetype-product.json`); arrows/chevrons
are decorative inline SVG in block JS. No convert blocks — every block is reused; the product look
ships as ADDITIVE variants (owners all done; existing pages unchanged):

| block | variant added | decode tier | notes |
|---|---|---|---|
| accordion | `products` | reconstructive | body segmented on picture groups → 2-up product cards (logos / badge / description / strong+em CTA row / one row per terms link); a list → 2-col archive link grid; flag cell `open` + `#id` (`@ew-exempt`, anchor targets); the adjacent `simulation-quiz` block MOVES into the empty panel 1; `#id` links open their panel |
| simulation-quiz | `compact` | template-slotted | intro h2s, label `<p>`s and option `<ul>`s MOVED; listbox popup (li = option), trigger shows `---` or an EW4 clone; hidden inputs gender/age/maritalStatus/children; submit div[role=button] disabled until complete (as live) |
| anchor-links | `icons` | reconstructive (EW6) | card-as-link box from the authored href, inner anchor unwrapped, picture + link `<p>` moved |
| link-buttons | `category`, `outline` | reconstructive | category: EW6 arrow links, a `<br>` label spans 2 columns on PC; outline: em-link runs = 2-col outline grid / single full-width button, plain link = right-aligned text link |
| cta-consult | `two-up` | template-slotted | [title, picture, text] [tel `<p>` + hours / CTA] [contract lead, number, hours]; SP phone button = EW4 clone `<a>` around number + hours (the source's sp twin) |
| contact-links | `strip` | reconstructive | boxes keep their links, rule between; ul → outline buttons (label span inside the authored link); tel line may carry an `<em>` note |
| page-banner | `consult` (CSS only) | template-slotted (existing) | 1st CTA = PC, 2nd = SP wording (`+` sibling), note PC only |
| section-title / breadcrumbs | CSS only | — | `body.product-listing` rhythm: center 1.3125rem / blue-block 1.75rem 6rem above; `.bc` trail (orange `/`) |

Template layer (`body.product-listing`, 1050px column, blocks 1rem apart, 1rem below the header)
ships in breadcrumbs.css — foundation-requests.md line. block-roundtrip `--ew`: 0 structural red
(maps: breadcrumbs=.bc, page-banner=.pl-banner-inner, accordion=.acc, simulation-quiz=.cyo-wrapper,
cta-consult=.cons-wrap, contact-links=.contact-content-wrapper, anchor-links=.anchor-button-wrapper);
exempt 13 = the accordion flag cells. davids-model-lint 🟡 justified: D1 breadcrumbs / page-banner /
section-title are catalogued blocks (block-map) with variant layout; D3 cta-consult (3/2 cells) and
contact-links (box rows 4/3 + list row) are the block-map content models.

Published gate (main--80b77690--aemcoder.aem.page): 1440 pixel 6.67 %, Δh +37 (0.4 %), clipped 0,
MISSING 0 / HIDDEN 0; 360 pixel 4.76 %, Δh 0, clipped 39 = live 39 (documented override, same
elements as prototypes-360), MISSING 0. Header/footer crops: 1440 0.00 % / 0.50 %, 360 1.34 % / 0.32 %.
Rows otherwise fail only on the queued font-not-loaded fallback and the units pairing advisory.

## cluster-content — /customer-feedback, /about-axa, /dataprivacy (template `content`, siblings of /company, 2026-11-09)

Render (migrate, sibling tier): `sibling-variance.mjs` company vs the 3 siblings (exit 2 — per-instance
Prismic params, JSON `stardust/.work/rollout/cluster-content/variance.json`); structural clones
`stardust/prototypes/<slug>-proposed.html` by `probes/clone-gen.py` (fork of
`stardust/scripts/replica-local/content-gen.py`: capture `<main>` + live styled-components params;
adds bands nested in grid columns, ContactSection info, heading alignment, OuterBackground colour,
the ※ List text the archetype re-author dropped); `migrate.mjs render` → rendered 3, unchanged 0,
refused 0; content-diff capture vs render: looks-same 0 · nothing-lost 0 on all three.
Content: `content/<slug>.html` by `probes/{dump-sib,gen-sib}.mjs` — the company encoder
(`archetype-company/probes/{dump,gen-content}.mjs`) forked, text verbatim from the clone. Media:
16 images rehosted to DA `media/<slug>/` (ledger `stardust/deploy/media-ledger-cluster-content.json`);
4 SVGs that embed raster data (DA svg-unsafe) rasterized 1x at their intrinsic size (`probes/raster.mjs`).
No block re-authored; sibling looks are ADDITIVE variants (company pages unchanged):

| block | variant(s) | why |
|---|---|---|
| columns | `img-inward`, `link-s`, `cell-rule-2`, `rules-3`, `rule-grey`, `rule-before-l` | customer-feedback rating pair, 14px links, rule-led text column, 3-rule / grey-rule spacing; about-axa 2.625rem rule above the cards |
| columns | `boxed` | about-axa link cards (Background band per grid column, inner 15/85 icon grid) → one cell per card, same template-slotted decode |
| columns | `contact` | about-axa ContactSection: cell = [h2 title][h2 tel: `tel:` link + 無料 em][hours][arrow link][※ note]; PC tel reads as text, SP as the blue button |
| anchor-links | `two-up`, `arrow-right` | customer-feedback LinkButtons to pages (50% from 768px, → arrow) |
| art-image | `collapsed` | live parity: the about-axa CEO banner SVG has only a viewBox and renders 0×0 on live at both widths (inconsistency-register candidate) |
| section styles (breadcrumbs.css content layer) | `fs-14`, `ta-center`, `ta-right`, `h-ramp`, `notes-list`, `gap-s/m/l`, `rule-top-s`, `rule-bottom-xl`, `outer-grey`, `spacer-hero`, `sr-h1` | Text 14px + `p + p` 7px, slice alignment, heading ramp, ※ list, mid-band spacer rules, grey OuterBackground (border-image — a clip-path made content-presence drop the band), about-axa 312px key visual |

Deviations: about-axa has no `<h1>` on live (title inside the key-visual image) → visually hidden
`<h1>企業情報</h1>` (breadcrumb current item = `<title>` stem; delivery-lint P0); bold inside the
two inline IR links and on the card title links moved to the `boxed` CSS (strong would read as a CTA /
buttonize); internal `/customer-feedback/` → `/customer-feedback`.
Local QA: block-roundtrip --ew: EW editable all, dead 0, duplicated 0 on every block; its structural
🔴 on about-axa are instance-pairing artefacts (9 nested proto `.grid` vs 4 blocks) — the published
content-presence row (MISSING 0) is the verdict.
Published gate (preview host): 1440 pixel 2.17 / 3.41 / 0.89 %, Δh +2 / −54 / 0; 360 pixel
6.03 / 8.57 / 6.79 %, Δh −34 / −98 / −23 (customer-feedback / about-axa / dataprivacy); clipped 0,
MISSING/HIDDEN 0; only `font-not-loaded:noto-sans-jp-fallback` (queued). No overrides.

### C-final (2026-11-09)

Foundation requests applied once: fallback face (`local('Liberation Sans')`, `local('Arimo')` added), CTA rail moved into `<main>`. Block fixes: accordion `products` picture-less card, banner-slider whitespace titles. Code bus resynced via the admin code endpoint (13 stale block files). Roster gate 10/10 delivered at 1440 and 360; pages remain live on aem.live (publish decision unchanged).
