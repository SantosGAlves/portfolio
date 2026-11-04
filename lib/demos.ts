import type { Metadata } from "next"
import type { AjudaAnimalDemoContent } from "@/content/demos/ajuda-animal-types"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"
import type { DemandasDemoContent } from "@/content/demos/demandas-types"
import { ajudaAnimal as ajudaAnimalEn } from "@/content/en/demos/ajuda-animal"
import { barbu as barbuEn } from "@/content/en/demos/barbu"
import { demandas as demandasEn } from "@/content/en/demos/demandas"
import { ajudaAnimal as ajudaAnimalPt } from "@/content/pt-BR/demos/ajuda-animal"
import { barbu as barbuPt } from "@/content/pt-BR/demos/barbu"
import { demandas as demandasPt } from "@/content/pt-BR/demos/demandas"
import { getContent, languageAlternates, localePrefix, type Locale } from "@/lib/i18n"

// Demos interativas dentro do site: /demos/<slug> (PT) e /en/demos/<slug> (EN).
// Cada demo é uma rota própria e carrega só o JavaScript dela.

/** Demo → estudo de caso de origem (para o link de volta e o repositório). */
export const demos = {
  demandas: { project: "gestao-de-demandas" },
  barbu: { project: "barbu" },
  "ajuda-animal": { project: "ajuda-animal" },
} as const
export type DemoSlug = keyof typeof demos

export function demoPath(locale: Locale, slug: string): string {
  return `${localePrefix(locale)}/demos/${slug}`
}

const demandasContent: Record<Locale, DemandasDemoContent> = { "pt-BR": demandasPt, en: demandasEn }

export function getDemandasContent(locale: Locale): DemandasDemoContent {
  return demandasContent[locale]
}

const barbuContent: Record<Locale, BarbuDemoContent> = { "pt-BR": barbuPt, en: barbuEn }

export function getBarbuContent(locale: Locale): BarbuDemoContent {
  return barbuContent[locale]
}

const ajudaAnimalContent: Record<Locale, AjudaAnimalDemoContent> = { "pt-BR": ajudaAnimalPt, en: ajudaAnimalEn }

export function getAjudaAnimalContent(locale: Locale): AjudaAnimalDemoContent {
  return ajudaAnimalContent[locale]
}

export function demandasDemoMetadata(locale: Locale): Metadata {
  return demoMetadata(locale, "demandas", getDemandasContent(locale).seo)
}

export function barbuDemoMetadata(locale: Locale): Metadata {
  return demoMetadata(locale, "barbu", getBarbuContent(locale).seo)
}

export function ajudaAnimalDemoMetadata(locale: Locale): Metadata {
  return demoMetadata(locale, "ajuda-animal", getAjudaAnimalContent(locale).seo)
}

function demoMetadata(locale: Locale, slug: DemoSlug, seo: { title: string; description: string }): Metadata {
  const { profile, ogLocale } = getContent(locale)
  const path = demoPath(locale, slug)
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(demoPath("pt-BR", slug), demoPath("en", slug)),
    },
    openGraph: { type: "website", locale: ogLocale, url: path, siteName: profile.name, title: seo.title, description: seo.description },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  }
}
