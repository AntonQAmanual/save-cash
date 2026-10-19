# Save Cash RC7 — package 3, 2026-10-19

This release continues RC6.1; existing tabs, OCR, document originals, reconciliation, reports and storage keys remain in place. No personal bank files or package screenshots are included in the repository.

## Changes

1. The main card, calculations view and expanded forecast use the same dated forecast component with intermediate balances, a chronological change/balance table and a separate pending/carryover list.
2. A monthly rent schedule replaces the single occurrence assumption. An old October anchor now also projects the next November rent, including the closing-day grace date. Each occurrence has independent bank confirmation; neither calendar arrival nor obligation edits rewrite the confirmed balance.
3. Green target headroom and red zero shortfall are separate. Scenario changes update both. Forecast values remain derived from ledger events.
4. Hebrew compensation is dated and one-off. The legacy fallback is tied to its originating period, not reused every month. The interface displays the deduction once; unresolved mathematics netting is labelled for confirmation rather than creating a guessed charge.
5. Card totals disclose their dated components and distinguish statement aggregates, covered entries, independent charges and future estimates. Exact imported installment evidence can clear a stale unverified flag during migration. Manual confirmation and the existing status editor preserve the actual amount, source and history; confirmation does not duplicate an aggregate bank charge.
6. Future fines and pending rent retain original amounts and dates through period changes. Credit payment dates remain distinct from purchase dates.
7. The legacy risk amount and include flag remain preserved in saved history but no longer create ledger events. The editor/toggle were removed; unknown fees are informational until recorded as actual bank operations.
8. Backup restore detects ZIP by signature, including extensionless browser downloads. Document imports reject empty files and files above 50 MiB; backup input limit is 250 MiB, with existing expanded-archive integrity checks retained.

## Automated validation

`npm test`: 193 passed, 0 failed, 0 skipped. Includes 16 additional package 3 cases against actual model/UI/storage code. Existing single-occurrence rent test fixtures explicitly disable recurrence; previous risk inclusion expectations were updated to the latest requirement.

New coverage: October-to-November rent recurrence and independent settlement; timeline-to-final-forecast equality; separate margins; legacy risk exclusion; one-off compensation; Paybox credit dates; exact installment evidence, card/name mismatch rejection, amount preservation and repeat confirmation; future fine retention; independent card components; shared UI; restore of extensionless ZIP; small CSV/XLSX; empty/unsupported/oversize imports; pending rent carryover.

`npm run build`: successful. Runtime dependency verification: 213 assets verified. `git diff --check`: clean. Source backup: `backup/pre-package03-20261019`; a complete verified local git bundle also exists.

## Verification limits

The browser test environment is separate from the user's installed phone database. Device data is not overwritten with control figures. The source of the historical 408-shekel difference cannot be conclusively assigned without the corresponding complete saved snapshot. Installments lacking exact imported bank evidence still require explicit user confirmation; a 232/233 discrepancy is not silently overwritten. The mathematics netting direction and any 250/256 fine discrepancy remain explicit data questions. Physical Android/iOS installation, native sharing, camera and keyboard testing require those devices; viewport checks do not establish physical-device installation.
