import { site as en } from "@/content/en/site"
import { site as ptBR } from "@/content/pt-BR/site"
import type { Locale, SiteContent } from "@/content/types"

export { locales, type Locale } from "@/content/types"

export const defaultLocale: Locale = "pt-BR"

const content: Record<Locale, SiteContent> = { "pt-BR": ptBR, en }

export function getContent(locale: Locale): SiteContent {
  return content[locale]
}

/** Rótulo curto do seletor de idioma. */
export const localeLabel: Record<Locale, string> = { "pt-BR": "PT", en: "EN" }

/** PT-BR fica na raiz; os outros idiomas ganham prefixo. */
export function localePrefix(locale: Locale): "" | `/${string}` {
  return locale === defaultLocale ? "" : "/en"
}

export function homePath(locale: Locale): string {
  return localePrefix(locale) || "/"
}

// Segmentos de rota traduzidos (PT → EN). Novas rotas entram aqui.
const segmentMap: Record<string, string> = { projetos: "projects" }
const reverseSegmentMap = Object.fromEntries(Object.entries(segmentMap).map(([pt, enSeg]) => [enSeg, pt]))

/** Converte um caminho do idioma atual para o equivalente no outro idioma. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean)
  const isEn = parts[0] === "en"
  const rest = isEn ? parts.slice(1) : parts

  if (target === "en") {
    const mapped = isEn ? rest : rest.map((seg, i) => (i === 0 ? (segmentMap[seg] ?? seg) : seg))
    return "/" + ["en", ...mapped].join("/")
  }
  const mapped = isEn ? rest.map((seg, i) => (i === 0 ? (reverseSegmentMap[seg] ?? seg) : seg)) : rest
  return "/" + mapped.join("/")
}

/** Alternativas de idioma para metadata (hreflang). */
export function languageAlternates(ptPath: string, enPath: string) {
  return { "pt-BR": ptPath, en: enPath, "x-default": ptPath }
}
