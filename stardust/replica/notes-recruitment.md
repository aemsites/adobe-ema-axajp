## recruitment (archetype `recruitment`, live /recruitment/career) — 2026-11-09

- Own microsite chrome: header (logo + 4 nav links + ENTRY dropdown + SP hamburger), footer (FOLLOW AXA, recruit nav, corporate nav, copyright bar). All in `stardust/prototypes/recruitment.css` / `recruitment.js` under the `rc-` prefix. **No canon changes** — nothing in canon/ was touched; the page does not use the main-site SharedFooter/header.
- Base: the effective global base on this page is tailwind preflight + main.css (`body` 14px/1.4, `ul,ol{padding-left:.875rem}`, h1–h6 rem ramp, `a{font-weight:600;color:#00008f}`), border-box everywhere. Note the ul padding: hidden lists without an explicit padding reset inherit 14px (chrome-parity caught it).
- Fonts: Noto Sans JP 400/700 self-hosted in `stardust/prototypes/fonts/` (copied, same names). "Publico Headline" and "Source Sans 3" are dead on live (URLs return the SPA HTML) — stacks kept brand-first, fallback rendering matches live exactly. Delivery: same; the licensed-font alert applies to Publico.
- Hero video: fixed full-viewport `<video>` backdrop; live picks `main-wide.mp4` (landscape) / `main-tall.mp4` (portrait) — JS re-picks on resize. Delivery must keep the orientation switch.
- InView reveals: static/no-JS state is revealed; JS (IntersectionObserver, rootMargin bottom +25%) adds the pre-state. rootMargin −10% left one service card blank in the 360 stitched capture.
- Icons/banners harvested to `stardust/prototypes/assets/recruitment/` (live /images/recruitment/career/*.svg|jpg); social svgs inline verbatim from the live DOM.
- Result: 1440 and 360 both 0.00% / Δ0, content 🔴0 🟡0, chrome crops 100%, cap-probe PASS at 2560.
