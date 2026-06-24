# Lojah.app — Handoff Sessão 23/06/2026

> **Data:** 23 de Junho de 2026
> **Status:** Módulos 1-4 ✅ completos | Módulo 6 🔄 em andamento | Catálogo 100% completo ✅

---

## Resumo da sessão

Sessão completa cobrindo: fechamento do Módulo 4 (cupons, FAQ, materiais), início e avanço do Módulo 6 (Open Graph, redirect, favicon, polimento visual), e conclusão total do catálogo (273 descrições + 273 imagens de catálogo).

---

## 1. Estado dos módulos

| Módulo | Status | Observação |
|---|---|---|
| Módulo 1 — Fundação | ✅ Completo | Banco, auth, multitenancy |
| Módulo 2 — Página Pública | ✅ Completo | Catálogo, modal catálogo, carrinho |
| Módulo 3 — Painel Vendedor | ✅ Completo | Perfil, cartão, upload foto, /c, /r, /cartao |
| Módulo 4 — Painel Admin | ✅ Completo | Ver detalhes abaixo |
| Módulo 5 — Superadmin | ⏳ Pendente | Após lançamento Atlântica |
| Módulo 6 — Polimento | 🔄 Em andamento | Open Graph ✅, Redirect ✅, Favicon ✅, Mobile 🔜 |

---

## 2. Módulo 4 — Fechamento completo

### Migration aplicada
- `20260623101601_add_coupon_pack_assignment_and_faq`
  - `CouponPack` ganhou `assigned_to` (String?) e `assigned_at` (DateTime?)
  - Relação `CouponPackSeller` entre `CouponPack` e `SellerProfile`
  - `ContentType` enum ganhou valor `FAQ`

### Entrega A — Cupons do Vendedor
- `app/api/admin/cupons/atribuir/route.ts` — atribui pack a vendedor
- `app/api/admin/vendedores-lista/route.ts` — lista vendedores para select
- `components/admin/AssignCouponModal.tsx` — modal de atribuição
- `app/admin/cupons/page.tsx` — badge de atribuição + botão "Atribuir"
- `app/painel/cupons/page.tsx` — UI real com resumo + lista + copiar
- `components/seller/CouponPurchaseModal.tsx` — compra via PIX com QR Code

**Fluxo de compra (MVP PIX):**
- 1 cupom anual: R$ 67 (de R$ 197)
- 10 cupons anuais: R$ 370 (de R$ 1.970)
- PIX: `whapspro@gmail.com`
- Após pagamento → WhatsApp admin `45999463907` com mensagem formatada
- Admin atribui cupons manualmente no painel

### Entrega B — FAQ
- `app/api/admin/faq/route.ts` + `[id]/route.ts`
- `components/admin/FaqForm.tsx` — CRUD inline com sort_order
- `app/admin/faq/page.tsx` — página admin
- `components/seller/FaqAccordion.tsx` — accordion somente leitura
- `app/painel/faq/page.tsx` — página vendedor
- Links adicionados em `AdminNav.tsx` e `PainelNav.tsx`

### Entrega C — Materiais/Tutoriais
- `app/api/admin/materiais/route.ts` + `[id]/route.ts`
- `components/admin/MaterialForm.tsx` — CRUD com tipo Tutorial/Vídeo + URL + sort_order
- `app/admin/materiais/page.tsx` — página admin
- `components/seller/MaterialCard.tsx` — cards com botão "Acessar"
- `app/painel/materiais/page.tsx` — página vendedor
- Links adicionados em `AdminNav.tsx` e `PainelNav.tsx`
- Suporta: YouTube, Google Drive, PDF, PowerPoint, qualquer URL pública

---

## 3. Módulo 6 — Polimento (em andamento)

### Open Graph ✅
- `generateMetadata` adicionado em `app/(public)/[slug]/page.tsx`
- Título: "Catálogo Atlântica Natural | [Nome do Vendedor]"
- Imagem: foto do vendedor → fallback `products/logo-atlantica-fundo-preto.jpg`
- Bio: bio do vendedor → fallback "Sou Consultor da Atlântica Natural e estou aqui para te ajudar!"

### Redirect por role ✅
- `components/shared/login-form.tsx` atualizado
- `COMPANY_ADMIN` / `SUPERADMIN` → `/admin`
- `SELLER` → `/painel`

### Favicon ✅
- `app/icon.png` e `public/icon.png` → favicon personalizado Lojah
- URL: `products/favicon.png` no Supabase
- `app/favicon.ico` deletado

### Logos corrigidas ✅
- `app/login/page.tsx` → logo Lojah preta
- `app/cadastro/page.tsx` → logo Lojah preta

### Title global ✅
- `app/layout.tsx` → "Catálogo Online Atlântica Natural"

### Banner assinatura expirando ✅
- `app/painel/layout.tsx` — banner âmbar quando restam ≤ 10 dias

### Card destaque catálogo no painel ✅
- `app/painel/page.tsx` — card com imagem + 3 links (cliente, consultor 50% OFF, revenda)
- Imagem: `products/catalogo.jpg`

### QR Code PIX ✅
- `components/seller/CouponPurchaseModal.tsx` — QR Code gerado via `qrcode.react`

### Responsividade mobile 🔜
- Aguardando testes no celular

---

## 4. Catálogo — 100% completo ✅

### Descrições
- **273/273 produtos** com descrição
- Scripts utilizados: `update-descriptions.ts`, `update-descriptions-2.ts`, `update-descriptions-3.ts`, `update-descriptions-4.ts`
- Padrão: 2-3 frases curtas focadas nos benefícios

### Imagens de catálogo
- **273/273 produtos** com `catalog_page_file` vinculado
- Script: `update-catalogo-perfumes-e-outros.ts`
- Perfumes femininos → `perfumes-femininos-15ml.jpg`
- Perfumes masculinos → `perfumes-masculinos-15-ml.jpg` ⚠️ hífen antes do "ml"
- Demais produtos → páginas numeradas do guia (ex: `6.jpg`, `50.jpg`)

---

## 5. Infraestrutura

### Serviços
| Serviço | URL / ID | Conta |
|---|---|---|
| Supabase | `kpgbusvofvdonfpicjwt` | — |
| Cloudflare | `dash.cloudflare.com` | `rfogasparian@gmail.com` |
| GitHub | `rodolfogasparian/lojah` | `rodolfogasparian@gmail.com` |
| Vercel | `vercel.com/lojah/lojah` | `rodolfogasparian@gmail.com` |

### Buckets Supabase
| Bucket | Tipo | Conteúdo |
|---|---|---|
| `products` | Público | Fotos dos produtos (WebP) + logos + favicon |
| `catalog-pages` | Público | Páginas do guia (JPG 1-159 + genéricas perfumes) |
| `profile` | Público | Fotos de perfil dos vendedores |

### Credenciais de teste
| Role | Email | Senha | Slug |
|---|---|---|---|
| SUPERADMIN | `admin@lojah.app` | `admin123` | — |
| COMPANY_ADMIN | `rodolfogasparian@gmail.com` | `admin@2026` | — |
| SELLER | `renda10online@gmail.com` | `senha123` | `mentoriar` |

### URLs de produção
