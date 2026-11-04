import type {
  DemandasDemoContent,
  DemoEventName,
  Priority,
  SectorId,
  SeedUser,
  Status,
} from "@/content/demos/demandas-types"

// Lógica da demo, sem React: o mesmo comportamento do sistema original
// (desafio-Gaudium: app.py e static/js/script.js), com o estado no navegador.

export type User = SeedUser

export type Ticket = {
  id: string
  code: number
  title: string
  description: string
  priority: Priority
  target: SectorId
  requesterId: string
  requesterName: string
  requesterSector: SectorId
  requesterEmail: string
  status: Status
  execution: "play" | "pausado"
  assigneeName: string | null
  /** Início do cronômetro (ms), só enquanto está em atendimento. */
  startedAt: number | null
  minutesSpent: number
  createdAt: number
  /** AAAA-MM-DD, como no banco. */
  deadline: string
  lastActivity: number
  history: Array<{ author: string; text: string; at: number }>
}

export type DemoEvent = {
  id: string
  name: DemoEventName
  /** webhook = enviado pelo back-end; schedule = verificação agendada no próprio n8n. */
  source: "webhook" | "schedule"
  at: number
  /** Cópia do ticket no momento do evento. */
  ticket: Ticket
}

export type Viewer = "admin" | "collaborator"
export type View = "board" | "mine"

export type DemoState = {
  version: 1
  users: User[]
  tickets: Ticket[]
  events: DemoEvent[]
  viewer: Viewer
  viewerIds: Record<Viewer, string>
  nextCode: number
  seq: number
}

const HOUR = 3_600_000
const IDLE_LIMIT = 48 * HOUR
const MAX_EVENTS = 50

/** Valores de setor como gravados no banco do sistema real (aparecem no JSON do evento). */
const dbSector: Record<SectorId, string> = {
  ti: "TI",
  rh: "RH",
  financeiro: "Financeiro",
  comercial: "Comercial",
  diretoria: "Diretoria",
}

// ---------------------------------------------------------------- datas

/** Data local em AAAA-MM-DD (valor de <input type="date">). */
export function toDateInput(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addDays(ms: number, days: number): number {
  const d = new Date(ms)
  d.setDate(d.getDate() + days)
  return d.getTime()
}

export function formatDate(dateInput: string, locale: string): string {
  return new Date(`${dateInput}T00:00:00`).toLocaleDateString(locale)
}

export function formatDateTime(ms: number, locale: string): string {
  return new Date(ms).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })
}

export function formatTime(ms: number, locale: string): string {
  return new Date(ms).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
}

