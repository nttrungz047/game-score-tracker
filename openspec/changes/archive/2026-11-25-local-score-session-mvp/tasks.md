# Tasks

## 1. Project foundation

- [x] 1.1 Create the Next.js TypeScript application structure with mobile-first styling and verify the development build starts successfully.
- [x] 1.2 Use browser-native CSS chart rendering and Canvas image rendering to avoid extra runtime dependencies, then verify TypeScript compilation and production build succeed.
- [x] 1.3 Define shared domain types for sessions, players, rounds, scores, preferences, and storage schema version, then verify type checking passes.
- [x] 1.4 Extract translated UI resources and shared confirmation UI, add lucide-react icons, and verify the app has no window.confirm calls or hard-coded action labels.

## 2. Local data and derived scoring

- [x] 2.1 Implement the versioned localStorage adapter with safe read/write behavior and verify sessions survive a reload-like read in a storage test.
- [x] 2.2 Implement score aggregation, ranking, round numbering, and chart-series derivation, then verify unit tests cover positive, negative, zero, edited, and deleted scores.
- [x] 2.3 Implement session creation, player management, and configuration editing, then verify tests cover validation and stable player IDs.
- [x] 2.4 Implement session duplication with copied configuration and players but no rounds or totals, then verify the duplicate is independent from the source session.

## 3. Session and scoring UI

- [x] 3.1 Build the session list, create-session form, and session detail navigation, then verify a user can create and reopen a session from the UI.
- [x] 3.2 Build the mobile-friendly player management UI, then verify adding, renaming, and removing players updates the persisted session.
- [x] 3.3 Build new-round and edit-round score forms with numeric mobile input, then verify saving a round updates totals and rankings.
- [x] 3.4 Build round history and score detail UI, then verify edit and delete flows recalculate totals and show confirmation before deletion.
- [x] 3.5 Build the current ranking view with configurable unit labels, metrics, and responsive empty states, then verify it works with zero and multiple rounds.
- [x] 3.6 Add the score progression chart, then verify chart data and labels update after adding, editing, or deleting a round.

## 4. Sharing image

- [x] 4.1 Build a deterministic score-image view model and share-image layout containing session metadata, ranking, totals, unit, and round count, then verify it reflects current data.
- [x] 4.2 Implement save-image download behavior and safe filenames, then verify a valid PNG or JPEG is downloaded from a mobile-capable browser.
- [x] 4.3 Implement copy-image behavior with clipboard capability detection, success feedback, and save-image fallback, then verify both supported and unsupported browser paths.

## 5. Preferences and safety

- [x] 5.1 Implement Vietnamese/English translation keys and locale persistence, then verify UI labels and confirmation messages switch and restore after reload.
- [x] 5.2 Implement light/dark/system theme selection and persistence, then verify theme changes apply without hydration errors.
- [x] 5.3 Add shared confirmation modals for deleting rounds, deleting players with scores, deleting sessions, and resetting all data, then verify cancel preserves data.
- [x] 5.4 Implement reset-all-data with explicit warning and verified storage cleanup, then verify the app returns to its initial state after confirmation.

## 6. Integration verification

- [x] 6.1 Verify responsive layouts at mobile, tablet, and desktop widths with no horizontal scrolling or hover-only controls.
- [x] 6.2 Run end-to-end flows for create session, record rounds, edit/delete, duplicate without history, reload, share image, and reset data.
- [ ] 6.3 Verify production build, linting, type checking, and browser behavior in representative Chromium and Safari mobile environments.

## Workflow follow-up

- Review the completed implementation against the three capability specs.
- Archive the OpenSpec change after implementation and review are complete.
