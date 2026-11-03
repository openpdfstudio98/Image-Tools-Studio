# Image Tools Studio — MVP v0.3

A dependency-free, static, mobile-friendly website with 13 browser-based image tools.

## Quick start
Open `public/index.html` in a browser, or run `python3 -m http.server 8080 --directory public` and visit `http://localhost:8080`.

## Deploy on Vercel
1. Create a new empty GitHub repository and upload the **contents of this project folder** (`public/` and `vercel.json`).
2. Import repository in Vercel and choose **Other** as framework preset.
3. Leave Build Command empty, set Output Directory to `public` only if required by your Vercel project settings, and deploy.
4. Verify URLs like `/compress-image` and `/resize-image`.

## Included tools
Compress image, resize image, crop image, JPG→PNG, PNG→JPG, WebP→JPG, JPG→WebP, rotate, flip, grayscale, brightness/contrast, image color picker.

## Not yet production ready
- Add a real domain and domain-based `canonical` metadata / sitemap.
- Support email is configured. Review privacy controls and ad policies before activating advertising.
- Chrome browser smoke tests completed for all 12 tools; real Safari/iOS/Android and AVIF decoding still need device testing. See TEST_REPORT.md.
- Compression supports quality or target KB for JPG/WebP. Target mode keeps original dimensions and clearly reports unreachable targets; no size guarantee is made.
- Aspect-locked resize follows the last edited dimension (width or height).
- Basic crop uses pixel coordinates, not dragging selection.
- Color picker samples an original-resolution canvas, with a scaled display.
- No actual analytics or ads are activated.
- No Google AdSense approval is implied.


## v0.2
Refined navy/mint responsive layout, keyboard-accessible image selection, `.html` route initialization, synchronized aspect-ratio inputs, stale-result invalidation, upload/processing race guards, encoder fallback detection, original-resolution color sampling, and Canvas-filter-independent effects. Compression reports when output is larger.

## v0.3
- Compress to 100 / 200 / 500 KB or a custom maximum, preserving dimensions.
- Batch compression: up to 20 images, 35 MB each, 100 MB combined; sequential processing, cancellation, per-file results, individual downloads and ZIP export. Batch output is capped at 150 MB.
- Before/after image comparison for every tool producing an output image.
- All processing and ZIP construction remain local with no third-party dependencies.

Run `node tests/pro-features.cjs` from the project directory for target-size edge cases, encoder fallback rejection and ZIP fixture generation.

## Launch & SEO release
Canonical production origin: https://imagetoolstudio.vercel.app (from the repository homepage). Crawlable HTML tool links, 12 original step-by-step guides and 36 FAQs, sitemap.xml, robots.txt, share metadata, WebApplication structured data, 404 page, completed support/about/privacy/terms pages. Support email: imagetoolstudio@gmail.com (provided by the owner). GitHub Issues remains available for public technical reports.

### Optional statistics
Users explicitly opt in through the privacy notice; declining keeps all tools available. Only allowlisted tool/action/count events reach `/api/usage`. DNT and GPC suppress events. The endpoint writes sanitized `studio_usage` records to Vercel function logs; this is approximate operational telemetry, not a durable analytics database. Hosting network/access logs are separate and may include technical information.

Review usage in the existing Vercel project's runtime logs filtered by `studio_usage`. A JSONL log export can be summarized with `node scripts/summarize-usage.cjs < usage.jsonl`. Counts represent opted-in actions, not unique visitors; download events mean requested, not confirmed saved. Log retention depends on hosting settings. No third-party analytics account is required.

### Later account work
- Search Console submission and site ownership verification require the owner's Google account. Submit the production sitemap after verification. No verification token is fabricated or prefilled.
- AdSense is not activated: an owner account, site review/approval, real publisher ID and appropriate privacy/advertising configuration are still required. No income or approval is guaranteed.
- Custom domain is optional; no domain has been purchased. If one is connected, run `node scripts/set-site-origin.cjs https://your-verified-domain` and deploy the changed files together.

Run `node tests/launch.cjs` and `node tests/pro-features.cjs` from the project root. Static preview does not execute `/api/usage`; endpoint tests exercise the handler separately.

## Remove Watermark / Object Eraser — 3 November 2026
`/remove-watermark` provides a brush mask, adjustable diameter, Undo, Clear selection, Cancel, original/output previews and PNG export. A local Web Worker initializes selected pixels from unmasked row/column boundaries, then relaxes the fill. It is not an AI model and cannot recover hidden image detail; texture often becomes blurred. No image is uploaded. Use images you own or have permission to edit.

Inputs: supported JPG/PNG/WebP/AVIF up to 35 MB and 44 MP. Working images are fitted within 2048 px per side, with the reduced download dimensions disclosed. A selection may cover at most 15% of the working image or 200,000 pixels, with up to 30 strokes. Each run starts from the loaded original. Cancel terminates the worker and invalidates pending PNG encoding.

Run `node tests/inpaint.cjs` for deterministic fill, untouched-pixel, alpha, edge-mask and invalid-mask checks. Real touch devices and Safari have not been tested.
