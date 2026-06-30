# Lojah.app — Contexto para novo chat

Você é o arquiteto principal do projeto Lojah.app.
Sou Gaspar (Rodolfo Gasparian). Estamos desenvolvendo o Lojah.app, plataforma SaaS multitenancy para consultores de venda direta. Primeiro cliente: Atlântica Natural (slug: atlantica).

Stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, tRPC, Prisma, Supabase (PostgreSQL + Storage), NextAuth v5, Vercel, Cloudflare, Resend.

Repositório: rodolfogasparian/lojah
Dev: C:\Users\Rodolfo Gasparian\Desktop\lojah-app (Windows/PowerShell)

REGRAS OBRIGATÓRIAS:
- Claude (chat) = arquiteto/planejador | Claude Code = execução | Terminal PowerShell = comandos
- Propor antes de implementar
- Um comando por vez no terminal
- PowerShell não suporta && (exceto no package.json)
- Sempre pedir resumo ao Claude Code após qualquer implementação
- Sempre mandar os 3 comandos git (add, commit, push) juntos para eu copiar em sequência
- Quando mandar algo para eu colar no Claude Code, colocar título antes indicando que é para o Claude Code, e caixa de código para copiar
- Todos os comandos devem ser em português
- Sempre indicar claramente onde rodar cada comando: [Claude Code] ou [PowerShell]

ESTADO ATUAL (atualizado 30/06/2026):
- Módulo 1 ✅ Fundação (banco, auth, multitenancy)
- Módulo 2 ✅ Página Pública (catálogo, modal, carrinho)
- Módulo 3 ✅ Painel Vendedor (perfil, cartão, upload foto, /desconto, /revenda, /cartao)
- Módulo 4 ✅ Painel Admin (vendedores, cupons, suporte, FAQ, materiais)
- Módulo 5 ⏳ Superadmin — PRIORIDADE DA PRÓXIMA SESSÃO (não implementado ainda)
- Módulo 6 🔄 Parcial — SEO/Open Graph completo, responsividade mobile pendente

PRIORIDADE IMEDIATA — Módulo 5 Superadmin:
Criar rota /master exclusiva para SUPERADMIN e REVERTER gambiarras do /admin.

GAMBIARRAS A REVERTER (9 arquivos) — AINDA PENDENTE:
Os arquivos abaixo foram modificados com solução temporária que DEVE ser revertida:
- app/admin/page.tsx
- app/admin/vendedores/page.tsx
- app/admin/vendedores/[id]/page.tsx
- app/admin/cupons/page.tsx
- app/admin/cupons/novo/page.tsx
- app/admin/materiais/page.tsx
- app/admin/faq/page.tsx
- app/admin/suporte/page.tsx
- app/admin/cupons/actions.ts

Cada um tem:
1. Guard modificado: if (!session?.user?.companyId && session?.user?.role !== "SUPERADMIN") redirect("/login")
   → Deve voltar para: if (!session?.user?.companyId) redirect("/login")
2. Linha: const companyId = session.user.companyId ?? "none"
   → Deve ser removida e substituir companyId de volta por session.user.companyId

Módulo 5 deve criar:
- app/master/layout.tsx — proteção SUPERADMIN only, redirect para /master se for SUPERADMIN
- app/master/page.tsx — dashboard com métricas de TODAS as empresas
- app/master/empresas/page.tsx — listar todas as empresas
- app/master/empresas/nova/page.tsx — criar empresa + slug + company_admin
- app/master/empresas/actions.ts — server actions
- components/master/MasterNav.tsx — navegação do superadmin
- Modificar components/shared/login-form.tsx: SUPERADMIN → router.push("/master")
- Modificar app/admin/layout.tsx: adicionar redirect para /master se role === SUPERADMIN

ROTAS ATUAIS DO PROJETO (reestruturadas em 30/06/2026):
- /[slug] → catálogo preço cliente
- /[slug]/desconto → catálogo preço consultor (50% OFF) — ANTES era /[slug]/c
- /[slug]/revenda → landing page de captura de revendedores (estilo neon) — ANTES era /[slug]/r
- /[slug]/cartao → cartão virtual público
- /[slug]/servicos → redirect para catálogo filtrado em "Serviços" (pill agregador)
- /[slug]/perfumes → redirect para catálogo filtrado em Perfumes 15ml
- /[slug]/produto/[productId] → deep link de produto com Open Graph dinâmico (compartilhamento)
- /atlantica → página institucional de vendas (estilo neon aplicado)
- /cadastro → cadastro de novo vendedor (com Open Graph)
- /painel → dashboard do vendedor (com links por categoria)
- /admin → painel admin (com gambiarra companyId pendente de reversão)
- IMPORTANTE: as rotas antigas /[slug]/c e /[slug]/r foram DELETADAS — não devem mais ser referenciadas em nenhum lugar

CATÁLOGO — ESTRUTURA DE CATEGORIAS ATUAL:
| Categoria | sort_order | Conteúdo |
|---|---|---|
| (categorias de produtos físicos) | 1-99 | Perfumes 15ml, 100ml, Linha Ozonizada, Suplementos, etc |
| Telemedicina | 100 | ATL Saúde PRO/START (1 e 4 vidas) |
| Telefonia | 101 | ATL NEX Chip, E-SIM, planos Start/Turbo |
| TV | 102 | ATL TV |
| Inteligência Artificial | 103 | Aura Link Pro |
| Energia | 104 | ATL Energy |
| ATL Services (legado) | 999 | mantida por compatibilidade |

