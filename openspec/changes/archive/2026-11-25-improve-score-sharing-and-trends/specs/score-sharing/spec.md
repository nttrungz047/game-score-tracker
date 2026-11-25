# Spec Delta

## MODIFIED Requirements

### Requirement: Header exposes primary session actions

The session ranking view MUST expose “Thêm vòng” and “Chia sẻ ảnh” in the session header action area. The actions MUST remain keyboard accessible, have translated accessible names, and remain usable when the header wraps on narrow viewports.

#### Scenario: Open a session

- **WHEN** a user opens a session
- **THEN** the header presents the add-round and share-image actions without requiring the user to scroll to a lower toolbar

### Requirement: Chart shows score variation across rounds

The chart MUST show an ordered point for each round and a series for each player, using cumulative totals derived from the round history and stable player IDs. The chart MUST provide a no-rounds state and a non-color-only way to identify series.

#### Scenario: Compare progress

- **WHEN** a session has multiple rounds
- **THEN** the chart lets the user follow each player's cumulative score from round to round and identify the corresponding player by legend or text

#### Scenario: No rounds

- **WHEN** a session has no rounds
- **THEN** the chart shows the existing translated empty state and does not render misleading axes or data points

### Requirement: Generate a score image

The system SHALL generate an image containing the current session name, game name, players, rankings, cumulative scores, configured unit name, round count, and generation date/time. The image SHALL include every ranking row without silent clipping.

#### Scenario: Generate an image with scores

- **WHEN** the user requests an image for a session with recorded rounds
- **THEN** the system produces an image that reflects the current ranking and totals

#### Scenario: Generate an image without scores

- **WHEN** the user requests an image for a session with no recorded rounds
- **THEN** the system produces an image showing the configured players and an explicit empty-score state

#### Scenario: Generate a complete ranking image

- **WHEN** the user requests an image for a session with multiple ranked players
- **THEN** the system includes every ranked player's rank, name, total, and a localized generation date/time
