@AGENTS.md

# Portfólio de Gustavo Alves dos Santos

Portfólio geral: projetos, experiência, formação e contato. Não é voltado a nenhuma vaga, empresa ou programa
específico; textos, metadados, Open Graph, JSON-LD e READMEs não citam vaga nem processo seletivo em andamento.
Indicador de disponibilidade do hero: "Aberto a novas oportunidades" / "Open to new opportunities".
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
- Frase de efeito do hero (`hero.tagline`, uma linha por item): "Agentes de IA, automações / e o back-end que
  mantém tudo de pé." / "AI agents, automations, / and the back-end that keeps it all running."
- "O que eu faço": quatro áreas curtas, gerais, sem ligar a projetos: Agentes de IA e LLMs, Automação e
  integrações, Back-end e dados, Machine learning e visão computacional (título, uma frase, palavras-chave).
- Linguagens sem barras de nível nem porcentagens: Python marcado como principal; Java, C# e Go como
  "já trabalhei com" (seção "Tecnologias").
- "Como eu trabalho" (em "Formação e competências"): cada qualidade com a prova e o link para o caso. Inclui a
  frase honesta: desenvolve com apoio de agentes de código (Claude Code), revisando e testando o que vai para
  produção, com link para o código deste site.
- Hunt Sales (ago/2025 – jun/2026): Gustavo propôs e desenvolveu sozinho o sistema completo da loja de baterias:
  agente de IA (GPT-4o mini, WhatsApp) + sistema de gestão (Supabase, Auth, painel HTML/JS + Tailwind, domínio da empresa).
  Resultado sem métricas formais: reverteu o churn do cliente e virou um novo tipo de produto, replicado
  (ex.: carregadores de veículos elétricos). Fonte dos fatos: `docs/conteudo/conteudo-agente-baterias.md`.
- Gaudium (jul/2026 – atual): empresa B2B de tecnologia para mobilidade e entregas. Só descrições gerais (NDA):
  automações de processos com n8n e integrações via API; agentes de IA e LLMs aplicados a processos internos;
  sites e produtos web com foco em back-end. Sem clientes, parceiros nem link para estudo de caso (a plataforma de
  demandas foi o case técnico do processo seletivo e não pode ser ligada à empresa).
- Experiência na home: Gaudium, Hunt Sales e o projeto de extensão Ajuda Animal (2026), em tópicos curtos com verbo
  de ação e links para os casos relacionados (`caseStudies`). Texto aprovado: a entrega da Hunt Sales "reverteu o
  risco de cancelamento de um cliente" (o cliente estava em risco; não houve cancelamento).
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
- `docs/` (fora do git) também fica fora do `tsc` e do ESLint: guarda repositórios de referência com código de outros projetos.
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

### Página inicial

Ordem (`components/pages/home-page.tsx`): Hero → O que eu faço → Experiência → Tecnologias → Projetos → Outros
projetos → Formação e competências → Contato. O menu do header (`site.ts` → `nav`) segue a mesma ordem, sem
"Outros projetos"; entre 1024 e 1280 px o header usa o nome curto e um espaço menor entre os links, para caber.
Cada seção é uma marca da régua de progresso (`data-rail`, na ordem da página).

### Hero

- Saudação pequena em mono ("olá, eu sou" / "hi, I'm"), depois o nome como `h1`:
  "Gustavo" em Schibsted bold e "Alves dos Santos" em Newsreader itálico, em linhas separadas
  (com `{" "}` entre os spans para o nome acessível ficar correto).
