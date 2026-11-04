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
- Todos os dados da assinatura e das conversas de exemplo (veículos, preços, Ah, nomes) são ilustrativos e assim rotulados.
- Sem clichês de IA: nada de gradiente roxo/azul, glassmorphism, Inter como fonte principal, emoji.
- Textos ficam só em `content/` (`site.ts` por idioma e um `.mdx` por projeto); componentes não têm texto solto.

## Posicionamento

Gustavo é **desenvolvedor de software, principalmente back-end, com foco em IA aplicada e automação**.
Não é "só IA": desenvolvimento de produto e back-end tem o mesmo peso.

- Linha de função do hero: opção A, "Desenvolvedor de software · IA aplicada e automação"
  / "Software developer · applied AI and automation". Opção B guardada no comentário de `site.ts`:
  "Desenvolvedor back-end com foco em IA aplicada". A linha só quebra depois do "·".
- "O que eu construo": três áreas de peso igual: Agentes de IA, Automação de processos e
  Produtos e back-end (APIs, bancos de dados, painéis, autenticação, deploy).
- Linguagens sem barras de nível, porcentagens ou parede de badges: Python como principal,
  Java, Go e C# como "já trabalhei com".
- Frase honesta em "Como eu trabalho": desenvolve com apoio de agentes de código (Claude Code),
  revisando e testando o que vai para produção.
- Hunt Sales (ago/2025 – jun/2026): Gustavo propôs e desenvolveu sozinho o sistema completo da loja de baterias:
  agente de IA (GPT-4o mini, WhatsApp) + sistema de gestão (Supabase, Auth, painel HTML/JS + Tailwind, domínio da empresa).
  Resultado sem métricas formais: reverteu o churn do cliente e virou um novo tipo de produto, replicado
  (ex.: carregadores de veículos elétricos). Fonte dos fatos: `docs/conteudo/conteudo-agente-baterias.md`.
- Gaudium (jul/2026 – atual): "Automações de processos e integrações via API" e "Desenvolvimento de sites e
  produtos web, com foco em back-end". Nada além disso (NDA).
- O projeto principal é apresentado como "Agente de IA + sistema de gestão", nunca como "um chatbot".

### Traduções decididas

- Tecnólogo → "Technology Degree (Tecnólogo) in Systems Analysis and Development".
- TCC → "Capstone project".
- Título da assinatura em EN → "agent · in-store sales assistant".
- A mensagem do cliente na assinatura fica traduzida no EN.

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
| `--warn` (alerta) | `#e8b04b` (9,8:1) | `#8a5300` (5,8:1) |
| `--danger` (atraso, erro) | `#f2857c` (7,7:1) | `#b3261e` (6,0:1) |

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
- Abaixo: função, parágrafo de apoio e CTAs numa coluna (máx. 46rem); os três fatos em linha a partir de 1024px.
  O lado direito fica para o fundo "Fluxo". A assinatura saiu do hero (foi para o estudo de caso do agente).
- O nome é o elemento do LCP; o fundo só começa depois do evento `load` (`lib/after-load.ts`).

## Assinatura "da mensagem à consulta"

`components/hero/signature.tsx` + `signature.module.css` + `lib/signature-player.ts`. Fica na seção
"Como funciona" do estudo de caso `agente-baterias`, como `<Signature />` no MDX (texto em `site.ts` → `signature`).

- Sequência: mensagem digitada → entidades destacadas uma a uma → `buscar_bateria({...})` escrita linha a linha
  → etapas da execução ficam ✓ → resposta aparece. Duração total entre 6 e 7 s (limite: 8 s).
  Tempos em `TIMING` no player.
- Campos iguais aos do sistema real: `modelo`, `ano`, `cambio`, `start_stop` (as chaves da tabela `aplicacoes`).
- Dois cenários: veículo encontrado (`aplicacoes` → `baterias (ativas)`, 3 opções) e veículo desconhecido
  (`veiculos_sugeridos.insert()` + transferência para a equipe, estado "aguardando").
