# Image Tools Studio v0.2 verification

Tested 2 November 2026 against a local preview of the GitHub source in desktop Chrome. Preview serves explicit `.html` routes; Vercel clean URLs remain configured in vercel.json.

## Browser smoke tests

| Tool | Test and observed result |
| --- | --- |
| Compress | PNG input → WebP download; size and larger-than-original notice shown |
| Resize | 400×200 input; height 50 with ratio locked → downloaded PNG 100×50 |
| Crop | x=200, y=0, width=200, height=100 → PNG 200×100 with green top-left pixel |
| JPG → PNG | JPEG fixture processed; download completed |
| PNG → JPG | PNG fixture → decoded JPEG 400×200 |
| WebP → JPG | WebP fixture processed; download completed |
| JPG → WebP | JPEG fixture → decoded WebP 400×200 |
| Rotate | 90° clockwise → PNG 200×400, blue top-left matching expected rotation |
| Flip | Horizontal flip processed; download completed |
| Grayscale | PNG output; red (255,0,0) became (54,54,54) |
| Brightness / contrast | Brightness +25 processed; contrast -50 changed red to (191,64,64) |
| Color picker | Preview click returned #FF0000; Copy HEX clipboard readback matched |

Downloaded files were inspected with Pillow where synchronized bytes were available. JPEG-to-PNG, WebP-to-JPG, flip, and transparent-PNG-to-JPEG downloads completed in the browser but their bytes were not made available in the local shared directory; those cases have download/UI evidence only, not independent pixel verification.

Additional checks: out-of-bounds crop displays an error; editing crop settings immediately disables the previous download; `.html` routes initialize controls; JavaScript syntax check passes. A transparent PNG → JPEG conversion completed; independent pixel verification remains pending.

## Responsive and visual checks

Inspected desktop home and tool pages, and the resize tool in a 390px-wide same-origin iframe (375px content area excluding scrollbar). Document scroll width equals client width; panels stack and buttons remain within the viewport. This checks responsive CSS, not a real mobile browser.

## Scope and limits

No real Safari/iPhone/iPad/Android device tests, AVIF decoding test, 35MB/44MP stress test, exhaustive transform combinations, live Vercel deployment test, or AdSense integration test was performed. The tools remain browser-local. No guarantee of target-KB compression or universal image compatibility is made.


# v0.3 upgrade checks — 2 November 2026

- Desktop Chrome: noisy 800×600 PNG (1408.8 KB) → WebP 98.1 KB with a 100 KB target; dimensions preserved, target-met state and before/after shown.
- Same input with 1 KB target: smallest attempted output 80.8 KB; explicit target-NOT-reached state and downloadable best attempt.
- Batch with two valid images and a corrupt PNG: two ready, one failed; corrupt image did not stop the queue. Individual result controls and ZIP link available.
- Batch PNG + target mode rejected with an actionable message.
- Cancelled a batch during its first 2400×1800 image: cancellation completed, zero outputs retained, controls restored.
- Resize regression: 400×200 → 100×50 PNG download completed; before/after image elements loaded at the correct original/output dimensions.
- Node tests exercise target boundaries, unreachable target, PNG target rejection, unsupported encoder rejection and ZIP fixture generation. Python zipfile independently validated CRC, UTF-8 Japanese filename handling, payload contents and extraction of the generated archive.
- ZIP download event was not observed in the cloud browser despite the prepared ZIP link being available. The underlying ZIP encoder passed independent extraction checks; end-to-end ZIP saving on a normal browser/device remains a verification limitation.
- Real Safari/iOS/Android, peak memory limits, 20-file maximum stress and all pre-existing tool combinations were not retested in this upgrade.


# Launch & SEO verification — 2 November 2026

Added source-rendered tool navigation, 12 tailored guides/36 FAQs, canonical/OG tags, sitemap, robots, truthful WebApplication schema without fabricated ratings, 404, support and policy pages. Stats are explicitly opt-in, first-party, fixed tool/action/count only; no filenames or pixels accepted by the endpoint. The endpoint writes sanitized operational logs, not permanent aggregate analytics.

`node tests/launch.cjs` validates canonical/sitemap consistency, internal links, script assets, all guides and endpoint rejection of filenames, unrecognized events, invalid counts, wrong origins, methods, oversized declared bodies and wrong content types. Existing target/ZIP utility tests are also rerun. Browser consent and tool smoke checks are recorded in the PR. Real mobile devices, Search Console ownership and AdSense approval remain outside automated verification.

Client privacy tests passed: no network event before consent or after decline, GPC suppresses events, file-derived CustomEvent details are excluded. Browser smoke check confirmed Decline survives reload, choices can be reopened, and compress/download work with statistics declined.

## Production verification after merge

PR #3 merged and the production Vercel status passed. Verified the homepage, canonical compression URL, interactive FAQ, 17-URL XML sitemap and support page on https://imagetoolstudio.vercel.app. A two-image batch ZIP downloaded successfully through the production HTTPS site; Python zipfile verified both expected WebP entries and all CRCs. This resolves the earlier cloud-browser ZIP download limitation observed on the HTTP local preview. Optional statistics consent was exercised on production; no application-origin console errors were observed. Production function log contents were not inspected.


# Local eraser tests — 3 November 2026

- Core tests: a masked white rectangle on a known linear gradient was reconstructed with zero mean absolute RGB error in the deterministic fixture. Outside-mask pixels and alpha are unchanged. Edge masks, texture locality, empty masks, oversize masks and invalid dimensions were checked. This synthetic result does not imply accuracy on photographs.
- Chrome UI: file selection, brush-size adjustment and an actual mouse drag created a mask. Undo and Reset were checked; Reset disables processing/download until a new selection exists.
- Synthetic gradient: PNG download completed at 600×400; independent Pillow inspection found the erased center (130,139,150,255) and unchanged outside point (74,104,150,255).
- Synthetic checker texture: processing and PNG download completed; visual inspection confirms blur/seams in the selected area. No texture-reconstruction claim is made.
- Oversized brush selection was rejected before worker execution with an actionable message.
- 3200×2000 upload disclosed a working/download size of 2048×1280 and completed processing. Cancel was retested after guarding the asynchronous PNG encoding race; cancellation retained the selection and applied no result.
- A 390px-wide iframe had equal content and scroll widths (375px excluding scrollbar), with stacked controls. This is CSS responsiveness testing, not physical touch-device testing.
- Existing SEO/link/sitemap, privacy-client, endpoint allowlist and target-compression/ZIP utility checks passed. Verification-token HTML files are excluded from SEO page tests.
- Real Safari/iPhone/Android pointer behavior, AVIF decoding, peak memory and broad real-photo output quality remain unverified.
