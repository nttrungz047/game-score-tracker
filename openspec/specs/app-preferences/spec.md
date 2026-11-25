# app-preferences Specification

## Purpose

Cho phép người dùng điều chỉnh ngôn ngữ và giao diện của ứng dụng theo thiết bị, đồng thời giữ các lựa chọn này giữa các lần mở ứng dụng.

## Requirements

### Requirement: Select the application language

The system SHALL support Vietnamese and English interface text and SHALL persist the selected language locally.

#### Scenario: Switch language

- **WHEN** the user selects Vietnamese or English
- **THEN** supported interface labels, actions, statuses, and confirmations update to that language

#### Scenario: Restore language

- **WHEN** the user opens the application after previously selecting a language
- **THEN** the application uses the saved language

### Requirement: Select the color theme

The system SHALL support light, dark, and system color themes and SHALL persist the selected theme locally.

#### Scenario: Select dark theme

- **WHEN** the user selects dark theme
- **THEN** the application uses dark theme styles immediately and after reload

#### Scenario: Select system theme

- **WHEN** the user selects system theme
- **THEN** the application follows the browser or operating system color preference

### Requirement: Responsive layout

The system SHALL provide usable layouts for mobile, tablet, and desktop viewport sizes without requiring hover interactions.

#### Scenario: Use on a mobile viewport

- **WHEN** the application is opened on a mobile browser
- **THEN** score entry, navigation, confirmations, and sharing actions remain visible and operable without horizontal scrolling
