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
  tier: "secondary",        // "featured" = destaque (o 1º em largura total) | "secondary" = card menor
  page: true,               // false = sem estudo de caso; o card leva ao repositório
  repo: "https://github.com/...", // opcional: link "Código no GitHub"
  live: "https://...",      // opcional: botão "Testar ao vivo" no topo do caso (nova aba)
  liveEmbed: "https://...", // opcional: abre a demo numa janela dentro do caso (iframe com câmera);
                            // só se o site permitir iframe (sem X-Frame-Options nem frame-ancestors)
  liveExternal: "...",      // opcional: texto do link para a versão externa (ex.: "Abrir a versão do IFSP")
  liveIntro: "...",         // opcional: frases de abertura da janela
  demo: "demandas",         // opcional: demo dentro do site (/demos/demandas), botão "Abrir demo"
  demoNote: "...",          // opcional: nota curta sob os botões de demo
  status: "shipped",        // "shipped" | "in-progress" | "planned" (card sem página)
  art: "automation",        // "battery" | "librasflow" | "automation" | "kanban" | "planned"
  title: "Nome do projeto",
  kind: "Agente de IA · n8n", // rótulo curto acima do título
  summary: "Duas linhas para o card (até 220 caracteres).",
  role: "O que eu fiz",
  period: "2026",
  stack: ["Python", "Supabase"], // nomes de ferramentas (iguais nos dois idiomas)
  tldr: [
    { label: "Problema", text: "..." },
    { label: "Solução", text: "..." },
    { label: "Resultado", text: "..." },
  ],
  draft: true,              // false quando o texto estiver revisado (tira o aviso do topo)
  media: {                  // opcional; arquivos em public/
    cover: { src: "/pasta/imagem.webp", alt: "...", width: 1540, height: 824, fit: "frame" }, // "frame" (tela) | "fill" (foto)
    video: { src: "/pasta/video.mp4", poster: "/pasta/poster.webp", width: 1280, height: 720, label: "...", caption: "..." },
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
```

3. (Opcional) Crie `content/en/projects/<slug>.mdx` com o mesmo `order`, `tier`, `page`,
   `repo`, `status`, `art` e `stack`. Se não existir, a página em inglês mostra o texto em
   português com um aviso e aponta o canonical para a versão em português.
Repositórios pequenos, sem card, entram na lista "Mais no GitHub" em `site.ts` → `projects.more`.

4. Rode `npm run build`. Metadado faltando ou diferente entre os idiomas derruba o build
   com a mensagem do que corrigir.

Nunca invente números, empresas ou resultados: use `[CONFIRMAR]`.
