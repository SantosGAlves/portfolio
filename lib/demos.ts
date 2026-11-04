import type { AjudaAnimalDemoContent } from "@/content/demos/ajuda-animal-types"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"
import type { CarregadoresDemoContent } from "@/content/demos/carregadores-types"
import type { DemandasDemoContent } from "@/content/demos/demandas-types"
import { ajudaAnimal as ajudaAnimalEn } from "@/content/en/demos/ajuda-animal"
import { barbu as barbuEn } from "@/content/en/demos/barbu"
import { carregadores as carregadoresEn } from "@/content/en/demos/carregadores"
import { demandas as demandasEn } from "@/content/en/demos/demandas"
import { ajudaAnimal as ajudaAnimalPt } from "@/content/pt-BR/demos/ajuda-animal"
import { barbu as barbuPt } from "@/content/pt-BR/demos/barbu"
import { carregadores as carregadoresPt } from "@/content/pt-BR/demos/carregadores"
import { demandas as demandasPt } from "@/content/pt-BR/demos/demandas"
import type { Locale } from "@/lib/i18n"

// Demos interativas: cada uma vive na seção "Experimente" do próprio estudo de caso (meta.demo + <Demo /> no MDX).
// As rotas antigas /demos/<slug> redirecionam para essa seção (next.config.ts).

export type DemoContentMap = {
  demandas: DemandasDemoContent
  barbu: BarbuDemoContent
  "ajuda-animal": AjudaAnimalDemoContent
  carregadores: CarregadoresDemoContent
}
export type DemoSlug = keyof DemoContentMap

const content: { [S in DemoSlug]: Record<Locale, DemoContentMap[S]> } = {
  demandas: { "pt-BR": demandasPt, en: demandasEn },
  barbu: { "pt-BR": barbuPt, en: barbuEn },
  "ajuda-animal": { "pt-BR": ajudaAnimalPt, en: ajudaAnimalEn },
  carregadores: { "pt-BR": carregadoresPt, en: carregadoresEn },
}

export function isDemoSlug(slug: string): slug is DemoSlug {
  return Object.hasOwn(content, slug)
}

export function getDemoContent<S extends DemoSlug>(slug: S, locale: Locale): DemoContentMap[S] {
  return content[slug][locale]
}