- Botão "Reproduzir"; hover/foco num termo destaca o campo correspondente na chamada.
- Sem JS ou com `prefers-reduced-motion`: estado final parado. Um script inline liga `data-live`
  antes da primeira pintura, para não haver flash do estado final.
- Espaço reservado com texto fantasma (`data-g`): sem CLS. Pausa fora da tela (IntersectionObserver 0,35) e com a aba oculta.
- O nome da função e das tabelas (`buscar_bateria`, `aplicacoes`, `baterias`, `veiculos_sugeridos`) fica em português nos dois idiomas, porque é código.

## Fundo "Fluxo" e régua de progresso

- `lib/flow-field.ts`: trilhas ortogonais com pacotes, em canvas 2D (sem WebGL), chunk próprio de ~1,9 KB gzip,
  carregado depois do load. Cor lida de `--brand-rgb`, intensidade de `--fx-strength` (1 no escuro, 1,25 no claro),
  redesenha ao trocar de tema. Máscara `.hero-bg` (esmaece à esquerda e embaixo) mantém o texto em primeiro plano.
- Celular ou toque: metade das trilhas, 20 fps, DPR 1, sem reação ao cursor. Reduced motion: um quadro parado.
- `components/layout/scroll-rail.tsx`: régua fixa à direita, só ≥ 1280px; cada `[data-rail]` vira uma marca.

## Estudos de caso (Fase 3)

- Um `.mdx` por projeto em `content/<idioma>/projects/<slug>.mdx`, com `export const meta`
  validado por zod (`content/project-schema.ts`). Passo a passo em `content/README.md`.
- `lib/projects.ts` carrega tudo com `import.meta.glob` (Turbopack), sem `fs`: o build falha com
  meta inválido, projeto sem versão PT ou campos compartilhados (`order`, `tier`, `page`, `repo`,
  `status`, `art`, `stack`) diferentes entre idiomas. Por isso `stack` usa só nomes de ferramenta.
- Rotas: `app/(pt)/projetos/[slug]` e `app/(en)/en/projects/[slug]`, mesmo slug nos dois idiomas,
  geradas no build. `status: "planned"` vira faixa "em construção" sem página; `page: false` também
  não gera página (o card leva ao `repo`).
- Seção de projetos (`components/sections/projects.tsx`), nesta hierarquia:
  1. Destaques (`tier: "featured"`), por `order`: o primeiro em largura total, os demais em duas colunas.
     Ordem atual: agente de baterias, LibrasFlow, plataforma de gestão de demandas.
  2. "Outros projetos" (`tier: "secondary"`): cards menores, sem imagem. Ajuda animal (com página),
     Barbearia Premium App e VoiceSnap (sem página, link para o GitHub).
  3. "Mais no GitHub": lista compacta em `site.ts` → `projects.more` (API .NET 10, Streamlit + Azure,
     concorrência em Java) + link para todos os repositórios.
- Sem versão EN: a página EN mostra o texto em português (`lang="pt-BR"`), com aviso,
  canonical para a versão PT e fora do sitemap.
- Template: cabeçalho com metadados em mono → vídeo ou arte → "Resumo em 30 segundos" (`tldr`) →
  corpo MDX na ordem contexto e problema → minha função → (como funciona) → solução e arquitetura → stack →
  decisões e trade-offs → resultado → (o mesmo padrão em outro nicho) → aprendizados → próximo caso.
- Blocos no MDX sem import (`mdx-components.tsx`): `<Flow>` (diagrama; `alt` = caminho
  alternativo, `altLabel` = "ou"/"or"; `accent: true` destaca a etapa final), `<Decision>`, `<Metrics>`/`<Metric>`, `<Chat>` com
  `<Message from="customer|agent">` e `<ChatNote>` (conversa com selo "exemplo ilustrativo"),
  `<Gallery>`/`<Shot>` (capturas com `next/image`; `<Shot layout="column|wide">` sozinha), `<PaperFigure>`
  (figura de artigo em cartão claro, legenda em mono, nota e link para o tamanho real em nova aba) e `<DataTable>`
  (o MDX não tem tabelas em Markdown). Nada de rolagem horizontal: diagrama com texto vira `<Flow>`.
