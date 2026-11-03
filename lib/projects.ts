import type { MDXContent } from "mdx/types"
import { projectMetaSchema, sharedProjectFields, type ProjectMeta } from "@/content/project-schema"
import { defaultLocale, locales, type Locale } from "@/lib/i18n"

// Carrega todos os estudos de caso no build: content/<idioma>/projects/<slug>.mdx.
// Para adicionar um projeto, basta criar o arquivo .mdx (ver content/README.md).
//
// Regras validadas aqui (o build falha se alguma quebrar):
// - `meta` segue projectMetaSchema;
// - o português é a fonte: todo projeto existe em content/pt-BR/projects;
// - campos compartilhados (ordem, status, stack...) são iguais nos dois idiomas.

type MdxModule = { default: MDXContent; meta?: unknown }

const modules = import.meta.glob<MdxModule>("/content/*/projects/*.mdx", { eager: true })

type Entry = { meta: ProjectMeta; Body: MDXContent }

export type Project = Entry & {
  slug: string
  /** Idioma em que o conteúdo está escrito (pode diferir do pedido, ver `fallback`). */
  contentLocale: Locale
  /** true quando não há versão no idioma pedido e o português é usado no lugar. */
  fallback: boolean
}

function buildRegistry() {
  const registry = Object.fromEntries(locales.map((l) => [l, new Map<string, Entry>()])) as Record<
    Locale,
    Map<string, Entry>
  >

  for (const [file, mod] of Object.entries(modules)) {
    const match = /^\/content\/([^/]+)\/projects\/([a-z0-9-]+)\.mdx$/.exec(file)
    if (!match) throw new Error(`Nome de arquivo inválido: ${file} (use letras minúsculas, números e hífens).`)
    const [, locale, slug] = match
    if (!(locales as readonly string[]).includes(locale)) throw new Error(`Idioma desconhecido em ${file}.`)

    const parsed = projectMetaSchema.safeParse(mod.meta)
    if (!parsed.success) {
      throw new Error(`Metadados inválidos em ${file}:\n${parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n")}`)
    }
    registry[locale as Locale].set(slug, { meta: parsed.data, Body: mod.default })
  }

  const source = registry[defaultLocale]
  for (const locale of locales) {
    if (locale === defaultLocale) continue
    for (const [slug, entry] of registry[locale]) {
      const base = source.get(slug)
      if (!base) throw new Error(`content/${locale}/projects/${slug}.mdx não tem versão em ${defaultLocale}.`)
      for (const field of sharedProjectFields) {
        if (JSON.stringify(base.meta[field]) !== JSON.stringify(entry.meta[field])) {
          throw new Error(`"${field}" de ${slug} difere entre ${defaultLocale} e ${locale}.`)
        }
      }
    }
  }
  return registry
}

const registry = buildRegistry()

function resolve(locale: Locale, slug: string): Project | undefined {
  const own = registry[locale].get(slug)
  if (own) return { ...own, slug, contentLocale: locale, fallback: false }
  const base = registry[defaultLocale].get(slug)
  return base ? { ...base, slug, contentLocale: defaultLocale, fallback: true } : undefined
}

/** Todos os projetos no idioma pedido (com o português como reserva), em ordem. */
export function getProjects(locale: Locale): Project[] {
  return [...registry[defaultLocale].keys()]
    .map((slug) => resolve(locale, slug)!)
    .sort((a, b) => a.meta.order - b.meta.order)
}

/** Tem página de estudo de caso: não é "planned" nem marcado com `page: false`. */
export function hasCaseStudy(project: Project): boolean {
  return project.meta.page && project.meta.status !== "planned"
}

/** Projetos com página de estudo de caso, na ordem da página inicial. */
export function getCaseStudies(locale: Locale): Project[] {
  return getProjects(locale).filter(hasCaseStudy)
}

export function getCaseStudy(locale: Locale, slug: string): Project | undefined {
  const project = resolve(locale, slug)
  return project && hasCaseStudy(project) ? project : undefined
}

/** O próximo estudo de caso na ordem da página inicial (volta ao primeiro no fim). */
export function getNextCaseStudy(locale: Locale, slug: string): Project | undefined {
  const list = getCaseStudies(locale)
  if (list.length < 2) return undefined
  const i = list.findIndex((p) => p.slug === slug)
  return list[(i + 1) % list.length]
}

export function caseStudyPath(locale: Locale, slug: string): string {
  return locale === defaultLocale ? `/projetos/${slug}` : `/en/projects/${slug}`
}
