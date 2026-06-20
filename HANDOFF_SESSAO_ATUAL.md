# Handoff — Sessão Atual

**Data:** 2026-06-20
**Projeto:** lojah-app (Atlântica Natural)

## Status atual

- Catálogo público funcionando em `localhost:3000/mentoriar` ✅
- 273 produtos com imagens e preços reais ✅
- Design: fundo verde `#cfee9a`, cards brancos, fonte Nunito ✅
- Header com 3 abas: Vitrine, Cartão Virtual, Compartilhar ✅
- Busca + filtro por categoria + pills de acesso rápido ✅
- Carrinho com envio via WhatsApp ✅
- Deploy no Vercel: `atlantica.lojah.app` funcionando para rota `/` ✅
- **PROBLEMA EM ABERTO:** `atlantica.lojah.app/mentoriar` dá erro 500

## Resumo do que foi feito nesta sessão

### 1. Catálogo de produtos implementado (design Lovable)
A página pública do vendedor (`app/(public)/[slug]/page.tsx`) ganhou uma seção de catálogo de produtos, com carrinho, busca, filtro de categoria e checkout via WhatsApp. O visual foi adaptado a partir de componentes gerados no Lovable, ajustando os tipos para o schema real do Prisma (o Lovable assumia campos como `price` e `size` que não existem no banco — usamos `price_client`).

### 2. Migrations criadas
- **`0_init`**: baseline representando o schema que já existia em produção (Supabase), recriado em UTF-8 sem BOM (o `migration.sql` original tinha sido salvo errado pelo PowerShell, em UTF-16).
- **`add_catalog_fields`**: adiciona `signup_button_text`/`signup_button_url` em `SellerProfile` e `catalog_image_url` em `Product`.

### 3. Componentes criados
- `components/catalog/ProductCard.tsx` — card de produto (imagem, nome, preço, botão WhatsApp, carrinho, link de cadastro)
- `components/catalog/CartBar.tsx` — barra fixa de carrinho com total e botão "Enviar pedido"
- `components/catalog/CategoryFilter.tsx` — filtro de categorias por chips horizontais (criado nesta sessão, mas **substituído depois** por um `<select>` inline dentro do `CatalogSection.tsx` — o arquivo ainda existe no projeto, mas não é mais importado por nada; decisão de manter ou apagar ficou em aberto)
- `components/catalog/CatalogSection.tsx` — orquestra busca, filtro de categoria (dropdown), pills de acesso rápido, grid de produtos e carrinho
- `components/seller/SellerTabs.tsx` — Client Component novo: cabeçalho fixo (`sticky top-0`) com avatar, nome do vendedor, "Consultor(a) {empresa}" e as 3 abas (Vitrine / Cartão Virtual / Compartilhar)
- `hooks/useCart.ts` — estado do carrinho (adicionar/remover/total/enviar pedido)
- `lib/format.ts` — função `brl()` (reaproveita `formatCurrency` de `lib/utils.ts`, não duplica a lógica)

### 4. Seed expandido (54 → 273 produtos)
`prisma/seed.ts` foi reescrito com a lista completa de produtos da Atlântica Natural, com preços reais (`price_consultant`/`price_client`) e `image_url` vinculada aos arquivos do bucket `products` no Supabase Storage. Resultado após rodar o seed: **273 produtos, 272 com imagem, 1 sem imagem** (Colágeno Anti Age). 14 categorias no total, incluindo as novas `Cabelos` e `Linha Casa Ozônio`.

### 5. Identidade visual aplicada
- `app/globals.css` — variáveis `--primary`, `--secondary` e `--accent` (modo claro) substituídas pela paleta verde/dourada da marca; `--background` alterado para `#cfee9a`. Como são variáveis globais do tema, isso afeta o site inteiro (login, cadastro, dashboard), não só a página pública.
- **Fonte Nunito**: aplicada via `next/font/google` em `app/layout.tsx` (não via `@import` no CSS — essa abordagem foi tentada primeiro e não funcionou porque o Next.js sobrepõe `@import` de fonte com seu próprio sistema de otimização de fontes).

### 6. Reformulação do cabeçalho (abas)
A página pública deixou de mostrar tudo numa lista única. Agora tem um cabeçalho fixo no topo (`SellerTabs.tsx`) com 3 abas:
- **Vitrine** → `CatalogSection` (catálogo)
- **Cartão Virtual** → cidade, bio, WhatsApp, Instagram, QR code
- **Compartilhar** → botão de compartilhar + QR code

