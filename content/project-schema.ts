import { z } from "zod"

// Metadados de cada estudo de caso (export const meta = {...} no .mdx).
// Validados no build por lib/projects.ts: campo faltando ou errado derruba o build.

export const projectStatuses = ["shipped", "in-progress", "planned"] as const
export const projectArts = ["battery", "librasflow", "automation", "kanban", "booking", "planned"] as const
export const projectTiers = ["featured", "secondary"] as const

/** Arquivo em public/ (caminho começando com "/"). */
const publicPath = z.string().regex(/^\/[^\s]+$/, "use um caminho de public/ começando com /")

export const projectMetaSchema = z.object({
  /** Ordem na página inicial (menor primeiro). */
  order: z.number().int(),
  /**
   * featured = destaque (o primeiro em largura total, os outros em duas colunas);
   * secondary = card menor, sem imagem.
   */
  tier: z.enum(projectTiers),
  /** false = sem página de estudo de caso: o card leva ao repositório. */
  page: z.boolean().default(true),
  /** Repositório público (link "Código no GitHub"). */
  repo: z.string().url().optional(),
  /** Código privado: nota no lugar do link do repositório (no caso e na página da demo). */
  privateCode: z.string().optional(),
  /** Demonstração pública ao vivo (link em nova aba no estudo de caso). */
  live: z.string().url().optional(),
  /**
   * Endereço da demonstração para abrir numa janela dentro do caso (iframe com câmera).
   * Só use se o site permitir iframe (sem X-Frame-Options nem frame-ancestors).
   */
  liveEmbed: z.string().url().optional(),
  /** Texto do link para a versão externa (ex.: "Abrir a versão do IFSP"). */
  liveExternal: z.string().optional(),
  /** Frases de abertura da janela da demonstração ao vivo. */
  liveIntro: z.string().optional(),
  /** Demonstração dentro do site (slug de /demos/<slug>): botão "Abrir demo" no estudo de caso. */
  demo: z
    .string()
    .regex(/^[a-z0-9-]+$/, "use o slug da demo, ex.: demandas")
    .optional(),
  /** Nota curta sob os botões de demo (ex.: diferença entre a demo e o que o estudo mede). */
  demoNote: z.string().optional(),
  /** planned = card "em construção", sem página de estudo de caso. */
  status: z.enum(projectStatuses),
  /** Composição abstrata do card (components/art). */
  art: z.enum(projectArts),
  title: z.string().min(1),
  /** Rótulo curto em mono acima do título (ex.: "Agente de IA + sistema de gestão"). */
  kind: z.string().min(1),
  /** Descrição do card: até duas linhas. */
  summary: z.string().min(1).max(220),
  role: z.string().min(1),
  period: z.string().min(1),
  stack: z.array(z.string().min(1)),
  /** "Resumo em 30 s" no topo do estudo de caso. */
  tldr: z
    .array(z.object({ label: z.string().min(1), text: z.string().min(1) }))
    .default([]),
  /** Texto ainda provisório: mostra o aviso de "[CONFIRMAR]" no topo do estudo de caso. */
  draft: z.boolean().default(true),
  /** Mídia real. Sem ela, card e estudo de caso usam a composição de `art`. */
  media: z
    .object({
      /** Imagem do card na página inicial. */
      cover: z
        .object({
          src: publicPath,
          alt: z.string().min(1),
          width: z.number().int(),
          height: z.number().int(),
          /** frame = captura de tela em moldura, cortada embaixo; fill = foto ocupando o card. */
          fit: z.enum(["frame", "fill"]).default("frame"),
        })
        .optional(),
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
export const sharedProjectFields = ["order", "tier", "page", "repo", "live", "liveEmbed", "demo", "status", "art", "stack"] as const
