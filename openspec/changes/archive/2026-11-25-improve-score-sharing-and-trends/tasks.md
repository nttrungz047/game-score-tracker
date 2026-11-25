# Tasks

## Decisions and domain

- [x] Confirm that this change is limited to the Write Score scoring experience.
- [x] Resolve chart and export decisions: cumulative totals, active locale/device time zone, deterministic tall image, and no new dependency.
- [x] Keep the typed chart projection keyed by stable player IDs and add unit coverage for cumulative totals across rounds.

## UI and sharing

- [x] Move add-round and share-image controls into the session header, remove the duplicate lower toolbar controls, and update responsive/keyboard/accessibility styling.
- [x] Replace the independent bar chart with the round-by-round trend visualization, legend, and empty state.
- [x] Expand the canvas export to include metadata, localized device date/time, headers, every ranking row, and deterministic no-clipping height.
- [x] Reuse the existing translations for the new placement, chart, and share-image behavior.

## Verification and handoff

- [x] Add focused browser/responsive checks for header actions, chart progression, and image completeness/date-time. Verified the header actions, SVG chart/legend, share dialog, and 390px responsive layout in Chromium.
- [x] Run `npm run format`.
- [x] Run `npm test`, `npm run build`, `npm run format:check`, and `npm run lint`.
- [x] Reconcile implementation with this delta spec and mark only completed tasks.
