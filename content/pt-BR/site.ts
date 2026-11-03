import type { SiteContent } from "@/content/types"

// Conteúdo provisório. Tudo marcado com [CONFIRMAR] precisa de dado real.
// Dados da assinatura do hero são ilustrativos; nunca citar o nome do cliente.
export const site: SiteContent = {
  locale: "pt-BR",
  ogLocale: "pt_BR",
  profile: {
    name: "Gustavo Alves dos Santos",
    shortName: "Gustavo Alves",
    location: "São José dos Campos/SP",
    availability: "Aberto a estágio em GenAI",
    email: "[CONFIRMAR]@email.com",
    links: {
      github: "https://github.com/SantosGAlves", // [CONFIRMAR]
      linkedin: "https://www.linkedin.com/in/[CONFIRMAR]",
      cv: "/cv/gustavo-alves-dos-santos-cv.pdf", // [CONFIRMAR] arquivo ainda não existe
    },
  },
  seo: {
    title: "Gustavo Alves dos Santos · IA aplicada e automação",
    description:
      "Desenvolvedor de IA aplicada e automação. Agentes que consultam bancos de dados, automações no n8n e integrações via API.",
  },
  hero: {
    greeting: "olá, eu sou",
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    role: "Desenvolvedor de IA aplicada e automação",
    lede: "Gosto de transformar processos manuais em sistemas que rodam sozinhos e chamam uma pessoa quando precisam. Hoje construo agentes que consultam bancos de dados, automações no n8n e integrações via API.",
    ctaProjects: "Ver projetos",
    facts: [
      { label: "Agora", value: "Estagiário de Automação e Inovação · Gaudium" },
      { label: "Formação", value: "Análise e Desenvolvimento de Sistemas · IFSP Jacareí · dez/2026" },
      { label: "Foco", value: "Agentes com dados reais, n8n e integrações via API" },
    ],
  },
  signature: {
    title: "agente · atendimento de balcão",
    badge: "exemplo ilustrativo",
    labels: { message: "Mensagem do cliente", call: "Chamada de ferramenta", trace: "Execução" },
    unknownToggle: "Simular veículo desconhecido",
    replay: "Reproduzir",
    caption: "Passe o mouse num termo destacado para ver o campo que ele preenche.",
    summary:
      "Exemplo ilustrativo: o cliente pergunta por uma bateria para um carro; o agente extrai modelo, ano, motor e câmbio, consulta o banco de dados e responde com a bateria indicada. Se o veículo não estiver cadastrado, cria um pré-cadastro e pede a confirmação do vendedor.",
    scenarios: {
      known: {
        message: [
          "tem bateria pro ",
          { field: "modelo", text: "onix" },
          " ",
          { field: "ano", text: "2019" },
          " ",
          { field: "motor", text: "1.0" },
          " ",
          { field: "cambio", text: "manual" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Onix"' },
          { field: "ano", value: "2019" },
          { field: "motor", value: '"1.0"' },
          { field: "cambio", value: '"manual"' },
        ],
        trace: [
          { label: "supabase · veiculos → baterias", status: "RLS ok", state: "done" },
          { label: "1 correspondência", status: "ok", state: "done" },
        ],
        reply: "Para o Onix 2019 1.0 manual, a indicada é a 60 Ah, por R$ 459,00. Quer que eu reserve?",
      },
      unknown: {
        message: [
          "tem bateria pro ",
          { field: "modelo", text: "kwid" },
          " ",
          { field: "ano", text: "2024" },
          " ",
          { field: "motor", text: "1.0" },
          " ",
          { field: "cambio", text: "manual" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Kwid"' },
          { field: "ano", value: "2024" },
          { field: "motor", value: '"1.0"' },
          { field: "cambio", value: '"manual"' },
        ],
        trace: [
          { label: "supabase · veiculos → baterias", status: "0 resultados", state: "done" },
          { label: "precadastro.insert(veiculo)", status: "criado", state: "done" },
          { label: "painel do vendedor", status: "aguardando", state: "wait" },
        ],
        reply: "Ainda não tenho esse modelo no cadastro. Pedi a confirmação ao vendedor e te respondo em seguida.",
      },
    },
  },
  sections: {
    projects: { id: "projetos", eyebrow: "Projetos selecionados", title: "Projetos" },
    build: { id: "construo", eyebrow: "O que eu construo", title: "Sistemas e resultados" },
    experience: { id: "experiencia", eyebrow: "Experiência", title: "Onde trabalhei" },
    education: { id: "formacao", eyebrow: "Formação", title: "Formação e TCC" },
    contact: { id: "contato", eyebrow: "Contato", title: "Vamos conversar" },
  },
  nav: ["projects", "build", "experience", "contact"],
  ui: {
    skipToContent: "Pular para o conteúdo",
    downloadCv: "Baixar CV",
    navLabel: "Navegação principal",
    languageLabel: "Idioma",
    themeToLight: "Ativar tema claro",
    themeToDark: "Ativar tema escuro",
    opensInNewTab: "(abre em nova aba)",
    sectionPlaceholder: "Conteúdo desta seção entra na Fase 3.",
    inProgress: "em construção",
    footerNote: "Feito com Next.js e publicado na Vercel.",
  },
}
