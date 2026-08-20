# Calcmate - Phase 7 (Settings + Polish)

## What this phase adds

- Settings screen
- Reusable empty state component
- Empty-state treatment in the Students roster
- Icon consistency pass across the occasional-use hub
- Global router header removal for a cleaner app shell

## Files added or updated

```text
app/_layout.tsx
app/(tabs)/more.tsx
app/(tabs)/students.tsx
app/settings.tsx
components/calcmate/EmptyState.tsx
```

## Behavior in this phase

- All router-managed page headers are hidden.
- `Settings` becomes a calm classroom-management screen.
- `More` now includes a clear entry to settings.
- Students search/filter now shows a helpful empty state instead of a blank list.
- Empty-state UI is reusable and styled to match the rest of Calcmate.

## Design choices

- Keep settings useful but not overwhelming
- Treat empty states as part of the product, not an error condition
- Use one icon family consistently
- Keep the app shell visually quiet so the content carries the meaning

## Demo path

1. Open any screen and confirm the page header is gone
2. Open `More`
3. Go to `Settings`
4. Review the settings cards and empty states
5. Open `Students`
6. Search for a missing name to see the empty-state treatment

## Final polish note

At this point the prototype has a complete teaching workflow:

- Home
- Attendance
- Students
- Groups
- Schedule
- Class flow
- AI assistant
- Assessments
- Insights
- Curriculum graph
- Knowledge trace
- Settings

The remaining work, if any, should be small refinements rather than new structural features.
