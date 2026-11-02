# Image Tools Studio — MVP v0.1

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
- Test browser compatibility, including AVIF and Safari.
- Compression tool uses chosen quality and format; it does **not** guarantee a target KB size.
- Resizing with "Preserve aspect ratio" takes width as the controlling dimension.
- Basic crop uses pixel coordinates, not dragging selection.
- Color picker samples the preview canvas (may be downscaled).
- No actual analytics or ads are activated.
- No Google AdSense approval is implied.
