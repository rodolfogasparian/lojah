# Lojah.app — Handoff Sessão 23/06/2026

> **Data:** 23 de Junho de 2026
> **Status:** Módulo 4 ✅ completo | Módulo 6 🔄 em andamento

---

## Resumo da sessão

Sessão de implementação: fechamento completo do Módulo 4 (cupons do vendedor,
FAQ, materiais/tutoriais) e início do Módulo 6 (Open Graph, redirect por role).

---

## 1. Estado dos módulos

| Módulo | Status | Observação |
|---|---|---|
| Módulo 1 — Fundação | ✅ Completo | Banco, auth, multitenancy |
| Módulo 2 — Página Pública | ✅ Completo | Catálogo, modal catálogo, carrinho |
| Módulo 3 — Painel Vendedor | ✅ Completo | Perfil, cartão, upload foto, /c, /r, /cartao |
| Módulo 4 — Painel Admin | ✅ Completo | Ver detalhes abaixo |
| Módulo 5 — Superadmin | ⏳ Pendente | Após lançamento Atlântica |
| Módulo 6 — Polimento | 🔄 67% | Open Graph ✅, Redirect ✅, Mobile 🔜 |

---

## 2. Módulo 4 — O que foi implementado nesta sessão

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
- `components/seller/CouponPurchaseModal.tsx` — compra via PIX

**Fluxo de compra de cupons (MVP):**
- Vendedor escolhe pack (1 anual R$67 ou 10 anuais R$370)
- Exibe chave PIX: `whapspro@gmail.com`
- Vendedor paga e clica "Já paguei"
- Abre WhatsApp admin (`45999463907`) com mensagem formatada
- Admin atribui cupons manualmente no painel

### Entrega B — FAQ
- `app/api/admin/faq/route.ts` + `app/api/admin/faq/[id]/route.ts`
- `components/admin/FaqForm.tsx` — CRUD inline com sort_order
- `app/admin/faq/page.tsx` — página admin
- `components/seller/FaqAccordion.tsx` — accordion somente leitura
- `app/painel/faq/page.tsx` — página vendedor
- Links adicionados em `AdminNav.tsx` e `PainelNav.tsx`

### Entrega C — Materiais/Tutoriais
- `app/api/admin/materiais/route.ts` + `app/api/admin/materiais/[id]/route.ts`
- `components/admin/MaterialForm.tsx` — CRUD com tipo Tutorial/Vídeo + URL + sort_order
- `app/admin/materiais/page.tsx` — página admin
- `components/seller/MaterialCard.tsx` — cards com botão "Acessar"
- `app/painel/materiais/page.tsx` — página vendedor
- Links adicionados em `AdminNav.tsx` e `PainelNav.tsx`
- Suporta: YouTube, Google Drive, PDF, PowerPoint, qualquer URL pública

---

## 3. Módulo 6 — O que foi implementado nesta sessão

### Open Graph ✅
- `generateMetadata` adicionado em `app/(public)/[slug]/page.tsx`
- Título: "Catálogo Atlântica Natural | [Nome do Vendedor]"
- Imagem: foto do vendedor → fallback logo Atlântica
  (`products/logo-atlantica-fundo-preto.jpg`)
- Bio: bio do vendedor → fallback "Sou Consultor da Atlântica Natural e estou aqui para te ajudar!"
- Compatível com WhatsApp, Telegram, Facebook, Twitter

### Redirect por role ✅
- `components/shared/login-form.tsx` atualizado
- Após login: busca sessão em `/api/auth/session`
- `COMPANY_ADMIN` ou `SUPERADMIN` → `/admin`
- `SELLER` → `/painel`

### Responsividade mobile 🔜
- Aguardando testes no celular para identificar problemas reais
- Próxima ação: Gaspar testa e reporta o que está ruim

---

## 4. Pendências para próxima sessão

### Módulo 6 — Responsividade mobile
- [ ] Gaspar testa no celular e reporta problemas
- [ ] Revisão das telas com problemas identificados

### Catálogo (herdado)
- [ ] 71 produtos sem imagem de catálogo (`produtos-sem-imagem-catalogo.txt`)
- [ ] ~140 produtos sem descrição
- [ ] 21 perfumes Bortoletto 15ml sem classificação M/F
- [ ] Perfumes 100ml — aguardando classificação M/F

### Módulo 5 — Superadmin (pós-lançamento Atlântica)
- [ ] Listar/criar empresas
- [ ] Criar company_admin
- [ ] Métricas gerais

---

## 5. Infraestrutura (sem mudanças)

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
| `products` | Público | Fotos dos produtos (WebP) + logos |
| `catalog-pages` | Público | Páginas do guia (JPG 1-159 + genéricas) |
| `profile` | Público | Fotos de perfil dos vendedores |

### Credenciais de teste
| Role | Email | Senha | Slug |
|---|---|---|---|
| SUPERADMIN | `admin@lojah.app` | `admin123` | — |
| COMPANY_ADMIN | `rodolfogasparian@gmail.com` | `admin@2026` | — |
| SELLER | `renda10online@gmail.com` | `senha123` | `mentoriar` |

### URLs de produção
