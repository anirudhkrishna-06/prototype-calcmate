# Calcmate - Phase 4 (Class Flow)

## What this phase adds

- Pre-Class Briefing
- Class Mode
- Parallel Learning
- Next Priority
- Complete Class
- Post-Class Update

## Files added or updated

```text
app/pre-class.tsx
app/class-mode.tsx
app/parallel-learning.tsx
app/next-priority.tsx
app/complete-class.tsx
app/post-class.tsx
app/(tabs)/index.tsx
data/mockData.ts
```

## Behavior in this phase

- `Home` now passes the active `groupId` into the briefing flow.
- `Pre-Class Briefing` shows:
  - the upcoming lesson
  - the class objective
  - top priorities
  - current parallel groups
  - `Start Class`
- `Class Mode` becomes the teacher's main in-class screen:
  - lesson objective
  - timer / block summary
  - top priorities
  - other groups
  - quick support actions
  - `Complete Class`
- `Parallel Learning` focuses on the non-teacher-led groups and lets the teacher inspect one at a time.
- `Next Priority` surfaces a calm recommendation for where the teacher should move attention next.
- `Complete Class` gives a short review of the lesson with quick resolved / follow-up markings.
- `Post-Class Update` summarizes the system state update after the lesson ends.

## Shared state added in this phase

This phase extends the lightweight in-memory prototype state with priority decisions:

- `getPriorityDecision()`
- `setPriorityDecision()`
- `resetPriorityDecisions()`

The goal is not a full backend. The goal is to make the flow feel connected across screens during the demo.

## Design choices

- Keep the lesson flow calm and teacher-first
- Avoid chat-first or AI-first layouts
- Use compact cards, restrained color, and simple action placement
- Keep the primary action always obvious
- Keep support actions available, but secondary

## Demo path

1. Open `Home`
2. Tap `View Class`
3. Review the briefing
4. Start the class
5. Move into `Parallel Learning` or `Next Priority`
6. Open `Complete Class`
7. Save and view `Post-Class Update`

## Next phase

Phase 5 - AI Assistant

The next slice should build on the class context and make the assistant feel truly classroom-aware without changing the calm visual language established here.