- Logo abaixo do nome, a função em mono; depois a frase de efeito (`text-role`, segunda linha esmaecida), o parágrafo
  de apoio e os CTAs numa coluna (máx. 46rem); os três fatos em linha a partir de 1024px.
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
- Seção de projetos (`components/sections/projects.tsx`), inspirada em victrhugo.site:
  1. Destaques (`tier: "featured"`), por `order`: seis cards com o mesmo peso, grade de 2 colunas (1 no celular),
     sem card gigante. Ordem: Agente de IA + sistema de gestão, LibrasFlow, Plataforma de demandas, Ajuda Animal,
     Barbú, Painel para carregadores de veículos elétricos. Cada card: arte, ano (trecho do `period` antes do " · "),
     título (`shortTitle` ou `title`), uma frase (`tagline` ou `summary`), até 4 tecnologias (as 4 primeiras de
     `stack`) e o selo "demo interativa". Fotos, prints e vídeos reais ficam só dentro dos estudos de caso
     (`media.cover` não existe mais).
  2. "Outros projetos" (seção própria, `OtherProjects`): lista compacta com ano, título, uma linha e seta: projetos
     `tier: "secondary"` (VoiceSnap, sem página, link para o GitHub) + `site.ts` → `projects.more` (API .NET 10,
     Streamlit + Azure, concorrência em Java), e o link "Todos os repositórios".
- Seção "Tecnologias" (`components/sections/stack.tsx` + `stack-marquee.tsx`), inspirada em victrhugo.site: faixa
  de selos (ícone monocromático do `simple-icons` + nome) rolando devagar, só com CSS (`animate-marquee`, duas
  cópias, 3,5 s por item). Pausa ao passar o mouse, ao tocar na faixa e no botão "Pausar a faixa" (WCAG 2.2.2).
  Com `prefers-reduced-motion`, grade parada e sem botão. Cada ícone entra uma vez no HTML (`<symbol>`); a faixa usa
  `<use>`. A faixa é `aria-hidden`: a lista por categoria, embaixo, tem o mesmo conteúdo. Dados em `content/tech.ts`
  (nomes das categorias no `site.ts`). Sem ícone no simple-icons (SQL, Java, C#, OpenAI API, Whisper, Evolution
  API, webhooks, APIs REST, Lovable, Bubble, Azure) ou com ícone que é o próprio nome escrito (.NET, MySQL): só o
  nome, no mesmo selo.
- Sem versão EN: a página EN mostra o texto em português (`lang="pt-BR"`), com aviso,
  canonical para a versão PT e fora do sitemap.
- Template: cabeçalho com metadados em mono → vídeo ou arte → "Resumo em 30 segundos" (`tldr`) →
  corpo MDX na ordem contexto e problema → minha função → (como funciona) → solução e arquitetura → stack →
  decisões e trade-offs → resultado → (o mesmo padrão em outro nicho) → aprendizados → próximo caso.
- Blocos no MDX sem import (`mdx-components.tsx`): `<Flow>` (diagrama; `alt` = caminho
  alternativo, `altLabel` = "ou"/"or"; `accent: true` destaca a etapa final), `<Architecture>` (dois blocos,
  "minha parte" e "sistema da equipe", ligados por uma seta com rótulo; cada bloco tem uma fila de etapas e um item
  opcional ligado por baixo, `side.under`; vira coluna no celular), `<Decision>`, `<Metrics>`/`<Metric>`, `<Chat>` com
  `<Message from="customer|agent">` e `<ChatNote>` (conversa com selo "exemplo ilustrativo"),
  `<Gallery>`/`<Shot>` (capturas com `next/image`; `<Shot layout="column|wide">` sozinha), `<PaperFigure>`
  (figura de artigo em cartão claro, legenda em mono, nota e link para o tamanho real em nova aba) e `<DataTable>`
  (o MDX não tem tabelas em Markdown). Nada de rolagem horizontal: diagrama com texto vira `<Flow>`.
