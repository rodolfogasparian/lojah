# Lojah.app — Handoff Sessão 25/06/2026

> **Data:** 25 de Junho de 2026
> **Status:** Módulo 4 completo ✅ | Landing lojah.app ✅ | Superadmin login parcialmente corrigido ⚠️

---

## Resumo da sessão

Sessão completa cobrindo: configuração Resend, emails pós-compra Hotmart, sistema de cupons promocionais, página catálogo inativo, materiais com vídeo modal, correção login superadmin (gambiarra temporária), landing page lojah.app, padronização visual página Atlântica.

---

## 1. Estado dos módulos

| Módulo | Status | Observação |
|---|---|---|
| Módulo 1 — Fundação | ✅ Completo | Banco, auth, multitenancy |
| Módulo 2 — Página Pública | ✅ Completo | Catálogo, modal catálogo, carrinho |
| Módulo 3 — Painel Vendedor | ✅ Completo | Perfil, cartão, upload foto, /c, /r, /cartao |
| Módulo 4 — Painel Admin | ✅ Completo | Cupons, FAQ, materiais, solicitações |
| Módulo 5 — Superadmin | ⏳ Pendente | Rota /master não implementada |
| Módulo 6 — Polimento | 🔄 Parcial | Responsividade mobile pendente |

---

## 2. Resend — Emails configurados

- Conta Resend nova: rodolfogasparian@gmail.com
- Domínio lojah.app verificado (região São Paulo sa-east-1)
- DNS no Cloudflare: DKIM, SPF (MX + TXT), DMARC
- RESEND_API_KEY salva no Vercel e no .env local
- Remetente: noreply@lojah.app

### Arquivos criados
- lib/email.ts — helper sendEmail({ to, subject, html })
- lib/email-templates/boas-vindas.ts — email boas-vindas ao comprador
- lib/email-templates/nova-compra.ts — aviso de nova compra para admin
- app/api/webhooks/hotmart/route.ts — MODIFICADO: dispara 2 emails pós-compra

### Emails disparados
- Compra nova → comprador recebe boas-vindas com login + link /painel
- Toda compra → admin@rodolfogasparian@gmail.com recebe aviso
- Falha no email NÃO quebra webhook (try/catch separados, sempre retorna 200)

---

## 3. Sistema de Cupons Promocionais

### Tabela de preços
| Produto | Duração | Preço | Quem acessa |
|---|---|---|---|
| Catálogo anual | 1 ano | R$67 | Vendedor (Hotmart ou PIX) |
| Pack anual (10 cupons) | 1 ano cada | R$370 | Vendedor (PIX) |
| Pack 7 dias (10 cupons) | 7 dias cada | R$10 | Vendedor (PIX) |
| Pack 30 dias (10 cupons) | 30 dias cada | R$40 | Todos os admins |

### Migration aplicada
- add-coupon-request: model CouponRequest + enum CouponRequestStatus + MONTHLY no PackType

### Fluxo vendedor solicita cupons
1. Vendedor clica "Solicitar pack" → modal PIX abre
2. QR Code PIX real (padrão EMV/BR Code CRC16-CCITT) + chave whapspro@gmail.com
3. Vendedor paga → clica "Já paguei — Avisar no WhatsApp"
4. Sistema cria CouponRequest (PENDING) no banco
5. WhatsApp admin abre com mensagem pré-formatada
6. Admin vê em /admin/cupons → clica "Aprovar"
7. Sistema gera cupons automaticamente e atribui ao vendedor

### Arquivos criados
- lib/pix.ts — gerarPayloadPix() com payload EMV real
- components/seller/ModalSolicitarPack.tsx — modal PIX + QR Code
- app/painel/cupons/actions.ts — solicitarPack(tipo)
- app/painel/cupons/page.tsx — página real de cupons do vendedor
- app/admin/cupons/actions.ts — aprovarSolicitacao(requestId)
- components/admin/AprovarSolicitacaoButton.tsx
- Badges: ANNUAL=verde, PROMOTIONAL=laranja, MONTHLY=azul

---

## 4. Página Catálogo Inativo

