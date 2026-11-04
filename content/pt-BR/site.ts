import type { SiteContent } from "@/content/types"

// Conteúdo provisório. Tudo marcado com [CONFIRMAR] precisa de dado real.
// Dados da assinatura (no estudo de caso do agente) são ilustrativos; nunca citar o nome do cliente.
export const site: SiteContent = {
  locale: "pt-BR",
  ogLocale: "pt_BR",
  profile: {
    name: "Gustavo Alves dos Santos",
    shortName: "Gustavo Alves",
    location: "São José dos Campos/SP",
    availability: "Aberto a novas oportunidades",
    email: "[CONFIRMAR]@email.com",
    links: {
      github: "https://github.com/SantosGAlves",
      linkedin: "https://www.linkedin.com/in/[CONFIRMAR]",
      cv: "/cv/gustavo-alves-dos-santos-cv.pdf", // [CONFIRMAR] arquivo ainda não existe
    },
  },
  seo: {
    title: "Gustavo Alves dos Santos · Software, IA aplicada e automação",
    description:
      "Desenvolvedor de software com foco em back-end, IA aplicada e automação: agentes que consultam bancos de dados, automações no n8n e os sistemas por trás deles.",
  },
  hero: {
    greeting: "olá, eu sou",
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    // Opção A (em uso). Opção B: "Desenvolvedor back-end com foco em IA aplicada".
    role: "Desenvolvedor de software · IA aplicada e automação",
    lede: "Desenvolvo software, principalmente back-end, e gosto de transformar processos manuais em sistemas que rodam sozinhos e chamam uma pessoa quando precisam. Hoje construo agentes de IA que consultam bancos de dados, automações no n8n e os sistemas por trás deles: APIs, painéis e autenticação.",
    ctaProjects: "Ver projetos",
    facts: [
      { label: "Agora", value: "Estagiário de Automação e Inovação II · Gaudium" },
      { label: "Formação", value: "Análise e Desenvolvimento de Sistemas · IFSP Jacareí · dez/2026" },
      { label: "Foco", value: "Back-end, agentes de IA com dados reais e automação" },
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
      "Exemplo ilustrativo: o cliente pede uma bateria para o carro; o agente extrai modelo, ano, câmbio e start-stop, consulta a tabela de aplicações e as baterias ativas e responde com as opções. Se o veículo não estiver cadastrado, registra o carro na fila de sugestões do painel e transfere o atendimento para a equipe.",
    // Na conversa real o agente pergunta um dado de cada vez; aqui a mensagem já traz tudo.
    // Nomes de função e tabelas ficam como no código (buscar_bateria, aplicacoes, veiculos_sugeridos).
    scenarios: {
      known: {
        message: [
          "tem bateria pro ",
          { field: "modelo", text: "corsa maxx" },
          " ",
          { field: "ano", text: "2010" },
          " ",
          { field: "cambio", text: "manual" },
          ", ",
          { field: "start_stop", text: "sem start-stop" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Corsa Maxx"' },
          { field: "ano", value: "2010" },
          { field: "cambio", value: '"manual"' },
          { field: "start_stop", value: "false" },
        ],
        trace: [
          { label: "supabase · aplicacoes", status: "60 Ah · comum", state: "done" },
          { label: "supabase · baterias (ativas)", status: "3 opções", state: "done" },
        ],
        reply: "Para o seu Corsa Maxx 2010 (60 Ah), tenho 3 opções, com 12 a 24 meses de garantia. Quer ver os preços?",
      },
      unknown: {
        message: [
          "tem bateria pra ",
          { field: "modelo", text: "kombi 1.4" },
          " ",
          { field: "ano", text: "2007" },
          " ",
          { field: "cambio", text: "manual" },
          ", ",
          { field: "start_stop", text: "sem start-stop" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Kombi 1.4"' },
          { field: "ano", value: "2007" },
          { field: "cambio", value: '"manual"' },
          { field: "start_stop", value: "false" },
        ],
        trace: [
          { label: "supabase · aplicacoes", status: "0 resultados", state: "done" },
          { label: "veiculos_sugeridos.insert()", status: "na fila", state: "done" },
          { label: "transferência para a equipe", status: "aguardando", state: "wait" },
        ],
        reply: "Não encontrei uma bateria cadastrada para a sua Kombi 2007. Vou te transferir para a nossa equipe, que já recebeu os seus dados.",
      },
    },
  },
  sections: {
    projects: { id: "projetos", eyebrow: "Projetos selecionados", title: "Projetos", nav: "Projetos" },
    build: { id: "construo", eyebrow: "O que eu construo", title: "Do agente ao back-end", nav: "O que construo" },
    experience: { id: "experiencia", eyebrow: "Experiência", title: "Onde trabalhei", nav: "Experiência" },
    education: { id: "formacao", eyebrow: "Formação", title: "Formação e TCC", nav: "Formação" },
    contact: { id: "contato", eyebrow: "Contato", title: "Vamos conversar", nav: "Contato" },
  },
  projects: {
    intro: "Do problema ao sistema em produção. O principal é um agente de IA com o sistema de gestão por trás dele.",
    caseStudyLink: "Ver estudo de caso",
    caseStudyFallbackLink: "Ver estudo de caso",
    plannedLabel: "Próximo projeto",
    status: { shipped: "entregue", "in-progress": "em andamento", planned: "em construção" },
    secondaryTitle: "Outros projetos",
    repoLink: "Código no GitHub",
    liveLink: "Testar ao vivo (usa a câmera)",
    demoBadge: "demo interativa",
    more: {
      title: "Mais no GitHub",
      items: [
        {
          title: "API de produtos em .NET 10",
          text: "Web API de catálogo com Entity Framework Core, migrações, injeção de dependência e Swagger.",
          stack: "C# · .NET 10 · EF Core · MySQL",
          href: "https://github.com/SantosGAlves/api-produtos-dotnet",
        },
        {
          title: "Cadastro com Streamlit e Azure",
          text: "Cadastro de produtos com imagens no Azure Blob Storage e dados no Azure SQL.",
          stack: "Python · Streamlit · Azure",
          href: "https://github.com/SantosGAlves/cadastro-produtos-streamlit-azure",
        },
        {
          title: "Concorrência em Java",
          text: "O jantar dos filósofos em quatro versões: deadlock, hierarquia de recursos, semáforos e monitores.",
          stack: "Java · threads",
          href: "https://github.com/SantosGAlves/prova-jantar-filosofos",
        },
      ],
      allLink: "Todos os repositórios",
    },
  },
  build: {
    intro:
      "Três frentes com o mesmo peso. Na prática elas se misturam: um agente só é útil com um back-end confiável por trás.",
    areas: [
      {
        title: "Agentes de IA",
        text: "Agentes que entendem o pedido, consultam dados reais por meio de ferramentas e chamam uma pessoa quando não têm a resposta.",
        includes: [
          "Extração de dados da mensagem",
          "Chamada de ferramentas e consultas ao banco",
          "Encaminhamento para atendimento humano",
        ],
        tools: ["APIs de LLM", "tool calling", "Python", "Supabase"],
      },
      {
        title: "Automação de processos",
        text: "Fluxos que tiram tarefas repetitivas das mãos das pessoas: recebem um evento, decidem o que fazer e registram o resultado.",
        includes: [
          "Chatbots e atendimento automatizado",
          "Integrações entre sistemas via API e webhooks",
          "Rotinas agendadas e notificações",
        ],
        tools: ["n8n", "webhooks", "APIs REST", "Python"],
      },
      {
        title: "Produtos e back-end",
        text: "Os sistemas por trás dos agentes, de ponta a ponta: APIs, bancos de dados, painéis de gestão, autenticação e deploy.",
        includes: [
          "APIs e modelagem de banco de dados",
          "Painéis de gestão e cadastro",
          "Autenticação, RLS, deploy e domínio",
        ],
        tools: ["Python", "PostgreSQL · Supabase", "RLS", "[CONFIRMAR] hospedagem"],
      },
    ],
    includesLabel: "Inclui",
    toolsLabel: "Ferramentas",
    languages: {
      title: "Linguagens",
      primaryLabel: "Principal",
      primary: { name: "Python", note: "a que mais uso, em agentes, automações e back-end" },
      otherLabel: "Já trabalhei com",
      other: ["Java", "Go", "C#"],
    },
    workflow: {
      title: "Como eu trabalho",
      text: "Desenvolvo com apoio de agentes de código, como o Claude Code. Eles aceleram a escrita; eu decido o que construir, reviso cada mudança e testo o que vai para produção. Este site foi feito assim.",
    },
  },
  experience: {
    caseStudyLink: "Ver o estudo de caso",
    items: [
      {
        company: "Gaudium",
        role: "Estagiário de Automação e Inovação II",
        period: "jul/2026 – atual",
        tags: ["sob NDA"],
        context:
          "Empresa B2B de tecnologia para agências de corrida e entrega. Os detalhes deste trabalho são confidenciais.",
        highlights: [
          "Automações de processos e integrações via API.",
          "Desenvolvimento de sites e produtos web, com foco em back-end.",
        ],
      },
      {
        company: "Hunt Sales",
        role: "Estagiário de Desenvolvimento e Automação",
        period: "ago/2025 – jun/2026",
        tags: [],
        context:
          "Empresa com plataforma própria de atendimento (CRM), onde rodam os agentes e painéis que desenvolvi para os clientes.",
        highlights: [
          "Propus e entreguei o primeiro agente de IA com sistema de gestão da empresa; a partir dele, fiquei responsável pelos projetos similares para outros clientes.",
          "Agentes de IA para atendimento no WhatsApp (GPT-4o mini), com consulta a banco de dados e transferência para humanos.",
          "Sistemas de gestão que alimentam os agentes (Supabase, autenticação, painéis web).",
          "Integrações via API com CRMs e com anúncios da Meta, entre outras.",
        ],
        caseStudy: "agente-baterias",
      },
    ],
  },
  education: {
    degree: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    school: "IFSP · Câmpus Jacareí",
    period: "conclusão em dez/2026",
    note: "Instituto Federal de São Paulo.",
    capstone: {
      label: "TCC",
      title: "LibrasFlow",
      text: "Reconhecimento do alfabeto manual de Libras com visão computacional.",
      slug: "librasflow",
      link: "Ver estudo de caso",
    },
  },
  contact: {
    intro: "Estou aberto a novas oportunidades. O caminho mais rápido é o e-mail.",
    emailLabel: "E-mail",
    copyEmail: "Copiar e-mail",
    copied: "E-mail copiado",
  },
  caseStudy: {
    back: "Voltar aos projetos",
    summaryTitle: "Resumo em 30 segundos",
    meta: { role: "Minha função", period: "Período", status: "Status", stack: "Stack" },
    next: "Próximo estudo de caso",
    fallbackNotice: "",
    illustrativeNotice:
      "Texto provisório. Trechos marcados com [CONFIRMAR] ainda serão revisados; dados de exemplo são ilustrativos.",
    video: { play: "Reproduzir", pause: "Pausar" },
    tryIt: { id: "experimente", title: "Experimente", loading: "Carregando a demo…", load: "Carregar a demo", error: "Não deu para carregar a demo.", retry: "Tentar de novo", link: "Testar ao vivo" },
    liveFrame: {
      start: "Abrir demo ao vivo",
      hint: "Depois, clique em Ativar câmera",
      privacy: "Roda no seu navegador: nenhuma imagem sai do seu computador.",
      stop: "Encerrar",
      open: "Abrir em nova aba",
      loading: "Carregando a versão pública…",
      frameTitle: "{titulo}: versão pública ao vivo",
    },
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
    footerNote: "Feito com Next.js e publicado na Vercel.",
  },
}
