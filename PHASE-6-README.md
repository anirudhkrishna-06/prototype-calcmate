# Calcmate - Phase 6 (Assessments + Insights)

## What this phase adds

- Assessments hub
- Assessment scheduling
- Assessment conduct flow
- Assessment results summary
- Insights dashboard
- Curriculum knowledge graph
- Student knowledge trace

## Files added or updated

```text
app/(tabs)/more.tsx
app/assessments.tsx
app/assessment-schedule.tsx
app/assessment-conduct.tsx
app/assessment-results.tsx
app/insights.tsx
app/curriculum.tsx
app/knowledge-trace.tsx
app/students/[studentId].tsx
data/mockData.ts
types/index.ts
```

## Behavior in this phase

- `More` becomes the gateway to the occasional-use analytics layer.
- `Assessments` shows:
  - upcoming assessments
  - status badges
  - direct links to schedule and conduct
- `Schedule Assessment` adds prerequisite guidance and existing evidence.
- `Conduct Assessment` provides a compact teacher workflow for recording responses.
- `Assessment Results` summarizes mastery and flags students needing attention.
- `Insights` gives a calm dashboard of attendance, mastery, and workload.
- `Curriculum KG` shows the prerequisite chain for concepts in a structured visual form.
- `Knowledge Trace` shows learner progression over time.
- Student profiles now link into the knowledge trace view.

## Shared data added in this phase

- `assessments`
- `assessmentResults`
- `insightMetrics`
- `curriculumNodes`
- `knowledgeTrace`
- `getAssessmentById()`
- `getAssessmentResultById()`
- `getKnowledgeTraceForStudent()`
- `getCurriculumByGrade()`

## Design choices

- Keep the analytics layer visually calm and teacher-first
- Avoid dense chart-heavy dashboards
- Use cards, chips, and simple progress bars instead of heavy visual noise
- Keep each screen focused on one question:
  - What should I assess?
  - What happened?
  - What does it mean?
  - What should I do next?

## Demo path

1. Open `More`
2. Go to `Assessments`
3. Schedule an assessment
4. Conduct it
5. Review results
6. Open `Insights`
7. Inspect the curriculum graph
8. Open a student knowledge trace from the trace screen or a student profile

## Next phase

Phase 7 - Settings + polish

The next slice should tighten small inconsistencies, add any settings or classroom-management utilities, and polish the overall navigation and visual rhythm.