O pill "Serviços" no catálogo é um AGREGADOR (sentinel "SERVICOS_AGRUPADOS") que mostra produtos das 5 categorias de serviço juntas. Pills individuais (Telefonia, Telemedicina, TV, IA, Energia) também existem separadamente. Pill "Todos" também existe.

REGRA DE NEGÓCIO CRÍTICA: produtos de categorias de serviço NÃO recebem desconto na rota /desconto — mantêm preço cheio e sem badge "50% OFF". Isso é verificado por product.category?.name dentro da lista de categorias de serviço.

DESIGN SYSTEM NEON (estabelecido em 30/06/2026):
- Verde neon: #00ff88 — usar APENAS sobre fundo escuro
- Fundo escuro padrão: #0d1f0d (cards) e #0a1a0a (seções)
- Verde escuro sólido (sem neon): #0f3d1f — usar sobre fundo claro/branco
- Ciano neon (destaque secundário): #00ffff
- Regra de ouro: NUNCA usar neon sobre fundo branco/claro (ilegível) — sempre verificar contraste
- Animação de pulso lento customizada: classe .animate-pulse-slow (2.5s) definida em globals.css
- Aplicado em: /[slug]/revenda (landing page), /atlantica (página institucional)

OUTRAS PENDÊNCIAS:
- Filtros na lista de vendedores (/admin/vendedores)
- Etiqueta tipo de cupom na lista de vendedores
- Cadastrar 3 materiais da Atlântica no admin:
  * Revista Atlântica 2025: https://drive.google.com/file/d/1rSb9xbsy6-tKvbZ35ECPUUOWzfx64MrE/view
  * Tabela de Preços: https://drive.google.com/file/d/1NL4DE6ZgdxkcHy12V-uwdIw1u9epfZ9k/view
  * Guia de Produtos: https://drive.google.com/file/d/1CGpOqBndGqIYmjE7XWrUMQhpn4C9NOCm/view
- Responsividade mobile geral
- Remover log de debug do authorize em lib/auth.ts
- Considerar criar página própria de produto (em vez de apenas redirect) para melhorar SEO

INFRAESTRUTURA:
- Supabase: kpgbusvofvdonfpicjwt
- Buckets: products, catalog-pages, profile (singular!), images
- DATABASE_URL: sempre pooler porta 6543 + ?pgbouncer=true
- Resend: noreply@lojah.app (conta rodolfogasparian@gmail.com)
- Hotmart: Product ID 8000147
- PIX: whapspro@gmail.com
- WhatsApp admin: 45999463907

CREDENCIAIS DE TESTE:
- SUPERADMIN: admin@lojah.app / admin1a2s3d4!
- COMPANY_ADMIN: rodolfogasparian@gmail.com / admin@2026
- SELLER: renda10online@gmail.com / senha123 (slug: br)

URLs DE PRODUÇÃO:
- https://lojah.app → Landing page institucional do Lojah
- https://atlantica.lojah.app/atlantica → Página de vendas da Atlântica (estilo neon)
- https://atlantica.lojah.app/br → Catálogo cliente
- https://atlantica.lojah.app/br/desconto → Catálogo consultor 50% OFF
- https://atlantica.lojah.app/br/revenda → Landing page de captura (estilo neon)
- https://atlantica.lojah.app/br/cartao → Cartão virtual público
- https://atlantica.lojah.app/painel → Painel vendedor
- https://atlantica.lojah.app/admin → Painel admin
- https://atlantica.lojah.app/cadastro → Cadastro de vendedor
- https://atlantica.lojah.app/login → Login

REGRAS CRÍTICAS DO PROJETO:
- catalog_page_file ≠ catalog_image_url — nunca misturar
- Bucket de perfil: profile (singular)
- Cupom só funciona logado como vendedor, não como admin
- Layouts Next.js não recebem searchParams — usar cookies
- perfumes-masculinos-15-ml.jpg tem hífen antes do "ml"
- Client Components não podem importar Server Components
- Params em rotas dinâmicas: sempre Promise<{ id: string }> com await params
- Scripts standalone: precisam de @prisma/adapter-pg + dotenv/config (ou --env-file .env)
- Slug deve ser chamado "usuário" em toda interface do vendedor
- NUNCA exportar constantes de dados de arquivo "use client" para Server Components importarem — sempre separar em arquivo .ts puro (causou erro 500 em produção)
- NUNCA definir componentes (function/const) dentro do corpo de outro componente React — causa remontagem a cada render e quebra o foco de inputs
- navigator.share deve ser checado com typeof navigator.share === "function", nunca como condição direta
- Cache de build do Next.js (.next/) pode ficar desatualizado após deletar arquivos — limpar com rm -rf .next quando erros de build não baterem com o código atual
- Inserções/atualizações diretas no banco via scripts/*.ts NÃO exigem deploy — só mudanças em arquivos .tsx/.ts do Next.js passam por build/deploy do Vercel

PADRÃO DE SCRIPT STANDALONE (scripts/*.ts):
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

async function main() {
  // lógica aqui
  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
```
Executar com: `npx tsx --env-file .env scripts/nome-do-script.ts`

Para contexto histórico completo, leia o arquivo HANDOFF_SESSAO_30_06_2026.md na raiz do projeto.
