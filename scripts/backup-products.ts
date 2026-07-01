import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const SOURCE_BUCKET = "products";
const DEST_BUCKET = "products-backup";

async function main() {
  console.log(`📦 Listando arquivos do bucket "${SOURCE_BUCKET}"...`);

  const { data: files, error: listError } = await supabase.storage
    .from(SOURCE_BUCKET)
    .list("", { limit: 1000 });

  if (listError) {
    throw new Error(`Erro ao listar bucket: ${listError.message}`);
  }

  if (!files || files.length === 0) {
    console.log("ℹ️  Nenhum arquivo encontrado no bucket.");
    return;
  }

  const total = files.length;
  console.log(`📋 ${total} arquivo(s) encontrado(s). Iniciando cópia...\n`);

  let copiados = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const nome = file.name;
    console.log(`Copiando ${i + 1}/${total}: ${nome}...`);

    const { data: blob, error: downloadError } = await supabase.storage
      .from(SOURCE_BUCKET)
      .download(nome);

    if (downloadError || !blob) {
      console.warn(`  ⚠️  Falha ao baixar "${nome}": ${downloadError?.message ?? "sem conteúdo"}`);
      continue;
    }

    const buffer = Buffer.from(await blob.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(DEST_BUCKET)
      .upload(nome, buffer, {
        contentType: blob.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`  ⚠️  Falha ao fazer upload de "${nome}": ${uploadError.message}`);
      continue;
    }

    copiados++;
  }

  console.log(`\n✅ ${copiados} arquivo(s) copiado(s) para ${DEST_BUCKET}`);
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
