/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Verifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verifications_id_key" ON "Verifications"("id");
