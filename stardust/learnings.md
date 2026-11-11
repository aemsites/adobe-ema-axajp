# Learnings — axa.co.jp replica run

## 2026-11-09 — rollout
- Source URLs ending in `/` (folder-style) 404 on EDS, which serves `/x` only. D-site must wire `/x/` → `/x` rows into the redirects sheet whenever the source uses trailing slashes; verify.mjs requests the source shape and catches it.
- The aem.live CDN can keep a CORS (Origin-header) variant of a block JS file for its full max-age (2 h) after a code fix; admin code resync + cache purge did not clear it. A fix shipped late in D2 needs the parity replay re-run after the max-age, or the fix landed before the first live request.
- Hand-authored repeat-block cells can carry root-relative links to out-of-scope pages (`/product/saving`); localize-links reports source-host links only, so verify.mjs is the instrument that finds them.
