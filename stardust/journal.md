# Journal — axa.co.jp replica migration

## Extract — 10/10 planned pages captured live, 7 page types (2026-11-09)

- Inputs: run.json scope.sourceUrl https://www.axa.co.jp/, breakpoints "desktop,mobile" → gate widths 1440, 360. Hands-off, flow replica.
- Opened sequentially rather than first-page-first: the run's own brief fixes Phase 1 as one `extract --prep --dynamics --pages <10>` call; with 10 pages the two-track split would add a reconcile step for no gain.
- crawl.mjs (real Chrome headless, no bot wall, consent auto) captured 10/10, httpStatus 200, waitMode medium 2500 ms. `/recruitment/` redirects to `/recruitment/career`.
- Vision: 9 ok, recruitment suspect (InView scroll-reveal sections unpainted in fullPage screenshot even with --wait slow; DOM text captured). Gate stitched captures will be the ground truth there.
- Types (by source template family, from the settled DOM's styled-component roots): home (index), prospect-hub (prospect), product-listing (product), insurance-guide (about-insurance), customer-hub (customer), recruitment (recruitment — own chrome), content (Prismic slice pages: company, customer-feedback, about-axa, dataprivacy).
- Fonts: Noto Sans JP 400/700 (OFL) downloaded; Publico Headline (recruitment H1) licensed and not loaded — serif fallback.
- cap-probe: contentMaxWidth differs per archetype (1142 home/prospect, 1050 product, 1024 about-insurance, 1078 …, 1280 recruitment module) — replicated per archetype.
- Martech: OneTrust consent + GTM/GA4 seen in the dynamic surface.
- Header contract (chrome-explore): 1440 — 7 menu controls, 14 states, 105 links; 390 — 1 drawer control, 12 states, depth 2.

Prep summary: Inventory 10 pages · Provenance 10/10 live · Page types home 1 · prospect-hub 1 · product-listing 1 · insurance-guide 1 · customer-hub 1 · recruitment 1 · content 4 · Module candidates 11 (DESIGN.json extensions.modules) · Typed slots written per page.

## Preserve direction — verbatim promotion, empty register, dynamics triaged (2026-11-09)

- PRODUCT.md / DESIGN.md / DESIGN.json promoted byte-for-byte from stardust/current/ (full-prep branch). direction.md written (preserve mode); state.json direction block set, pages advanced to directed.
- Inconsistency register empty — pure replica (no audit asked, no --register). Per-archetype content widths noted as source intent, not registered.
- No --target-breakpoints: the source's breakpoints are kept.
- Dynamics: detect on 7 archetypes (42 findings) → plan (43 rows with --martech --chrome) → curated 16 rows in stardust/dynamic-features.md; every row has a disposition, decided-out none.
- Martech (owner asked to keep tags/consent): spec-martech (GTM-T87MNJG library saved; Launch absent; OneTrust domain script not in the server HTML) → martech-contract.json + martech-handoff.md, every part disabled → scripts/martech.js scaffolded (no CMP, 0 routes enabled).

## Source-fidelity gate — recruitment archetype passes 1440/360 (2026-11-09)

- recruitment 1440: pixel 0.00 %, Δh 0, content 🔴0 🟡0, clipped 0 — PASS (3 rounds). 360: pixel 0.00 %, Δh 0 — PASS (5 rounds incl. confirm + post-motion pixel round). cap-probe PASS @2560; 5 unit families within 4 px.
- Own chrome (rc- prefix) in recruitment.css/js; Publico Headline + Source Sans 3 fail to load on live too → same fallbacks, permanent justified flag.
- captureState: hero video frozen at frame 0 → deliver autoplay muted loop (main-wide.mp4 landscape / main-tall.mp4 portrait). Motion: scroll reveal ×12, back-to-top fade, video — implemented.

## Source-fidelity gate — home archetype passes 1440/360 (2026-11-09)

- index 1440: pixel 0.55 %, Δh 1, content 🔴1 (justified: OneTrust CMP button injected into the live footer; CMP carried disabled), clipped 0 — PASS. 360: pixel 1.01 %, Δh −1, 🔴0 — PASS. cap-probe PASS @2560.
- Canon authored: stardust/prototypes/canon/{canon.css,chrome.js,header.html,footer.html,rail.html}; mobile breakpoint max-width 767px; twin PC/SP h2 pattern. See stardust/replica/notes-index.md.
- captureState: hero carousel starts on the slide the live capture lands on (slide 5 at 1440, mid-change at 360) → deliver: start on slide 1, autoplay 5 s (remove is-capture-state / data-capture-start*).
- Open: header contract chrome-compare not yet confirmed (fixes applied after 18 first-run errors) → re-check at the C0 foundation gate. Quiz tab "ライフイベントから" panel never captured → dynamics follow-up.
- Budget: the two archetypes so far cost far more than planned (home ≈ $45, recruitment ≈ $21 of the $100 run budget). Remaining archetypes must be authored with 1–2 rounds per breakpoint, in-session or with a tightly capped subagent.

## Source-fidelity gate — content archetype (company) passes 1440/360 (2026-11-09)

- company 1440: pixel 0.19 %, Δh 0, 🔴0 🟡0 — PASS (4 rounds). 360: pixel 8.58 %, Δh −4, 🔴0 — PASS (5 rounds; residual bands are SP text-wrap in long paragraphs; h3 SP size unmeasured). cap-probe PASS. Motion: back-to-top fade only.
- Slice modules in stardust/prototypes/content.css (body 14px/1.4 #333 on this page type); chrome overrides for 14px body in company.css → back-port to canon at C0 behind a page-type class (notes-company.md).
- Sibling generator kept at stardust/scripts/replica-local/content-gen.py (+ content-probe.mjs) for customer-feedback / about-axa / dataprivacy. about-axa's contact section still needs measuring.
- Cost note: a tightly briefed subagent (≈60 tool calls) cost ≈ $4 vs ≈ $45 for home — keep this shape for the remaining 4 archetypes.

## Source-fidelity gate — prospect-hub archetype (prospect) passes 1440/360 (2026-11-09)

- prospect 1440: pixel 2.73 %, Δh −3, 🔴0 🟡0, clipped 0 — PASS (1 full round). 360: pixel 0.67 %, Δh 0, 🔴0 🟡0 — PASS (1 round). cap-probe PASS at 2560.
- Not Prismic slices: 16px body like home, CTA rail present; simulation form CSS copied from index.css (canon candidate at C0). No canon changes.
- Motion: back-to-top + jump-tab hover implemented; jump-tab scroll (live anchors have no href) is an open item, unobserved by motion-observe.

## Source-fidelity gate — product-listing archetype (product) passes 1440/360 (2026-11-09)

- product 1440: pixel 0.16 %, Δh 0, 🔴0, 🟡4 justified (phone-number whitespace normalisation; React-generated aria ids differ per load) — PASS (3 rounds). 360: pixel 0.18 %, Δh 0, 🔴0 🟡0 — PASS; clip-probe 39 = live parity (live clips the same 39 two-line button labels at 360). cap-probe PASS.
- Not Prismic slices; 16px body; no CTA rail. Generator stardust/.work/replica/product-gen.py maps hashed classes to readable ones. No canon changes.
- Motion: accordion 300 ms, back-to-top, button hover. Open: quiz dropdowns use a native select (live custom popup never captured) — dynamics item.

## Source-fidelity gate — insurance-guide archetype (about-insurance) passes 1440/360 (2026-11-09)

- about-insurance 1440: pixel 0.08 %, Δh 0, 🔴0 🟡0, clipped 0 — PASS (1 full round). 360: pixel 0.20 %, Δh 0, 🔴0 🟡0 — PASS (1 round). cap-probe PASS (0/5 rows failed).
- 16px body, no CTA rail; not Prismic slices. No canon changes. PC contact strip `.ai-contact*` is reusable for about-axa's contact section.
- Motion: back-to-top + bubble pop-up (scrim 0.5, panel slide 0.5 s) parity. Open: bubble texts click-only (kept in <template>), SP Q&A accordion built from live CSS but unobserved.

## Source-fidelity gate — customer-hub archetype (customer) passes 1440/360 (2026-11-09)

- customer 1440: pixel 0.08 %, Δh 0, 🔴1 justified (OneTrust renames the footer cookie link, same as home) — PASS (2 rounds). 360: pixel 0.15 %, Δh 0, 🔴0 🟡0, clipped 5 = live parity (hidden slider dots) — PASS (3 rounds). cap-probe PASS; 45 repeated units, 0 off.
- Register entry added: live overflows to 368 px at 360 (MyAXA logo); prototype clips at the page wrapper (gate doc: never replicate horizontal overflow). Visually identical.
- Motion: autoplay slider (~4 s, 500 ms slide, arrows/dots) — restoreAtDelivery; back-to-top; hovers. Parity 12.

## Recreate — all 7 archetypes gated at 1440/360 (2026-11-09)

- home 0.55/1.01 %, recruitment 0.00/0.00 %, company(content) 0.19/8.58 %, prospect 2.73/0.67 %, product 0.16/0.18 %, about-insurance 0.08/0.20 %, customer 0.08/0.15 % (1440/360 pixel). All cap-probe PASS, motion parity recorded in stardust/replica/progress.json.
- Canon unchanged since home; canon back-port candidates for C0: company 14px-body chrome overrides, simulation widget shared by home/prospect, `.ai-contact*` strip for about-axa.

## Source-fidelity gate — prototype tables written, 7/7 rows at 1440 and 360 (2026-11-09)

- `gate-all --stage prototype`: 1440 = 2 PASS + 5 documented overrides; 360 = 1 PASS + 6 documented overrides → 7/7 delivered at both widths. Pixel-only 7/7 at 1440, 6/7 at 360 (home, below).
- Instrument findings (no project-copy edits made): (1) gate-all hands units to unit-geometry as `--unit "<origin>=<build>"` and unit-geometry `split('=')`s it, so attribute selectors (`[class*='…']`) read "bad selector" → units.json origin selectors rewritten to exact styled-components class tokens (originals kept as `originAttr`; stardust/.work/replica/probes/units-noeq.mjs). (2) unit-geometry's origin cache (stardust/current/measure/<slug>-units.json) is keyed by slug, not width → a 360 run reused the 1440 inventory; caches kept per width under stardust/.work/replica/units-cache-<w>/ — clear/swap before each width at the published gate.
- Overrides (sidecars gates/prototypes-<w>/overrides.json, clip-allow.json): recruitment font-not-loaded is live parity (Publico Headline / Source Sans 3 dead on live); units granularity on prospect (one svg), about-insurance (bubble popup boxes), product (lazy images in collapsed accordions), company (wrapper-div vs <a> root pairing); product 39 / customer 5 clips = live parity; home 360 20.76 % = capture-state artifact (hero autoplay leaves `is-capture-state` under gate-all's longer settle; same live.png measured 1.01 % in the archetype gate) — removed at delivery.

## Migrate plan — archetypes first, one content sibling cluster (2026-11-09)

- 7 archetypes render through the approved-page branch now; the only siblings (customer-feedback, about-axa, dataprivacy → content/company) render after the content archetype unit is done in C-deliver. Units in stardust/migrate/progress.json.

## A-inventory — 10 pages, 7 templates, 7 to deliver + 3 content-pending (2026-11-09)

- inventory.mjs keeps state.json's trailing slash (`/company/`) while migrated sidecars deliver `/company` → duplicate `-x` rows; and content siblings name their type (`content`), not the archetype slug. Fed it a normalised copy instead (stardust/.work/rollout/state-inventory.json: trailing slashes stripped, `representative: company` on the 3 content siblings) — re-run inventory with `--state stardust/.work/rollout/state-inventory.json`. Source `/x/` URLs need redirects to `/x` at D-site.
- rollout.json: da org aemcoder, site 80b77690, ref main; liveHost main--80b77690--aemcoder.aem.live.

## B-block — 28 blocks (17 shared, 11 template-specific), each converted once (2026-11-09)

- Catalogue + content models in stardust/rollout/block-map.md; modules[] recorded on the 7 archetype sidecars; coverage/blocks.json 28 distinct, 67 instances; plan.json: each block converts on exactly one page, the rest reuse.
- Open: content siblings' modules recorded after their render (dataprivacy = breadcrumbs only; about-axa adds contact-links); product's quiz sits inside accordion panel 1 (no nested blocks — placement row / JS move); second quiz tab never captured (dynamics).

## B2-dynamic — 21 rows dispositioned, martech carried over all-disabled (2026-11-09)

- Fresh detect on 10/10 pages = same 42 findings; rows 16 → 21 (#17 product quiz popup, #18 simulation 2nd tab, #19 about-insurance bubbles, #20 customer slider autoplay, #21 prismic images rehosted). rebuild-native 9, embed-passthrough 6, static-snapshot 4, index-backed 1, data-fed 1, decided-out 0.
- Martech contract: OneTrust CMP, GTM-T87MNJG route, productionHosts — all disabled (owner enables). Duplicate GTM runtime route from the plan re-run removed. martech-scaffold: unchanged (scripts/martech.js already wired).
- D2: capture #17 popup and #18 second panel from source before building those blocks.

## C-deliver foundation — styles, fonts, header/footer + recruitment variants live (2026-11-09)

- Foundation: Noto Sans JP self-hosted, canon tokens/section styles in styles.css, header/footer blocks (+ recruitment variants via `nav`/`footer` metadata), CTA rail as last /footer section (default on home + prospect-hub, `cta-rail` metadata override), back-to-top in footer block, body class from `template` metadata (`content` = 14px page type). nav/footer (+ /recruitment/*) live on .page and .live.
- Published chrome bands ≤ 1.32 % (main) and 0.00 % (recruitment, after the footer-indent fix). chrome-compare 1440 exit 0; 390 one error: the live SP menu button's only name is ";" — mirrored; exception recorded unsigned in stardust/chrome/header-decisions.json (chrome-compare accepts owner-signed decisions only).
- crop-compare.mjs writes crop-diff.png into the cwd — removed from the repo root; run it from a scratch dir.

## C-deliver gate-all + final — roster 10/10 delivered at 1440 and 360 (2026-11-09)

- gate-all needs pages at status `deployed` with a `liveUrl`: state.json keeps lifecycle states, so the roster ran from `stardust/.work/rollout/gate-all/state-gate.json` (coverage deployedUrls), like the cluster runs. First roster run: pixel 10/10 @1440, 9/10 @360, full verdict 0 — font-not-loaded on every row, unit families still on prototype selectors, content findings on 4 pages.
- The aem.page code bus was STALE for 13 block files (contact-links, banner-slider, feature-grid, link-buttons, link-panels, news-list, page-banner) — pushes had not synced. Fixed with `POST admin.hlx.page/code/<org>/<site>/main/*` and a bounded md5 poll; every later push is followed by the same sync.
- Fixes: fallback face resolves Liberation Sans/Arimo; CTA rail lives in `<main>`; accordion `products` builds a card for a picture-less panel (corporate product was un-carded); banner-slider drops whitespace-only link titles (the link name falls back to the image alt). units.json build selectors now include the EDS classes.
- Final roster: 1440 3 PASS + 7 overrides, 360 3 PASS + 7 overrides → 10/10 delivered both widths. Residuals in overrides.json: unit-geometry element pairing (JOIN / role swaps, wrapper boxes) on 6 pages, recruitment origin-side font errors (live Publico/Source Sans 3 fail in Chrome), index 360 live capture state, product 360 clip parity.
- unit-geometry's origin cache is per slug, not per width: swap `stardust/.work/replica/units-cache-<w>/` into `stardust/current/measure/` before each width (left on 1440).

## D2-dynamic — parity replay 10/10 on the preview origin, martech gated (2026-11-09)

- stardust/dynamics/parity.json written (9 features, 10 checks): menus, hero/customer carousels, both quizzes, search hand-off, bubble dialog, no page errors on all 10 paths, martech (no tag host requested, 2 gated).
- Bubble modal kept `aria-modal` while closed (a closed dialog matched); now `hidden` + `aria-modal` only while open — Escape closes: true on .page. aem.live serves CORS module requests from a separate CDN variant that kept the old file after a code-bus sync and a cache purge: re-check after its max-age.
- NewCustomerModal (callback-request portal) not rebuilt yet: no trigger identified on the delivered pages; row pending E-full-site.

## E-full-site (open) — verify finds trailing-slash 404s; D-site never ran (2026-11-09)

- `verify.mjs` (aem.live): 4 verified, 6 failed with HTTP 404 — it requests `/<slug>/` (migratedHtml is `<slug>/index.html`), EDS serves `/<slug>` only; the source URLs carry the trailing slash, so real visitors hit the same 404.
- Rollout D-site was skipped: no `stardust/redirects.tsv`, no `/redirects.json` on the site. Next: run D-site (redirects sheet `/x/` → `/x` for the 9 non-root pages + sitemap/robots, PUT → preview → publish), then re-run `verify.mjs` and `update-coverage.mjs --gate` both widths, re-run dynamics-check on aem.live (bubble Escape once the CORS variant expires), then E2/F/G/H/I.

## D-site — redirects sheet live, sitemap served 10 = assembled 10 (2026-11-09)

- `stardust/redirects.tsv` → DA `/redirects.json` (Source/Destination, 9 rows `/<slug>/` → `/<slug>`), PUT → preview → live; `/prospect/`, `/dataprivacy/` answer 301 on .page and .live. No `/` row: the root is the `index` document and answers 200.
- `assemble.mjs --verify-origin` aem.live: served sitemap 10 = assembled 10, extra 0, missing 0 (chrome documents carry noindex).

## E-full-site — 10/10 verified on aem.live after redirects + product link repoint (2026-11-09)

- `verify.mjs --all` (aem.live): 9/10 after D-site; product failed on 4 internal links to out-of-scope pages (`/product/{saving,ladies,chronic,financial-institutions}`) → repointed to the source site like the page's other out-of-scope product links, product re-PUT → preview → live; re-run 10/10 verified. `update-coverage.mjs --gate` 1440 + 360: 10/10 rows, 0 flips.
- Render check: customer banner slider (restoreAtDelivery autoplay) advances unpoked on aem.live (translate −974 → −1948 px in 9 s).
- dynamics-check on aem.live: 7/8 PASS; bubble Escape FAIL is the aem.live CDN's CORS variant of the pre-fix `bubble-guide.js` (Last-Modified 12:27, X-Cache MISS, max-age 7200), unaffected by admin code resync + cache purge; .page passes; re-check after ~15:25 UTC.

## E2-link-audit — internal links localized, out-of-scope targets repointed (2026-11-09)

- `localize-links.mjs` localized 4 source-host links whose targets are delivered (about-insurance 2, product 1, prospect 1); re-PUT → preview → live; `--check` 0 to change.
- Every internal href on the 10 pages + nav/footer (default and recruitment variants) GETs 200 on aem.live (23 distinct); no `.html` hrefs.
- 237 distinct www.axa.co.jp targets outside the fixed 10-page scope stay absolute to the source site — scope extension, recorded with the list in `direction.md`; no capture gaps in state.json. verify 10/10.

## F-optimize — 0 open findings, gate clean (2026-11-09)

- `optimize.mjs --all` on aem.live: open P1 0 · P2 0 · P3 0; 10 source-parity P2 (no JSON-LD — the source has none either), informational. GATE: no open P1.

## G-aem — nothing to autofix (2026-11-09)

- `autofix-aem.mjs --project . --dry-run`: 0 candidates (no open fixable findings after F); no re-deploy needed.

## H-report — summary written, block ledger reconciled (2026-11-09)

- `stardust/rollout/report.md`: 10/10 verified, 7 templates, 28 blocks shipped, health 100, 0 open findings. Six blocks were still `pending` in coverage/blocks.json though shipped and live (200 on aem.live) → `update-coverage.mjs --block … --status deployed`; lastRun blocks 28/28.
- `stardust/learnings.md` started: trailing-slash redirects, CDN CORS-variant lag, root-relative out-of-scope links.

## I-dashboard — 10/10 pages through every stage (2026-11-09)

- `dashboard.mjs` → `stardust/rollout/dashboard/`: identified 10 · prototyped 10 · deployed 10 · optimised 10. The 10 source-parity JSON-LD findings resolved `accepted` (source has none; no register entry) so they no longer hold pages at "deployed".

## Handoff — 10/10 pages delivered and live on aem.live, rollout complete (2026-11-09)

- migrate → deploy → rollout A…I done: 7 gated archetypes + 3 content siblings, roster gate 10/10 at 1440 and 360, verify 10/10 on aem.live, redirects + sitemap live, optimize clean, dashboard 10/10 optimised. done-check: complete, no gaps.
- Martech carried over all-disabled (contract + handoff + scripts/martech.js committed); enabling stays with the owner.
- Open residual: bubble pop-up Escape on aem.live waits on the CDN's cached CORS variant of `bubble-guide.js` (max-age 7200, cached ~13:23 UTC); passes on .page. Re-run `dynamics-check.mjs --origin https://main--80b77690--aemcoder.aem.live` after ~15:25 UTC to record it.
