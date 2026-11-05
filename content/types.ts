// Tipos do conteúdo do site. Os textos ficam em content/<idioma>/site.ts,
// sempre com o mesmo formato; os componentes só leem estes tipos.

import type { TechGroupKey } from "./tech"

export const locales = ["pt-BR", "en"] as const
export type Locale = (typeof locales)[number]

/** Seções da página inicial (a ordem na página fica em components/pages/home-page.tsx). */
export type SectionKey = "experience" | "projects" | "now" | "stack" | "other" | "education" | "contact"

export type SectionHeading = {
  /** Âncora da seção na página inicial (sem #). */
  id: string
  eyebrow: string
  title: string
  /** Rótulo curto no menu do header. */
  nav: string
}

/** Fato curto do hero com a prova: link para um estudo de caso (`case`) ou para uma seção da home (`section`). */
export type ProofFact = { text: string; case?: string; section?: SectionKey }

/** Linha da seção "Agora": rótulo curto e o que estou fazendo; `case` = link para o estudo de caso. */
export type NowItem = { label: string; text: string; case?: string }

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
    links: { github: string; linkedin: string; whatsapp: string }
  }
  seo: { title: string; description: string }
  hero: {
    firstName: string
    lastName: string
    /** Texto alternativo da foto (public/foto/gustavo-avatar.webp). */
    photoAlt: string
    role: string
    /** Frase de efeito abaixo do nome; cada item é uma linha. */
    tagline: string[]
    /** Quatro palavras-chave numa linha, no lugar da antiga seção "O que eu faço". */
    keywords: string[]
    /** Três fatos curtos com prova (cada um leva ao caso ou à seção que o comprova). */
    proof: ProofFact[]
    /** Parágrafo sobre mim: fica em "Ver mais" na seção "Agora". */
    lede: string
    ctaProjects: string
    /** Botão secundário do hero: abre o LinkedIn em nova aba (o site não tem CV para download, de propósito). */
    ctaLinkedin: string
  }
  /** "Agora" (como o "Currently" do victrhugo.site): três linhas; o resto fica em "Ver mais". */
  now: {
    items: NowItem[]
    /** Rótulo do "Ver mais" com o parágrafo sobre mim e as quatro áreas (`build`). */
    more: string
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
    /** Link do card para a demo do caso (/projetos/<slug>#experimente), com "▶". */
    tryDemo: string
    /** Rodapé de todo card: "Ver projeto →" (ou "Ver código ↗", sem página de caso). */
    viewProject: string
    viewCode: string
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
  /** "O que eu faço": quatro áreas, gerais, sem ligar a projetos (em "Ver mais" na seção "Agora"). */
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
    /** Botões do topo: até a demo (#experimente) e o repositório. */
    tryNow: string
    code: string
    /** Bloco fechado com o texto longo (<Details> no MDX). */
    details: string
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
  /** Página 404 (app/global-not-found.tsx): bilíngue, porque não sabe o idioma do endereço. */
  notFound: { title: string; text: string; home: string; projects: string }
  ui: {
    skipToContent: string
    navLabel: string
    languageLabel: string
    themeToLight: string
    themeToDark: string
    opensInNewTab: string
    footerNote: string
    /** "Ver mais" / "Ver menos" dos blocos recolhidos. */
    more: string
    less: string
  }
}
