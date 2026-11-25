# Proposal: Improve score trends and sharing

## Why

Write Score currently places the primary round/share actions below the ranking, renders the chart as independent per-player bars, and generates a compact image that can omit ranking content on larger sessions.

## What changes

- Move the “Thêm vòng” and “Chia sẻ ảnh” actions into the session header action area so they are immediately available on every ranking view.
- Replace the current chart presentation with a round-by-round trend visualization that makes cumulative score changes across rounds easy to compare.
- Make the shared ranking image include the complete ranking table, session metadata, and a localized date/time; keep download and clipboard sharing behavior local-only.

## Scope and non-goals

- No backend, account, database, synchronization, or payment integration.
- Preserve the existing versioned local-storage approach.
- Do not change score calculation or ranking semantics.
- Do not add backend, accounts, database, synchronization, or payment functionality.

## Decisions

- Chart trends represent cumulative totals for ranking progression.
- Shared image date/time uses the active UI locale and device time zone.
- The shared image uses one deterministic tall image with a readable minimum row height.
- Existing translated resource keys are reused; no new visible labels are required.
