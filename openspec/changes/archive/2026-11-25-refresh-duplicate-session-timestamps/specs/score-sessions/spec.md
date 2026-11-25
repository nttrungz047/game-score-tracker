# Score sessions

## MODIFIED Requirements

### Requirement: Duplicate a session without history

The system SHALL allow the user to duplicate a session while retaining its player list and session configuration but SHALL exclude all rounds and score totals from the duplicate. The duplicate SHALL have a new identifier, and its `createdAt` and `updatedAt` SHALL both be set to the current timestamp captured when duplication occurs.

#### Scenario: Duplicate an existing session

- **WHEN** the user chooses duplicate for a session with history
- **THEN** the system creates a new session with copied configuration and players, zero rounds, zero totals, a new identifier, and current creation and update timestamps

#### Scenario: Duplicate timestamps are consistent

- **WHEN** a session is duplicated
- **THEN** the duplicate's `createdAt` and `updatedAt` contain the same current ISO timestamp

#### Scenario: Source session is unchanged

- **WHEN** a session is duplicated
- **THEN** the source session, including its timestamps, rounds, players, and configuration, remains unchanged
