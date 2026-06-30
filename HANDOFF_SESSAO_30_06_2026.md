# Lojah.app — Handoff Sessão 30/06/2026

> **Status:** Landing pages neon, catálogo de serviços ATL completo, correções críticas de produção

---

## Resumo da sessão

Sessão extensa cobrindo: correção de bugs críticos de impersonation e signup_button_url, criação da landing page de revenda com identidade visual neon, expansão completa do catálogo com produtos de serviços ATL (saúde, telefonia, TV, IA, energia), sistema de compartilhamento por produto com Open Graph dinâmico, modal de catálogo suspenso com QR Code PIX, e diversos ajustes visuais e de UX.

---

## 1. Correções críticas de bugs

### 1.1 Impersonation não carregava dados do vendedor
**Problema:** Ao admin acessar "como cliente", páginas do painel (perfil, cupons, etc.) buscavam dados via `session.user.id`, que pertencia ao admin, não ao vendedor.

**Solução:** Criado `lib/painel-auth.ts` com helper `getPainelProfile()` que verifica cookie de impersonation primeiro, depois cai para sessão normal. Aplicado em todas as páginas do painel (perfil, cartão, cupons, suporte, materiais, FAQ).

### 1.2 signup_button_url incorreto
**Problema:** Todos os vendedores tinham a mesma URL de cadastro genérica (/codigos), sem personalização por slug.

**Solução:** URL agora gerada automaticamente como `https://cadastro.atlanticanatural.com.br/{slug}` na criação da conta (webhook Hotmart e cadastro manual), mas o campo continua editável depois pelo vendedor.

### 1.3 Bug de digitação travando em /admin/materiais
**Problema:** Componentes `FormFields` e `TypeIcon` definidos dentro do corpo do componente pai causavam remontagem a cada tecla digitada, perdendo o foco do input.

**Solução:** Componentes movidos para fora do escopo do componente pai (nível de módulo), com tipagem explícita `FormData`.

### 1.4 Erros de build em produção
Dois erros de TypeScript travaram múltiplos deploys:
- `navigator.share` sendo avaliado como condição sempre verdadeira → corrigido para `typeof navigator.share === "function"`
- Pastas órfãs `/c/` e `/r/` com cache de build desatualizado referenciando prop `pageUrl` removida → pastas deletadas e cache `.next/` limpo

---

## 2. Reestruturação de rotas

| Rota antiga | Rota nova | Função |
|---|---|---|
| `/[slug]/c` | `/[slug]/desconto` | Catálogo preço consultor (50% OFF) |
| `/[slug]/r` | `/[slug]/revenda` | Landing page de captura de revendedores |
| — | `/[slug]/servicos` | Redirect para catálogo filtrado em ATL Services |
| — | `/[slug]/perfumes` | Redirect para catálogo filtrado em Perfumes 15ml |
| — | `/[slug]/produto/[productId]` | Deep link de produto com Open Graph dinâmico, redireciona para catálogo filtrado |

**Regra de negócio implementada:** produtos da categoria de serviços (ATL Services e subcategorias) **não recebem desconto** na rota `/desconto` — mantêm preço cheio e não exibem badge "50% OFF".

---

## 3. Landing page de revenda (/[slug]/revenda)

Construída a partir de componente fornecido (Lovable) e integrada ao projeto:

- `components/landing/LandingNaturais.tsx` — componente client-side com FAQ accordion, galeria com lightbox, vídeos Vimeo embed
- `lib/landing-naturais-defaults.ts` — dados padrão extraídos para arquivo puro (sem "use client") após bug de Server/Client Component boundary que causava erro 500 em produção

**Conteúdo personalizado por vendedor:** nome, WhatsApp, texto do CTA e logo são injetados dinamicamente a partir do perfil do vendedor.

