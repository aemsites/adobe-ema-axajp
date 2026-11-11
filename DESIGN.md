---
name: AXA Life Insurance Japan (axa.co.jp) — current state
description: Institutional navy-on-white corporate insurance site set in Noto Sans JP
colors:
  axa-navy: "#00008f"
  text: "#343c3d"
  white: "#ffffff"
  surface: "#f2f5f8"
  grey-disabled: "#999999"
  border-light: "#e5e5e5"
  border: "#cccccc"
  muted-text: "#757575"
  teal: "#00adc6"
  blue-bright: "#3a3fd8"
  coral: "#f07662"
  axa-red: "#ff1721"
  black: "#000000"
typography:
  h1: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: 1.4 }
  h2: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.4 }
  h3: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: 1.4 }
  body: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: 1.6 }
  body-sm: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: 1.5 }
  nav: { fontFamily: "Noto Sans JP, sans-serif", fontSize: "14px", fontWeight: 700 }
  display: { fontFamily: "Publico Headline, serif", fontSize: "28px", fontWeight: 400 }
rounded:
  none: "0px"
  sm: "4px"
  pill: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary: { backgroundColor: "{colors.axa-navy}", textColor: "{colors.white}", rounded: "{rounded.none}", padding: "12px 20px" }
  button-outline: { backgroundColor: "{colors.white}", textColor: "{colors.text}", rounded: "{rounded.none}", padding: "0px 30px" }
  button-disabled: { backgroundColor: "{colors.grey-disabled}", textColor: "{colors.white}", rounded: "{rounded.none}", padding: "12px 20px" }
  header-login: { backgroundColor: "{colors.axa-navy}", textColor: "{colors.white}", padding: "8px" }
---
<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-09T04:50:31Z stardustVersion=0.37.1 mode=descriptive readArtifacts=stardust/current/_computed-styles.json,stardust/current/_brand-extraction.json -->

## Overview

Descriptive snapshot of axa.co.jp as captured on 2026-11-09 (10 pages, 1440 and 360). A white, orderly corporate site: AXA navy (#00008F) carries links, buttons, borders and the logo; body copy is dark slate (#343C3D); light grey-blue (#F2F5F8) bands separate sections. Everything is set in Noto Sans JP. The recruitment section is a separate design with its own header/footer and a serif display face.

## Colors

- **AXA navy #00008F** — primary: links, buttons, header login, borders, heading accents (most-used colour across pages).
- **Text #343C3D** — body and headings.
- **Surface #F2F5F8** — section bands and title banners.
- **Borders #E5E5E5 / #CCCCCC**; **muted text #757575**; **disabled grey #999999** (form submit before input).
- Accents used sparingly: teal #00ADC6, bright blue #3A3FD8, coral #F07662, AXA red #FF1721 (logo slash).

## Typography

Noto Sans JP 400/700 (self-hosted woff2 on the source). Ad-hoc scale: 40 / 33.6 / 32 / 28 / 25.2 / 24 / 22.4 / 20 / 19.6 / 16 / 15 / 14 / 12 px. Headings are bold; body 16 px / 1.6. Weight 600 appears on buttons (synthesised from the two loaded weights). Recruitment H1 names Publico Headline (licensed; not rehosted).

## Layout

Centered fixed-width content column inside full-bleed bands; see DESIGN.json extensions.breakpoints for the measured container model. Mobile collapses to one column with a hamburger header.

## Elevation & Depth

Flat. The dominant shadow is a 1 px hairline (rgb(240,240,240) 0 -1px 0) in the footer link lists; cards rely on borders, not shadows.

## Shapes

Square buttons and cards (0 px). 4 px radius on small header controls; 50% for circular slider arrows and icon badges.

## Components

Header (logo, utility links, audience mega-menu, navy ログイン button), multi-column footer, right-edge floating consultation rail (index, prospect), breadcrumbs (slice pages), hero carousel (home), title banners, product-category icon grid, consultation/contact blocks, Prismic slice blocks (heading band, text, grid cards, media, horizontal rule).

## Do's and Don'ts

- Do keep navy as the single action colour; do keep buttons square.
- Don't introduce rounded cards, gradients or shadows not captured here.
