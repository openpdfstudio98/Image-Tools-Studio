# Image Tools Studio — MVP v0.3

A dependency-free, static, mobile-friendly website with 12 browser-based image tools.

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
- Add a verified support email, review legal/privacy pages, cookie consent rules and ad policies before activating ads.
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
