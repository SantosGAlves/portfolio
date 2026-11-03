import type { SiteContent } from "@/content/types"

// Conteúdo provisório. Tudo marcado com [CONFIRMAR] precisa de dado real.
export const site: SiteContent = {
  locale: "pt-BR",
  profile: {
    name: "Gustavo Alves dos Santos",
    shortName: "Gustavo Alves",
    role: "Desenvolvedor de IA aplicada e automação",
    location: "São José dos Campos/SP",
    availability: "Aberto a estágio em GenAI",
    email: "[CONFIRMAR]@email.com",
    links: {
      github: "https://github.com/SantosGAlves", // [CONFIRMAR]
      linkedin: "https://www.linkedin.com/in/[CONFIRMAR]",
      cv: "/cv/gustavo-alves-dos-santos-cv.pdf", // [CONFIRMAR] arquivo ainda não existe
    },
  },
  nav: [
    { label: "Projetos", href: "#projetos" },
    { label: "O que eu construo", href: "#construo" },
    { label: "Experiência", href: "#experiencia" },
    { label: "Contato", href: "#contato" },
  ],
  seo: {
    title: "Gustavo Alves dos Santos · IA aplicada e automação",
    description:
      "Desenvolvedor de IA aplicada e automação. Agentes que consultam bancos de dados, fluxos no n8n e integrações via API.",
  },
  ui: {
    skipToContent: "Pular para o conteúdo",
    downloadCv: "Baixar CV",
    navLabel: "Navegação principal",
    footerNote: "Feito com Next.js e publicado na Vercel.",
  },
}
