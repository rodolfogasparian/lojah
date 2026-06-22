-- AddForeignKey
ALTER TABLE "impersonation_tokens" ADD CONSTRAINT "impersonation_tokens_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
