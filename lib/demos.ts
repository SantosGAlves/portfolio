import type { Metadata } from "next"
import type { DemandasDemoContent } from "@/content/demos/demandas-types"
import { demandas as demandasEn } from "@/content/en/demos/demandas"
import { demandas as demandasPt } from "@/content/pt-BR/demos/demandas"
import { getContent, languageAlternates, localePrefix, type Locale } from "@/lib/i18n"

// Demos interativas dentro do site: /demos/<slug> (PT) e /en/demos/<slug> (EN).
// Cada demo é uma rota própria e carrega só o JavaScript dela.

/** Demo → estudo de caso de origem (para o link de volta e o repositório). */
export const demos = { demandas: { project: "gestao-de-demandas" } } as const
export type DemoSlug = keyof typeof demos

export function demoPath(locale: Locale, slug: string): string {
  return `${localePrefix(locale)}/demos/${slug}`
}

const demandasContent: Record<Locale, DemandasDemoContent> = { "pt-BR": demandasPt, en: demandasEn }

export function getDemandasContent(locale: Locale): DemandasDemoContent {
  return demandasContent[locale]
}

export function demandasDemoMetadata(locale: Locale): Metadata {
  const c = getDemandasContent(locale)
  const { profile, ogLocale } = getContent(locale)
  const path = demoPath(locale, "demandas")
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(demoPath("pt-BR", "demandas"), demoPath("en", "demandas")),
    },
    openGraph: { type: "website", locale: ogLocale, url: path, siteName: profile.name, title: c.seo.title, description: c.seo.description },
    twitter: { card: "summary_large_image", title: c.seo.title, description: c.seo.description },
  }
}
