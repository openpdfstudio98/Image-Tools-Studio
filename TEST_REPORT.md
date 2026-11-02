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
