import type { Metadata } from "next"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getCaseStudies, getCaseStudy } from "@/lib/projects"

// Peças compartilhadas pelas rotas /projetos/[slug] e /en/projects/[slug].

export function caseStudyParams() {
  // Mesmos slugs nos dois idiomas; o português é a fonte.
  return getCaseStudies("pt-BR").map((p) => ({ slug: p.slug }))
}

export function caseStudyMetadata(locale: Locale, slug: string): Metadata {
  const project = getCaseStudy(locale, slug)
  if (!project) return {}
  const { profile, ogLocale } = getContent(locale)
  const path = caseStudyPath(locale, slug)
  const ptPath = caseStudyPath("pt-BR", slug)

  return {
    title: project.meta.title,
    description: project.meta.summary,
    // Sem versão própria neste idioma: a página aponta para o original em português.
    alternates: project.fallback
      ? { canonical: ptPath }
      : { canonical: path, languages: { "pt-BR": ptPath, en: caseStudyPath("en", slug), "x-default": ptPath } },
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: path,
      siteName: profile.name,
      title: project.meta.title,
      description: project.meta.summary,
    },
    twitter: { card: "summary_large_image", title: project.meta.title, description: project.meta.summary },
  }
}
