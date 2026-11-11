# Dynamic features — www.axa.co.jp

Curated 2026-11-09 from `stardust/dynamics/dynamic-features.generated-plan.json` (43 rows, detect on 7 archetypes + reach from 10/10 crawled pages). **Rollout B2 re-verified 2026-11-09**: fresh detect on all 10 pages (7 archetypes + 3 content siblings) → same 42 findings (+ chrome row); plan re-run with `--target-origin main--80b77690--aemcoder.aem.page --martech`; `/cookie/extend` is host-bound (404 on target), as expected. Rows 17–21 added from capture review. Hands-off run: owner decisions are recorded by name and the interim tier ships; nothing is decided-out.

## Listings contract

none — every card group in scope (home hero carousel, product category groups, slice card grids, customer notices) is editorially curated and authored as block rows; no page reads a query index.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chrome-menu | header mega-menus (7 at 1440) + mobile drawer | M | 9/10 | rebuild-native | runtime | self | planned | chrome-interaction | none — header contract is the spec | stardust/chrome/header-contract.json |
| 2 | m-modal-trigger-newcustomermodal | callback-request modal (新規のお客さま) | M | 9/10 | rebuild-native | runtime | self | planned | modal | none; its CTA links to https://www.axa.co.jp/request/callback | NewCustomerModal trigger |
| 3 | home-hero-carousel | hero carousel (slick, autoplay 5s — frozen in capture, restore at delivery) | M | 1/10 | rebuild-native | block | self | planned | carousel | none | slick-track 9 cards on / |
| 4 | f-form-prospectform | "find your insurance" quiz (11 fields) → /prospect/be-recommended/results | F | 2/10 | rebuild-native | widget | needs-backend | interim | forms | results page is outside this run's scope: interim submits GET to the source results URL; owner decides the production endpoint | ProspectForm, index + prospect |
| 5 | f-form-select-js-wired | product quiz (4 selects, JS-wired) | F | 1/10 | rebuild-native | widget | needs-backend | interim | forms | same as #4 | product |
| 6 | s-site-search-form | site search → /search-result/ | S | 9/10 | index-backed | widget | self | interim | search | results page outside scope: interim submits to https://www.axa.co.jp/search-result/?q=; owner decides EDS search | header search |
| 7 | t-consent-onetrust | consent: OneTrust (+ runtime iframe onetrust-text-resize, preference-center buttons) — injected via GTM, no domain-script in server HTML | T | 10/10 | embed-passthrough | embed | needs-business-decision | carried-disabled | tags | owner enables in martech-contract.json (consent.cmp) | cdn-au.onetrust.com |
| 8 | t-tag-manager-google-tag-manager | GTM-T87MNJG (loads GA4/Ads, Meta, LINE, Yahoo, Bing, Trade Desk, User Insight, Clarity, New Relic, Genesys chat, ad sync hosts) | T | 10/10 | embed-passthrough | embed | needs-business-decision | carried-disabled | tags | owner enables the route in martech-contract.json; consent model owner-decision | www.googletagmanager.com |
| 9 | t-other-tags | every other T/A third-party host in the generated plan (google.com ccm, analytics.google.com, adsrvr, facebook, bing, line, yimg, flvcdn, nakanohito, bidswitch, casalemedia, pubmatic, clarity, newrelic, mypurecloud chat, aws ecs collector) | T | 10/10 | embed-passthrough | embed | needs-business-decision | carried-disabled | tags | loaded by GTM on the source; ride the GTM route | generated plan rows a-unknown-*, t-* |
| 10 | a-first-party-api-get-cookie-extend | GET /cookie/extend (first-party cookie lifetime extension for tags) | A | 10/10 | data-fed | runtime | needs-business-decision | interim | api | not rebuilt; owner decides with the martech switch-on | GET /cookie/extend → 200 on source, 404 on target (host-bound) |
| 11 | a-cms-app-settings-object-datalayer | dataLayer global | A | 10/10 | embed-passthrough | runtime | self | carried-disabled | settings | initialised by martech.js when GTM is enabled | dataLayer |
| 12 | cr-main-empty-at-load | home + customer main filled client-side | CR | 2/10 | static-snapshot | content | self | planned | client-rendered-page | settled DOM captured (1869 / 1122 chars) — ships as authored content | _dynamics.json |
| 13 | listings (5 candidates) | curated card groups | L | — | static-snapshot | block | self | planned | listings | editorially curated; authored rows, no index | generated l-* rows |
| 14 | v-video-youtube | YouTube embeds | V | 7/7 | embed-passthrough | content | self | planned | media | none | www.youtube.com |
| 15 | i18n-locale-variants | links into /cr/, /ir/, axol.jp/zw | I18N | 6/7 | static-snapshot | content | needs-business-decision | interim | locale | outside scope: links stay absolute to the source host | nav links |
| 16 | x-sign-in-account-links | MyAXA login / register links | X | 6/7 | embed-passthrough | content | needs-backend | planned | auth | links to myweb.axa.co.jp kept as-is (no auth on the new host) | myweb.axa.co.jp |
| 17 | product-quiz-dropdown-popup | product page quiz: custom dropdown popup (open state never captured) | M | 1/10 | rebuild-native | widget | self | planned | forms | none; capture the open state from the source at D2 before styling | /product/ |
| 18 | simulation-tabs | home/prospect simulation tabs: second tab panel never captured | M | 2/10 | rebuild-native | block | self | planned | tabs | none; capture panel 2 from the source (click) at D2; author both panels as rows | / , /prospect/ |
| 19 | about-insurance-bubble-popups | about-insurance bubble pop-ups (click-only, no hover) | M | 1/10 | rebuild-native | block | self | planned | modal | none; open on click only | /about-insurance/ |
| 20 | customer-slider | customer page slider (autoplay — frozen in capture, restore at delivery) | M | 1/10 | rebuild-native | block | self | planned | carousel | none | /customer/ |
| 21 | content-images-prismic | content images served from images.prismic.io / prod-japan-cdn.prismic.io | T | 8/10 | static-snapshot | content | self | planned | media | import copies images to the media bus; no runtime dependency on prismic | generated t-unknown-*-prismic-io |

## Decision batch

One message to the owner:
1. **Tags and consent** (#7–#11): the whole stack is carried over switched off in `stardust/martech-contract.json`; set `enabled: true` on `consent.cmp` and on the GTM route, add the OneTrust domain-script id, then re-run martech-scaffold. The `/cookie/extend` endpoint is not rebuilt.
2. **Quiz forms and search** (#4–#6): rebuilt UI submits to the source results pages on www.axa.co.jp until those pages migrate; decide the production endpoint/search.
3. **Out-of-scope sections** (#15): /cr/, /ir/ and other sections stay linked to www.axa.co.jp.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none | — |
