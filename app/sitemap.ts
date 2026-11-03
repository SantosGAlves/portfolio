import type { MetadataRoute } from "next"
import { homePath } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"

// Cada página aparece uma vez por idioma, com as alternativas (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const url = (path: string) => new URL(path, base).toString()
  const languages = { "pt-BR": url(homePath("pt-BR")), en: url(homePath("en")) }

  return [
    { url: languages["pt-BR"], alternates: { languages } },
    { url: languages.en, alternates: { languages } },
  ]
}
