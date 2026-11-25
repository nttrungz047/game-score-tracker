# Tasks

## Domain behavior

- [x] 1.1 Update `duplicateSession` to capture one current ISO timestamp and assign it to both duplicate timestamps.
- [x] 1.2 Preserve copied configuration, players, empty rounds, new ID, and source immutability.

## Verification

- [x] 2.1 Add a test asserting the duplicate has current `createdAt` and `updatedAt` values that are equal.
- [x] 2.2 Add or retain assertions that source timestamps and source data remain unchanged.
- [x] 2.3 Run formatting, unit tests, type checking, lint, and production build when the implementation is applied.