**Estrutura final da página:**
1. Hero com banner do ecossistema
2. "Você escolhe onde lucrar" — 6 cards (Produtos, ATL ON MED, ATL NEX, Energia, ATL APPs, Renda Recorrente)
3. "Por que ser consultor(a) Atlântica" — 4 diferenciais
4. Galeria de banners reais com lightbox em tela cheia
5. "Quanto você pode ganhar" — 3 faixas de ganho estimado
6. "Escolha como começar" — 3 kits (Consultor Produtos R$79,90, Licença ATL Services R$999,99, Apenas consumir produtos)
7. Depoimentos em vídeo (Vimeo embed)
8. FAQ com 8 perguntas
9. Footer simplificado (contato e pagamentos removidos a pedido)
10. Botão WhatsApp flutuante

**Identidade visual:** estilo neon verde (#00ff88) sobre fundo escuro (#0d1f0d/#0a1a0a), aplicado seletivamente — neon apenas em elementos sobre fundo escuro, nunca sobre fundo claro (regra de legibilidade estabelecida após várias correções).

---

## 4. Catálogo de serviços ATL — expansão completa

### Categorias criadas (todas sob o guarda-chuva visual "Serviços")
| Categoria | sort_order | Produtos |
|---|---|---|
| Telemedicina | 100 | ATL Saúde PRO (1 e 4 vidas), ATL Saúde START (1 e 4 vidas) |
| Telefonia | 101 | ATL NEX Chip, E-SIM, planos Start (14/17/22GB), planos Turbo (38/58/68GB) |
| TV | 102 | ATL TV |
| Inteligência Artificial | 103 | Aura Link Pro |
| Energia | 104 | ATL Energy |
| ATL Services (legado) | 999 | mantida para compatibilidade |

**Total: 22 produtos de serviço cadastrados** diretamente via scripts no banco de produção (sem necessidade de deploy).

### Filtro "Serviços" agregador
Implementado como pill especial (SERVICOS_AGRUPADOS) que agrega produtos de todas as 5 categorias de serviço em uma visão unificada, mantendo os filtros individuais (Telefonia, Telemedicina, etc.) funcionando separadamente. Pill "Todos" também adicionado para resetar o filtro.

### Scripts de seed criados
- `scripts/seed-atl-services.ts` — 9 produtos iniciais (saúde + diversos)
- `scripts/seed-atl-nex.ts` — 6 planos de telefonia
- `scripts/seed-categorias-servicos.ts` — categorias Telemedicina e Telefonia
- `scripts/seed-categorias-servicos-2.ts` — categorias TV, IA, Energia
- `scripts/seed-faq.ts` — 9 perguntas frequentes do painel do vendedor

**Padrão técnico consolidado:** scripts standalone usam @prisma/adapter-pg + execução via `npx tsx --env-file .env scripts/nome.ts`.

---

## 5. Sistema de compartilhamento por produto

- Nova rota `/[slug]/produto/[productId]` gera meta tags Open Graph específicas (foto, nome, descrição do produto) e redireciona para o catálogo filtrado pela categoria
- Botão de compartilhar nos cards do catálogo agora abre menu customizado com 4 opções: Compartilhar nativo, WhatsApp, WhatsApp Business, Copiar link
- Meta tags Open Graph dinâmicas por categoria implementadas em generateMetadata de /[slug]/page.tsx, /[slug]/r (revenda), /[slug]/c (desconto) e /cadastro

---

## 6. Modal de catálogo suspenso (renovação)

Substituída a antiga lógica de redirect para /conta-suspensa por um modal bloqueante:
- `components/catalog/CatalogSuspendedModal.tsx` — overlay com backdrop-blur-sm, catálogo visível mas desfocado por baixo
- QR Code PIX gerado dinamicamente (lib qrcode + lib/pix.ts existente) — valor fixo R$ 67,00, chave whapspro@gmail.com
- Campo de cupom funcional integrado ao modal (POST /api/ativar-cupom)
- Botão WhatsApp aponta para o consultor dono do catálogo (não o admin)

---

## 7. Página institucional /atlantica

Aplicado o mesmo estilo neon da landing de revenda, com cuidado de legibilidade (neon só em fundo escuro):
- Header com duas logos lado a lado (Atlântica + Lojah), sem texto
- Botão "Ver modelo ao vivo" com animação neon pulsante customizada (animate-pulse-slow, 2.5s)
- Seções "Demo ao vivo", "Como Funciona" e "Planos" convertidas para fundo escuro
- Botões "Quero meu catálogo" redirecionados para /cadastro (antes apontavam para Hotmart)
- Adicionado item "Página de Captura Revendedor" com link de exemplo nos dois cards de plano

---

## 8. Painel do vendedor — links por categoria

Adicionado card "Links por Categoria" em /painel com 6 links diretos prontos para compartilhar:
- Perfumes 15ml, Linha Ozonizada, Suplementos, Telemedicina, Telefonia, Serviços (agregado)

---

## 9. Performance

Lazy loading (loading="lazy" + decoding="async") aplicado em todas as imagens do catálogo e landing pages, exceto a imagem do hero (carrega imediatamente). Reduz tempo de carregamento inicial significativamente.

---

## 10. FAQ do painel do vendedor

9 perguntas cadastradas cobrindo: funcionamento do catálogo, comissões, cupons, revenda para equipe, compra de cupons, personalização de perfil, cartão virtual, catálogo de desconto e renovação de assinatura.

---

## Pendências para próxima sessão

- [ ] Módulo 5 — Superadmin (/master) ainda não implementado; gambiarra de companyId ?? "none" em 9 arquivos do /admin segue pendente de reversão
- [ ] Responsividade mobile geral ainda não revisada a fundo
- [ ] Cadastrar os 3 materiais oficiais da Atlântica (Revista, Tabela de Preços, Guia de Produtos) — links do Google Drive já fornecidos em sessões anteriores
- [ ] Remover log de debug do authorize em lib/auth.ts
- [ ] Considerar criar página própria de produto (em vez de apenas redirect) para melhorar SEO e permitir compra direta via deep link

---

## Infraestrutura (sem mudanças)

| Serviço | Identificador |
|---|---|
| Supabase | kpgbusvofvdonfpicjwt |
| Buckets | products, catalog-pages, profile, images |
| GitHub | rodolfogasparian/lojah |
| Vercel | vercel.com/lojah/lojah |
| PIX | whapspro@gmail.com |
| WhatsApp admin | 45999463907 |

### Credenciais de teste
| Role | Email | Senha | Slug |
|---|---|---|---|
| SUPERADMIN | admin@lojah.app | admin1a2s3d4! | — |
| COMPANY_ADMIN | rodolfogasparian@gmail.com | admin@2026 | — |
| SELLER | renda10online@gmail.com | senha123 | br |

---

## Lições aprendidas nesta sessão

1. **Server/Client Component boundary:** nunca exportar constantes de dados de arquivo com "use client" para serem importadas por Server Components — sempre separar em arquivo .ts puro (causou erro 500 em produção).
2. **Componentes definidos dentro de outro componente:** causam remontagem a cada render, quebrando o foco de inputs — sempre declarar no nível de módulo.
3. **Cache de build do Next.js:** pode reportar erros de arquivos já deletados; rm -rf .next resolve quando o erro não bate com o estado atual do código.
4. **Neon design system:** verde neon (#00ff88) só funciona visualmente sobre fundo escuro; sobre fundo claro deve usar verde escuro sólido (#0f3d1f) sem text-shadow.
5. **Inserção de dados via script:** alterações diretas no banco via scripts/*.ts com Prisma adapter não exigem deploy — só alterações de código (arquivos .tsx/.ts do Next.js) passam por build/deploy do Vercel.
6. **navigator.share:** deve ser checado com typeof navigator.share === "function", nunca como condição direta (if (navigator.share)), pois TypeScript trata referência de função como sempre truthy.

---

*Documento gerado em 30/06/2026.*
