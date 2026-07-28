-- CreateTable
CREATE TABLE "kanban_message_templates" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "kanban" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kanban_message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kanban_message_templates_company_id_kanban_key" ON "kanban_message_templates"("company_id", "kanban");

-- AddForeignKey
ALTER TABLE "kanban_message_templates" ADD CONSTRAINT "kanban_message_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
