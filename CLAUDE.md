@AGENTS.md

# Portfólio de Gustavo Alves dos Santos

Site pessoal para a vaga de estágio em GenAI do iFood (trilha AI Builder).
O processo segue `docs/brief.md` em fases (o `docs/` fica fora do git). Este arquivo registra
as decisões já tomadas; mudar qualquer uma delas exige pedido explícito do Gustavo.

## Regras de conteúdo (não negociáveis)

- Nunca inventar métricas, empresas, depoimentos ou resultados. Dado ausente vira `[CONFIRMAR]`.
- Trecho da tradução em inglês com dúvida vira `[REVISAR]` (comentário no arquivo de conteúdo).
- **Nunca citar o nome do cliente da loja de baterias**, em nenhum idioma, arquivo ou commit.
- Gaudium está sob NDA: só descrições genéricas do trabalho.
- Todos os dados da assinatura do hero (veículos, preços, Ah) são ilustrativos e assim rotulados.
- Sem clichês de IA: nada de gradiente roxo/azul, glassmorphism, Inter como fonte principal, emoji.
- Textos ficam só em `content/<idioma>/site.ts`; componentes não têm texto solto.

## Stack e restrições técnicas

- Next.js 16 (App Router, Turbopack, `cacheComponents`), TypeScript, Tailwind v4, shadcn/ui (base Radix, estilo nova).
  Ler a doc em `node_modules/next/dist/docs/` antes de usar uma API (ver AGENTS.md).
- Site 100% estático: os layouts raiz exportam `ensureStatic = "navigation"`; o build falha se algo virar dinâmico.
- Metas: Lighthouse ≥ 95 nas quatro categorias (mobile), LCP < 2,5 s, CLS < 0,1, INP < 200 ms, AA, a partir de 360px.
- MCP shadcn para componentes; MCP 21st só como inspiração (nenhum componente pago).
- Commits pequenos e descritivos, em português.

## Identidade visual (Direção A, "Console")

### Cores (tokens em `app/globals.css`)

Escuro é o padrão. O tema claro usa um verde mais escuro, porque `#7EE08F` não passa AA sobre fundo claro.
A cor de status "ok" (ciano) é separada do destaque, para o verde não significar só "sucesso".

| Token | Escuro | Claro |
| --- | --- | --- |
| `--bg` | `#0e0f12` | `#f5f6f7` |
| `--surface` / `--surface-2` | `#15171b` / `#1b1e23` | `#ffffff` / `#eceef1` |
| `--text` | `#ededf0` (16,4:1) | `#101215` (17,3:1) |
| `--text-muted` | `#9a9da6` (7,1:1) | `#4d525a` (7,3:1) |
| `--text-subtle` | `#82868f` (5,3:1) | `#5f646d` (5,5:1) |
| `--brand` (destaque) | `#7ee08f` (11,8:1) | `#17773a` (5,2:1) |
| `--ok` (status) | `#6cc7e0` (9,9:1) | `#0e6f87` (5,3:1) |

Contraste medido contra `--bg`; todos os textos passam AA (≥ 4,5:1) também sobre `surface` e `surface-2`.
Destaque chapado e usado com parcimônia (rótulos, links, foco, detalhes). Sem gradientes nem neon.

### Tipografia (`lib/fonts.ts`, via `next/font`)