- `meta.live` = demonstração pública externa: botão "Testar ao vivo (usa a câmera)" no topo do caso, em nova aba.
  Com `meta.liveEmbed`, o botão vira "Testar aqui (usa a câmera)" e abre uma janela (`components/case-study/live-demo.tsx`,
  `<dialog>` nativo com iframe `allow="camera"`), e o link externo (`meta.liveExternal`) fica ao lado. O iframe só
  existe com a janela aberta: fechar destrói a página e desliga a câmera. `meta.liveIntro` abre a janela;
  `meta.demoNote` aparece no rodapé dela. No celular a janela ocupa a tela e o texto vai para o rodapé;
  `meta.demo` = slug de uma demo dentro do site (`/demos/<slug>`): botão "Abrir demo"; `meta.demoNote` = nota
  curta sob os botões.
- Blocos que dependem do idioma (`<Video>`, `<Signature>`) são passados por `case-study-page.tsx`
  em `<Body components={...}>`, com os rótulos do `site.ts` do idioma do texto.
- `meta.media.cover` = imagem real do card (`fit: "frame"`: captura em moldura `surface-2`, cortada embaixo;
  `fit: "fill"`: foto ocupando a área); `meta.media.video` = vídeo no topo do caso no lugar da arte
  (vídeo com menos de 1000 px de largura fica na largura da coluna de texto, sem esticar). `meta.draft` (padrão `true`) mostra o aviso de texto provisório.
- Vídeos (`components/case-study/loop-video.tsx`): sem som, loop, `preload="none"` com poster; o arquivo
  só é baixado depois do load e quando entra na tela, pausa fora dela; botão Pausar/Reproduzir (WCAG 2.2.2);
  com reduced motion não toca sozinho.
- Mídia do agente: `public/agente-baterias/midia-agente-baterias/` (já censurada). Os `.png` originais ficam
  fora do git; o site usa só `.webp` e `.mp4`.
- Mídia do LibrasFlow: `public/librasflow/` (vídeo e poster convertidos do GIF de demonstração do repositório,
  sem a faixa do editor; `librasflow-card.webp` sem a barra de texto do topo). O banner do repositório não é usado
  (estética de "IA brilhante", contra as regras visuais). Figuras do artigo em `public/librasflow/midia-librasflow/`
  (matriz de confusão e interface), com rótulos em português; a legenda avisa isso. O pipeline é um `<Flow>` de
  6 etapas traduzido (a figura do pipeline foi apagada).
- Artes abstratas (`components/art/project-art.tsx`), composições HTML/SVG do servidor nas cores do tema,
  decorativas: painel + agente, pontos da mão, fluxo de nós e Kanban com SLA (plataforma de demandas).
  As telas do repositório da plataforma não são usadas: têm o logo da Gaudium e dados de teste.
- JSON-LD `Person` na página inicial; links com `[CONFIRMAR]` ficam fora do `sameAs`.

### Fatos dos casos

- LibrasFlow (fonte: `docs/conteudo/conteudo-librasflow-e-demos.md`, do artigo do TCC, mais atual que o repositório):
  TCC de ADS no IFSP Jacareí, em dupla com Carlos Henrique Moreira Gonçalves (coautor, sempre citado); orientação
  do Prof. Dr. Tardelli Ronan Coelho Stekel e da Profa. Dra. Ana Paula Abrantes de Castro e Shiguemori. Artigo
  "em preparação para submissão" (sem nome de revista). Números: 99,96% com vazamento → 97,01% ± 2,59% com
  divisão por grupos (DBSCAN ε 0,05, 6.270 grupos) → **71,2%** no teste externo (3.812 imagens; não 69%, que é a
  variante de 63 atributos, descartada). São 34.374 amostras, não "imagens". Demo pública: librasflow.ifsp.dev
  (MLP no navegador; os números do estudo são do Random Forest). Nunca escrever "100% de acurácia".
  Em 04/11/2026 o librasflow.ifsp.dev não mandava `X-Frame-Options` nem CSP, então abre em iframe
  (`/#demo`); o reconhecimento roda no navegador (o `demo.js` só busca o modelo), o que sustenta a frase "nenhuma
  imagem sai do seu computador". A página pública é só em português; o texto EN avisa. A versão nativa
  ("Experimente" com `@mediapipe/tasks-vision` e a MLP em JSON) depende do código em `docs/referencias/librasflow-web`,
  que ainda não existe.
