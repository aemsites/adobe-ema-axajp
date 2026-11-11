# Dynamics parity check — https://main--80b77690--aemcoder.aem.page — 2026-11-09T13:28:25.668Z

Replayed 10 checks over 10 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega-menus + mobile drawer | M | done | dom-count | PASS | 174 × header nav a (min 20) |  |
| hero carousel (autoplay) | M | done | dom-count | PASS | 7 × .hero-carousel-slide (min 7) |  |
| find-your-insurance quiz | F | interim | dom-count | PASS | 4 × .simulation-quiz fieldset (min 3) |  |
| find-your-insurance quiz | F | interim | dom-count | PASS | 4 × .simulation-quiz fieldset (min 3) |  |
| product quiz (4 selects) | F | interim | dom-count | PASS | 1 × .simulation-quiz (min 1) |  |
| site search | S | interim | dom-count | PASS | 1 × header .gnav-search form (min 1) |  |
| bubble pop-ups | M | done | click-dialog | PASS | dialog 845px · heading "結婚した" · 0 fields · Escape closes: true | www.axa.co.jp:200×10 |
| customer banner slider (autoplay) | M | done | dom-count | PASS | 9 × .banner-slider-slide (min 3) |  |
| no uncaught errors on every delivered page | X | done | no-page-errors | PASS | none on 10 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- callback-request modal (M) — pending E-full-site
