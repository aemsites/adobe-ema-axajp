# Dynamic features plan — www.axa.co.jp

| phase | deliverables | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| D1 chrome (C0 foundation) | header runtime: 7 hover mega-menus, mobile drawer, search box → source /search-result/, callback modal | nav/footer documents | chrome-compare exit 0 vs header-contract.json | search endpoint (#6) | M |
| D2 blocks (per archetype) | hero carousel (autoplay 5s, arrows, dots) + customer slider autoplay (#3, #20), quiz widgets (#4, #5) posting to source results URLs, product quiz dropdown popup (#17), simulation tabs both panels (#18), about-insurance click-only bubble pop-ups (#19); capture the uncaptured states (#17 open popup, #18 panel 2) from the source first | carousel/slider/tab/bubble rows authored; quiz is a widget (no authored rows) | motion-observe/compare; dynamics-check form presence | quiz endpoint | M |
| D3 martech (before deploy) | scripts/martech.js from martech-contract.json, every part disabled; dataLayer init | none | dynamics-check martech feature | enable CMP + GTM (#7–#11) | S |
