<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-09T04:49:55Z stardustVersion=0.37.1 readArtifacts=stardust/current/pages/*.json,stardust/current/_brand-extraction.json mode=descriptive -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — from the top-level audience navigation captured on every page (保険をご検討のお客さま / ご契約者さま / 法人のお客さま / パートナーさま / 企業情報) and the recruitment section._

- Individuals in Japan considering life, medical, cancer or variable insurance (prospect hub, product list, insurance guide).
- Existing policyholders handling claims, contract changes and MyAXA account access (customer hub).
- Corporate customers looking at business-protection and employee-benefit plans (company page).
- Job seekers (recruitment section, own chrome).

## Product Purpose

Corporate and sales site of AXA Life Insurance Japan (アクサ生命保険株式会社): presents the product line, routes prospects to free consultation, brochure requests and phone consultation, and serves policyholders' self-service paths. Meta description (home): "アクサ生命保険株式会社公式ホームページです。生命保険、医療保険、がん保険、持病をお持ちの方のための保険などの各種保険商品やアクサ生命の企業情報をご案内します。"

## Positioning

_provenance: inferred — from the home "アクサ生命の強み" section: "欧州で200年、日本で90年の歴史と実績", "世界基準の資産運用と多様な変額保険"._

A global insurer (AXA Group) with long local history, positioned on trust, financial strength and consultation-led sales.

## Capabilities and Constraints

- Life, medical, cancer and variable insurance product catalogue with per-product pages (product list).
- Lead capture: free consultation form (/form/consultation), brochure request (/form/brochure), phone consultation (0120-977-990).
- Policyholder self-service through MyAXA (myweb.axa.co.jp, external).
- FAQ hosted externally (help.axa.co.jp).
- Consent management by OneTrust; Google tag manager / GA4 analytics.

## Brand Commitments

- Register: **brand** (marketing / corporate with self-service routing).
- Personality observed: institutional, reassuring, orderly; AXA navy (#00008F) with sparse red accent, generous white space, Noto Sans JP throughout.
- Observed anti-references: no dark mode, no heavy gradients, no rounded "app" styling (square buttons, 4 px radius on small controls).

## Evidence on Hand

- Page records: stardust/current/pages/<slug>.json + settled DOM <slug>.html (10 pages).
- Screenshots: stardust/current/assets/screenshots/.
- Computed styles: stardust/current/_computed-styles.json (1440 + 360).
- Brand surface: stardust/current/_brand-extraction.json; logo stardust/current/assets/logo.svg; fonts stardust/current/assets/fonts/.
- Source CSS: stardust/current/assets/css/.

## Product Principles

_provenance: inferred — from repeated CTA placement (floating consultation rail, contact blocks on every hub)._

1. Every page offers a path to human consultation.
2. Audience-first navigation: prospects, policyholders, corporations, partners.
3. Regulatory clarity: dense, precise Japanese copy, legal notices preserved.

## Accessibility & Inclusion

Japanese-language site (lang ja). Navy-on-white text clears contrast. Some icon-only controls (back-to-top, slider arrows) rely on aria-labels.
