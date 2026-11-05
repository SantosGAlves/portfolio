import type { SiteContent } from "@/content/types"

// English mirror of content/pt-BR/site.ts (same types).
// [CONFIRMAR] marks missing real data.
export const site: SiteContent = {
  locale: "en",
  ogLocale: "en_US",
  profile: {
    name: "Gustavo Alves dos Santos",
    shortName: "Gustavo Alves",
    location: "São José dos Campos, Brazil",
    availability: "Open to new opportunities",
    email: "gustasp49@gmail.com",
    links: {
      github: "https://github.com/SantosGAlves",
      linkedin: "https://www.linkedin.com/in/gustavo-alves-dos-santos-9aa713256/",
      whatsapp: "https://wa.me/5512982972495",
    },
  },
  seo: {
    title: "Gustavo Alves dos Santos · Software, applied AI and automation",
    description:
      "Software developer focused on back-end, applied AI and automation: agents that query databases, n8n automations and the systems behind them.",
  },
  hero: {
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    photoAlt: "Photo of Gustavo Alves dos Santos",
    // Option A (in use). Option B: "Back-end developer focused on applied AI".
    role: "Software developer · applied AI and automation",
    tagline: ["AI agents, automations,", "and the back-end that keeps it all running."],
    keywords: ["AI agents", "Automation", "Back-end", "Machine learning"],
    proof: [
      { text: "AI agent delivered to a client", case: "agente-baterias" },
      { text: "Scientific paper in preparation", case: "librasflow" },
      { text: "Internship in automation and AI", section: "experience" },
    ],
    lede: "I build software, mostly back-end, and I like turning manual processes into systems that run on their own and call a person when they need one. Right now I build AI agents that query databases, n8n automations and the systems behind them: APIs, dashboards and authentication.",
    ctaProjects: "See projects",
    ctaLinkedin: "View LinkedIn",
  },
  now: {
    items: [
      { label: "Work", text: "Automation & Innovation Intern II at Gaudium: n8n automations, AI agents and web products." },
      {
        label: "Studies",
        text: "Finishing a Technology Degree (Tecnólogo) in Systems Analysis and Development at IFSP Jacareí (Dec 2026).",
      },
      { label: "Research", text: "LibrasFlow scientific paper in preparation for submission.", case: "librasflow" },
    ],
    more: "More about what I do",
  },
  signature: {
    title: "agent · in-store sales assistant",
    badge: "illustrative example",
    labels: { message: "Customer message", call: "Tool call", trace: "Execution" },
    unknownToggle: "Simulate unknown vehicle",
    replay: "Replay",
    caption: "Hover a highlighted term to see the field it fills.",
    summary:
      "Illustrative example: a customer asks for a battery for their car; the agent extracts model, year, transmission and start-stop, queries the fitment table and the active batteries, and replies with the options. If the vehicle is not on file, it adds the car to the suggestions queue in the dashboard and hands the conversation over to the team.",
    // The message is translated for English readers (decided with Gustavo); the real agent talks in Portuguese
    // and asks for one detail at a time. Code identifiers (buscar_bateria, aplicacoes, veiculos_sugeridos)
    // stay as in the real code.
    scenarios: {
      known: {
        message: [
          "do you have a battery for a ",
          { field: "ano", text: "2010" },
          " ",
          { field: "modelo", text: "corsa maxx" },
          ", ",
          { field: "cambio", text: "manual" },
          ", ",
          { field: "start_stop", text: "no start-stop" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Corsa Maxx"' },
          { field: "ano", value: "2010" },
          { field: "cambio", value: '"manual"' },
          { field: "start_stop", value: "false" },
        ],
        trace: [
          { label: "supabase · aplicacoes", status: "60 Ah · standard", state: "done" },
          { label: "supabase · baterias (active)", status: "3 options", state: "done" },
        ],
        reply: "For your 2010 Corsa Maxx (60 Ah), I have 3 options, with 12 to 24 months of warranty. Want to see the prices?",
      },
      unknown: {
        message: [
          "do you have a battery for a ",
          { field: "ano", text: "2007" },
          " ",
          { field: "modelo", text: "kombi 1.4" },
          ", ",
          { field: "cambio", text: "manual" },
          ", ",
          { field: "start_stop", text: "no start-stop" },
          "?",
        ],
        call: [
          { field: "modelo", value: '"Kombi 1.4"' },
          { field: "ano", value: "2007" },
          { field: "cambio", value: '"manual"' },
          { field: "start_stop", value: "false" },
        ],
        trace: [
          { label: "supabase · aplicacoes", status: "0 results", state: "done" },
          { label: "veiculos_sugeridos.insert()", status: "queued", state: "done" },
          { label: "handoff to the team", status: "waiting", state: "wait" },
        ],
        reply: "I couldn't find a battery on file for your 2007 Kombi. I'm handing you over to our team, who already have your details.",
      },
    },
  },
  sections: {
    experience: { id: "experience", eyebrow: "Experience", title: "Work and extension projects", nav: "Experience" },
    stack: { id: "stack", eyebrow: "Stack", title: "What I work with", nav: "Stack" },
    projects: { id: "projects", eyebrow: "Selected work", title: "Projects", nav: "Projects" },
    now: { id: "now", eyebrow: "Now", title: "What I'm doing right now", nav: "Now" },
    other: { id: "other-projects", eyebrow: "Repositories", title: "Other projects", nav: "Other projects" },
    education: {
      id: "education",
      eyebrow: "Education and skills",
      title: "Studies, languages and how I work",
      nav: "Education",
    },
    contact: { id: "contact", eyebrow: "Contact", title: "Shall we talk?", nav: "Contact" },
  },
  projects: {
    intro: "From the problem to a system in production: AI agents, automations and the systems behind them.",
    plannedLabel: "Next project",
    status: { shipped: "shipped", "in-progress": "in progress", planned: "coming soon" },
    otherIntro: "Smaller and study projects, with the code on GitHub.",
    repoLink: "Code on GitHub",
    liveLink: "Try it live (uses your camera)",
    tryDemo: "Try the demo",
    viewProject: "View project",
    viewCode: "View code",
    deliveredBadge: "delivered to a client",
    more: {
      items: [
        {
          title: "Product API in .NET 10",
          year: "2026",
          text: "Catalog Web API with Entity Framework Core, migrations, dependency injection and Swagger.",
          href: "https://github.com/SantosGAlves/api-produtos-dotnet",
        },
        {
          title: "Streamlit and Azure catalog",
          year: "2025",
          text: "Product catalog with images in Azure Blob Storage and data in Azure SQL.",
          href: "https://github.com/SantosGAlves/cadastro-produtos-streamlit-azure",
        },
        {
          title: "Concurrency in Java",
          year: "2025",
          text: "The dining philosophers in four versions: deadlock, resource ordering, semaphores and monitors.",
          href: "https://github.com/SantosGAlves/prova-jantar-filosofos",
        },
      ],
      allLink: "All repositories",
    },
  },
  build: {
    intro:
      "Four areas that overlap in practice: an agent is only useful with reliable data and a back-end behind it.",
    areas: [
      {
        title: "AI agents and LLMs",
        text: "Agents that understand the request, query real data and hand over to a person when they don't have the answer.",
        items: ["customer service", "data queries", "system integration"],
      },
      {
        title: "Automation and integrations",
        text: "Flows that take repetitive work off people's hands and get systems talking to each other.",
        items: ["n8n", "APIs", "webhooks", "CRMs"],
      },
      {
        title: "Back-end and data",
        text: "The systems behind everything, end to end: from the database model to deployment.",
        items: ["APIs", "databases", "authentication", "deployment"],
      },
      {
        title: "Machine learning and computer vision",
        text: "Models trained and evaluated carefully, ready to run in real time.",
        items: ["models", "evaluation", "real-time applications"],
      },
    ],
  },
  experience: {
    caseStudiesLabel: { one: "Case study", other: "Case studies" },
    items: [
      {
        company: "Gaudium",
        role: "Automation & Innovation Intern II",
        period: "Jul 2026 – present",
        tags: ["internship"],
        // NDA: general descriptions only; no clients, partners or case study links.
        context:
          "In the Labs area (MIL), I build solutions with automation, low/no-code and artificial intelligence to speed up delivery for a technology platform for urban mobility and delivery entrepreneurs.",
        highlights: [
          "Develop applications and digital products with low/no-code platforms and code, focused on back-end, for internal and external needs.",
          "Build process automations with n8n and integrations between systems via API, reducing the teams' manual work.",
          "Apply AI agents and LLMs to internal processes, tracking results and exploring new uses.",
          "Map processes with other teams and propose solutions to make them faster, safer and more scalable.",
          "Document the solutions I build to ensure maintenance and reproducibility.",
        ],
      },
      {
        company: "Hunt Sales",
        role: "Development & Automation Intern",
        period: "Aug 2025 – Jun 2026",
        tags: ["internship"],
        context:
          "A company with its own customer service platform (CRM), where the agents and dashboards I built for its clients run.",
        highlights: [
          "Proposed and delivered, on my own, the company's first AI agent with a management system (GPT-4o mini, Supabase and a web dashboard with authentication), which reversed a client's cancellation risk and became a new kind of product.",
          "Took charge of the following projects of the same kind, such as the dashboard for electric vehicle chargers.",
          "Built WhatsApp customer service agents that query a database and hand over to humans.",
          "Integrated CRMs and Meta ads through APIs.",
        ],
        caseStudies: ["agente-baterias", "carregadores-ev"],
      },
      {
        company: "Ajuda Animal",
        role: "Owner of the WhatsApp channel",
        period: "2026",
        tags: ["extension project"],
        context: "IFSP Jacareí extension project with the Jacareí city government, in a team.",
        highlights: [
          "Built the report chatbot in n8n, connected to WhatsApp through the Evolution API.",
          "Integrated the bot with the system's API and created the conversation session database.",
          "Applied LGPD (Brazil's data protection law) safeguards: reports are anonymous by default and contact details are kept only with the citizen's consent.",
        ],
        caseStudies: ["ajuda-animal"],
      },
    ],
  },
  stack: {
    intro: "What I use to build systems and put them into production. Python is my main language.",
    pause: "Pause the strip",
    play: "Resume the strip",
    byCategory: "View by category",
    mainLabel: "main",
    usedLabel: "also worked with",
    groups: {
      languages: "Languages",
      ai: "AI and data",
      backend: "Back-end and databases",
      automation: "Automation and integrations",
      nocode: "No-code and low-code",
      frontend: "Front-end",
      infra: "Infrastructure and tools",
    },
  },
  education: {
    formationTitle: "Education",
    degree: "Technology Degree (Tecnólogo) in Systems Analysis and Development",
    school: "IFSP · Jacareí campus",
    period: "graduating Dec 2026",
    capstone: {
      label: "Capstone project",
      title: "LibrasFlow",
      text: "Recognition of the Brazilian Sign Language (Libras) manual alphabet with computer vision. Scientific paper in preparation.",
      slug: "librasflow",
      link: "Read the case study",
    },
    languagesTitle: "Languages",
    languages: [
      { name: "Portuguese", level: "native" },
      {
        name: "English",
        level: "advanced reading and listening (technical documentation), conversation in progress",
      },
    ],
    workTitle: "How I work",
    work: [
      {
        label: "Autonomy",
        text: "Proposed and delivered, on my own, a product that became a service line.",
        cases: ["agente-baterias"],
      },
      {
        label: "Focus on results",
        text: "The delivery reversed a client's cancellation risk.",
        cases: ["agente-baterias"],
      },
      {
        label: "Technical rigor",
        text: "Found and fixed a data leak in my own model instead of reporting 99.96%.",
        cases: ["librasflow"],
      },
      {
        label: "Teamwork",
        text: "Group projects at IFSP and an extension project with the Jacareí city government.",
        cases: ["librasflow", "barbu", "ajuda-animal"],
      },
      {
        label: "Building with AI",
        text: "I use coding agents such as Claude Code, reviewing and testing what goes to production. This site was built that way.",
        links: [{ label: "This site's code", href: "https://github.com/SantosGAlves/portfolio" }],
      },
    ],
  },
  contact: {
    intro: "I'm open to new opportunities. I reply quickly by email or WhatsApp.",
    emailLabel: "Email",
    copyEmail: "Copy email",
    whatsapp: "Chat on WhatsApp",
    copied: "Email copied",
  },
  caseStudy: {
    back: "Back to projects",
    summaryTitle: "30-second summary",
    meta: { role: "My role", period: "Period", status: "Status", stack: "Stack" },
    next: "Next case study",
    tryNow: "Try it now",
    code: "Code",
    details: "View technical details",
    fallbackNotice: "This case study is only available in Portuguese for now.",
    illustrativeNotice: "Draft text. Parts marked [CONFIRMAR] are still under review; sample data is illustrative.",
    video: { play: "Play", pause: "Pause" },
    tryIt: { id: "try-it", title: "Try it", loading: "Loading the demo…", load: "Load the demo", error: "The demo couldn't load.", retry: "Try again", link: "Try it live" },
    liveFrame: {
      start: "Open live demo",
      hint: "Then click Ativar câmera",
      privacy: "Runs in your browser: no image leaves your computer.",
      stop: "Stop",
      open: "Open in a new tab",
      loading: "Loading the public version…",
      frameTitle: "{titulo}: live public version",
    },
  },
  nav: ["experience", "projects", "now", "stack", "education", "contact"],
  ui: {
    skipToContent: "Skip to content",
    navLabel: "Main navigation",
    languageLabel: "Language",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    opensInNewTab: "(opens in a new tab)",
    footerNote: "Built with Next.js and deployed on Vercel.",
    more: "Show more",
    less: "Show less",
  },
}
