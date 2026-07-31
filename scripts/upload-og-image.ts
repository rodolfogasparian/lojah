import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const SUPABASE_URL = "https://kpgbusvofvdonfpicjwt.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ2J1c3ZvZnZkb25mcGljand0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgzNzQ3OCwiZXhwIjoyMDk3NDEzNDc4fQ.net9w06eoFq_qQH-985Flf5jk1Iw6ueDCADI31BRFyo";

const BUCKET = "imagens";
// ← atualize este caminho quando tiver o arquivo
const LOCAL_PATH = "C:\\NOVO DISCO\\LOJAH\\ATLANTICA\\share-plano-renda-inteligente.png";
const STORAGE_NAME = "share-plano-renda-inteligente.png";

async function main() {
  if (!fs.existsSync(LOCAL_PATH)) {
    console.error(`✗ Arquivo não encontrado: ${LOCAL_PATH}`);
    console.error(`  Atualize LOCAL_PATH neste script com o caminho correto.`);
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Criar bucket "imagens" se não existir
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) { console.error("Erro ao criar bucket:", error.message); process.exit(1); }
    console.log(`✓ Bucket "${BUCKET}" criado`);
  } else {
    console.log(`✓ Bucket "${BUCKET}" já existe`);
  }

  const buffer = fs.readFileSync(LOCAL_PATH);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`Subindo ${STORAGE_NAME} (${sizeKB} KB)...`);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(STORAGE_NAME, buffer, { contentType: "image/png", upsert: true });

  if (error) { console.error(`✗ Erro: ${error.message}`); process.exit(1); }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(STORAGE_NAME);
  console.log(`✓ Upload concluído`);
  console.log(`  URL: ${data.publicUrl}`);
}

main().catch(console.error);
