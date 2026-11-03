// Tipos do conteúdo do site. Os textos ficam em content/<idioma>/site.ts,
// sempre com o mesmo formato; os componentes só leem estes tipos.

export const locales = ["pt-BR", "en"] as const
export type Locale = (typeof locales)[number]

export type SectionKey = "projects" | "build" | "experience" | "education" | "contact"

export type SectionHeading = {
  /** Âncora da seção na página inicial (sem #). */
  id: string
  eyebrow: string
  title: string
}

export type Fact = { label: string; value: string }

/** Campos que o agente extrai da mensagem na assinatura do hero. */
export type SignatureField = "modelo" | "ano" | "motor" | "cambio"

export type SignatureScenario = {
  /** Texto da mensagem; os objetos são entidades destacadas. */
  message: Array<string | { field: SignatureField; text: string }>
  /** Argumentos da chamada buscar_bateria, na ordem. */
  call: Array<{ field: SignatureField; value: string }>
  trace: Array<{ label: string; status: string; state: "done" | "wait" }>
  reply: string
}

export type SignatureContent = {
  title: string
  badge: string
  labels: { message: string; call: string; trace: string }
  unknownToggle: string
  replay: string
  caption: string
  /** Descrição em texto para leitores de tela. */
  summary: string
  scenarios: { known: SignatureScenario; unknown: SignatureScenario }
}

export type SiteContent = {
  locale: Locale
  /** Valor de og:locale. */
  ogLocale: string
  profile: {
    name: string
    shortName: string
    location: string
    availability: string
    email: string
    links: { github: string; linkedin: string; cv: string }
  }
  seo: { title: string; description: string }
  hero: {
    greeting: string
    firstName: string
    lastName: string
    role: string
    lede: string
    ctaProjects: string
    facts: Fact[]
  }
  signature: SignatureContent
  sections: Record<SectionKey, SectionHeading>
  /** Ordem dos links do header (seções da página inicial). */
  nav: SectionKey[]
  ui: {
    skipToContent: string
    downloadCv: string
    navLabel: string
    languageLabel: string
    themeToLight: string
    themeToDark: string
    opensInNewTab: string
    sectionPlaceholder: string
    inProgress: string
    footerNote: string
  }
}
