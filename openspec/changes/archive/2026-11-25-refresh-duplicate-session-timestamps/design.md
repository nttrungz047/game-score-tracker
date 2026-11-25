# Design

## Context

The existing MVP already centralizes session duplication in the domain layer. The UI duplicate actions delegate to that helper, so changing the domain behavior keeps all duplicate entry points consistent.

## Decision

When `duplicateSession(source)` creates the new session:

1. Capture one `now` value with `new Date().toISOString()`.
2. Assign that value to both `createdAt` and `updatedAt` on the duplicate.
3. Continue generating a new session ID and copying only session configuration and players.
4. Continue resetting rounds to an empty array.
5. Leave the source object unchanged.

Using one captured value avoids a possible mismatch between the two timestamps and makes the behavior deterministic to assert in tests.

## Non-Goals

- Do not change timestamps on the source session.
- Do not copy the source rounds or derived totals.
- Do not change localStorage schema or UI labels.
