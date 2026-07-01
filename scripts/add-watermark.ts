import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import sharp from "sharp";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKET = "products";
const WATERMARK_TEXT = "lojah.app";
const FONT_SIZE = 20;
const PADDING = 6;
const MARGIN = 12;

async function buildWatermarkSvg(text: string): Promise<Buffer> {
  const charWidth = FONT_SIZE * 0.55;
  const textWidth = Math.ceil(text.length * charWidth);
  const textHeight = FONT_SIZE;
  const bgWidth = textWidth + PADDING * 2;
  const bgHeight = textHeight + PADDING * 2;

  const svg = `
    <svg width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${bgWidth}" height="${bgHeight}" rx="3" ry="3"
        fill="rgba(0,0,0,0.5)" />
      <text
        x="${bgWidth / 2}"
        y="${textHeight + PADDING - 2}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${FONT_SIZE}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
      >${text}</text>
    </svg>
  `.trim();

  return Buffer.from(svg);
}

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "webp") return "image/webp";
  if (ext === "png") return "image/png";
  return "image/jpeg";
}

async function applyWatermark(imageBuffer: Buffer, filename: string): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { width = 0, height = 0 } = await image.metadata();

  const watermarkSvg = await buildWatermarkSvg(WATERMARK_TEXT);
  const watermarkMeta = await sharp(watermarkSvg).metadata();
  const wWidth = watermarkMeta.width ?? 100;
  const wHeight = watermarkMeta.height ?? 30;

  const left = Math.max(0, width - wWidth - MARGIN);
  const top = Math.max(0, height - wHeight - MARGIN);

  const composited = image.composite([
    {
      input: watermarkSvg,
      left,
      top,
    },
  ]);

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "webp") return composited.webp().toBuffer();
  if (ext === "png") return composited.png().toBuffer();
  return composited.jpeg({ quality: 90 }).toBuffer();
}

async function main() {
  console.log(`🖼️  Listando arquivos do bucket "${BUCKET}"...`);

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 });

  if (listError) {
    throw new Error(`Erro ao listar bucket: ${listError.message}`);
  }

  if (!files || files.length === 0) {
    console.log("ℹ️  Nenhum arquivo encontrado no bucket.");
    return;
  }

  const imageExtensions = ["jpg", "jpeg", "png", "webp"];
  const imageFiles = files.filter((f) => {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    return imageExtensions.includes(ext);
  });

  const total = imageFiles.length;
  console.log(`📋 ${total} imagem(ns) encontrada(s). Iniciando processamento...\n`);

  let processados = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const nome = file.name;
    console.log(`Processando ${i + 1}/${total}: ${nome}...`);

    const { data: blob, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(nome);

    if (downloadError || !blob) {
      console.warn(`  ⚠️  Falha ao baixar "${nome}": ${downloadError?.message ?? "sem conteúdo"}`);
      continue;
    }

    const inputBuffer = Buffer.from(await blob.arrayBuffer());

    let outputBuffer: Buffer;
    try {
      outputBuffer = await applyWatermark(inputBuffer, nome);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠️  Falha ao processar "${nome}": ${msg}`);
      continue;
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(nome, outputBuffer, {
        contentType: getMimeType(nome),
        upsert: true,
      });

    if (uploadError) {
      console.warn(`  ⚠️  Falha ao fazer upload de "${nome}": ${uploadError.message}`);
      continue;
    }

    processados++;
  }

  console.log(`\n✅ ${processados} arquivo(s) processado(s) com marca d'água`);
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
