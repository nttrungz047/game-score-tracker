# score-sharing Specification

## Purpose

Cho phép người dùng biến bảng điểm hiện tại thành một ảnh dễ đọc để lưu trữ hoặc dán vào ứng dụng nhắn tin mà không cần backend hay dịch vụ chia sẻ riêng.

## Requirements

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

### Requirement: Save the score image

The system SHALL allow the user to save the generated score image to the device using a standard image download flow.

#### Scenario: Save image successfully

- **WHEN** the user chooses save image
- **THEN** the browser downloads an image file representing the current score view

### Requirement: Copy the score image

The system SHALL allow the user to copy the generated score image to the clipboard when the browser supports image clipboard operations.

#### Scenario: Copy image successfully

- **WHEN** the user chooses copy image in a compatible browser
- **THEN** the image is placed on the clipboard and the interface confirms success

#### Scenario: Copy image is unsupported

- **WHEN** the browser does not support copying image data
- **THEN** the interface explains the limitation and offers save image as the fallback

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
