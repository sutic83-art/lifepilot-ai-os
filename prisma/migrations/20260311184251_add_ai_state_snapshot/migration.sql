-- CreateTable
CREATE TABLE "AIStateSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "snapshotType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "executiveMode" TEXT,
    "energyLevel" TEXT,
    "burnoutRisk" TEXT,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIStateSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
