/*
  Warnings:

  - You are about to drop the `OnboardingProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OnboardingProfile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserOnboarding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "primaryGoal" TEXT NOT NULL,
    "workPace" TEXT NOT NULL,
    "supportStyle" TEXT NOT NULL,
    "overloadTendency" TEXT NOT NULL,
    "focusArea" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserOnboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOnboarding_userId_key" ON "UserOnboarding"("userId");
