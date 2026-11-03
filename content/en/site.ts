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
    availability: "Open to GenAI internships",
    email: "[CONFIRMAR]@email.com",
    links: {
      github: "https://github.com/SantosGAlves", // [CONFIRMAR]
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
      "Illustrative example: a customer asks for a battery for their car; the agent extracts model, year, engine and transmission, queries the database and answers with the right battery. If the vehicle is not on file, it creates a draft entry and asks the seller to confirm.",
    // The message is translated for English readers (decided with Gustavo); the real agent talks in Portuguese.
    // Code identifiers (buscar_bateria, veiculos, precadastro) stay as in the real code.
    scenarios: {
      known: {
        message: [
          "do you have a battery for an ",
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
          { label: "1 match", status: "ok", state: "done" },
        ],
        reply: "For the 2019 Onix 1.0 manual, the right one is the 60 Ah, at R$ 459.00. Want me to reserve it?",
      },
      unknown: {
        message: [
          "do you have a battery for a ",
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
          { label: "supabase · veiculos → baterias", status: "0 results", state: "done" },
          { label: "precadastro.insert(veiculo)", status: "created", state: "done" },
          { label: "seller dashboard", status: "waiting", state: "wait" },
        ],
        reply: "I don't have that model on file yet. I've asked the seller to confirm and I'll get back to you shortly.",
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
      other: ["Java", "Go"],
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
        highlights: [
          "Internal process automation with n8n, AI agents and LLMs. [CONFIRMAR]",
          "Building internal products, from back-end to interface. [CONFIRMAR]",
        ],
      },
      {
        company: "Hunt Sales",
        role: "Development & Automation Intern", // [REVISAR] official title in English
        period: "Aug 2025 – [CONFIRMAR]",
        tags: [],
        context: "Development and automation for clients. [CONFIRMAR]",
        highlights: [
          "Built the whole system for a car battery store, end to end: the customer service AI agent and the management system integrated with it.",
          "Dashboard to manage vehicles, batteries and prices, with authentication, row-level security in Supabase, deployment and domain.",
          "Automatic draft entries for unknown vehicles, confirmed by the seller in the dashboard.",
          "I proposed the project; it helped retain a client who was about to cancel.",
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
    intro: "I'm open to GenAI internships. Email is the fastest way to reach me.",
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
