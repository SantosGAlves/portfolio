// Tipos do conteúdo do site. Os textos ficam em content/<idioma>/site.ts,
// sempre com o mesmo formato; os componentes só leem estes tipos.

import type { TechGroupKey } from "./tech"

export const locales = ["pt-BR", "en"] as const
export type Locale = (typeof locales)[number]

/** Seções da página inicial (a ordem na página fica em components/pages/home-page.tsx). */
export type SectionKey = "build" | "experience" | "stack" | "projects" | "other" | "education" | "contact"

export type SectionHeading = {
  /** Âncora da seção na página inicial (sem #). */
  id: string
  eyebrow: string
  title: string
  /** Rótulo curto no menu do header. */
  nav: string
}

export type Fact = { label: string; value: string }

/** Campos que o agente extrai da mensagem na assinatura (as chaves da tabela `aplicacoes`). */
export type SignatureField = "modelo" | "ano" | "cambio" | "start_stop"

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
  /** Uma frase: o que essa área entrega. */
  text: string
  /** Três ou quatro palavras-chave, em mono e em uma linha. */
  items: string[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  /** Rótulos curtos, ex.: "sob NDA". */
  tags: string[]
  /** Uma linha sobre a empresa ou o contexto. */
  context: string
  /** Tópicos curtos, começando por verbo de ação. */
  highlights: string[]
  /** Estudos de caso relacionados (slugs em content/<idioma>/projects). */
  caseStudies?: string[]
}

/** Item de "Como eu trabalho": a qualidade, a prova e os links para os casos que a mostram. */
export type WorkTrait = {
  label: string
  text: string
  /** Slugs dos estudos de caso. */
  cases?: string[]
  /** Outros links (ex.: o repositório deste site). */
  links?: Array<{ label: string; href: string }>
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
    /** whatsapp: link wa.me, só no botão da seção de contato (o número não aparece escrito na página). */
    links: { github: string; linkedin: string; whatsapp: string; cv: string }
  }
  seo: { title: string; description: string }
  hero: {
    greeting: string
    firstName: string
    lastName: string
    role: string
    /** Frase de efeito abaixo do nome; cada item é uma linha. */
    tagline: string[]
    lede: string
    ctaProjects: string
    facts: Fact[]
  }
  signature: SignatureContent
  sections: Record<SectionKey, SectionHeading>
  projects: {
    intro: string
    /** Link de um caso que só existe em português (versão EN). */
    plannedLabel: string
    status: Record<"shipped" | "in-progress" | "planned", string>
    /** Link para o repositório de um projeto. */
    repoLink: string
    /** Botão da demonstração pública ao vivo (em nova aba), no topo do caso sem meta.liveEmbed. */
    liveLink: string
    /** Selo discreto no card da home dos projetos com demo interativa. */
    demoBadge: string
    /** Selo do card de projeto entregue a um cliente (meta.badges com "delivered"). */
    deliveredBadge: string
    /** Introdução da seção "Outros projetos". */
    otherIntro: string
    /** Repositórios menores na lista "Outros projetos" (depois dos projetos `secondary`). */
    more: {
      items: Array<{ title: string; year: string; text: string; href: string }>
      allLink: string
    }
  }
  /** "O que eu faço": quatro áreas, gerais, sem ligar a projetos. */
  build: {
    intro: string
    areas: CapabilityArea[]
  }
  experience: { items: ExperienceItem[]; caseStudiesLabel: { one: string; other: string } }
  /** Tecnologias: faixa rolando + lista por categoria (os itens ficam em content/tech.ts). */
  stack: {
    intro: string
    pause: string
    play: string
    /** Botão que abre a lista por categoria (fechada por padrão). */
    byCategory: string
    /** Selo da linguagem principal. */
    mainLabel: string
    /** Rótulo das linguagens com que já trabalhei. */
    usedLabel: string
    groups: Record<TechGroupKey, string>
  }
  /** "Formação e competências". */
  education: {
    formationTitle: string
    degree: string
    school: string
    period: string
    capstone: { label: string; title: string; text: string; slug: string; link: string }
    languagesTitle: string
    languages: Array<{ name: string; level: string }>
    workTitle: string
    work: WorkTrait[]
  }
  contact: {
    intro: string
    emailLabel: string
    copyEmail: string
    /** Botão do WhatsApp na seção de contato. */
    whatsapp: string
    copied: string
  }
  caseStudy: {
    back: string
    summaryTitle: string
    meta: { role: string; period: string; status: string; stack: string }
    next: string
    fallbackNotice: string
    /** Aviso de texto provisório (só em casos com `draft: true`). */
    illustrativeNotice: string
    /** Botão dos vídeos em loop. */
    video: { play: string; pause: string }
    /** Seção da demo dentro do caso (<Demo /> no MDX). `id` = âncora (/projetos/<slug>#experimente). */
    /** `link` = atalho no topo do caso até a versão embutida (meta.liveEmbed). */
    tryIt: { id: string; title: string; loading: string; load: string; error: string; retry: string; link: string }
    /** Moldura de navegador da versão pública (meta.liveEmbed). {titulo} = título do projeto. */
    liveFrame: { start: string; hint: string; privacy: string; stop: string; open: string; loading: string; frameTitle: string }
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
