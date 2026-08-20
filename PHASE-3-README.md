# Calcmate - Phase 3 (Groups + Schedule)

## What this phase adds

- A teacher-first group overview screen
- A compact group detail route for drilling into one class at a time
- A vertical schedule timeline with horizontal grade filters
- A shared route pattern for moving between group overview and schedule detail

## Files added or updated

```text
app/(tabs)/groups.tsx
app/(tabs)/schedule.tsx
app/groups/[groupId].tsx
data/mockData.ts
```

## Behavior in this phase

- `Groups` shows each class as a calm summary card:
  - grade
  - student count
  - present count
  - current subject
  - current concept
  - current activity mode
  - remaining time, when available
- Tapping a group opens a dedicated group detail screen.
- Group detail shows:
  - the classroom state for that group
  - current instructional mode
  - seeded student roster, if available
  - today's schedule blocks for the group
- `Schedule` shows a vertical instructional timeline:
  - `All` view for the full classroom
  - grade filters for individual groups
  - minimal cards that emphasize time, concept, and activity mode

## Teacher-first UI choices

- No heavy calendar chrome
- No dense analytics dashboard layout
- No chat-style interface
- No decorative AI visuals
- Cards stay compact and structured so the teacher can scan quickly during class

## Shared data pattern

This phase reads from the existing mock data and adds one small helper:

- `getGroupById()`

The schedule view uses:

- `scheduleToday`
- `groups`

The detail screen uses:

- `getStudentsByGroup()`
- `scheduleToday`

## Demo path

1. Open `Groups`
2. Tap a group card
3. Inspect the group summary, roster, and schedule blocks
4. Open `Schedule`
5. Switch between `All` and individual grades
6. Tap a timeline card to jump back into the group detail

## Next phase

Phase 4 - Class flow

- Pre-Class Briefing
- Class Mode
- Parallel Learning
- Next Priority
- Complete Class

The next slice should narrow the app from planning into actual in-class action while keeping the same calm, teacher-centric visual language.
