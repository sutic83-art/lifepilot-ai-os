# Dashboard Cleanup Plan

## Standard koji svaka dashboard stranica treba da dobije

- DashboardShell
- LoadingCard
- ErrorCard
- SectionCard
- fetchJson helper
- shared types kada se tip koristi na više mesta

## Redosled migracije

### Phase 1 — core product surfaces
1. /dashboard
2. /dashboard/tasks
3. /dashboard/goals
4. /dashboard/habits

### Phase 2 — core AI operating surfaces
5. /dashboard/weekly-review
6. /dashboard/goal-alignment
7. /dashboard/time-allocation
8. /dashboard/intervention
9. /dashboard/policy
10. /dashboard/decision

### Phase 3 — intelligence and memory surfaces
11. /dashboard/energy
12. /dashboard/review
13. /dashboard/learning
14. /dashboard/memory-consolidation
15. /dashboard/trends
16. /dashboard/retrospective

### Phase 4 — system / founder / advanced surfaces
17. /dashboard/founder-reporting
18. /dashboard/state
19. /dashboard/orchestrator
20. /dashboard/self-tuning

## Migration checklist for each page

- [ ] Use DashboardShell
- [ ] Use LoadingCard
- [ ] Use ErrorCard
- [ ] Use SectionCard
- [ ] Replace manual fetch with fetchJson
- [ ] Move repeated types into lib/types if reused
- [ ] Remove duplicated layout wrappers
- [ ] Check duplicate React keys
- [ ] Verify page still loads correctly

## Notes

- Do not refactor all pages at once.
- Migrate one page, test it, then continue.
- Prefer stable reusable UI patterns over ad hoc layout code.