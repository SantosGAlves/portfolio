import type { MetadataRoute } from "next"
import { demoPath, demos } from "@/lib/demos"
import { homePath } from "@/lib/i18n"
import { caseStudyPath, getCaseStudies } from "@/lib/projects"
import { getSiteUrl } from "@/lib/site-url"

// Cada página aparece uma vez por idioma, com as alternativas (hreflang).
// Caso sem versão em inglês: só a página em português entra.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const url = (path: string) => new URL(path, base).toString()

  const home = { "pt-BR": url(homePath("pt-BR")), en: url(homePath("en")) }
  const entries: MetadataRoute.Sitemap = [
    { url: home["pt-BR"], alternates: { languages: home } },
    { url: home.en, alternates: { languages: home } },
  ]

  const enBySlug = new Map(getCaseStudies("en").map((p) => [p.slug, p]))
  for (const project of getCaseStudies("pt-BR")) {
    const pt = url(caseStudyPath("pt-BR", project.slug))
    if (enBySlug.get(project.slug)?.fallback === false) {
      const languages = { "pt-BR": pt, en: url(caseStudyPath("en", project.slug)) }
      entries.push({ url: pt, alternates: { languages } }, { url: languages.en, alternates: { languages } })
    } else {
      entries.push({ url: pt })
    }
  }
  // Demos: mesma rota nos dois idiomas.
  for (const slug of Object.keys(demos)) {
    const languages = { "pt-BR": url(demoPath("pt-BR", slug)), en: url(demoPath("en", slug)) }
    entries.push({ url: languages["pt-BR"], alternates: { languages } }, { url: languages.en, alternates: { languages } })
  }
  return entries
}
