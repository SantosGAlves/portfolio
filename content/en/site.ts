import type { SiteContent } from "@/content/types"

// English mirror of content/pt-BR/site.ts (same types).
// [REVISAR] marks lines where the translation needs Gustavo's review.
// [CONFIRMAR] marks missing real data.
export const site: SiteContent = {
  locale: "en",
  ogLocale: "en_US",
  profile: {
    name: "Gustavo Alves dos Santos",
    shortName: "Gustavo Alves",
    location: "São José dos Campos, Brazil",
    availability: "Open to new opportunities",
    email: "[CONFIRMAR]@email.com",
    links: {
      github: "https://github.com/SantosGAlves",
      linkedin: "https://www.linkedin.com/in/[CONFIRMAR]",
      cv: "/cv/gustavo-alves-dos-santos-cv-en.pdf", // [CONFIRMAR] English CV does not exist yet
    },
  },
  seo: {
    title: "Gustavo Alves dos Santos · Software, applied AI and automation",
    description:
      "Software developer focused on back-end, applied AI and automation: agents that query databases, n8n automations and the systems behind them.",
  },
  hero: {
    greeting: "hi, I'm",
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    // Option A (in use). Option B: "Back-end developer focused on applied AI".
    role: "Software developer · applied AI and automation",
    lede: "I build software, mostly back-end, and I like turning manual processes into systems that run on their own and call a person when they need one. Right now I build AI agents that query databases, n8n automations and the systems behind them: APIs, dashboards and authentication.",
    ctaProjects: "See projects",
    facts: [
      { label: "Now", value: "Automation & Innovation Intern II · Gaudium" }, // [REVISAR] official title in English
      {
        label: "Education",
        value: "Technology Degree (Tecnólogo) in Systems Analysis and Development · IFSP Jacareí · Dec 2026",
      },
      { label: "Focus", value: "Back-end, AI agents on real data and automation" },
    ],
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
    projects: { id: "projects", eyebrow: "Selected work", title: "Projects", nav: "Projects" },
    build: { id: "what-i-build", eyebrow: "What I build", title: "From agent to back-end", nav: "What I build" },
    experience: { id: "experience", eyebrow: "Experience", title: "Where I've worked", nav: "Experience" },
    education: { id: "education", eyebrow: "Education", title: "Education and capstone project", nav: "Education" },
    contact: { id: "contact", eyebrow: "Contact", title: "Let's talk", nav: "Contact" },
  },
  projects: {
    intro:
      "From the problem to a system in production. The main one is an AI agent with the management system behind it.",
    caseStudyLink: "Read the case study",
    caseStudyFallbackLink: "Read the case study (in Portuguese)",
    plannedLabel: "Next project",
    status: { shipped: "shipped", "in-progress": "in progress", planned: "coming soon" },
    secondaryTitle: "Other projects",
    repoLink: "Code on GitHub",
    liveLink: "Try it live (uses your camera)",
    liveDialog: {
      trigger: "Try it here (uses your camera)",
      eyebrow: "Live demo",
      loading: "Loading the public version…",
      frameTitle: "{titulo}: live demo",
      close: "Close",
      fallback: "Camera didn't open in here?",
      external: "Open in a new tab",
    },
    demoBadge: "interactive demo",
    more: {
      title: "More on GitHub",
      items: [
        {
          title: "Product API in .NET 10",
          text: "Catalog Web API with Entity Framework Core, migrations, dependency injection and Swagger.",
          stack: "C# · .NET 10 · EF Core · MySQL",
          href: "https://github.com/SantosGAlves/api-produtos-dotnet",
        },
        {
          title: "Streamlit and Azure catalog",
          text: "Product catalog with images in Azure Blob Storage and data in Azure SQL.",
          stack: "Python · Streamlit · Azure",
          href: "https://github.com/SantosGAlves/cadastro-produtos-streamlit-azure",
        },
        {
          title: "Concurrency in Java",
          text: "The dining philosophers in four versions: deadlock, resource ordering, semaphores and monitors.",
          stack: "Java · threads",
          href: "https://github.com/SantosGAlves/prova-jantar-filosofos",
        },
      ],
      allLink: "All repositories",
    },
  },
  build: {
    intro:
      "Three areas with equal weight. In practice they overlap: an agent is only useful with a reliable back-end behind it.",
    areas: [
      {
        title: "AI agents",
        text: "Agents that understand the request, query real data through tools and hand over to a person when they don't have the answer.",
        includes: ["Extracting data from the message", "Tool calls and database queries", "Handoff to a human"],
        tools: ["LLM APIs", "tool calling", "Python", "Supabase"],
      },
      {
        title: "Process automation",
        text: "Flows that take repetitive work off people's hands: they receive an event, decide what to do and record the outcome.",
        includes: [
          "Chatbots and automated customer service",
          "System integrations through APIs and webhooks",
          "Scheduled routines and notifications",
        ],
        tools: ["n8n", "webhooks", "REST APIs", "Python"],
      },
      {
        title: "Products and back-end",
        text: "The systems behind the agents, end to end: APIs, databases, management dashboards, authentication and deployment.",
        includes: [
          "APIs and database modeling",
          "Management and data-entry dashboards",
          "Authentication, RLS, deployment and domain",
        ],
        tools: ["Python", "PostgreSQL · Supabase", "RLS", "[CONFIRMAR] hosting"],
      },
    ],
    includesLabel: "Includes",
    toolsLabel: "Tools",
    languages: {
      title: "Languages",
      primaryLabel: "Main",
      primary: { name: "Python", note: "the one I use most, for agents, automation and back-end" },
      otherLabel: "Also worked with",
      other: ["Java", "Go", "C#"],
    },
    workflow: {
      title: "How I work",
      text: "I build with the help of coding agents such as Claude Code. They speed up the writing; I decide what to build, review every change and test what goes to production. This site was built that way.",
    },
  },
  experience: {
    caseStudyLink: "Read the case study",
    items: [
      {
        company: "Gaudium",
        role: "Automation & Innovation Intern II", // [REVISAR] official title in English
        period: "Jul 2026 – present",
        tags: ["under NDA"],
        context:
          "B2B technology company for ride-hailing and delivery agencies. The details of this work are confidential.",
        highlights: ["Process automation and API integrations.", "Building websites and web products, focused on back-end."],
      },
      {
        company: "Hunt Sales",
        role: "Development & Automation Intern", // [REVISAR] official title in English
        period: "Aug 2025 – Jun 2026",
        tags: [],
        context:
          "A company with its own customer service platform (CRM), where the agents and dashboards I built for its clients run.",
        highlights: [
          "Proposed and delivered the company's first AI agent with a management system; after that, I became responsible for similar projects for other clients.",
          "AI agents for WhatsApp customer service (GPT-4o mini) that query a database and hand over to humans.",
          "Management systems that feed the agents (Supabase, authentication, web dashboards).",
          "API integrations with CRMs and Meta ads, among others.",
        ],
        caseStudy: "agente-baterias",
      },
    ],
  },
  education: {
    degree: "Technology Degree (Tecnólogo) in Systems Analysis and Development",
    school: "IFSP · Jacareí campus",
    period: "graduating Dec 2026",
    note: "Federal Institute of São Paulo.",
    capstone: {
      label: "Capstone project",
      title: "LibrasFlow",
      text: "Recognition of the Brazilian Sign Language (Libras) manual alphabet with computer vision.",
      slug: "librasflow",
      link: "Read the case study",
    },
  },
  contact: {
    intro: "I'm open to new opportunities. Email is the fastest way to reach me.",
    emailLabel: "Email",
    copyEmail: "Copy email",
    copied: "Email copied",
  },
  caseStudy: {
    back: "Back to projects",
    summaryTitle: "30-second summary",
    meta: { role: "My role", period: "Period", status: "Status", stack: "Stack" },
    next: "Next case study",
    fallbackNotice: "This case study is only available in Portuguese for now.",
    illustrativeNotice: "Draft text. Parts marked [CONFIRMAR] are still under review; sample data is illustrative.",
    video: { play: "Play", pause: "Pause" },
    tryIt: { id: "try-it", title: "Try it", loading: "Loading the demo…" },
  },
  nav: ["projects", "build", "experience", "contact"],
  ui: {
    skipToContent: "Skip to content",
    downloadCv: "Download CV",
    navLabel: "Main navigation",
    languageLabel: "Language",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    opensInNewTab: "(opens in a new tab)",
    footerNote: "Built with Next.js and deployed on Vercel.",
  },
}
