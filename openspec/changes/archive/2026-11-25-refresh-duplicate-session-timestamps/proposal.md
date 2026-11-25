# Proposal

## Why

Duplicating a session creates a new independent session, but its timestamps should describe the new session rather than the source session. The duplicate action must therefore record the current time for both creation and last update.

## What Changes

- Set `createdAt` to the current ISO timestamp when duplicating a session.
- Set `updatedAt` to the same current ISO timestamp when duplicating a session.
- Preserve the source session and keep the duplicate's copied configuration and players, empty rounds, and independent identifier.
- Add domain tests covering the timestamp behavior.

## Capabilities

### Modified Capabilities

- `score-sessions`: clarify timestamp semantics for duplicated sessions.

## Impact

- Domain duplication logic in `src/lib/domain.ts`.
- Existing score-session tests.
- No storage schema, UI, or API changes.
