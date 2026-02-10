-- CreateTable
CREATE TABLE "UserProgress" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "totalXP" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompletedSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    CONSTRAINT "CompletedSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProgress" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
