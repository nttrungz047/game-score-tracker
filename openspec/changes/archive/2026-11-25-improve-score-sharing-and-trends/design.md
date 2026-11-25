# Design

## Current baseline

The app is a single Next.js App Router client route. `page.tsx` owns hydrated React state and dialogs; `domain.ts` owns session, round, standings, metrics, and chart-series logic; `storage.ts` persists a version-1 local store. Sharing currently calls a canvas helper from the client and draws only a compact list of standings. The current chart uses independent vertical bars for each player's cumulative value at each round.

## UI actions

Keep the session header as the stable action region. Add a header action group containing “Thêm vòng” and “Chia sẻ ảnh”, with the existing duplicate/delete actions retained but visually secondary. The actions must remain keyboard reachable, have translated accessible names, and wrap on narrow screens. Remove the duplicate toolbar controls so there is one canonical location for each action.

## Trend chart

Extend the domain chart projection to return ordered round points with a cumulative total for every stable player ID. Render a shared plot with:

- one x-axis position per round, labelled with the round number;
- one line/point series per player, using a stable palette and a legend keyed by player name;
- a zero/empty state when there are no rounds;
- horizontal scrolling or responsive sizing for many rounds;
- a text fallback/table or accessible summary so the information is not conveyed by color alone.

The chart must derive from `rounds` and use stable IDs; it must not store duplicated totals. If the implementation cannot use an SVG/canvas safely with the current constraints, a semantic CSS/SVG plot is preferred over adding a chart dependency. The open decision about cumulative versus delta data is recorded in the proposal; cumulative totals are the default because they show ranking movement over time.

## Full ranking image

Create a canvas export model in the domain/UI boundary that includes:

1. session/game title;
2. number of rounds and score unit;
3. generation date/time formatted using the active locale and the device time zone;
4. a table header for rank, player, and total;
5. every current ranked player, with a consistent row height and enough canvas height for all rows.

Use measured text and bounded horizontal padding so long player names and units do not overlap. Keep the existing PNG download and Clipboard API paths. Blob creation remains client-only after hydration. If the list exceeds a practical canvas size, the implementation should use a deterministic tall image or a documented paging/scale fallback rather than silently clipping rows.

## Persistence and compatibility

No persistence schema changes are needed. Score sessions continue to use the existing version-1 localStorage payload.

## Verification

Add domain tests for chart data, UI/browser coverage for header actions and full-image generation, and responsive/accessibility checks. Run the repository's format, unit test, build, format check, and lint commands before implementation handoff.
