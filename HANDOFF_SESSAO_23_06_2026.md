# Lojah.app — Handoff Sessão 23/06/2026

> **Data:** 23 de Junho de 2026  
> **Status:** Módulos 1-4 ✅ completos | Módulo 6 ✅ completo | Catálogo 100% ✅ | Webhook Hotmart ✅

---

## Resumo da sessão

Sessão completa: fechamento do Módulo 4, Módulo 6 (polimento), catálogo 100% completo, página de vendas, webhook Hotmart automatizado.

---

## 1. Estado dos módulos

| Módulo | Status | Observação |
|---|---|---|
| Módulo 1 — Fundação | ✅ Completo | Banco, auth, multitenancy |
| Módulo 2 — Página Pública | ✅ Completo | Catálogo, modal catálogo, carrinho |
| Módulo 3 — Painel Vendedor | ✅ Completo | Perfil, cartão, upload foto, /c, /r, /cartao |
| Módulo 4 — Painel Admin | ✅ Completo | Cupons, FAQ, Materiais, Suporte, Impersonation |
| Módulo 5 — Superadmin | ⏳ Pendente | Após lançamento Atlântica |
| Módulo 6 — Polimento | ✅ Completo | Open Graph, Redirect, Favicon, Mobile pendente |

---

## 2. Módulo 4 — Fechamento completo

### Entrega A — Cupons do Vendedor
- Atribuição de packs pelo admin (`AssignCouponModal`)
- Visualização de cupons no painel do vendedor
- Modal de compra via PIX com QR Code
- Preços: 1 cupom R$67 | 10 cupons R$370
- PIX: `whapspro@gmail.com` | WhatsApp: `45999463907`

### Entrega B — FAQ
- Admin cadastra perguntas/respostas com sort_order
- Vendedor consulta via accordion
- Rotas: `/admin/faq` e `/painel/faq`

### Entrega C — Materiais/Tutoriais
- Admin cadastra com título + URL + tipo (Tutorial/Vídeo)
- Suporta YouTube, Google Drive, PDF, PowerPoint
- Rotas: `/admin/materiais` e `/painel/materiais`

---

## 3. Módulo 6 — Polimento completo

| Item | Status | Detalhe |
|---|---|---|
| Open Graph | ✅ | Preview WhatsApp com foto/bio do vendedor |
| Redirect por role | ✅ | Admin → `/admin`, Vendedor → `/painel` |
| Favicon | ✅ | `products/favicon.png` |
| Logo preta login/cadastro | ✅ | `logo-loja-preto.png` |
| Title global | ✅ | "Catálogo Online Atlântica Natural" |
| Banner assinatura expirando | ✅ | Aparece 10 dias antes |
| Card destaque catálogo painel | ✅ | Imagem + 3 links |
| QR Code PIX | ✅ | `qrcode.react` no modal de compra |
| Responsividade mobile | 🔜 | Aguarda testes no celular |

---

## 4. Catálogo — 100% completo

| Item | Status |
|---|---|
| Descrições | ✅ 273/273 produtos |
| Imagens de catálogo | ✅ 273/273 produtos |

### Scripts de catálogo criados
- `scripts/update-descriptions-3.ts` — perfumes Bortoletto (22)
- `scripts/update-descriptions-4.ts` — 118 produtos restantes
- `scripts/list-sem-descricao.ts` — lista produtos sem descrição
- `scripts/list-sem-catalogo.ts` — lista produtos sem imagem
- `scripts/update-catalogo-perfumes-e-outros.ts` — 110 produtos vinculados

### Regra perfumes
- Femininos → `perfumes-femininos-15ml.jpg`
- Masculinos → `perfumes-masculinos-15-ml.jpg` ⚠️ hífen antes do "ml"

---

## 5. Página de Vendas — atlantica.lojah.app/atlantica

### Arquivo
- `app/(public)/atlantica/page.tsx`

### Seções
1. Hero com imagem `catalogo-3.png` + 2 botões verdes
2. Demo ao vivo → abre `atlantica.lojah.app/br`
3. Vídeo YouTube embed `https://youtu.be/kCkbqfeU6zo`
4. Benefícios (6 cards bege)
5. Como funciona (3 passos fundo verde)
6. Planos e preços:
   - Individual: R$67/ano → `pay.hotmart.com/M106478390Y`
   - Pack 10: R$370 → `pay.hotmart.com/M106478390Y?off=o2ppbpn2`
7. CTA final com WhatsApp

### Rodapé público
- `app/(public)/layout.tsx` — rodapé em todas as páginas públicas
- Texto: "Desenvolvido por Sistema Inteligente • Solicite o Seu Catálogo"
- Link: `atlantica.lojah.app/atlantica`

---

## 6. Webhook Hotmart — Automação completa ✅

### Endpoint
`POST https://atlantica.lojah.app/api/webhooks/hotmart`

### Arquivo
`app/api/webhooks/hotmart/route.ts`

### Fluxo automático
1. Hotmart envia POST ao aprovar compra
2. Valida `x-hotmart-hottok`
3. Cria usuário + perfil + assinatura 1 ano automaticamente
4. Gera cupons `ATLA-XXXX-XXXX` e atribui ao vendedor
5. Retorna `{ ok: true, email, cupons }`

### Configuração Hotmart
- Produto: Catálogo Online Atlântica Natural (ID: 8000147)
- Evento: Compra aprovada
- URL: `https://atlantica.lojah.app/api/webhooks/hotmart`
- Versão: 2.0.0
- Status: ✅ Testado e funcionando (200 - Processado)

### Variável de ambiente
- `HOTMART_HOTTOK` configurado no Vercel (Production)

### Ofertas Hotmart
| Oferta | Offer Code | Cupons gerados |
|---|---|---|
| Individual R$67 | — (sem código) | 1 cupom anual |
| Pack 10 R$370 | `o2ppbpn2` | 10 cupons anuais |

---

## 7. Infraestrutura

### Serviços
| Serviço | URL / ID | Conta |
|---|---|---|
| Supabase | `kpgbusvofvdonfpicjwt` | — |
| Cloudflare | `dash.cloudflare.com` | `rfogasparian@gmail.com` |
| GitHub | `rodolfogasparian/lojah` | `rodolfogasparian@gmail.com` |
| Vercel | `vercel.com/lojah/lojah` | `rodolfogasparian@gmail.com` |
| Hotmart | `app.hotmart.com` | Produto ID: 8000147 |

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
| SELLER | `renda10online@gmail.com` | `senha123` | `br` |

### URLs de produção