- Plataforma de demandas: o README fala em RLS, mas o código usa a chave de serviço e checa permissões
  no Flask. O caso descreve o que o código faz. Foi o "case técnico do processo seletivo em que fui aprovado"
  ("technical case from the hiring process I passed"), sem citar a empresa.

## Demos dentro do site

Regras (`docs/conteudo/conteudo-librasflow-e-demos.md`, Parte 2): faixa fixa "Demonstração com dados fictícios ·
sem banco de dados", botão "Ver código no GitHub", rota própria em PT e EN que carrega só o próprio JS,
botão "Abrir demo" no estudo de caso (`meta.demo`) e nenhuma marca de terceiros.

- `lib/demos.ts`: mapa demo → projeto, `demoPath`, conteúdo e metadata. Rotas `app/(pt)/demos/<slug>` e
  `app/(en)/en/demos/<slug>` (o segmento `demos` é igual nos dois idiomas); entram no sitemap pelo mapa.
- Textos em `content/<idioma>/demos/<slug>.ts`, tipados em `content/demos/<slug>-types.ts`.
- Demo de demandas (`components/demos/demandas/`): "Painel de Demandas" / "Request Board", recriação do
  repositório desafio-Gaudium sem a marca. `loader.tsx` usa `next/dynamic` com `ssr: false` (o estado vem do
  `localStorage` e do relógio). `logic.ts` é puro: regras de permissão do Flask (admin vê e altera tudo;
  colaborador vê só o próprio setor de destino e altera só esses), SLA do `script.js` (75/90%, atrasado,
  cumprido), tempo apontado e payloads do n8n (`novo_ticket`, `ticket_assumido`, `ticket_concluido`, mais o alerta
  de 48 h sem atividade como verificação agendada). Usuários fictícios Ana (RH), Carlos (Comercial) e Marina (TI,
  admin), e-mails `@example.com`. Eventos como no original: só a mudança de `status` (arrastar no Kanban, Concluir) dispara;
  os botões Assumir/Retomar/Pausar equivalem ao `status_execucao` e não disparam evento.
- Teste da demo: pelo Chrome DevTools Protocol, clicando nos botões, preenchendo o formulário e simulando o
  arrastar com `DragEvent` + `DataTransfer` (ver "Verificação visual").

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
- No `next.config.ts`, o loader do Tailwind ignora `*.module.css` (senão os CSS Modules perdem o escopo).
- Componentes cliente não importam `Button`/`cn`: o servidor calcula `buttonVariants(...)` e passa a classe como string,
  para `tailwind-merge` e o Slot do Radix não irem ao bundle do cliente. Exceção: as demos, que ficam num chunk
  próprio carregado só na rota delas.
- `buttonVariants` devolve as classes já mescladas (`cn`); sem isso a borda do `outline` perdia para o
  `border-transparent` da base.
- Fontes pré-carregadas: três arquivos, ~95 KB no total.

## Verificação visual

Headless Chrome não abre janela menor que 500px. Para 360px e para o tema claro, usar o
Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride` + `localStorage.theme`).

## Pendências conhecidas

- Repositório: github.com/SantosGAlves/portfolio (público).
- CV em PDF (PT e EN), e-mail e LinkedIn: `[CONFIRMAR]`. GitHub confirmado: github.com/SantosGAlves.
- 404 personalizada: com vários layouts raiz, o 404 padrão sai sem `lang`; resolver na Fase 3/4
  (`app/global-not-found.tsx`, ainda experimental no Next 16).
- Imagem Open Graph: Fase 4.
- Textos reais dos estudos de caso: agente, LibrasFlow e plataforma de demandas prontos (`draft: false`);
  ajuda animal ainda tem `[CONFIRMAR]`.
