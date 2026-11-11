# Inconsistency register — axa.co.jp replica

Written 2026-11-09T05:04:43Z by stardust:replica (hands-off). No audit was requested and no --register file was supplied.

**Empty register — pure replica.** No design delta is permitted; anything that differs from the live site is a fidelity bug.

Noted, not registered (replicated as captured): cap-probe reports per-archetype content widths (1142 / 1050 / 1024 / 1078 / 1280 px) and a single 1280 px module cap on recruitment — source intent per template, kept as is.

## customer (customer-hub) — SP horizontal overflow (2026-11-09)
- Live /customer/ at 360 has scrollWidth 368 (+8px): the MyAXA logo svg in the login card is `translateX(68px)` and runs past the viewport. Per source-fidelity-gate.md (live-side overflow is not mirrored) the replica clips it: `@media (max-width:767px){.ct-customer-contents-wrapper{overflow-x:clip}}` in stardust/prototypes/customer.css. Visually identical (the viewport already crops those 8px); only the horizontal scroll is removed.
