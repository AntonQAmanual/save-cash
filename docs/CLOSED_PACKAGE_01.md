# Closed package 01 implemented on RC4.2

Release RC5, 18 October 2026. Existing design and eight tabs retained.

New modules: calendar.js separates calculated cash from confirmed bank snapshots and applies rent at 22:00 Asia/Jerusalem; archive.js maintains an append-only SHA256 audit chain and creates XLSX, paginated PDF and standalone interactive HTML; package-ui.js adds the statement menu, period reminder, draft left-side edits and atomic final reconciliation with an optional user-supplied bank snapshot.

No private account values, screenshots, policy or bank documents are bundled in this repository. Earlier functions retained: installment registry, completed single-card history, Menora date-based policy forecast, dog CRUD and plan links, receipt OCR and translation, status/final purchase confirmation, CSV/XLSX/image/PDF statement import, duplicate detection and rollback.

159 tests pass. Added coverage: Jerusalem clock and DST, exact rent boundary, missed-event replay, confirmed bank invariant, separate late fees, period reminder/final/rollback, audit chain tamper detection, calendar/family/card reporting ranges, XLSX read-back, standalone HTML search and escaping, two-page PDF parsing, archive ZIP preservation, OCR-only statement confirmation, atomic bank point application and simulated storage failure.

The PDF export contains locally rendered page images: Cyrillic, Hebrew and currency signs display through local browser fonts; text selection/search in PDF is not provided. HTML and XLSX keep structured searchable data. Historical rows only exist where data was actually retained; migration records a baseline, never invents earlier edits. A local SHA256 chain detects accidental changes but is not a remote notarization or protection from a device owner replacing all local data.

Physical Android/iOS installation, device camera and actual Safari sessions require real devices and are not claimed by automated tests. GitHub Pages cannot provide server-side device authorization by itself. Existing device data is not remotely accessible and is never reset by a release.
