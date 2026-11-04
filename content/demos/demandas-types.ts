import type { DemoSectionText } from "./section-types"

// Tipos do conteúdo da demo da plataforma de demandas (seção "Experimente" do caso).
// Os textos ficam em content/<idioma>/demos/demandas.ts; a lógica, em components/demos/demandas.

export const sectorIds = ["ti", "rh", "financeiro", "comercial", "diretoria"] as const
export type SectorId = (typeof sectorIds)[number]

export const priorities = ["baixa", "media", "alta"] as const
export type Priority = (typeof priorities)[number]

/** Os mesmos valores do banco do sistema original. */
export const statuses = ["entrada", "andamento", "pausado", "concluido"] as const
export type Status = (typeof statuses)[number]

export type DemoEventName = "novo_ticket" | "ticket_assumido" | "ticket_concluido" | "alerta_inatividade"

export type SeedUser = {
  id: string
  name: string
  /** Sempre @example.com: nada de e-mail real. */
  email: string
  sector: SectorId
  isAdmin: boolean
}

/** Ticket de exemplo com tempos relativos ao momento em que a demo abre. */
export type SeedTicket = {
  code: number
  title: string
  description: string
  priority: Priority
  target: SectorId
  /** id de um SeedUser */
  requester: string
  status: Status
  /** id de um SeedUser (quem assumiu) */
  assignee?: string
  createdHoursAgo: number
  /** Prazo em dias a partir de hoje (negativo = vencido). */
  deadlineInDays: number
  lastActivityHoursAgo: number
  minutesSpent: number
  /** Só para tickets em atendimento: há quanto tempo o cronômetro está rodando. */
  runningForMinutes?: number
  history?: Array<{ author: string; text: string; hoursAgo: number }>
}

/** Modelo de e-mail do n8n. `{chave}` é trocado pelos dados do ticket. */
export type EmailTemplate = {
  to: string
  subject: string
  heading: string
  lead: string
  fields: Array<[label: string, value: string]>
  outro: string
  cta: string
}

export type DemandasDemoContent = {
  /** Locale do Intl para datas. */
  dateLocale: string
  section: DemoSectionText
  brand: string
  sectors: Record<SectorId, string>
  priorities: Record<Priority, string>
  statuses: Record<Status, string>
  viewer: {
    label: string
    admin: string
    collaborator: string
    ruleAdmin: string
    ruleCollaborator: string
  }
  views: { board: string; mine: string; label: string }
  toolbar: {
    search: string
    export: string
    newTicket: string
    users: string
    automations: string
    reset: string
    resetConfirm: string
    hint: string
  }
  board: { label: string; empty: string; emptyMine: string; count: string }
  card: { from: string; origin: string; createdAt: string; readOnly: string; open: string }
  sla: { onTrack: string; warning: string; critical: string; late: string; done: string; none: string }
  ticket: {
    brief: string
    history: string
    noHistory: string
    notePlaceholder: string
    noteLabel: string
    addNote: string
    origin: string
    destination: string
    assignee: string
    unassigned: string
    sla: string
    noDeadline: string
    timeSpent: string
    status: string
    assume: string
    resume: string
    pause: string
    finish: string
    remove: string
    close: string
    confirmFinish: string
    confirmRemove: string
    confirm: string
    cancel: string
    readOnly: string
    forbidden: string
    system: string
  }
  form: {
    title: string
    subject: string
    subjectPlaceholder: string
    description: string
    descriptionPlaceholder: string
    origin: string
    destination: string
    priority: string
    deadline: string
    submit: string
    cancel: string
  }
  users: {
    title: string
    intro: string
    name: string
    email: string
    sector: string
    admin: string
    actions: string
    add: string
    makeAdmin: string
    revokeAdmin: string
    remove: string
    demoProfile: string
    created: string
    close: string
    yes: string
    no: string
  }
  automations: {
    title: string
    intro: string
    empty: string
    webhook: string
    schedule: string
    payload: string
    checkResult: string
    email: string
    to: string
    subject: string
    runCheck: string
    checkNone: string
    fieldsNote: string
    close: string
    footer: string
    events: Record<DemoEventName, string>
  }
  emails: Record<DemoEventName, EmailTemplate>
  toasts: {
    sent: string
    view: string
    createdOther: string
    exported: string
    reset: string
    noteAdded: string
  }
  csv: { filename: string; headers: [string, string, string, string, string, string, string] }
  seed: {
    users: SeedUser[]
    /** Os dois perfis do seletor "ver como". */
    viewers: { admin: string; collaborator: string }
    tickets: SeedTicket[]
  }
}
