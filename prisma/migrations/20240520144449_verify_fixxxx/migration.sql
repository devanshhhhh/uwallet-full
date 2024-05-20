/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Verifications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Verifications_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Verifications_userId_key" ON "Verifications"("userId");
