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
  /** Rótulo curto no menu do header. */
  nav: string
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

export type CapabilityArea = {
  title: string
  /** Uma frase de resultado: o que essa área entrega. */
  text: string
  /** O que costuma entrar (sistemas, não badges). */
  includes: string[]
  /** Ferramentas, em mono e em uma linha. */
  tools: string[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  /** Rótulos curtos, ex.: "sob NDA". */
  tags: string[]
  /** Uma linha sobre a empresa ou o contexto. */
  context: string
  highlights: string[]
  /** Estudo de caso relacionado (slug em content/<idioma>/projects). */
  caseStudy?: string
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
  projects: {
    intro: string
    caseStudyLink: string
    /** Link de um caso que só existe em português (versão EN). */
    caseStudyFallbackLink: string
    plannedLabel: string
    status: Record<"shipped" | "in-progress" | "planned", string>
  }
  build: {
    intro: string
    areas: CapabilityArea[]
    includesLabel: string
    toolsLabel: string
    languages: {
      title: string
      primaryLabel: string
      primary: { name: string; note: string }
      otherLabel: string
      other: string[]
    }
    workflow: { title: string; text: string }
  }
  experience: { items: ExperienceItem[]; caseStudyLink: string }
  education: {
    degree: string
    school: string
    period: string
    note: string
    capstone: { label: string; title: string; text: string; slug: string; link: string }
  }
  contact: {
    intro: string
    emailLabel: string
    copyEmail: string
    copied: string
  }
  caseStudy: {
    back: string
    summaryTitle: string
    meta: { role: string; period: string; status: string; stack: string }
    next: string
    fallbackNotice: string
    illustrativeNotice: string
  }
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
    footerNote: string
  }
}