- Se status=SUSPENDED ou sem assinatura ativa → renderiza CatalogoInativo
- Botão "Falar com [Nome]" → WhatsApp do vendedor
- Botão "Renovar meu catálogo" → só aparece se isOwner===true (ainda sem modal real)
- Arquivos: components/catalog/CatalogoInativo.tsx + app/(public)/[slug]/page.tsx modificado

---

## 5. Materiais e Tutoriais

### Admin (/admin/materiais)
- CRUD completo (criar/editar/excluir)
- Tipos: Tutorial, Vídeo, Documento
- Ícone clicável abre URL em nova aba

### Vendedor (/painel/materiais)
- VIDEO → abre VideoModal com player YouTube embutido (botão X 44px)
- TUTORIAL → abre URL em nova aba
- Texto com whiteSpace: pre-wrap (respeita quebras de linha)
- Arquivos: components/seller/VideoModal.tsx + components/seller/MaterialCard.tsx

---

## 6. Correção Login Superadmin ⚠️ GAMBIARRA — REVERTER NO MÓDULO 5

### Problema
- 8 arquivos em /admin tinham: if (!session?.user?.companyId) redirect("/login")
- SUPERADMIN tem companyId=null → era bloqueado em todas as páginas

### Solução temporária aplicada (GAMBIARRA)
- Guard modificado: if (!session?.user?.companyId && session?.user?.role !== "SUPERADMIN")
- const companyId = session.user.companyId ?? "none" adicionado em todos os arquivos

### Arquivos com gambiarra (REVERTER no Módulo 5)
- app/admin/page.tsx
- app/admin/vendedores/page.tsx
- app/admin/vendedores/[id]/page.tsx
- app/admin/cupons/page.tsx
- app/admin/cupons/novo/page.tsx
- app/admin/materiais/page.tsx
- app/admin/faq/page.tsx
- app/admin/suporte/page.tsx
- app/admin/cupons/actions.ts

### Badge de role no header
- SUPERADMIN → badge roxo "Super Admin"
- COMPANY_ADMIN → badge verde "Admin"
- Arquivo: components/admin/AdminNav.tsx

### Senha superadmin atualizada
- Email: admin@lojah.app
- Senha: admin1a2s3d4!
- Script reset: scripts/reset-superadmin.ts

---

## 7. Landing Page lojah.app

### URLs
- lojah.app → landing (não logado) ou redirect por role (logado)
- SUPERADMIN → /master | COMPANY_ADMIN → /admin | SELLER → /painel

### Conteúdo
- Seções: Nav, Hero, TrustStrip, Features, HowItWorks, Demo, ForWhom, Pricing, FAQ, Footer
- Hero: hero-mockup.png do Supabase
- Logo: logo-loja-preto.png do Supabase
- Menu "Entrar" dropdown → Atlântica Natural → atlantica.lojah.app/login
- Botões → WhatsApp 45999463907

### Preços
| Plano | Mês | Ano |
|---|---|---|
| Individual | R$16,42/mês | R$197/ano |
| Equipe | R$82/mês | R$985/ano |

- Nota: "Valores referentes ao setup inicial da Atlântica Natural..."

### Arquivos
- components/landing/LandingPage.tsx — componente principal (use client)
- app/(public)/page.tsx — wrapper
- app/page.tsx — redirect por role ou renderiza LandingPage

---

## 8. Padronização Visual — Página Atlântica

URL: atlantica.lojah.app/atlantica

