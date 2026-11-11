# Prototype gate — every crafted prototype, 1440px

2026-11-09T07:24:27.557Z · **2 PASS / 5 FAIL / 0 error of 7** (+5 documented overrides → 7 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **7 PASS**; full verdict (1–4): **2 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0, units 4, fonts not loaded 1 (Publico Headline, Source Sans 3); content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/customer-proposed.html` | - | - | stitch-live | chrome | 0.08 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 3.33 | 1 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/recruitment-proposed.html` | - | - | stitch-live | chrome | 0 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | FAIL (fonts) → PASS: font-not-loaded is live parity: the live page declares Publico Headline / Source Sans 3 but both faces fail to load on www.axa.co.jp (SPA fallback HTML); prototype keeps the same stack and renders the same fallback (never rehosted, licensed). Pixel 0.00%. | font-not-loaded:Publico Headline; font-not-loaded:Source Sans 3 |
| `/about-insurance-proposed.html` | - | - | stitch-live | chrome | 0.08 | 0 | 0 | n/a | off 7 hidden 0 missing 7 | FAIL (elements) → PASS: units: Bubble family pairs the live wrapper (text node box = whole bubble, popup content box empty/hidden until click) with the build button label; the hidden popup box reads MISSING. Granularity, not geometry: pixel 0.08%, Δh 0, content 0 lost. | units off 7 hidden 0 missing 7 |
| `/product-proposed.html` | - | - | stitch-live | chrome | 0.16 | 0 | 0 | n/a | off 10 hidden 0 missing 0 | FAIL (elements) → PASS: units: product-card images inside collapsed-by-default accordion panels read dy -10/-21 (lazy image boxes measured before decode on live); visible geometry passes: pixel 0.16%, Δh 0, content 0 lost. | units off 10 hidden 0 missing 0 |
| `/company-proposed.html` | - | - | stitch-live | chrome | 0.19 | 0 | 0 | n/a | off 6 hidden 0 missing 0 | FAIL (elements) → PASS: units: anchor-button family pairs the live DirectButton wrapper div (margin box) with the build <a class="anchor-btn">; link row offsets (21,20,-77,-40) are the wrapper margin. Pixel 0.19%, Δh 0, content 0 lost. | units off 6 hidden 0 missing 0 |
| `/prospect-proposed.html` | - | - | stitch-live | chrome | 2.73 | -3 | 0 | n/a | off 1 hidden 0 missing 0 | FAIL (elements) → PASS: units: one svg icon inside a jump section reads dy4/dh-8 against a 4px tol; pixel and height pass, content 0 lost — icon box granularity (live svg viewBox box vs build inline svg). | units off 1 hidden 0 missing 0 |