/** "01h 35m", como no painel original. */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.floor(min % 60)
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`
}

/** Troca {chave} pelos valores. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))
}

// ---------------------------------------------------------------- seed

export function createSeed(content: DemandasDemoContent, now: number): DemoState {
  const users = content.seed.users.map((u) => ({ ...u }))
  const byId = new Map(users.map((u) => [u.id, u]))
  const tickets: Ticket[] = content.seed.tickets.map((s) => {
    const requester = byId.get(s.requester)!
    const running = s.status === "andamento" && s.runningForMinutes !== undefined
    return {
      id: `t-${s.code}`,
      code: s.code,
      title: s.title,
      description: s.description,
      priority: s.priority,
      target: s.target,
      requesterId: requester.id,
      requesterName: requester.name,
      requesterSector: requester.sector,
      requesterEmail: requester.email,
      status: s.status,
      execution: running ? "play" : "pausado",
      assigneeName: s.assignee ? (byId.get(s.assignee)?.name ?? null) : null,
      startedAt: running ? now - s.runningForMinutes! * 60_000 : null,
      minutesSpent: s.minutesSpent,
      createdAt: now - s.createdHoursAgo * HOUR,
      deadline: toDateInput(addDays(now, s.deadlineInDays)),
      lastActivity: now - s.lastActivityHoursAgo * HOUR,
      history: (s.history ?? []).map((h) => ({
        author: byId.get(h.author)?.name ?? h.author,
        text: h.text,
        at: now - h.hoursAgo * HOUR,
      })),
    }
  })
  return {
    version: 1,
    users,
    tickets,
    events: [],
    viewer: "admin",
    viewerIds: { ...content.seed.viewers },
    nextCode: Math.max(...tickets.map((t) => t.code)) + 1,
    seq: 1,
  }
}

// ---------------------------------------------------------------- persistência

export function storageKey(content: DemandasDemoContent): string {
  return `demo-demandas-v1-${content.dateLocale}`
}

export function loadState(content: DemandasDemoContent): DemoState | null {
  try {
    const raw = window.localStorage.getItem(storageKey(content))
    if (!raw) return null
    const data = JSON.parse(raw) as DemoState
    if (data?.version !== 1 || !Array.isArray(data.tickets) || !Array.isArray(data.users)) return null
    return data
  } catch {
    return null
  }
}

export function saveState(content: DemandasDemoContent, state: DemoState): void {
  try {
    window.localStorage.setItem(storageKey(content), JSON.stringify(state))
  } catch {
    // Navegação privada ou armazenamento bloqueado: a demo segue só na memória.
  }
}

// ---------------------------------------------------------------- regras

export function currentUser(state: DemoState): User {
  const id = state.viewerIds[state.viewer]
  return state.users.find((u) => u.id === id) ?? state.users[0]
}

/** Perfis do seletor "ver como": não podem ser excluídos nem mudar de papel. */
export function isLockedUser(state: DemoState, id: string): boolean {
  return Object.values(state.viewerIds).includes(id)
}

/** Regra do back-end: admin altera tudo; os outros, só o que é destinado ao próprio setor. */
export function canEdit(user: User, ticket: Ticket): boolean {
  return user.isAdmin || user.sector === ticket.target
}

/** Kanban: admin vê tudo, colaborador só o próprio setor. "Meus chamados": o que a pessoa abriu. */
export function visibleTickets(state: DemoState, view: View, query: string, labels: (t: Ticket) => string): Ticket[] {
  const user = currentUser(state)
  const base =
    view === "mine"
      ? state.tickets.filter((t) => t.requesterId === user.id)
      : user.isAdmin
        ? state.tickets
        : state.tickets.filter((t) => t.target === user.sector)
  const q = query.trim().toLowerCase()
  const filtered = q ? base.filter((t) => labels(t).toLowerCase().includes(q)) : base
  return [...filtered].sort((a, b) => b.createdAt - a.createdAt)
}

export type SlaState = "ok" | "warning" | "critical" | "late" | "done" | "none"

/** Mesmo cálculo do script.js: do momento da abertura até 23:59:59 do dia do prazo. */
export function computeSla(ticket: Ticket, now: number): { pct: number; state: SlaState } {
  if (!ticket.deadline) return { pct: 0, state: "none" }
  const end = new Date(`${ticket.deadline}T23:59:59`).getTime()
  if (now > end && ticket.status !== "concluido") return { pct: 100, state: "late" }
  if (ticket.status === "concluido") return { pct: 100, state: "done" }
  const elapsed = now - ticket.createdAt
  if (elapsed <= 0) return { pct: 0, state: "ok" }
  const pct = Math.min(100, Math.max(0, (elapsed / (end - ticket.createdAt)) * 100))
  return { pct, state: pct >= 90 ? "critical" : pct >= 75 ? "warning" : "ok" }
}

/** Minutos apontados, contando o cronômetro em andamento. */
export function minutesWithClock(ticket: Ticket, now: number): number {
  return ticket.minutesSpent + (ticket.startedAt ? Math.max(0, Math.floor((now - ticket.startedAt) / 60_000)) : 0)
}

/**
 * Como a mudança chega ao back-end, igual ao sistema original:
 * "status" = arrastar no Kanban ou Concluir; "execucao" = botões de play e pausa do detalhe.
 */
export type MoveVia = "status" | "execucao"

/**
 * Evento que o back-end envia ao n8n (ou nenhum). No original, só o PATCH com `status`
 * dispara eventos; o PATCH com `status_execucao` (play e pausa) não dispara nenhum.
 */
export function eventForMove(ticket: Ticket, status: Status, via: MoveVia): DemoEventName | null {
  if (via === "execucao") return null
  if (status === "andamento" && ticket.status !== "andamento") return "ticket_assumido"
  if (status === "concluido" && ticket.status !== "concluido") return "ticket_concluido"
  return null
}

export function idleTickets(state: DemoState, now: number): Ticket[] {
  return state.tickets.filter((t) => t.status !== "concluido" && now - t.lastActivity > IDLE_LIMIT)
}

// ---------------------------------------------------------------- ações

export type TicketDraft = { title: string; description: string; target: SectorId; priority: Priority; deadline: string }

export type Action =
  | { type: "create"; now: number; draft: TicketDraft }
  | { type: "move"; now: number; id: string; status: Status; via: MoveVia }
  | { type: "remove"; id: string }
  | { type: "note"; now: number; id: string; text: string }
  | { type: "inactivityCheck"; now: number }
  | { type: "addUser"; user: Omit<User, "id"> }
  | { type: "toggleAdmin"; id: string }
  | { type: "removeUser"; id: string }
  | { type: "setViewer"; viewer: Viewer }
  | { type: "reset"; state: DemoState }

function withEvent(state: DemoState, name: DemoEventName, source: DemoEvent["source"], ticket: Ticket, at: number): DemoState {
  const event: DemoEvent = { id: `e-${state.seq}`, name, source, at, ticket: { ...ticket } }
  return { ...state, seq: state.seq + 1, events: [event, ...state.events].slice(0, MAX_EVENTS) }
}

function stopClock(ticket: Ticket, now: number): Ticket {
  return { ...ticket, minutesSpent: minutesWithClock(ticket, now), startedAt: null, execution: "pausado" }
}

/** Equivalente ao PATCH /api/demandas/<id> com { status }. */
function moveTicket(ticket: Ticket, status: Status, now: number, user: User): Ticket {
  const touched = { ...ticket, lastActivity: now }
  if (status === "andamento") {
    if (ticket.status === "andamento") return touched
    return { ...touched, status, execution: "play", assigneeName: user.name, startedAt: now }
  }
  return { ...stopClock(touched, now), status }
}

export function reducer(state: DemoState, action: Action): DemoState {
  const user = currentUser(state)
  switch (action.type) {
    case "create": {
      const ticket: Ticket = {
        id: `t-${state.nextCode}`,
        code: state.nextCode,
        ...action.draft,
        requesterId: user.id,
        requesterName: user.name,
        requesterSector: user.sector,
        requesterEmail: user.email,
        status: "entrada",
        execution: "pausado",
        assigneeName: null,
        startedAt: null,
        minutesSpent: 0,
        createdAt: action.now,
        lastActivity: action.now,
        history: [],
      }
      const next = { ...state, tickets: [ticket, ...state.tickets], nextCode: state.nextCode + 1 }
      return withEvent(next, "novo_ticket", "webhook", ticket, action.now)
    }
    case "move": {
      const ticket = state.tickets.find((t) => t.id === action.id)
      if (!ticket || !canEdit(user, ticket) || ticket.status === action.status) return state
      const updated = moveTicket(ticket, action.status, action.now, user)
      const next = { ...state, tickets: state.tickets.map((t) => (t.id === ticket.id ? updated : t)) }
      const event = eventForMove(ticket, action.status, action.via)
      return event ? withEvent(next, event, "webhook", updated, action.now) : next
    }
    case "remove": {
      if (!user.isAdmin) return state
      return { ...state, tickets: state.tickets.filter((t) => t.id !== action.id) }
    }
    case "note": {
      const text = action.text.trim()
      if (!text) return state
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.id
            ? { ...t, lastActivity: action.now, history: [...t.history, { author: user.name, text, at: action.now }] }
            : t
        ),
      }
    }
    case "inactivityCheck":
      return idleTickets(state, action.now).reduce(
        (acc, ticket) => withEvent(acc, "alerta_inatividade", "schedule", ticket, action.now),
        state
      )
    case "addUser": {
      if (!user.isAdmin) return state
      const id = `u-${state.seq}`
      return { ...state, seq: state.seq + 1, users: [...state.users, { ...action.user, id }] }
    }
    case "toggleAdmin": {
      if (!user.isAdmin || isLockedUser(state, action.id)) return state
      return { ...state, users: state.users.map((u) => (u.id === action.id ? { ...u, isAdmin: !u.isAdmin } : u)) }
    }
    case "removeUser": {
      if (!user.isAdmin || isLockedUser(state, action.id)) return state
      return { ...state, users: state.users.filter((u) => u.id !== action.id) }
    }
    case "setViewer":
      return { ...state, viewer: action.viewer }
    case "reset":
      return action.state
  }
}

// ---------------------------------------------------------------- n8n

/** Linha da tabela `demandas` como o back-end envia ao webhook. */
function dbRow(ticket: Ticket) {
  return {
    id: ticket.id,
    codigo: ticket.code,
    titulo: ticket.title,
    descricao: ticket.description,
    prioridade: ticket.priority,
    departamento: dbSector[ticket.target],
    setor_solicitante: dbSector[ticket.requesterSector],
    solicitante: ticket.requesterName,
    email_solicitante: ticket.requesterEmail,
    responsavel: ticket.assigneeName,
    status: ticket.status,
    status_execucao: ticket.execution,
    prazo: ticket.deadline,
    tempo_gasto: ticket.minutesSpent,
    created_at: new Date(ticket.createdAt).toISOString(),
  }
}

/** Corpo do evento: igual ao disparar_n8n() do app.py ({ evento, timestamp, ticket }). */
export function eventPayload(event: DemoEvent): string {
  const body =
    event.source === "webhook"
      ? { evento: event.name, timestamp: new Date(event.at).toISOString(), ticket: dbRow(event.ticket) }
      : { verificacao: "sem_atividade_48h", timestamp: new Date(event.at).toISOString(), ticket: dbRow(event.ticket) }
  return JSON.stringify(body, null, 2)
}

export function emailVars(ticket: Ticket, content: DemandasDemoContent): Record<string, string | number> {
  return {
    codigo: ticket.code,
    titulo: ticket.title,
    solicitante: ticket.requesterName,
    emailSolicitante: ticket.requesterEmail,
    setorOrigem: content.sectors[ticket.requesterSector],
    departamento: content.sectors[ticket.target],
    emailSetor: `${ticket.target}@example.com`,
    prioridade: content.priorities[ticket.priority],
    responsavel: ticket.assigneeName ?? content.ticket.unassigned,
    prazo: formatDate(ticket.deadline, content.dateLocale),
    criadoEm: formatDateTime(ticket.createdAt, content.dateLocale),
  }
}

// ---------------------------------------------------------------- CSV

function csvCell(value: string | number): string {
  const text = String(value)
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Mesmas colunas do "Exportar dados" original, separadas por ponto e vírgula. */
export function toCsv(tickets: Ticket[], content: DemandasDemoContent): string {
  const rows = tickets.map((t) =>
    [
      t.code,
      t.title,
      content.priorities[t.priority],
      content.statuses[t.status],
      t.requesterName,
      content.sectors[t.target],
      formatDate(t.deadline, content.dateLocale),
    ]
      .map(csvCell)
      .join(";")
  )
  return [content.csv.headers.map(csvCell).join(";"), ...rows].join("\n")
}