### Mudanças visuais
- Cores: verde escuro #166534, branco, cinza claro (igual lojah.app)
- Fundos coloridos (#f5f0e8, #cfee9a) removidos
- Cards: rounded-3xl border border-gray-200 shadow-sm
- Botões: rounded-full
- Ícones benefícios: bg-green-50 text-[#166534] (todos padronizados)

### Features adicionadas nos cards de preço
Individual (R$67/ano): 1 catálogo exclusivo, Link personalizado, Painel do consultor, Produtos ilimitados, Suporte via WhatsApp

Pack Equipe (R$370/ano): 10 vouchers para sua equipe, Cada consultor com link exclusivo, Painel administrativo completo, Gestão de cupons e ativações, A diferença do preço de venda é seu lucro, Suporte prioritário

---

## 9. Pendências para próxima sessão

### 🔴 CRÍTICO — Fazer primeiro
- [ ] Módulo 5 Superadmin — criar /master e REVERTER gambiarras do /admin
  - app/master/layout.tsx — proteção SUPERADMIN only
  - app/master/page.tsx — dashboard geral (todas as empresas)
  - app/master/empresas/page.tsx — listar empresas
  - app/master/empresas/nova/page.tsx — criar empresa + company_admin
  - components/master/MasterNav.tsx
  - Reverter TODOS os ?? "none" e guards modificados nos 9 arquivos do /admin
  - Redirecionar SUPERADMIN para /master no login-form.tsx

### 🟡 Importante
- [ ] Modal de renovação no catálogo inativo (cupom + PIX R$67)
- [ ] Filtros na lista de vendedores (/admin/vendedores) — nome, usuário, status
- [ ] Etiqueta tipo de cupom na lista de vendedores
- [ ] Cadastrar 3 materiais da Atlântica no admin:
  * Revista Atlântica 2025: https://drive.google.com/file/d/1rSb9xbsy6-tKvbZ35ECPUUOWzfx64MrE/view
  * Tabela de Preços: https://drive.google.com/file/d/1NL4DE6ZgdxkcHy12V-uwdIw1u9epfZ9k/view
  * Guia de Produtos: https://drive.google.com/file/d/1CGpOqBndGqIYmjE7XWrUMQhpn4C9NOCm/view

### 🟢 Backlog
- [ ] Responsividade mobile revisada
- [ ] Remover log de debug do authorize em lib/auth.ts
- [ ] Email de confirmação quando vendedor ativa cupom

---

## 10. Infraestrutura

### Serviços
| Serviço | URL / ID | Conta |
|---|---|---|
| Supabase | kpgbusvofvdonfpicjwt | — |
| Cloudflare | dash.cloudflare.com | rfogasparian@gmail.com |
| GitHub | rodolfogasparian/lojah | rodolfogasparian@gmail.com |
| Vercel | vercel.com/lojah/lojah | rodolfogasparian@gmail.com |
| Resend | resend.com | rodolfogasparian@gmail.com (conta nova) |
| Hotmart | Product ID 8000147 | — |

### Buckets Supabase
| Bucket | Tipo | Conteúdo |
|---|---|---|
| products | Público | Fotos produtos + hero-mockup.png + logo-loja-preto.png |
| catalog-pages | Público | Páginas guia JPG 1-159 + genéricas |
| profile | Público | Fotos perfil vendedores |

### Credenciais de teste
| Role | Email | Senha | Acesso |
|---|---|---|---|
| SUPERADMIN | admin@lojah.app | admin1a2s3d4! | /admin (temporário, gambiarra) |
| COMPANY_ADMIN | rodolfogasparian@gmail.com | admin@2026 | /admin Atlântica |
| SELLER | renda10online@gmail.com | senha123 | /painel (slug: br) |

### URLs de produção
- https://lojah.app → Landing page
- https://atlantica.lojah.app/atlantica → Página de vendas Atlântica
- https://atlantica.lojah.app/br → Catálogo cliente
- https://atlantica.lojah.app/painel → Painel do vendedor
- https://atlantica.lojah.app/admin → Painel admin
- https://atlantica.lojah.app/login → Login

---

## 11. Regras críticas do projeto

- catalog_page_file ≠ catalog_image_url — nunca misturar
- Bucket de perfil: profile (singular, não profiles)
- Cupom só funciona logado como vendedor, não como admin
- Layouts Next.js não recebem searchParams — usar cookies
- perfumes-masculinos-15-ml.jpg tem hífen antes do "ml"
- Client Components não podem importar Server Components
- Params em rotas dinâmicas: sempre Promise<{ id: string }> com await params
- Scripts standalone: precisam de @prisma/adapter-pg + dotenv/config
- DATABASE_URL: sempre pooler porta 6543 + ?pgbouncer=true
- PowerShell não suporta && (exceto no package.json)
- Slug deve ser chamado "usuário" em toda interface do vendedor
- Chave PIX: whapspro@gmail.com
- WhatsApp admin: 45999463907
- SUPERADMIN login: admin@lojah.app / admin1a2s3d4!

---

*Documento gerado em 25/06/2026. Próxima sessão: Módulo 5 Superadmin (PRIORIDADE) + reverter gambiarras.*
