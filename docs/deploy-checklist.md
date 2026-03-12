# Deploy Checklist

## Pre deploy-a

- [ ] `.env.example` postoji
- [ ] `.gitignore` ignoriše `.env`
- [ ] `README.md` postoji
- [ ] `npx prisma validate` prolazi
- [ ] `npx prisma generate` prolazi
- [ ] glavne dashboard rute rade
- [ ] onboarding radi
- [ ] tasks rade
- [ ] goals rade
- [ ] habits rade
- [ ] action execution radi
- [ ] review loop radi
- [ ] snapshots rade
- [ ] trends rade
- [ ] coach radi
- [ ] founder reporting radi

## Pre produkcije

- [ ] odlučiti finalnu bazu
- [ ] pripremiti produkcione env varijable
- [ ] proveriti auth flow
- [ ] proveriti API consistency
- [ ] proveriti da nema debug ostataka
- [ ] proveriti da nema praznih ili napuštenih fajlova

## Posle deploy-a

- [ ] test login
- [ ] test onboarding
- [ ] test dashboard
- [ ] test task creation
- [ ] test AI coach
- [ ] test state snapshot