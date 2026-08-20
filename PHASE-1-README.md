# Calcmate — Phase 1 (Foundation + Home)

## What's in this drop

```
constants/theme.ts                         → replaces existing constants/theme.ts
types/index.ts                              → new
data/mockData.ts                            → new
components/calcmate/Card.tsx                 → new
components/calcmate/Badge.tsx                → new
components/calcmate/Button.tsx               → new
components/calcmate/PriorityList.tsx         → new
components/calcmate/OtherGroupsStrip.tsx     → new
components/calcmate/AIButton.tsx             → new
components/calcmate/PlaceholderScreen.tsx    → new
app/(tabs)/_layout.tsx                       → replaces existing tab layout
app/(tabs)/index.tsx                         → replaces existing Home tab
app/(tabs)/schedule.tsx                      → new (placeholder, Phase 3)
app/(tabs)/students.tsx                      → new (placeholder, Phase 2)
app/(tabs)/groups.tsx                        → new (placeholder, Phase 3)
app/(tabs)/more.tsx                          → new (placeholder, Phase 6/7)
app/attendance.tsx                           → new (placeholder, Phase 2)
app/pre-class.tsx                            → new (placeholder, Phase 4)
app/ai.tsx                                   → new (placeholder, Phase 5)
```

## Merge steps

1. Copy this folder's contents into `E:\Projects\prototype-calcmate`, overwriting
   `constants/theme.ts`, `app/(tabs)/_layout.tsx`, and `app/(tabs)/index.tsx`.
2. Delete `app/(tabs)/explore.tsx` — it's the template's default second tab
   and is no longer referenced by the new `_layout.tsx`.
3. Confirm `tsconfig.json` has the `@/*` path alias (the default Expo
   template ships with this already, pointing `@/*` → `./*`). All new files
   import via `@/constants/theme`, `@/data/mockData`, etc.
4. Confirm `@expo/vector-icons` is installed (bundled with the default
   template) — used for the `Feather` icon set.
5. Run:
   ```
   npx expo start
   ```

## What you'll see

- **Home tab**: classroom status card (44/47 present), Mark Attendance
  button, Upcoming Class card (Grade 4 — Fractions, 3 students need
  attention), Other Groups strip, and the persistent `✦ Calcmate` button.
- **Schedule / Students / Groups / More tabs**: placeholder screens (built
  out in Phases 2–7).
- Tapping **Mark Attendance**, **View Class**, or the **✦ Calcmate** button
  navigates to placeholder screens confirming the routes exist end-to-end.

## Next phase

Phase 2 — Attendance (mark + modify) and Students (list + profile with
knowledge state), using the `students` array in `data/mockData.ts`.

Let me know once you've pulled this in and I'll move on to Phase 2.
