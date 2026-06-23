-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'FAQ';

-- AlterTable
ALTER TABLE "coupon_packs" ADD COLUMN     "assigned_at" TIMESTAMP(3),
ADD COLUMN     "assigned_to" TEXT;

-- AddForeignKey
ALTER TABLE "coupon_packs" ADD CONSTRAINT "coupon_packs_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "seller_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
