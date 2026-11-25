# score-sharing Specification

## Purpose

Cho phép người dùng biến bảng điểm hiện tại thành một ảnh dễ đọc để lưu trữ hoặc dán vào ứng dụng nhắn tin mà không cần backend hay dịch vụ chia sẻ riêng.

## Requirements

### Requirement: Generate a score image

The system SHALL generate an image containing the current session name, game name, players, rankings, cumulative scores, configured unit name, and round count.

#### Scenario: Generate an image with scores

- **WHEN** the user requests an image for a session with recorded rounds
- **THEN** the system produces an image that reflects the current ranking and totals

#### Scenario: Generate an image without scores

- **WHEN** the user requests an image for a session with no recorded rounds
- **THEN** the system produces an image showing the configured players and an explicit empty-score state

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