- `meta.live` = demonstração pública externa: botão "Testar ao vivo (usa a câmera)" no topo do caso, em nova aba.
  Com `meta.liveEmbed`, a versão pública vai para a seção "Experimente" (`<Demo />` no MDX) e o topo do caso ganha
  só um link para ela ("Testar ao vivo ↓" / "Try it live ↓"). `components/case-study/live-frame.tsx`: moldura de
  navegador (barra com o endereço de `meta.live`); antes do clique, só a prévia (o vídeo do topo do caso em loop),
  o botão "Abrir demo ao vivo" / "Open live demo", a dica "Depois, clique em Ativar câmera" e o aviso "Roda no seu navegador: nenhuma imagem sai do seu computador", sem
  nenhuma requisição ao site. O clique cria o iframe (`allow="camera; fullscreen"`, foco nele); "Encerrar",
  sair da página (`pagehide`) ou desmontar removem o iframe e desligam a câmera. "Abrir em nova aba" sempre
  visível. `meta.liveIntro` = intro da seção; `meta.demoNote` = nota sob a moldura. O cabeçalho fixo do site do IFSP fica
  escondido: o iframe sobe dentro da caixa (`overflow-hidden`) e cresce na mesma medida, 60 px até 880 px de
  largura do iframe e 75 px acima (container query `@min-[881px]`; medidas de 04/11/2026, `cropClassName` em
  `try-it.tsx`). Se o IFSP mudar o cabeçalho, remedir. No celular a moldura ocupa a
  largura da tela e a altura sob o header, menos `--demo-reserve` (cabem a câmera e a letra reconhecida).
  `meta.demo` = slug de uma demo do site, mostrada na seção "Experimente" do caso (ver "Demos dentro dos estudos
  de caso"); não há botão "Abrir demo".
- Blocos que dependem do idioma (`<Video>`, `<Signature>`) são passados por `case-study-page.tsx`
  em `<Body components={...}>`, com os rótulos do `site.ts` do idioma do texto.
- `meta.media.video` = vídeo no topo do caso no lugar da arte
  (vídeo com menos de 1000 px de largura fica na largura da coluna de texto, sem esticar). `video.controls: true` =
  vídeo longo com controles nativos, sem tocar sozinho e com `preload="none"` (só baixa no play).
  `meta.privateCode` = nota de código privado no lugar do link do repositório, no topo do caso. `meta.draft` (padrão `true`) mostra o aviso de texto provisório.
- Vídeos (`components/case-study/loop-video.tsx`): sem som, loop, `preload="none"` com poster; o arquivo
  só é baixado depois do load e quando entra na tela, pausa fora dela; botão Pausar/Reproduzir (WCAG 2.2.2);
  com reduced motion não toca sozinho.
- Mídia do agente: `public/agente-baterias/midia-agente-baterias/` (já censurada). Os `.png` originais ficam
  fora do git; o site usa só `.webp` e `.mp4`.
- Mídia do LibrasFlow: `public/librasflow/` (vídeo e poster convertidos do GIF de demonstração do repositório,
  sem a faixa do editor). O banner do repositório não é usado
  (estética de "IA brilhante", contra as regras visuais). Figuras do artigo em `public/librasflow/midia-librasflow/`
  (matriz de confusão e interface), com rótulos em português; a legenda avisa isso. O pipeline é um `<Flow>` de
  6 etapas traduzido (a figura do pipeline foi apagada).
- Artes dos cards (`components/art/project-art.tsx`), SVG do servidor, decorativas, todas no mesmo sistema:
  `viewBox` 320×200 (card em 16:10), traço de 1,5, painéis arredondados, um único acento verde, grade de pontos e
  brilho embaixo. Paleta sempre escura (#0a0b0d, #15171b, verde #7ee08f), também no tema claro: a arte é uma
  "tela" dentro do card. `agent` (chat + banco), `hand` (21 pontos da mão fazendo o L), `kanban`, `phone`
  (celular com horários, Barbú), `map` (mapa com pino, Ajuda Animal), `charger` (carregador + bateria) e `planned`.
  A arte também aparece no topo do caso que não tem vídeo.
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
  Em 04/11/2026 o librasflow.ifsp.dev não mandava `X-Frame-Options`, CSP (nem em `<meta>`) ou `Permissions-Policy`,
  e os scripts não fogem do iframe; por isso abre embutido em `/#palco-demo` (o palco da câmera; `/#demo` parava no
  título da seção). Dentro do iframe a pessoa ainda clica em "Ativar câmera", que é do site do IFSP; o reconhecimento roda no navegador (o `demo.js` só busca o modelo), o que sustenta a frase "nenhuma
  imagem sai do seu computador". A página pública é só em português; o texto EN avisa. A versão nativa
  ("Experimente" com `@mediapipe/tasks-vision` e a MLP em JSON) depende do código em `docs/referencias/librasflow-web`,
  que ainda não existe.
- Barbú (fonte: repositório barbu_barbearia, pasta `Tela_Home_Inicial/lib`, clonado em `docs/referencias/barbu`):
  projeto em equipe de 4 (Carlos, Gustavo Alves, Henrique e Kendy) na disciplina de Dispositivos Móveis. Gustavo fez
  grande parte do app: Firebase Auth e Firestore, telas iniciais, login, agendamento e integração com o n8n.
  Substituiu o card do repositório Gest-o_Projetos_Barb-. O webhook do n8n aponta para localhost e o fluxo do n8n
  não está no repositório (por isso o e-mail da demo é "prévia ilustrativa"). Limites citados no caso, tirados do
  código: a consulta de horários não filtra o status e a gravação não usa transação.
- Ajuda Animal (fonte: `docs/conteudo/conteudo-ajuda-animal.md` e a branch `feature-bot-whatsapp-n8n`, extraída em
  `docs/referencias/ajuda-animal`): projeto de extensão do IFSP Jacareí com a Prefeitura de Jacareí (Secretaria de
  Proteção Animal), em equipe. Gustavo fez o canal do WhatsApp: bot no n8n, integração com o core-api (REST +
  `x-service-key`) e a tabela `whatsapp_sessions`; painel e API são da equipe. Protótipo demonstrado em 19/10/2026,
  sem produção. Repositório privado: sem link de código, só a nota `privateCode`. Vídeo em
  `public/ajuda-animal/midia-ajuda-animal/` (endereços desfocados, em português). O slide de arquitetura do vídeo virou
  `<Architecture>` e o arquivo ficou em `docs/referencias/ajuda-animal`. Nunca usar o `n8n_ajudaanimal.json`
  exportado (tem o número pessoal e a chave da Evolution API); só o fluxo da branch, com marcadores.
- Carregadores de veículos elétricos (`carregadores-ev`; fonte: `docs/conteudo/conteudo-agente-baterias.md`,
  seção "Mesmo padrão, outro nicho"): projeto na Hunt Sales, cliente nunca identificado. Período "2026 · Hunt
  Sales" (confirmado). O conteúdo saiu do caso das baterias, que
  ficou com uma linha e o link. Só fatos da fonte: veículos (kWh, limite AC), produtos com várias saídas,
  simulador, multiempresa, Realtime, gravações pelo webhook do n8n; stack Node.js/Express, HTML/CSS/JS, Supabase, n8n.
- Plataforma de demandas: o README fala em RLS, mas o código usa a chave de serviço e checa permissões
  no Flask. O caso descreve o que o código faz. Foi o "case técnico do processo seletivo em que fui aprovado"
  ("technical case from the hiring process I passed"), sem citar a empresa.

## Demos dentro dos estudos de caso

**Regra: toda demo nova fica dentro do estudo de caso**, na seção "Experimente" / "Try it", como a assinatura
do agente de baterias. Nada de página separada nem botão "Abrir demo": o visitante abre o projeto e vê o contexto,
a arquitetura, a demo funcionando e os resultados. Continuam valendo (`docs/conteudo/conteudo-librasflow-e-demos.md`,
Parte 2): selo que diz que os dados são fictícios, notas sobre o que é real e o que é simulado, nenhuma marca
de terceiros.

- Ligar uma demo: `meta.demo: "<slug>"` e `<Demo />` no MDX, no ponto do texto (padrão: logo depois da seção de
  arquitetura ou "Como funciona", antes de Stack). O slug precisa estar em `lib/demos.ts` (conteúdo) e em
  `components/case-study/lazy-demo.tsx` (import); slug desconhecido quebra o build.
- Versão pública hospedada em outro site (LibrasFlow): `meta.liveEmbed` + `<Demo />`, na mesma seção, dentro da
  moldura de navegador de `live-frame.tsx` (ver `meta.live` acima). Antes de usar, conferir com `curl -I` que o
  site aceita iframe.
- `components/case-study/try-it.tsx` (servidor): título com âncora (`caseStudy.tryIt.id`: `#experimente` /
  `#try-it`), intro, selo, a demo e as notas. O texto fica na coluna de leitura; a demo sai dela e usa a largura
  do conteúdo (o `<article>` do caso é `@container`; margem `calc(50% - 50cqi)`) e, no celular, a da tela
  (`-mx-4`), sem rolagem lateral.
- Carregamento: `lazy-demo.tsx` (cliente) espera a seção chegar a 300 px da tela (IntersectionObserver) e só então
  faz o `import()` da demo, que é um chunk próprio. Nada depende de hover. Plano B, para o celular: a mesma
  conferência de posição em `scroll`, `touchend` e `resize` (passivos), carga imediata sem IntersectionObserver,
  botão "Carregar a demo" sobre o esqueleto e "Tentar de novo" se o `import()` falhar. Até lá fica o esqueleto vindo do servidor
  (`components/demos/<slug>/skeleton.tsx`, mesma altura). O caso continua estático e o texto aparece primeiro.
  A demo nunca é renderizada no servidor (usa o relógio e a memória do navegador).
- `--demo-reserve` (3rem no celular, 0 a partir de 640px): altura que fica livre fora das demos em moldura de
  celular, para a página continuar rolando (as áreas internas usam `overscroll-contain`).
- As rotas antigas `/demos/<slug>` e `/en/demos/<slug>` redirecionam (308) para `/projetos/<caso>#experimente` e
  `/en/projects/<caso>#try-it` (mapa `movedDemos` no `next.config.ts`; demo nova não entra nele).
- Card da home: selo discreto "demo interativa" / "interactive demo" nos projetos com `meta.demo` ou
  `meta.liveEmbed` (LibrasFlow).
- Textos em `content/<idioma>/demos/<slug>.ts` (`section`: selo, intro e notas, tipo `DemoSectionText`),
  tipados em `content/demos/<slug>-types.ts`.
- Títulos no fluxo das demos começam em h3 (a seção é h2); títulos de diálogo ficam em h2.
- Demo de demandas (`components/demos/demandas/`): "Painel de Demandas" / "Request Board", recriação do
  repositório desafio-Gaudium sem a marca. Estado no `localStorage`; no celular o quadro vai de ponta a ponta.
  `logic.ts` é puro: regras de permissão do Flask (admin vê e altera tudo;
  colaborador vê só o próprio setor de destino e altera só esses), SLA do `script.js` (75/90%, atrasado,
  cumprido), tempo apontado e payloads do n8n (`novo_ticket`, `ticket_assumido`, `ticket_concluido`, mais o alerta
  de 48 h sem atividade como verificação agendada). Usuários fictícios Ana (RH), Carlos (Comercial) e Marina (TI,
  admin), e-mails `@example.com`. Eventos como no original: só a mudança de `status` (arrastar no Kanban, Concluir) dispara;
  os botões Assumir/Retomar/Pausar equivalem ao `status_execucao` e não disparam evento.
- Demo do Barbú (`components/demos/barbu/`): protótipo navegável recriado em React a partir do app em Flutter,
  com o selo "Protótipo web recriado a partir do app em Flutter · dados fictícios". A partir de 640px fica numa
  moldura de celular; abaixo disso ocupa a largura da tela e a altura sob o header, menos `--demo-reserve`.
  Cores do `app_theme.dart` (#0A0A0A, #1A1A1A, #121212, #D32F2F); texto vermelho em #EF5350 para passar AA.
  Tudo em memória (volta ao início ao recarregar). Telas: splash, login com "Esqueceu a senha?", cadastro
  (senha mínima de 6), início, agendamento em 3 etapas, sucesso, histórico com cancelamento, avisos, perfil e
  Fidelidade/Produtos "em desenvolvimento". Ao confirmar, "Nos bastidores" mostra o documento em `bookings`,
  o aviso em `notifications/{uid}/items`, o lembrete 1 h antes, o JSON do webhook e a prévia do e-mail: em folha
  dentro do celular e, a partir de 1024px, num painel ao lado. Diferenças assumidas (nas notas da seção): ocupados
  aparecem riscados em vez de sumir e horários de hoje que já passaram ficam desativados.
- Simulador de recarga (`components/demos/carregadores/`, caso `carregadores-ev`): o visitante escolhe um de 5 carros
  fictícios (kWh e limite AC em `content/demos/carregadores-types.ts`) e vê o tempo de 0 a 100% em cada saída de
  4 carregadores fictícios (1 ou 2 saídas), por `tempo (h) = bateria ÷ min(limite AC, potência da saída)`, com a
  conta e "limitado pelo carro/carregador". As saídas mais rápidas (pode haver empate) ficam em verde. Começa no
  sedã (AC de 11 kW), que mostra o gargalo: a saída de 22 kW não ajuda. Selo "Simulação com dados fictícios".
- Demo do Ajuda Animal (`components/demos/ajuda-animal/`): simulador da conversa com o bot, numa tela de chat escura
  e neutra (sem a identidade do WhatsApp), com o selo "Simulação com dados fictícios · sem WhatsApp, sem banco".
  `logic.ts` replica o fluxo do n8n: mesmos textos (sem emojis), roteador de etapas (as etapas da denúncia não
  validam a resposta, como no fluxo), comandos `menu`/`voltar`/`cancelar` e `zerar`, o nó "Code: Montar Denuncia"
  (tipos, espécie por palavra-chave, lat/lng ou endereço, `allowContact` só na opção 2) e o protocolo e a
  normalização do core-api. Bastidores: caminho pelos nós do fluxo, linha de `whatsapp_sessions` com o que mudou,
  a chamada ao core-api (`x-service-key: ••••`) e a miniatura do painel (mapa SVG fictício, "Avançar status").
  Caixa "Simular falha da API" mostra as mensagens de erro do fluxo. No EN, os textos, comandos e palavras de
  espécie são traduzidos. Sem botão do GitHub (código privado).
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
  próprio carregado só quando a seção "Experimente" chega perto da tela.
- `buttonVariants` devolve as classes já mescladas (`cn`); sem isso a borda do `outline` perdia para o
  `border-transparent` da base.
- Fontes pré-carregadas: três arquivos, ~95 KB no total.

## Desenvolvimento e verificação

- Celular na rede local: `npm run dev -- -H 0.0.0.0` e `http://<IP>:3000`. O `next dev` bloqueia o JavaScript de
  desenvolvimento pedido por outra origem; sem `allowedDevOrigins` (IP da máquina e `192.168.*.*` no
  `next.config.ts`) a página abre sem hidratar: links funcionam, demos e botões não. Só afeta o dev; o build de
  produção (`next start -H 0.0.0.0`) não tem essa trava.
- As páginas `[slug]` exportam `instant = false`: tira a validação de navegação instantânea do dev, que acusava
  `params` fora de `<Suspense>` (as páginas são todas geradas no build).
- Teste de toque no Chrome headless: `Input.dispatchTouchEvent` (arrasto de dedo) com
  `Emulation.setTouchEmulationEnabled`; `Input.synthesizeScrollGesture` com toque não rola no headless.

### Verificação visual

Headless Chrome não abre janela menor que 500px. Para 360px e para o tema claro, usar o
Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride` + `localStorage.theme`).

## Pendências conhecidas

- Repositório: github.com/SantosGAlves/portfolio (público).
- CV em PDF (PT e EN), e-mail e LinkedIn: `[CONFIRMAR]`. GitHub confirmado: github.com/SantosGAlves.
- 404 personalizada: com vários layouts raiz, o 404 padrão sai sem `lang`; resolver na Fase 3/4
  (`app/global-not-found.tsx`, ainda experimental no Next 16).
- Imagem Open Graph: Fase 4.
- Textos reais dos estudos de caso: agente, LibrasFlow e plataforma de demandas prontos (`draft: false`);
  Barbú e Ajuda Animal prontos.
