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
    title: "Gustavo Alves dos Santos · Applied AI and automation",
    description:
      "Applied AI and automation developer. Agents that query databases, n8n automations and API integrations.",
  },
  hero: {
    greeting: "hi, I'm",
    firstName: "Gustavo",
    lastName: "Alves dos Santos",
    role: "Applied AI and automation developer",
    lede: "I like turning manual processes into systems that run on their own and call a person when they need one. Right now I build agents that query databases, n8n automations and API integrations.",
    ctaProjects: "See projects",
    facts: [
      { label: "Now", value: "Automation & Innovation Intern · Gaudium" }, // [REVISAR] official title in English
      {
        label: "Education",
        value: "Associate degree in Systems Analysis and Development · IFSP Jacareí · Dec 2026", // [REVISAR] "Tecnólogo" equivalent
      },
      { label: "Focus", value: "Agents on real data, n8n and API integrations" },
    ],
  },
  signature: {
    title: "agent · counter service", // [REVISAR]
    badge: "illustrative example",
    labels: { message: "Customer message", call: "Tool call", trace: "Execution" },
    unknownToggle: "Simulate unknown vehicle",
    replay: "Replay",
    caption: "Hover a highlighted term to see the field it fills.",
    summary:
      "Illustrative example: a customer asks for a battery for their car; the agent extracts model, year, engine and transmission, queries the database and answers with the right battery. If the vehicle is not on file, it creates a draft entry and asks the seller to confirm.",
    // [REVISAR] The message is translated for English readers; the real agent talks in Portuguese.
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
    projects: { id: "projects", eyebrow: "Selected work", title: "Projects" },
    build: { id: "what-i-build", eyebrow: "What I build", title: "Systems and outcomes" },
    experience: { id: "experience", eyebrow: "Experience", title: "Where I've worked" },
    education: { id: "education", eyebrow: "Education", title: "Education and final project" }, // [REVISAR] "TCC"
    contact: { id: "contact", eyebrow: "Contact", title: "Let's talk" },
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
    sectionPlaceholder: "This section's content arrives in Phase 3.",
    inProgress: "in progress",
    footerNote: "Built with Next.js and deployed on Vercel.",
  },
}
