-- CreateEnum
CREATE TYPE "CouponRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "PackType" ADD VALUE 'MONTHLY';

-- CreateTable
CREATE TABLE "coupon_requests" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "pack_type" "PackType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 10,
    "status" "CouponRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,

    CONSTRAINT "coupon_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coupon_requests" ADD CONSTRAINT "coupon_requests_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_requests" ADD CONSTRAINT "coupon_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
