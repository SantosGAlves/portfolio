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
    email: "gustasp49@gmail.com",
    links: {
      github: "https://github.com/SantosGAlves",
      linkedin: "https://www.linkedin.com/in/gustavo-alves-dos-santos-9aa713256/",
      whatsapp: "https://wa.me/5512982972495",
    },
  },
  seo: {
    title: "Gustavo Alves dos Santos · Software, IA aplicada e automação",
    description:
      "Desenvolvedor de software com foco em back-end, IA aplicada e automação: agentes que consultam bancos de dados, automações no n8n e os sistemas por trás deles.",
  },
  hero: {
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    photoAlt: "Foto de Gustavo Alves dos Santos",
    // Opção A (em uso). Opção B: "Desenvolvedor back-end com foco em IA aplicada".
    role: "Desenvolvedor de software · IA aplicada e automação",
    tagline: ["Agentes de IA, automações", "e o back-end que mantém tudo de pé."],
    keywords: ["Agentes de IA", "Automação", "Back-end", "Machine learning"],
    proof: [
      { text: "Agente de IA entregue a cliente", case: "agente-baterias" },
      { text: "Artigo científico em preparação", case: "librasflow" },
      { text: "Estágio em automação e IA", section: "experience" },
    ],
    lede: "Desenvolvo software, principalmente back-end, e gosto de transformar processos manuais em sistemas que rodam sozinhos e chamam uma pessoa quando precisam. Hoje construo agentes de IA que consultam bancos de dados, automações no n8n e os sistemas por trás deles: APIs, painéis e autenticação.",
    ctaProjects: "Ver projetos",
    ctaLinkedin: "Ver LinkedIn",
  },
  now: {
    items: [
      { label: "Trabalho", text: "Estágio de Automação e Inovação II na Gaudium: automações no n8n, agentes de IA e produtos web." },
      { label: "Estudo", text: "Concluindo Análise e Desenvolvimento de Sistemas no IFSP Jacareí (dez/2026)." },
      { label: "Pesquisa", text: "Artigo científico do LibrasFlow em preparação para submissão.", case: "librasflow" },
    ],
    more: "Ver mais sobre o que eu faço",
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
    experience: { id: "experiencia", eyebrow: "Experiência", title: "Trabalho e extensão", nav: "Experiência" },
    stack: { id: "tecnologias", eyebrow: "Tecnologias", title: "Com o que eu trabalho", nav: "Tecnologias" },
    projects: { id: "projetos", eyebrow: "Projetos selecionados", title: "Projetos", nav: "Projetos" },
    now: { id: "agora", eyebrow: "Agora", title: "O que estou fazendo agora", nav: "Agora" },
    other: { id: "outros-projetos", eyebrow: "Repositórios", title: "Outros projetos", nav: "Outros projetos" },
    education: {
      id: "formacao",
      eyebrow: "Formação e competências",
      title: "Estudo, idiomas e como eu trabalho",
      nav: "Formação",
    },
    contact: { id: "contato", eyebrow: "Contato", title: "Vamos conversar?", nav: "Contato" },
  },
  projects: {
    intro: "Do problema ao sistema em produção: agentes de IA, automações e os sistemas por trás deles.",
    plannedLabel: "Próximo projeto",
    status: { shipped: "entregue", "in-progress": "em andamento", planned: "em construção" },
    otherIntro: "Projetos menores e de estudo, com o código no GitHub.",
    repoLink: "Código no GitHub",
    liveLink: "Testar ao vivo (usa a câmera)",
    tryDemo: "Testar demo",
    viewProject: "Ver projeto",
    viewCode: "Ver código",
    deliveredBadge: "entregue a cliente",
    more: {
      items: [
        {
          title: "API de produtos em .NET 10",
          year: "2026",
          text: "Web API de catálogo com Entity Framework Core, migrações, injeção de dependência e Swagger.",
          href: "https://github.com/SantosGAlves/api-produtos-dotnet",
        },
        {
          title: "Cadastro com Streamlit e Azure",
          year: "2025",
          text: "Cadastro de produtos com imagens no Azure Blob Storage e dados no Azure SQL.",
          href: "https://github.com/SantosGAlves/cadastro-produtos-streamlit-azure",
        },
        {
          title: "Concorrência em Java",
          year: "2025",
          text: "O jantar dos filósofos em quatro versões: deadlock, hierarquia de recursos, semáforos e monitores.",
          href: "https://github.com/SantosGAlves/prova-jantar-filosofos",
        },
      ],
      allLink: "Todos os repositórios",
    },
  },
  build: {
    intro:
      "Quatro frentes que se misturam na prática: um agente só é útil com dados confiáveis e um back-end por trás.",
    areas: [
      {
        title: "Agentes de IA e LLMs",
        text: "Agentes que entendem o pedido, consultam dados reais e chamam uma pessoa quando não têm a resposta.",
        items: ["atendimento", "consulta a dados", "integração com sistemas"],
      },
      {
        title: "Automação e integrações",
        text: "Fluxos que tiram tarefas repetitivas das mãos das pessoas e fazem os sistemas conversarem.",
        items: ["n8n", "APIs", "webhooks", "CRMs"],
      },
      {
        title: "Back-end e dados",
        text: "Os sistemas por trás de tudo, de ponta a ponta: do modelo do banco ao deploy.",
        items: ["APIs", "bancos de dados", "autenticação", "deploy"],
      },
      {
        title: "Machine learning e visão computacional",
        text: "Modelos treinados e avaliados com cuidado, prontos para rodar em tempo real.",
        items: ["modelos", "avaliação", "aplicações em tempo real"],
      },
    ],
  },
  experience: {
    caseStudiesLabel: { one: "Estudo de caso", other: "Estudos de caso" },
    items: [
      {
        company: "Gaudium",
        role: "Estagiário de Automação e Inovação II",
        period: "jul/2026 – atual",
        tags: ["estágio"],
        // NDA: só descrições gerais (texto do Gustavo); sem clientes, parceiros nem link para estudos de caso.
        context:
          "Na área de Labs (MIL), crio soluções com automação, low/no-code e inteligência artificial para acelerar as entregas de uma plataforma de tecnologia para empreendedores de mobilidade urbana e entregas.",
        highlights: [
          "Desenvolvo aplicações e produtos digitais com plataformas low/no-code e código, com foco em back-end, para necessidades internas e externas.",
          "Construo automações de processos com n8n e integrações entre sistemas via API, reduzindo trabalho manual das equipes.",
          "Aplico agentes de IA e LLMs em processos internos, acompanhando resultados e explorando novos usos.",
          "Mapeio processos com outras áreas e proponho soluções para torná-los mais ágeis, seguros e escaláveis.",
          "Documento as soluções desenvolvidas para garantir manutenção e reprodutibilidade.",
        ],
      },
      {
        company: "Hunt Sales",
        role: "Estagiário de Desenvolvimento e Automação",
        period: "ago/2025 – jun/2026",
        tags: ["estágio"],
        context:
          "Empresa com plataforma própria de atendimento (CRM), onde rodam os agentes e painéis que desenvolvi para os clientes.",
        highlights: [
          "Propus e entreguei sozinho o primeiro agente de IA com sistema de gestão da empresa (GPT-4o mini, Supabase e painel web com autenticação), que reverteu o risco de cancelamento de um cliente e virou um novo tipo de produto.",
          "Fiquei responsável pelos projetos seguintes do mesmo tipo, como o painel para carregadores de veículos elétricos.",
          "Criei agentes de atendimento no WhatsApp com consulta a banco de dados e transferência para humanos.",
          "Integrei CRMs e anúncios da Meta via API.",
        ],
        caseStudies: ["agente-baterias", "carregadores-ev"],
      },
      {
        company: "Ajuda Animal",
        role: "Responsável pelo canal de WhatsApp",
        period: "2026",
        tags: ["projeto de extensão"],
        context: "Projeto de extensão do IFSP Jacareí com a Prefeitura de Jacareí, em equipe.",
        highlights: [
          "Desenvolvi o chatbot de denúncias no n8n, ligado ao WhatsApp pela Evolution API.",
          "Integrei o bot à API do sistema e criei o banco de sessões das conversas.",
          "Apliquei cuidados de LGPD: a denúncia é anônima por padrão e o contato só fica guardado com o consentimento do cidadão.",
        ],
        caseStudies: ["ajuda-animal"],
      },
    ],
  },
  stack: {
    intro: "O que uso para construir sistemas e colocá-los em produção. Python é a linguagem principal.",
    pause: "Pausar a faixa",
    play: "Continuar a faixa",
    byCategory: "Ver por categoria",
    mainLabel: "principal",
    usedLabel: "já trabalhei com",
    groups: {
      languages: "Linguagens",
      ai: "IA e dados",
      backend: "Back-end e bancos",
      automation: "Automação e integrações",
      nocode: "No-code e low-code",
      frontend: "Front-end",
      infra: "Infra e ferramentas",
    },
  },
  education: {
    formationTitle: "Formação",
    degree: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    school: "IFSP · Câmpus Jacareí",
    period: "conclusão em dez/2026",
    capstone: {
      label: "TCC",
      title: "LibrasFlow",
      text: "Reconhecimento do alfabeto manual de Libras com visão computacional. Artigo científico em preparação.",
      slug: "librasflow",
      link: "Ver estudo de caso",
    },
    languagesTitle: "Idiomas",
    languages: [
      { name: "Português", level: "nativo" },
      {
        name: "Inglês",
        level: "leitura e compreensão avançadas (documentação técnica), conversação em desenvolvimento",
      },
    ],
    workTitle: "Como eu trabalho",
    work: [
      {
        label: "Autonomia",
        text: "Propus e entreguei sozinho um produto que virou linha de serviço.",
        cases: ["agente-baterias"],
      },
      {
        label: "Foco no resultado",
        text: "A entrega reverteu o risco de cancelamento de um cliente.",
        cases: ["agente-baterias"],
      },
      {
        label: "Rigor técnico",
        text: "Encontrei e corrigi um vazamento de dados no meu próprio modelo, em vez de reportar 99,96%.",
        cases: ["librasflow"],
      },
      {
        label: "Trabalho em equipe",
        text: "Projetos em grupo no IFSP e extensão com a Prefeitura de Jacareí.",
        cases: ["librasflow", "barbu", "ajuda-animal"],
      },
      {
        label: "Desenvolvimento com IA",
        text: "Uso agentes de código como o Claude Code, revisando e testando o que vai para produção. Este site foi feito assim.",
        links: [{ label: "Código deste site", href: "https://github.com/SantosGAlves/portfolio" }],
      },
    ],
  },
  contact: {
    intro: "Estou aberto a novas oportunidades. Respondo rápido por e-mail ou WhatsApp.",
    emailLabel: "E-mail",
    copyEmail: "Copiar e-mail",
    whatsapp: "Conversar no WhatsApp",
    copied: "E-mail copiado",
  },
  caseStudy: {
    back: "Voltar aos projetos",
    summaryTitle: "Resumo em 30 segundos",
    meta: { role: "Minha função", period: "Período", status: "Status", stack: "Stack" },
    next: "Próximo estudo de caso",
    tryNow: "Testar agora",
    code: "Código",
    details: "Ver detalhes técnicos",
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
  nav: ["experience", "projects", "now", "stack", "education", "contact"],
  notFound: {
    title: "Página não encontrada",
    text: "O endereço pode ter mudado ou estar digitado errado.",
    home: "Voltar para o início",
    projects: "Ver projetos",
  },
  ui: {
    skipToContent: "Pular para o conteúdo",
    navLabel: "Navegação principal",
    languageLabel: "Idioma",
    themeToLight: "Ativar tema claro",
    themeToDark: "Ativar tema escuro",
    opensInNewTab: "(abre em nova aba)",
    footerNote: "Feito com Next.js e publicado na Vercel.",
    more: "Ver mais",
    less: "Ver menos",
  },
}
