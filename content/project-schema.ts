import { z } from "zod"

// Metadados de cada estudo de caso (export const meta = {...} no .mdx).
// Validados no build por lib/projects.ts: campo faltando ou errado derruba o build.

export const projectStatuses = ["shipped", "in-progress", "planned"] as const
/** Ilustrações dos cards (components/art/project-art.tsx), todas no mesmo estilo. */
export const projectArts = ["agent", "hand", "kanban", "phone", "map", "charger", "planned"] as const
export const projectTiers = ["featured", "secondary"] as const

/** Arquivo em public/ (caminho começando com "/"). */
const publicPath = z.string().regex(/^\/[^\s]+$/, "use um caminho de public/ começando com /")

export const projectMetaSchema = z.object({
  /** Ordem na página inicial (menor primeiro). */
  order: z.number().int(),
  /**
   * featured = card com arte na grade de destaques (2 colunas, todos com o mesmo peso);
   * secondary = linha na lista compacta "Outros projetos" (ano, título, uma frase, link).
   */
  tier: z.enum(projectTiers),
  /** false = sem página de estudo de caso: o card leva ao repositório. */
  page: z.boolean().default(true),
  /** Repositório público (link "Código no GitHub"). */
  repo: z.string().url().optional(),
  /** Código privado: nota no lugar do link do repositório, no topo do caso. */
  privateCode: z.string().optional(),
  /** Demonstração pública ao vivo: botão em nova aba no topo do caso (ou, com liveEmbed, endereço da moldura). */
  live: z.string().url().optional(),
  /**
   * Endereço embutido na seção "Experimente" (<Demo /> no MDX), numa moldura de navegador; o iframe
   * (allow="camera; fullscreen") só carrega no clique. O topo do caso ganha um link para a seção.
   * Só use se o site permitir iframe (sem X-Frame-Options nem frame-ancestors).
   */
  liveEmbed: z.string().url().optional(),
  /**
   * Imagem parada na moldura da versão embutida, antes do clique (sem ela, a moldura fica só com o botão).
   * Use uma tela da interface, não o vídeo do topo do caso.
   */
  livePreview: z
    .object({ src: publicPath, width: z.number().int(), height: z.number().int(), alt: z.string().min(1) })
    .optional(),
  /** Introdução da seção "Experimente" da versão embutida (liveEmbed). */
  liveIntro: z.string().optional(),
  /** Demo dentro do caso (slug de lib/demos.ts): a seção "Experimente" aparece onde o MDX tem <Demo />. */
  demo: z
    .string()
    .regex(/^[a-z0-9-]+$/, "use o slug da demo, ex.: demandas")
    .optional(),
  /** Nota curta sobre a demonstração ao vivo (sob a moldura, ou sob o botão sem liveEmbed), ex.: diferença entre a demo e o que o estudo mede. */
  demoNote: z.string().optional(),
  /**
   * Selos do card na home, além do automático: "demo" (demo interativa; já entra sozinho com `demo` ou
   * `liveEmbed`) e "delivered" (entregue a cliente).
   */
  badges: z.array(z.enum(["demo", "delivered"])).default([]),
  /** planned = card "em construção", sem página de estudo de caso. */
  status: z.enum(projectStatuses),
  /** Composição abstrata do card (components/art). */
  art: z.enum(projectArts),
  title: z.string().min(1),
  /** Título no card, quando o do estudo de caso é longo (ex.: "Agente de IA + sistema de gestão"). */
  shortTitle: z.string().min(1).optional(),
  /** Uma frase no card (e na lista "Outros projetos"). Sem ela, o card usa `summary`. */
  tagline: z.string().min(1).max(140).optional(),
  /** Rótulo curto em mono acima do título (ex.: "Agente de IA + sistema de gestão"). */
  kind: z.string().min(1),
  /** Subtítulo do estudo de caso e descrição para buscadores e redes. */
  summary: z.string().min(1).max(220),
  role: z.string().min(1),
  /** Linha de fatos no topo do caso: "papel curto · ano · resultado principal" (sem eles, usa `role` e nada). */
  roleShort: z.string().min(1).max(60).optional(),
  outcome: z.string().min(1).max(70).optional(),
  /** Começa pelo ano ("2026 · ...", "2025–2026 · ..."): o card mostra o trecho antes do " · ". */
  period: z.string().min(1),
  /** Os 4 primeiros aparecem no card: ponha os mais representativos antes. */
  stack: z.array(z.string().min(1)),
  /** "Resumo em 30 s" no topo do estudo de caso. */
  tldr: z
    .array(z.object({ label: z.string().min(1), text: z.string().min(1) }))
    .default([]),
  /** Texto ainda provisório: mostra o aviso de "[CONFIRMAR]" no topo do estudo de caso. */
  draft: z.boolean().default(true),
  /** Mídia real, só no estudo de caso (os cards usam sempre a arte de `art`). Sem vídeo, o caso usa a arte. */
  media: z
    .object({
      /** Vídeo no topo do estudo de caso: sem som, em loop, carregado depois da página. */
      video: z
        .object({
          src: publicPath,
          poster: publicPath,
          width: z.number().int(),
          height: z.number().int(),
          /** Descrição do vídeo para leitores de tela. */
          label: z.string().min(1),
          caption: z.string().optional(),
          /**
           * true = vídeo longo: controles nativos, não toca sozinho e só baixa quando a pessoa der play.
           * false (padrão) = sem som, em loop, toca quando entra na tela.
           */
          controls: z.boolean().default(false),
        })
        .optional(),
    })
    .default({}),
})

export type ProjectMeta = z.output<typeof projectMetaSchema>
export type ProjectStatus = (typeof projectStatuses)[number]
export type ProjectArt = (typeof projectArts)[number]
export type ProjectTier = (typeof projectTiers)[number]

/** Campos que precisam ser iguais nos dois idiomas. */
export const sharedProjectFields = ["order", "tier", "page", "repo", "live", "liveEmbed", "demo", "badges", "status", "art", "stack"] as const
