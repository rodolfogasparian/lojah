-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('FINANCIAL', 'TECHNICAL', 'FAQ');

-- AlterTable
ALTER TABLE "support_tickets" ADD COLUMN     "category" "TicketCategory" NOT NULL DEFAULT 'TECHNICAL';
ALTER TABLE "support_tickets" ADD COLUMN     "reference" TEXT;

-- Backfill existing rows with a generated reference
UPDATE "support_tickets" SET "reference" = 'SUP-' || upper(substr(md5(random()::text || id), 1, 6)) WHERE "reference" IS NULL;

-- AlterTable
ALTER TABLE "support_tickets" ALTER COLUMN "reference" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_reference_key" ON "support_tickets"("reference");