### 7. Busca e filtro do catálogo
`CatalogSection.tsx` ganhou: campo de busca por nome (tempo real, com ícone de lupa), dropdown `<select>` com todas as categorias que têm produto, e 4 pills de acesso rápido (Perfumes Bortoletto 15ml, Perfumes Bortoletto 100ml, Linha Ozonizada, Suplementos e Nutracêuticos) com hover verde.

## Problema em aberto — Prisma em produção

- **Erro:** `PrismaClientKnownRequestError: Can't reach database server`
- **Causa identificada:** `DATABASE_URL` no Vercel aponta para o endpoint **direto** do Supabase (`db.kpgbusvofvdonfpicjwt.supabase.co:5432`). Esse host só tem IPv4, e a Vercel sai por IPv6 por padrão — a função serverless simplesmente não alcança o banco. Adicionar `?pgbouncer=true&connection_limit=1` na URL **não resolve**, porque é o host/porta errados, não um parâmetro de configuração — e além disso o adapter atual (`@prisma/adapter-pg`, baseado em `node-postgres`) ignora silenciosamente esses parâmetros da query string.
- **Correção já aplicada no código:** `lib/db.ts` agora configura `max: 1` diretamente nas opções do `PrismaPg` (pool real via `node-postgres`), já que o `connection_limit` da URL não tinha efeito nenhum.
- **O que falta fazer (só dá pra fazer pelos painéis web):**
  1. No **Supabase** → botão **Connect** → aba **ORM** (ou "Connection Pooling" → modo "Transaction") → copiar a connection string do **pooler** (host tipo `aws-0-<região>.pooler.supabase.com`, porta **6543**, usuário no formato `postgres.<project-ref>`).
  2. Na **Vercel** → Project Settings → Environment Variables → `DATABASE_URL` (ambiente Production) → colar essa string do pooler, mantendo `?pgbouncer=true`.
  3. Redeploy.
- `DIRECT_URL` não precisa ser alterado na Vercel — conferido que o build (`prisma generate && next build`) não roda migration nenhuma, então essa variável nunca é usada em produção, só localmente quando alguém roda migration manual.

## Próximos passos (depois de resolver o banco em produção)

1. **Modal "Ver no catálogo"** — o botão com ícone de olho no canto da imagem do produto ainda não faz nada; precisa abrir a imagem da revista/catálogo do produto.
2. **Página institucional** `atlantica.lojah.app` (página "sobre a empresa", separada da vitrine de cada vendedor).
3. **Página raiz `lojah.app`** — landing page do SaaS (hoje a rota `/` só mostra uma tela genérica de login/logout).

## Regras do projeto

- 💻 **Terminal** = PowerShell — usar só para ler, listar, rodar comandos.
- 🤖 **Claude Code** = criar, editar, resolver problemas no código.
- 🌐 **Vercel / Supabase / Cloudflare** = ações feitas pelos painéis web (o agente não tem acesso direto a essas APIs nesta sessão).
- Um comando por vez.
- Propor antes de implementar.
- Windows/PowerShell — não usar `&&` para encadear comandos.

## Notas técnicas importantes (ler antes de mexer em migrations/seed de novo)

- **Nunca usar `>` do PowerShell pra gerar `migration.sql`** — ele salva em UTF-16 com BOM e quebra o Prisma. Usar Bash/`prisma migrate diff --script` redirecionando no Bash.
- **O número no início do nome de arquivo no bucket NÃO é confiável como `code` do produto** — é uma sequência interna de upload, sem relação garantida com o catálogo real. Um vínculo automático por número quase causou 16 produtos com fotos trocadas (foi revertido na hora). O seed atual já usa o mapeamento correto, validado manualmente pelo usuário.
- **`prisma migrate dev` contra produção pode tentar resetar o schema** se o checksum de uma migration já aplicada mudar (ex: ao corrigir o encoding do `0_init`). Resolvido com `UPDATE` direto no checksum da tabela `_prisma_migrations`, nunca com `migrate reset`.
- **`atlantica.lojah.app` "funcionar" não prova que Prisma/env vars funcionam em produção** — a rota `/` usa sessão JWT e não toca no banco quando deslogado. Só a rota `/[slug]` (que consulta `SellerProfile`/`Product`) exercita a conexão real com o Postgres.

## Commit

Todo o trabalho desta sessão está no working tree, **ainda não commitado no git**.
