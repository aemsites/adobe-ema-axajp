<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-09T07:33:49.415Z · input stardust/current/_dynamics.json (10 pages, 42 findings) · target probe https://main--80b77690--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 10/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-bs-nakanohito-jp | A | unknown third-party host bs.nakanohito.jp | 10/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-w2-c9dea2a81a9e4d3c963d5887958afe | A | unknown third-party host w2-c9dea2a81a9e4d3c963d5887958afeb5.ecs.eu-west-1.on.aws | 10/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-first-party-api-get-cookie-extend | A | first-party API GET /cookie/extend | 10/10 (reach 10/10) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 5 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 10/10 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | a-unknown-third-party-host-api-cdn-mypurecloud-jp | A | unknown third-party host api-cdn.mypurecloud.jp | 5/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-apps-mypurecloud-jp | A | unknown third-party host apps.mypurecloud.jp | 1/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | cr-main-empty-at-load-filled-after-client-rendered-page | CR | main empty at load, filled after (client-rendered page) | 2/10 | static-snapshot | content | needs-human-capture | pending | client-rendered-page | human-browser capture; never migrate blank |  |
| 9 | f-form-prospectform-formwrapper-sc-eb0ec054-0-origin-prospec | F | form "ProspectForm__FormWrapper-sc-eb0ec054-0" → origin /prospect/be-recommended/results (11 fields) | 2/10 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 10 | f-form-select-select-no-action-js-wired-4-fields | F | form "select:+select:" → no action (JS-wired) (4 fields) | 1/10 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 11 | i18n-locale-variants-cr-ir-ir-ir-ir | I18N | locale variants cr,ir,ir,ir,ir | 9/10 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 12 | i18n-locale-variants-zw | I18N | locale variants zw | 1/10 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 13 | l-listing-candidate-slick-track-9-cards | L | listing candidate slick-track (9 cards) | 2/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 14 | l-listing-candidate-itemslist-styles-listwrapper-sc-809b56aa | L | listing candidate ItemsList-styles__ListWrapper-sc-809b56aa-0 hHLxbb (4 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 15 | l-listing-candidate-productcategorygroup-styles-productcateg | L | listing candidate ProductCategoryGroup-styles__ProductCategoryGroupWrapper-sc-989e0571-0 hBGndD (7 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 16 | l-listing-candidate-layout-sc-f22cece7-3-hazlyz-5-cards | L | listing candidate Layout-sc-f22cece7-3 haZlyz (5 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 17 | l-listing-candidate-customerinfo-styles-contractornoticeswra | L | listing candidate CustomerInfo-styles__ContractorNoticesWrapper-sc-df45de50-5 jCMnRi (4 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 18 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 10/10 (reach 9/10) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 19 | m-modal-trigger-newcustomermodal-styles-callbacktext-sc-94c5 | M | modal trigger NewCustomerModal-styles__CallBackText-sc-94c556d6-3 → target outside DOM at capture | 9/10 (reach 9/10) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 20 | s-site-search-form-search-result | S | site search form → /search-result/ | 9/10 (reach 0/10) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 21 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-consent-onetrust | T | consent: OneTrust | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 23 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-d-line-scdn-net | T | unknown third-party host d.line-scdn.net | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-s-yimg-jp | T | unknown third-party host s.yimg.jp | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-tag-flvcdn-net | T | unknown third-party host tag.flvcdn.net | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-cs-nakanohito-jp | T | unknown third-party host cs.nakanohito.jp | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-tr-line-me | T | unknown third-party host tr.line.me | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-images-prismic-io | T | unknown third-party host images.prismic.io | 8/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-unknown-third-party-host-prod-japan-cdn-prismic-io | T | unknown third-party host prod-japan.cdn.prismic.io | 7/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | t-analytics-session-replay | T | analytics: session replay | 6/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-unknown-third-party-host-c-bing-com | T | unknown third-party host c.bing.com | 6/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-unknown-third-party-host-simage2-pubmatic-com | T | unknown third-party host simage2.pubmatic.com | 6/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-rum-new-relic | T | RUM: New Relic | 5/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-x-bidswitch-net | T | unknown third-party host x.bidswitch.net | 5/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-chat-live-chat-widget | T | chat: live chat widget | 4/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | t-unknown-third-party-host-dsum-sec-casalemedia-com | T | unknown third-party host dsum-sec.casalemedia.com | 3/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | v-video-youtube | V | video: YouTube | 10/10 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |
| 41 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 10/10 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 42 | x-sign-in-account-links | X | sign-in / account links | 9/10 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 5 row(s) — read-settings, chrome-interaction, modal-loader, search-index-backed, media-as-url.
- **One owner decision batch:** 36 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · human-browser capture; never migrate blank · production endpoint; interim capture ships now · scope of the locale trees · index-driven or editorially curated?.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/2 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 19
- **detect** — 6
- **listings** — 5
- **forms** — 2
- **locale wave** — 2
- **interactive** — 2
- **off-origin data** — 1
- **capture** — 1
- **search** — 1
- **media** — 1
- **embeds** — 1
- **register** — 1
