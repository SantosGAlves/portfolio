import { getContent, homePath, type Locale } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"

// Dados estruturados (schema.org). Só entram links confirmados: o que ainda tem
// [CONFIRMAR] fica de fora para não publicar um perfil errado.
export function personJsonLd(locale: Locale) {
  const { profile, hero, experience } = getContent(locale)
  const url = new URL(homePath(locale), getSiteUrl()).toString()
  const sameAs = [profile.links.github, profile.links.linkedin].filter((l) => !l.includes("[CONFIRMAR]"))
  const current = experience.items[0]

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url,
    jobTitle: hero.role,
    address: { "@type": "PostalAddress", addressLocality: "São José dos Campos", addressRegion: "SP", addressCountry: "BR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Instituto Federal de São Paulo (IFSP)" },
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    knowsAbout: ["Python", "AI agents", "LLM", "n8n", "Supabase", "PostgreSQL", "Back-end development"],
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` escapado: o JSON não consegue fechar a tag <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
