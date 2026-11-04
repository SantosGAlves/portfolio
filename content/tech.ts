import type { Locale } from "./types"

// Tecnologias da seção "Tecnologias" da página inicial: a faixa rolando (na ordem abaixo) e a lista por
// categoria. Os nomes das categorias e os rótulos ficam em content/<idioma>/site.ts → stack.
// `icon` = ícone monocromático do simple-icons (mapeado em components/sections/stack.tsx); sem ícone no
// simple-icons (ou quando o ícone é o próprio nome escrito, como .NET e MySQL), a tecnologia aparece só com
// o nome, no mesmo selo.

/** Ícones do simple-icons usados aqui (slug do pacote). */
export const techIcons = [
  "python",
  "javascript",
  "typescript",
  "go",
  "dart",
  "scikitlearn",
  "opencv",
  "mediapipe",
  "pandas",
  "numpy",
  "flask",
  "nodedotjs",
  "postgresql",
  "supabase",
  "firebase",
  "n8n",
  "react",
  "nextdotjs",
  "tailwindcss",
  "flutter",
  "html5",
  "docker",
  "git",
  "github",
  "render",
  "vercel",
  "claude",
] as const
export type TechIcon = (typeof techIcons)[number]

export const techGroupKeys = ["languages", "ai", "backend", "automation", "nocode", "frontend", "infra"] as const
export type TechGroupKey = (typeof techGroupKeys)[number]

export type TechItem = {
  /** Nome da tecnologia; objeto só quando muda entre os idiomas. */
  name: string | Record<Locale, string>
  icon?: TechIcon
  /** main = linguagem principal (Python); used = "já trabalhei com". */
  level?: "main" | "used"
}

export const techGroups: Array<{ key: TechGroupKey; items: TechItem[] }> = [
  {
    key: "languages",
    items: [
      { name: "Python", icon: "python", level: "main" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "SQL" },
      { name: "Java", level: "used" },
      { name: "C#", level: "used" },
      { name: "Go", icon: "go", level: "used" },
      { name: "Dart", icon: "dart" },
    ],
  },
  {
    key: "ai",
    items: [
      { name: "OpenAI API" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "OpenCV", icon: "opencv" },
      { name: "MediaPipe", icon: "mediapipe" },
      { name: "Whisper" },
      { name: "Pandas", icon: "pandas" },
      { name: "NumPy", icon: "numpy" },
    ],
  },
  {
    key: "backend",
    items: [
      { name: "Flask", icon: "flask" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: ".NET" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Supabase", icon: "supabase" },
      { name: "Firebase", icon: "firebase" },
      { name: "MySQL" },
    ],
  },
  {
    key: "automation",
    items: [
      { name: "n8n", icon: "n8n" },
      { name: "Evolution API" },
      { name: "webhooks" },
      { name: { "pt-BR": "APIs REST", en: "REST APIs" } },
    ],
  },
  {
    key: "nocode",
    items: [{ name: "Lovable" }, { name: "Bubble" }],
  },
  {
    key: "frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Flutter", icon: "flutter" },
      { name: "HTML/CSS", icon: "html5" },
    ],
  },
  {
    key: "infra",
    items: [
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Azure" },
      { name: "Render", icon: "render" },
      { name: "Vercel", icon: "vercel" },
      { name: "Claude Code", icon: "claude" },
    ],
  },
]

export function techName(item: TechItem, locale: Locale): string {
  return typeof item.name === "string" ? item.name : item.name[locale]
}
