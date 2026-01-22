/*
  Warnings:

  - The primary key for the `Lead` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_pkey",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "sentiment" VARCHAR(20),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lead_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Lead_sentiment_idx" ON "Lead"("sentiment");
