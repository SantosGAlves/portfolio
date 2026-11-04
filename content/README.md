# Conteúdo do site

Todo texto do site fica aqui. Os componentes só leem estes arquivos.

```
content/
├─ types.ts               # formato dos textos da página inicial
├─ project-schema.ts      # formato dos metadados dos projetos (validado no build)
├─ pt-BR/site.ts          # textos da página inicial em português (fonte)
├─ en/site.ts             # espelho em inglês, mesmo formato
├─ pt-BR/projects/*.mdx   # um arquivo por projeto (estudo de caso)
└─ en/projects/*.mdx      # versões em inglês (opcionais)
```

Marcadores: `[CONFIRMAR]` = dado real que falta; `[REVISAR]` = tradução a revisar.

## Adicionar um projeto

1. Crie `content/pt-BR/projects/<slug>.mdx`. O nome do arquivo vira a URL
   (`/projetos/<slug>` e `/en/projects/<slug>`): letras minúsculas, números e hífens.
2. Comece pelos metadados e siga a ordem das seções:

```mdx
export const meta = {
  order: 5,                 // posição na página inicial
  tier: "featured",         // "featured" = card com arte na grade de destaques (2 colunas, mesmo peso)
                            // | "secondary" = linha na lista "Outros projetos" (ano, título, frase)
  page: true,               // false = sem estudo de caso; o card leva ao repositório
  repo: "https://github.com/...", // opcional: link "Código no GitHub"
  privateCode: "...",       // opcional: nota de código privado no lugar do link, no topo do caso
  live: "https://...",      // opcional: botão "Testar ao vivo" no topo do caso (nova aba)
  liveEmbed: "https://...", // opcional: versão pública embutida na seção "Experimente" (<Demo />), numa moldura
                            // de navegador; o iframe com câmera só carrega no clique. O topo ganha um link
                            // para a seção. Só se o site permitir iframe (sem X-Frame-Options nem frame-ancestors)
  liveIntro: "...",         // opcional: introdução da seção da versão embutida
  demo: "demandas",         // opcional: demo do site; aparece onde o texto tiver <Demo /> (seção "Experimente")
  demoNote: "...",          // opcional: nota curta sobre a demonstração ao vivo (sob a moldura)
  status: "shipped",        // "shipped" | "in-progress" | "planned" (card sem página)
  art: "map",               // ilustração do card: "agent" | "hand" | "kanban" | "phone" | "map" | "charger" | "planned"
  title: "Nome do projeto",
  shortTitle: "Nome curto", // opcional: título no card, quando o do caso é longo
  tagline: "Uma frase para o card (até 140 caracteres).", // sem ela, o card usa summary
  kind: "Agente de IA · n8n", // rótulo curto acima do título
  summary: "Subtítulo do caso e descrição para buscadores (até 220 caracteres).",
  role: "O que eu fiz",
  period: "2026",           // começa pelo ano: o card mostra o trecho antes do " · "
  stack: ["Python", "Supabase"], // nomes de ferramentas (iguais nos dois idiomas); os 4 primeiros vão para o card
  tldr: [
    { label: "Problema", text: "..." },
    { label: "Solução", text: "..." },
    { label: "Resultado", text: "..." },
  ],
  draft: true,              // false quando o texto estiver revisado (tira o aviso do topo)
  media: {                  // opcional; arquivos em public/; só no estudo de caso (o card usa sempre a arte)
    video: { src: "/pasta/video.mp4", poster: "/pasta/poster.webp", width: 1280, height: 720, label: "...", caption: "..." },
    // controls: true = vídeo longo: controles nativos, sem tocar sozinho, só baixa no play
  },
}

## Contexto e problema
## Minha função
## Solução e arquitetura

<Flow
  altLabel="ou"
  steps={[
    { title: "Entrada", detail: "..." },
    { title: "Processamento", detail: "..." },
    { title: "Caminho alternativo", detail: "...", alt: true },
  ]}
/>

<Architecture
  link="HTTP + chave"
  groups={[
    { label: "Minha parte", mine: true, nodes: [{ title: "A" }, { title: "B" }], side: { title: "banco", under: 1, link: "lê e grava" } },
    { label: "Sistema da equipe", nodes: [{ title: "API" }, { title: "Banco" }], side: { title: "Painel", under: 0, link: "JWT", dir: "up" } },
  ]}
/>

## Stack
## Decisões e trade-offs

<Decision title="O que foi decidido" tradeoff="O que isso custou">
  Por que foi a escolha certa.
</Decision>

## Resultado

<Metrics>
  <Metric value="[CONFIRMAR]" label="O que foi medido" />
</Metrics>

## Aprendizados
```

Outros blocos disponíveis:

```mdx
<Chat title="Cenário 1" badge="exemplo ilustrativo" customer="Cliente" agent="Agente">
<Message from="customer">Pergunta do cliente</Message>
<Message from="agent">Resposta do agente</Message>
<ChatNote label="nos bastidores">O que o sistema fez.</ChatNote>
</Chat>

<Video src="/pasta/video.mp4" poster="/pasta/poster.webp" width={1280} height={720} label="Descrição" caption="Legenda" />

<Gallery>
  <Shot src="/pasta/tela.webp" width={1540} height={824} alt="Descrição" caption="Legenda" />
</Gallery>

<Shot layout="wide" minWidth={720} src="/pasta/diagrama.webp" width={1190} height={240} alt="..." caption="..." />

<DataTable caption="Legenda" head={["Coluna", "Valor"]} rows={[["Linha", "1"]]} highlight={0} />

<Signature />   {/* demonstração interativa do agente (texto em site.ts) */}
<Demo />        {/* seção "Experimente" com a demo de meta.demo; padrão: depois da arquitetura, antes de Stack */}
```

3. (Opcional) Crie `content/en/projects/<slug>.mdx` com o mesmo `order`, `tier`, `page`,
   `repo`, `status`, `art` e `stack`. Se não existir, a página em inglês mostra o texto em
   português com um aviso e aponta o canonical para a versão em português.
Repositórios pequenos, sem página, entram na lista "Outros projetos" em `site.ts` → `projects.more` (título, ano, uma frase, link).

4. Rode `npm run build`. Metadado faltando ou diferente entre os idiomas derruba o build
   com a mensagem do que corrigir.

Nunca invente números, empresas ou resultados: use `[CONFIRMAR]`.
