# Arquitetura — Lojah App

Plataforma multi-empresa (multi-tenant) para times de vendas diretas/multinível: cada **empresa** (`Company`) tem seus **vendedores** (`SellerProfile`), um **catálogo de produtos** próprio e uma **vitrine pública** por vendedor. O acesso é controlado por **assinatura** (`Subscription`), ativada por **cupons** (`Coupon`/`CouponPack`).

## Stack

- **Next.js** (App Router) — framework principal
- **Prisma** — ORM, conectado ao PostgreSQL do Supabase (ver `prisma/schema.prisma`)
- **tRPC** — comunicação tipada entre frontend e backend (`server/routers`)
- **NextAuth** — autenticação
- **Supabase** — banco de dados Postgres + (futuramente) storage de imagens
- **Resend** — envio de e-mails transacionais
- **Zod** — validação de dados (usado junto com tRPC)

## Papéis de usuário (`Role` no schema)

- `SUPERADMIN` — administra toda a plataforma (todas as empresas)
- `COMPANY_ADMIN` — administra uma empresa: produtos, categorias, conteúdos do painel, vendedores
- `SELLER` — vendedor com perfil público e vitrine de produtos

## Estrutura de pastas

```
app/                    Rotas (App Router do Next.js) — páginas e layouts
components/
  ui/                   Componentes base de interface (botão, input, card, modal...)
                         reutilizáveis e sem regra de negócio — base do design system
  catalog/               Componentes da vitrine pública de produtos (página do vendedor)
  seller/                Componentes do painel do vendedor (dashboard, perfil, cupons)
  admin/                 Componentes do painel administrativo da empresa/superadmin
  shared/                Componentes compartilhados entre as áreas acima
                         (ex: header, navegação, loading, empty state)
lib/                     Funções utilitárias e configuração de serviços
                         (ex: cliente Prisma, cliente Supabase, helpers, auth config)
server/
  routers/               Routers do tRPC, um por domínio
                         (ex: company.ts, product.ts, seller.ts, subscription.ts, coupon.ts)
prisma/
  schema.prisma          Modelo de dados (fonte da verdade do banco)
```

## Modelo de dados (resumo)

| Modelo            | Responsabilidade                                          |
|--------------------|-------------------------------------------------------------|
| `Company`          | Empresa cliente da plataforma (tenant)                      |
| `User`              | Login/credenciais, vinculado a um papel (`Role`)             |
| `SellerProfile`     | Perfil público do vendedor (slug, foto, contato, bio)        |
| `Subscription`      | Assinatura ativa do vendedor, ligada a um cupom               |
| `CouponPack`/`Coupon` | Lotes de cupons comprados e cupons individuais para ativar assinaturas |
| `ProductCategory`/`Product` | Catálogo de produtos da empresa                       |
| `PanelContent`      | Conteúdos do painel (tutorial, vídeo, protocolo, página de vendas, suporte) |

## Convenções

- Cada empresa é isolada pelos dados via `company_id` — toda query de produto, categoria, conteúdo etc. deve filtrar pela empresa do usuário logado.
- Regras de negócio e acesso ao banco ficam em `server/routers` (via tRPC), nunca direto nos componentes.
- Componentes em `components/ui` não devem importar nada de `lib`/`server` — são puramente visuais.
