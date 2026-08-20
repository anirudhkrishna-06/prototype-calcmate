# Calcmate - Phase 5 (AI Assistant)

## What this phase adds

- A general AI assistant experience for planning and classroom questions
- A context-aware Class AI mode that inherits the current lesson context
- Prompt chips instead of a chat-first layout
- A structured response card that reads like a teacher-ready recommendation
- Action chips that jump into the relevant part of the prototype

## Files added or updated

```text
app/ai.tsx
components/calcmate/AIButton.tsx
app/pre-class.tsx
app/class-mode.tsx
```

## Behavior in this phase

- The assistant screen now supports two modes:
  - `General AI`
  - `Class AI`
- `Class AI` receives the active group id from the class flow.
- The assistant shows:
  - current context
  - quick prompt chips
  - a teacher-ready answer
  - action chips for moving to the next task
- The entry points from `Pre-Class Briefing` and `Class Mode` now open the contextual assistant mode.

## Design choices

- No chatbot transcript as the primary UI
- No oversized decorative AI illustration
- No flashy gradient treatment
- Keep the answer concise, structured, and classroom-safe
- Make the assistant feel like a copilot, not a separate product

## Demo path

1. Open the AI button from `Home` for general planning help
2. Open the AI button from `Pre-Class` or `Class Mode` for lesson-aware help
3. Pick a prompt chip
4. Type a short question
5. Tap `Ask`
6. Use the action chips to jump back into the classroom flow

## Next phase

Phase 6 - Assessments + Insights

The next slice should surface the broader teacher decision layer:

- assessment planning
- results and mastery
- insights
- curriculum / knowledge graph views
