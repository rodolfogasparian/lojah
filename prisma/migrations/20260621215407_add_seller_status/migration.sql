-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "seller_profiles" ADD COLUMN     "status" "SellerStatus" NOT NULL DEFAULT 'PENDING';
