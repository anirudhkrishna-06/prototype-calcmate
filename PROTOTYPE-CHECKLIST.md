# Calcmate Prototype Checklist

This is the freeze checklist for the Expo prototype. It marks what is present in the app today and what is intentionally simplified for prototype scope.

## Legend

- `[x]` Present and working in the prototype
- `[~]` Present in simplified form for prototype scope
- `[ ]` Not yet represented

## 1. Global App Shell

- [x] Tabs for `Home`, `Schedule`, `Students`, `Groups`, and `More`
- [x] Persistent `AI Assistant` floating action button
- [x] Global router page headers disabled
- [x] Calm, teacher-first color system and spacing tokens
- [x] Consistent Feather icon usage across the app
- [x] Reusable empty-state component

## 2. Home / Today

- [x] Teacher landing screen
- [x] Classroom attendance summary
- [x] `Mark Attendance` shortcut
- [x] `Schedule for the Day` shortcut
- [x] Upcoming class card
- [x] Other groups summary
- [x] Direct access to class briefing
- [~] Teacher profile / notifications chip
  - The screen is clean and focused, but the profile/notification area is not visually emphasized yet.

## 3. Attendance

- [x] Mark attendance screen
- [x] Present / absent toggles
- [x] Mark all present action
- [x] Attendance modification state
- [x] Attendance history per student
- [x] Attendance changes affect classroom state
- [~] Grade / group selector
  - The prototype is seeded around Grade 4 to keep the flow focused, but the data model supports expansion.

## 4. Students

- [x] Students roster screen
- [x] Search
- [x] Attendance filters
- [x] Knowledge-level filters
- [x] Compact student cards
- [x] Student profile route
- [x] Attendance status on profile
- [x] Knowledge state on profile
- [x] Recommendation / instructional priority on profile
- [x] Attendance history on profile
- [x] Knowledge trace link from profile
- [~] Full assessment history on profile
  - The prototype shows the learner’s current state, attendance history, and trace, but not a full historical assessment transcript.

## 5. Groups

- [x] Grade-wise group overview
- [x] Present / total counts
- [x] Current concept and subject
- [x] Activity mode badges
- [x] Group detail route
- [x] Group roster list
- [x] Group schedule blocks
- [x] Direct jump to student profiles

## 6. Schedule

- [x] Vertical instructional timeline
- [x] `All` view
- [x] Grade filters
- [x] Time-grouped blocks
- [x] Direct jump from timeline to group detail
- [x] Clear activity mode labeling

## 7. Pre-Class Briefing

- [x] Upcoming lesson summary
- [x] Objective display
- [x] Top 3 priorities
- [x] Other groups summary
- [x] `Start Class` action
- [x] Class-context AI access

## 8. Class Mode

- [x] Minimal in-class operating screen
- [x] Lesson objective
- [x] Timer / block context
- [x] Top priorities
- [x] Other groups
- [x] Quick support actions
- [x] `Complete Class` action
- [x] Context-aware AI access

## 9. Parallel Learning

- [x] Parallel learning screen
- [x] Group selection
- [x] Activity summary
- [x] Transition to next priority

## 10. Next Priority

- [x] Recommendation for next teacher move
- [x] Reasoning summary
- [x] Alternate path
- [x] Direct navigation to the next group or back to class

## 11. Complete Class

- [x] Priority review
- [x] Resolve / follow-up choices
- [x] Brief teacher note
- [x] Save and continue action

## 12. Post-Class Update

- [x] Post-class processing screen
- [x] Lesson-state summary
- [x] Priority outcome summary
- [x] Knowledge-state update messaging
- [x] Return home action

## 13. AI Assistant

- [x] General AI mode
- [x] Class AI mode
- [x] Context-aware class parameters
- [x] Prompt chips instead of chat-first layout
- [x] Structured response card
- [x] Action chips that route into the app
- [x] Persistent AI button entry

## 14. Assessments

- [x] Assessments hub
- [x] Upcoming assessments list
- [x] Schedule assessment screen
- [x] Conduct assessment screen
- [x] Assessment results screen
- [x] Prerequisite warning behavior
- [x] Assessment mastery summary

## 15. Insights

- [x] Insights dashboard
- [x] Attendance / mastery / attention metrics
- [x] Teacher action summary
- [x] Links into assessments and curriculum

## 16. Curriculum KG

- [x] Curriculum knowledge graph screen
- [x] Prerequisite chain visualization
- [x] Grade 4 focus section
- [x] Explanatory reading hints

## 17. Knowledge Trace

- [x] Student knowledge trace screen
- [x] Student selector
- [x] Time-ordered progression
- [x] Evidence-based mastery changes
- [x] Link back to student profile

## 18. Settings / Classroom Management

- [x] Settings screen
- [x] Classroom preferences sections
- [x] Reusable empty-state examples
- [x] More hub entry to settings

## 19. Design / Polish

- [x] Warm ivory background and restrained palette
- [x] Navy / teal / amber / red hierarchy
- [x] Moderate corner radii
- [x] Subtle shadows
- [x] No page headers
- [x] Calm card-based layouts
- [x] Empty states for no results
- [x] Lint-clean codebase

## 20. Prototype-Simplified Items

These are represented in the prototype, but not yet backed by a persistent backend:

- [~] Teacher profile / notifications on Home
- [~] Full multi-grade attendance selector
- [~] Full assessment history on student profile
- [~] Persisted settings storage
- [~] Persistent knowledge graph updates
- [~] Live RAG / backend AI reasoning

## Final Freeze Statement

The prototype now covers the full teacher journey:

`Attendance → Classroom state → Daily schedule → Group schedule → Pre-class priorities → Parallel learning → Class mode → AI assistance → Post-class feedback → Knowledge-state update`

That means the app is ready to freeze as a coherent prototype.
