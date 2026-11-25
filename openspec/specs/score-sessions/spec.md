# score-sessions Specification

## Purpose

Cho phép một người quản lý điểm cho cả nhóm qua nhiều vòng chơi, lưu lại tiến trình trên trình duyệt và tiếp tục sử dụng mà không cần tài khoản hoặc máy chủ.

## Requirements

### Requirement: Create and persist a session

The system SHALL allow the user to create a session with a game name, custom unit name, and zero or more players, and SHALL persist it locally. The session display name SHALL be generated from the game name or the localized default when the user does not provide one.

#### Scenario: Create a session

- **WHEN** the user submits a valid game configuration
- **THEN** the system creates a session with a unique local identifier and zero total rounds

#### Scenario: Restore sessions after reload

- **WHEN** the user reloads the application with previously saved sessions
- **THEN** the system restores those sessions from local storage

### Requirement: Manage players

The system SHALL allow the user to add, rename, and remove players from a session, and SHALL preserve player identity across all recorded rounds.

#### Scenario: Add a player

- **WHEN** the user adds a non-empty unique player name
- **THEN** the player appears in the session and can receive scores in a new round

#### Scenario: Remove a player with recorded scores

- **WHEN** the user attempts to remove a player who has scores
- **THEN** the system asks for confirmation before removing the player and its associated score entries

### Requirement: Record scores by round

The system SHALL allow the user to enter a score for each active player in a new round and SHALL calculate each player's cumulative total from all recorded rounds.

#### Scenario: Save a round

- **WHEN** the user submits valid scores for the active players
- **THEN** the system saves one numbered round and updates cumulative totals and rankings

#### Scenario: Edit a round

- **WHEN** the user edits and saves an existing round
- **THEN** the system replaces that round's scores and recalculates totals and rankings

#### Scenario: Delete a round

- **WHEN** the user requests deletion of a round
- **THEN** the system requires confirmation and recalculates totals after deletion

### Requirement: Display score history and ranking

The system SHALL display the current ranking, cumulative score for each player, round history, and the configured unit name wherever scores are shown.

#### Scenario: View ranking

- **WHEN** a session contains one or more rounds
- **THEN** the system displays players ordered by cumulative score with the configured unit label

#### Scenario: View empty session

- **WHEN** a session contains no rounds
- **THEN** the system displays an empty state and an action to add the first round

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

### Requirement: Reset local data

The system SHALL provide a reset-all-data action that permanently removes all locally stored sessions and preferences only after explicit confirmation.

#### Scenario: Confirm reset

- **WHEN** the user confirms reset all data
- **THEN** the system removes all application data from local storage and returns to the initial state

#### Scenario: Cancel reset

- **WHEN** the user cancels the reset confirmation
- **THEN** the system preserves all sessions and preferences