- Texto e títulos: **Schibsted Grotesk** (variável).
- Mono (rótulos, código, metadados): **Geist Mono** (variável).
- Itálica editorial: **Newsreader** itálica, só peso 400 e sem eixo `opsz` (24 KB; a versão com `opsz` tinha 147 KB).
- Escala: tokens `text-name`, `text-role`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-meta`.
  Todo token novo de tamanho precisa entrar no grupo `font-size` de `lib/utils.ts`, senão o `cn` o confunde com cor.

### Hero

- Saudação pequena em mono ("olá, eu sou" / "hi, I'm"), depois o nome como `h1`:
  "Gustavo" em Schibsted bold e "Alves dos Santos" em Newsreader itálico, em linhas separadas
  (com `{" "}` entre os spans para o nome acessível ficar correto).
- Abaixo: função ("Desenvolvedor de IA aplicada e automação"), parágrafo de apoio, CTAs e três fatos.
- Ao lado (≥ 1024px) ou abaixo: a assinatura animada.
- O nome é o elemento do LCP; fundo e assinatura só começam depois do evento `load` (`lib/after-load.ts`).

## Assinatura "da mensagem à consulta"

`components/hero/signature.tsx` + `signature.module.css` + `lib/signature-player.ts`.

- Sequência: mensagem digitada → entidades destacadas uma a uma → `buscar_bateria({...})` escrita linha a linha
  → etapas da execução ficam ✓ → resposta aparece. Duração total entre 6 e 7 s (limite: 8 s).
  Tempos em `TIMING` no player.
- Dois cenários: veículo cadastrado e veículo desconhecido (pré-cadastro + painel do vendedor, estado "aguardando").
- Botão "Reproduzir"; hover/foco num termo destaca o campo correspondente na chamada.
- Sem JS ou com `prefers-reduced-motion`: estado final parado. Um script inline liga `data-live`
  antes da primeira pintura, para não haver flash do estado final.
- Espaço reservado com texto fantasma (`data-g`): sem CLS. Pausa fora da tela (IntersectionObserver 0,35) e com a aba oculta.
- O nome da função e das tabelas (`buscar_bateria`, `veiculos`, `precadastro`) fica em português nos dois idiomas, porque é código.

## Fundo "Fluxo" e régua de progresso

- `lib/flow-field.ts`: trilhas ortogonais com pacotes, em canvas 2D (sem WebGL), chunk próprio de ~1,9 KB gzip,
  carregado depois do load. Cor lida de `--brand-rgb`, intensidade de `--fx-strength` (1 no escuro, 1,25 no claro),
  redesenha ao trocar de tema. Máscara `.hero-bg` (esmaece à esquerda e embaixo) mantém o texto em primeiro plano.
- Celular ou toque: metade das trilhas, 20 fps, DPR 1, sem reação ao cursor. Reduced motion: um quadro parado.
- `components/layout/scroll-rail.tsx`: régua fixa à direita, só ≥ 1280px; cada `[data-rail]` vira uma marca.

## Idiomas

- PT-BR é o padrão, na raiz (`/`); inglês em `/en`. Rotas estáticas, sem middleware nem redirecionamento.
- Dois layouts raiz por grupos de rota: `app/(pt)/layout.tsx` e `app/(en)/en/layout.tsx`, ambos usando
  `components/layout/root-document.tsx`. Trocar de idioma é uma navegação completa (aceito).
- Conteúdo espelhado: `content/pt-BR/site.ts` e `content/en/site.ts`, mesmo tipo `SiteContent` (`content/types.ts`).
- `lib/i18n.ts`: `getContent`, `homePath`, `switchLocalePath` (com mapa de segmentos traduzidos, ex.: `projetos` ↔ `projects`).
- `lib/metadata.ts`: metadata por idioma, `alternates.languages` (pt-BR, en, x-default), `og:locale` pt_BR / en_US.
- Sitemap com alternativas por idioma. Toda página nova entra nos dois idiomas, no sitemap e no mapa de segmentos.

## Temas

- Escuro é o padrão; botão no header; preferência em `localStorage` (`theme`).
- `lib/theme.ts`: script inline no `<head>` aplica `data-theme` e `color-scheme` antes da primeira pintura (sem flash).
  `<html>` usa `suppressHydrationWarning`. Ícone do botão troca só por CSS (variantes `dark:`/`light:`).
- Tudo que depende de cor lê tokens CSS; canvas relê ao mudar `data-theme`.

## Desempenho

- JS inicial ~138 KB gzip, dos quais ~125 KB são React e Next; o código do site soma ~10 KB.
- Componentes cliente não importam `Button`/`cn`: o servidor calcula `buttonVariants(...)` e passa a classe como string,
  para `tailwind-merge` e o Slot do Radix não irem ao bundle do cliente.
- Fontes pré-carregadas: três arquivos, ~95 KB no total.

## Pendências conhecidas

- Repositório no GitHub ainda não criado (o Gustavo roda o `gh repo create`).
- CV em PDF (PT e EN), e-mail, LinkedIn e GitHub: `[CONFIRMAR]`.
- 404 personalizada: com vários layouts raiz, o 404 padrão sai sem `lang`; resolver na Fase 3/4
  (`app/global-not-found.tsx`, ainda experimental no Next 16).
- Imagem Open Graph, JSON-LD Person: Fase 3/4.
- Estudos de caso em EN quando só existir o arquivo em PT: decidir na Fase 3.
