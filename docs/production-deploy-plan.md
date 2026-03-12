# Production Deploy Plan

## Target stack

- Frontend / app: Vercel
- Database: PostgreSQL
- ORM: Prisma
- Repository: GitHub

## Current local state

- Framework: Next.js
- ORM: Prisma
- Current local DB: SQLite
- Auth: NextAuth-based flow
- AI routes: multiple internal AI OS layers

## Production migration plan

1. Finalize local MVP
2. Push clean repo to GitHub
3. Prepare PostgreSQL database
4. Change Prisma datasource provider from sqlite to postgresql
5. Regenerate Prisma client
6. Recreate / validate migration strategy for PostgreSQL
7. Set production environment variables
8. Deploy app to Vercel
9. Run production migrations using `npx prisma migrate deploy`
10. Test auth, onboarding, dashboard, tasks, coach, snapshots

## Required environment variables

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- OPENAI_API_KEY

## Production commands

- `npx prisma generate`
- `npx prisma migrate deploy`

## Post-deploy smoke test

- Login works
- Onboarding saves
- Dashboard loads
- Tasks create correctly
- AI coach responds
- State snapshot saves
- Trends page loads