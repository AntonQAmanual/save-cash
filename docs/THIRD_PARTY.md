# Third-party components

Application code © 2026 Anton Koval. Third-party assets retain their own licenses:

- Tesseract.js 7.0.0 and matching tesseract.js-core: Apache-2.0; npm package-lock pins runtime packages.
- Hebrew and English `tessdata_fast` trained models: Apache-2.0. Vendored from official tesseract-ocr/tessdata_fast; SHA-256 of committed files is the authoritative build content.
- PDF.js / pdfjs-dist 6.4.299: Apache-2.0. Includes standard fonts and packed character maps distributed by that package.
- SheetJS CE 0.20.3: Apache-2.0; official versioned standalone build.
- fflate 0.8.3: MIT.

Licenses accompany each component under vendor. `scripts/vendor.mjs` prepares runtime assets. GitHub Actions prepares and verifies vendor files against runtime-integrity.json; the deployed application serves them locally and does not execute scripts from third-party CDNs. Updating models is an explicit maintenance operation requiring OCR regression checks. Downloading models from the script's upstream main URL may change their content; use committed models for reproducible release builds.
