import { z } from "zod"

// Metadados de cada estudo de caso (export const meta = {...} no .mdx).
// Validados no build por lib/projects.ts: campo faltando ou errado derruba o build.

export const projectStatuses = ["shipped", "in-progress", "planned"] as const
export const projectArts = ["battery", "librasflow", "automation", "planned"] as const

export const projectMetaSchema = z.object({
  /** Ordem na página inicial (menor primeiro). */
  order: z.number().int(),
  /** Projeto principal: card grande, em largura total. */
  featured: z.boolean().default(false),
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
})

export type ProjectMeta = z.output<typeof projectMetaSchema>
export type ProjectStatus = (typeof projectStatuses)[number]
export type ProjectArt = (typeof projectArts)[number]

/** Campos que precisam ser iguais nos dois idiomas. */
export const sharedProjectFields = ["order", "featured", "status", "art", "stack"] as const
