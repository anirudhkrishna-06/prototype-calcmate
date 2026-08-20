# Calcmate - Phase 2 (Attendance + Students)

## What this phase adds

- Editable attendance for the current classroom roster
- Student list with search, filters, and profile entry points
- Student profile screen with attendance history, knowledge state, and quick attendance changes
- Shared mock-data helpers so attendance edits stay consistent across screens during the prototype
- Removal of the default Expo `explore` tab

## Files added or updated

```text
data/mockData.ts
app/attendance.tsx
app/(tabs)/students.tsx
app/students/[studentId].tsx
app/(tabs)/index.tsx
```

## Behavior in this phase

- `Home` now reads the current classroom state from the shared mock store.
- `Attendance` shows the Grade 4 roster and lets the teacher toggle each student present or absent.
- `Attendance` also includes a `Mark All Present` action for the classroom reset case.
- `Students` shows a compact roster with filters for all / present / absent / needs attention.
- Tapping a student opens a profile with:
  - attendance status
  - knowledge state
  - recommendation text
  - attendance change history
  - quick `Mark Present` / `Mark Absent` actions

## Shared data pattern

This phase uses a lightweight in-memory store in `data/mockData.ts`:

- `students`
- `getStudentById()`
- `getStudentsByGroup()`
- `setStudentAttendance()`
- `markAllStudentsPresent()`
- `getClassroomState()`

That is enough for the prototype, and it keeps Phase 2 simple without adding a global state library.

## Demo path

1. Open `Home`
2. Tap `Mark Attendance`
3. Toggle a few students present/absent
4. Open `Students`
5. Filter by `Needs attention`
6. Open a student profile
7. Change attendance from the profile and confirm the status updates

## Next phase

Phase 3 - Groups + Schedule

- grade-wise group cards
- group detail screens
- daily schedule timeline
- class / group instructional state

If the Phase 2 slice is stable, Phase 3 should focus on the teacher's next decision: where to go, what each group is doing, and how the schedule is structured across the day.
