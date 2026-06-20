-- AlterTable
ALTER TABLE "products" ADD COLUMN     "catalog_image_url" TEXT;

-- AlterTable
ALTER TABLE "seller_profiles" ADD COLUMN     "signup_button_text" TEXT DEFAULT 'Fazer cadastro',
ADD COLUMN     "signup_button_url" TEXT DEFAULT 'https://cadastro.atlanticanatural.com.br/codigos';
