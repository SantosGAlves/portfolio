// Tipos do conteúdo do site. Os textos ficam em content/<idioma>/,
// os componentes só leem estes formatos.

export type Locale = "pt-BR"

export type NavItem = {
  label: string
  href: `#${string}` | `/${string}`
}

export type Profile = {
  name: string
  shortName: string
  role: string
  location: string
  availability: string
  email: string
  links: {
    github: string
    linkedin: string
    cv: string
  }
}

export type SiteContent = {
  locale: Locale
  profile: Profile
  nav: NavItem[]
  seo: {
    title: string
    description: string
  }
  ui: {
    skipToContent: string
    downloadCv: string
    navLabel: string
    footerNote: string
  }
}
