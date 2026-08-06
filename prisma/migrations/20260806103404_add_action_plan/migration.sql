-- CreateEnum
CREATE TYPE "ActionPlanStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "ActionItemCategory" AS ENUM ('VENDA', 'CONTATO', 'APRESENTACAO', 'ACOMPANHAMENTO', 'POS_VENDA', 'TREINAMENTO', 'ESTUDO', 'POSTAGEM_REDES', 'RECRUTAMENTO', 'REUNIAO', 'ORGANIZACAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ActionItemStatus" AS ENUM ('PENDENTE', 'REALIZADO', 'PARCIAL', 'NAO_REALIZADO');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateTable
CREATE TABLE "action_plans" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "week_start" DATE NOT NULL,
    "week_end" DATE NOT NULL,
    "month_reference" TEXT NOT NULL,
    "status" "ActionPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_plan_items" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "category" "ActionItemCategory" NOT NULL DEFAULT 'OUTRO',
    "action_text" TEXT NOT NULL,
    "desired_result" TEXT,
    "actual_result" TEXT,
    "status" "ActionItemStatus" NOT NULL DEFAULT 'PENDENTE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_plan_goals" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "target_value" TEXT NOT NULL,
    "actual_value" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_plan_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorships" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_plan_share_links" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_plan_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "action_plans_seller_id_week_start_key" ON "action_plans"("seller_id", "week_start");

-- CreateIndex
CREATE UNIQUE INDEX "mentorships_mentor_id_mentee_id_key" ON "mentorships"("mentor_id", "mentee_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_plan_share_links_token_key" ON "action_plan_share_links"("token");

-- AddForeignKey
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_plan_items" ADD CONSTRAINT "action_plan_items_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "action_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_plan_goals" ADD CONSTRAINT "action_plan_goals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "action_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_plan_share_links" ADD CONSTRAINT "action_plan_share_links_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "action_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
