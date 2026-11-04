import type { AjudaAnimalDemoContent, AjudaPlace, AjudaSpecies, AjudaStatus, AjudaTipo } from "@/content/demos/ajuda-animal-types"
import { ajudaStatuses } from "@/content/demos/ajuda-animal-types"

// Réplica pura do fluxo do n8n (n8n/Fluxo_ajuda_animal_whatsapp.json) e das regras do core-api que o bot usa.
// Sem React: recebe a mensagem e o estado, devolve o novo estado, as respostas e o que aconteceu nos bastidores.

export type Step =
  | "INICIO"
  | "MENU"
  | "DENUNCIA_TIPO"
  | "DENUNCIA_ANIMAL"
  | "DENUNCIA_LOCAL"
  | "DENUNCIA_FOTO"
  | "DENUNCIA_LGPD"
  | "CONSULTA_PROTOCOLO"

/** Linha de whatsapp_sessions (n8n/sessoes_whatsapp.sql), com as colunas que o fluxo lê. */
export type Session = {
  phone_number: string
  current_step: Step
  temp_tipo: AjudaTipo | null
  temp_animal: string | null
  temp_local: string | null
  temp_foto: string | null
}
export const sessionFields = ["phone_number", "current_step", "temp_tipo", "temp_animal", "temp_local", "temp_foto"] as const

export type ApiType = "ABUSE" | "ABANDONMENT"

/** Corpo de POST /reports (CreateReportDto), na ordem em que o nó de código monta. */
export type ReportBody = {
  type: ApiType
  allowContact: boolean
  latitude?: number
  longitude?: number
  address: string
  species?: AjudaSpecies
  description: string
  contactPhone?: string
  reporterName?: string
}

export type Report = {
  protocol: string
  type: ApiType
  species: AjudaSpecies | null
  status: AjudaStatus
  address: string
  latitude: number | null
  longitude: number | null
  allowContact: boolean
  createdAt: number
  updatedAt: number
}

export type Input = { kind: "text"; text: string } | { kind: "location"; place: AjudaPlace } | { kind: "photo"; id: string }

export type ApiCall = {
  method: "POST" | "GET"
  path: string
  body?: ReportBody
  /** null = sem resposta (falha simulada). */
  status: number | null
  response?: Record<string, unknown>
}

export type Exec = {
  trail: { name: string; disabled?: boolean }[]
  before: Session | null
  after: Session | null
  deleted: boolean
  call: ApiCall | null
}

export type Context = {
  content: AjudaAnimalDemoContent
  session: Session | null
  reports: Report[]
  fail: boolean
  now: number
  phone: string
  pushName: string
  /** Número em [0, 1), para o protocolo (o componente usa crypto). */
  random: () => number
}

export type Result = { session: Session | null; reports: Report[]; replies: string[]; exec: Exec }

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

// core-api/src/common/protocol.ts: sem 0/O nem 1/I/L.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

export function generateProtocol(now: number, random: () => number): string {
  let suffix = ""
  for (let i = 0; i < 6; i++) suffix += alphabet[Math.floor(random() * alphabet.length)]
  return `DEN-${new Date(now).getFullYear()}-${suffix}`
}

/** "den 2026 7k3qx9" ou "DEN20267K3QX9" → "DEN-2026-7K3QX9" (como o core-api). */
export function normalizeProtocol(input: string): string {
  const text = input.trim().toUpperCase()
  const compact = text.replace(/[^A-Z0-9]/g, "")
  const match = /^([A-Z]{3})(\d{4})([A-Z0-9]{6})$/.exec(compact)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : text
}

const tipoByOption: Record<string, AjudaTipo> = { "1": "ANIMAL_FERIDO", "2": "MAUS_TRATOS", "3": "ABANDONO", "4": "SEM_AGUA_COMIDA", "5": "OUTRO" }
const apiTypeByTipo: Record<AjudaTipo, ApiType> = {
  ANIMAL_FERIDO: "ABUSE",
  MAUS_TRATOS: "ABUSE",
  ABANDONO: "ABANDONMENT",
  SEM_AGUA_COMIDA: "ABUSE",
  OUTRO: "ABUSE",
}

// Palavras-chave do nó "Code: Montar Denuncia". A versão em inglês acrescenta as palavras em inglês.
const speciesPt: [RegExp, AjudaSpecies][] = [
  [/cachorr|c[aã]o\b|c[aã]es|cadel|vira.?lata/, "DOG"],
  [/gat[oa]|felin/, "CAT"],
  [/caval|[eé]gua|burr|mula|jument|asno|potr/, "HORSE"],
  [/\bboi|vaca|bezerr|touro|gado/, "CATTLE"],
  [/porc|su[ií]n|leit[aã]o/, "PIG"],
  [/cabra|bode|cabrit/, "GOAT"],
  [/ovelha|carneir|cordeir/, "SHEEP"],
  [/p[aá]ssar|\baves?\b|galinh|galo\b|papagai|pomb|calopsit|periquit|\bpato/, "BIRD"],
  [/coelh/, "RABBIT"],
]
const speciesEn: [RegExp, AjudaSpecies][] = [
  [/\bdogs?\b|pupp|\bmutt/, "DOG"],
  [/\bcats?\b|kitt/, "CAT"],
  [/horse|donkey|\bmule|\bpony/, "HORSE"],
  [/\bcows?\b|\box\b|\bbull|calf|cattle/, "CATTLE"],
  [/\bpigs?\b|\bhog/, "PIG"],
  [/\bgoat/, "GOAT"],
  [/sheep|\blamb/, "SHEEP"],
  [/\bbirds?\b|chicken|parrot|pigeon|\bducks?\b/, "BIRD"],
  [/rabbit|bunn/, "RABBIT"],
]

export function speciesFor(animal: string, locale: string): AjudaSpecies | undefined {
  const text = animal.trim().toLowerCase()
  if (!text) return undefined
  const rules = locale === "pt-BR" ? speciesPt : [...speciesPt, ...speciesEn]
  return rules.find(([re]) => re.test(text))?.[1] ?? "OTHER"
}

/** Nó "Code: Montar Denuncia": corpo do POST /reports a partir da sessão. */
export function buildReport(session: Session, messageText: string, ctx: Context): ReportBody {
  const { content } = ctx
  const allowContact = messageText.trim() === "2"
  const tipo = session.temp_tipo ?? "OUTRO"
  const type = apiTypeByTipo[tipo]
  const animal = (session.temp_animal ?? "").trim()
  const species = speciesFor(animal, content.dateLocale)
  const local = (session.temp_local ?? "").trim()
  const m = /^(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:\s+(.+))?$/.exec(local)

  const body: ReportBody = { type, allowContact, address: "", description: "" }
  if (m) {
    body.latitude = Number(m[1])
    body.longitude = Number(m[2])
    body.address = (m[3] || fill(content.description.sharedLocation, { lat: body.latitude.toFixed(5), lng: body.longitude.toFixed(5) })).slice(0, 300)
  } else {
    body.address = (local || content.description.noAddress).slice(0, 300)
  }
  if (species) body.species = species

  const parts = [`${content.tipoLabels[tipo]}.`, fill(content.description.animal, { animal: animal || content.description.notInformed })]
  if (session.temp_foto) parts.push(fill(content.description.photo, { ref: session.temp_foto }))
  parts.push(content.description.registered)
  body.description = parts.join(" ").slice(0, 2000)

  if (allowContact) {
    if (/^\d{10,13}$/.test(ctx.phone)) body.contactPhone = ctx.phone
    if (ctx.pushName) body.reporterName = ctx.pushName
  }
  // Mesma ordem de chaves do nó de código: type, allowContact, latitude, longitude, address, species, description...
  const { type: t, allowContact: a, latitude, longitude, address, species: s, description, contactPhone, reporterName } = body
  return {
    type: t,
    allowContact: a,
    ...(latitude !== undefined ? { latitude, longitude } : {}),
    address,
    ...(s ? { species: s } : {}),
    description,
    ...(contactPhone ? { contactPhone } : {}),
    ...(reporterName ? { reporterName } : {}),
  }
}

/** Data da última atualização, como no nó "Msg: Status Encontrado". */
export function formatDate(ms: number, locale: string): string {
  return new Date(ms).toLocaleDateString(locale, { timeZone: "America/Sao_Paulo" })
}

export function nextStatus(status: AjudaStatus): AjudaStatus | null {
  const i = ajudaStatuses.indexOf(status)
  return i >= 0 && i < ajudaStatuses.length - 1 ? ajudaStatuses[i + 1] : null
}

const n = (name: string): { name: string; disabled?: boolean } => ({ name })
const entry = [n("Webhook"), n("Filtro: Apenas Mensagens Recebidas"), n("Normalizar Entrada"), n("If: Zerar Conversa?")]
const send = n("HTTP: Enviar WhatsApp")

/** Uma mensagem do cidadão passando pelo fluxo inteiro. */
export function handle(input: Input, ctx: Context): Result {
  const { content } = ctx
  const bot = content.bot

  // Normalizar Entrada
  const messageText = input.kind === "text" ? input.text.trim().slice(0, 500) : ""
  const lower = messageText.toLowerCase()
  const localText =
    input.kind === "location"
      ? `${input.place.lat},${input.place.lng} ${[input.place.name, input.place.address].filter(Boolean).join(" - ")}`.trim().slice(0, 300)
      : messageText.slice(0, 300)
  const fotoRef = input.kind === "photo" ? `wa-msg:${input.id}` : ""

  const before = ctx.session
  if (content.commands.reset.includes(lower)) {
    return {
      session: null,
      reports: ctx.reports,
      replies: [bot.reset],
      exec: { trail: [...entry, n("Postgres: Zerar Sessao"), n("Msg: Conversa Zerada"), send], before, after: null, deleted: true, call: null },
    }
  }

  // Postgres: Buscar ou Criar Sessao
  const found: Session = before ?? {
    phone_number: ctx.phone,
    current_step: "INICIO",
    temp_tipo: null,
    temp_animal: null,
    temp_local: null,
    temp_foto: null,
  }
  const isMenu = content.commands.menu.includes(lower)
  const route: Step = isMenu ? "INICIO" : found.current_step
  const trail = [...entry, n("Postgres: Buscar ou Criar Sessao"), n(`Switch: Roteador de Etapas → ${route}`)]

  let session: Session = found
  let reports = ctx.reports
  const replies: string[] = []
  let call: ApiCall | null = null
  const set = (patch: Partial<Session>) => {
    session = { ...session, ...patch }
  }

  switch (route) {
    case "INICIO":
      set({ current_step: "MENU" })
      trail.push(n("Postgres: Set Step MENU"), n("Msg: Boas Vindas"))
      replies.push(bot.welcome)
      break
    case "MENU":
      trail.push(n("Switch: Opcao Menu (1, 2 ou 3)"))
      if (messageText === "1") {
        set({ current_step: "DENUNCIA_TIPO" })
        trail.push(n("Postgres: Set Step DENUNCIA_TIPO"), n("Msg: Pergunta Tipo"))
        replies.push(bot.askTipo)
      } else if (messageText === "2") {
        set({ current_step: "CONSULTA_PROTOCOLO" })
        trail.push(n("Postgres: Set Step CONSULTA_PROTOCOLO"), n("Msg: Pergunta Protocolo"))
        replies.push(bot.askProtocol)
      } else if (messageText === "3") {
        set({ current_step: "INICIO" })
        trail.push(n("Postgres: Reset Sessao Menu"), n("Msg: Informacoes Uteis"))
        replies.push(bot.info)
      } else {
        trail.push(n("Msg: Opcao Invalida"))
        replies.push(bot.invalid)
      }
      break
    // Como no fluxo, as etapas da denúncia não validam a resposta: o que não é opção conhecida vira OUTRO ou vazio.
    case "DENUNCIA_TIPO":
      set({ temp_tipo: tipoByOption[messageText] ?? "OUTRO", current_step: "DENUNCIA_ANIMAL" })
      trail.push(n("Postgres: Salvar Tipo"), n("Msg: Pergunta Animal"))
      replies.push(bot.askAnimal)
      break
    case "DENUNCIA_ANIMAL":
      set({ temp_animal: messageText.slice(0, 100) || null, current_step: "DENUNCIA_LOCAL" })
      trail.push(n("Postgres: Salvar Animal"), n("Msg: Pergunta Local"))
      replies.push(bot.askLocal)
      break
    case "DENUNCIA_LOCAL":
      set({ temp_local: localText || null, current_step: "DENUNCIA_FOTO" })
      trail.push(n("Postgres: Salvar Local"), n("Msg: Pergunta Foto"))
      replies.push(bot.askFoto)
      break
    case "DENUNCIA_FOTO":
      set({ temp_foto: fotoRef || null, current_step: "DENUNCIA_LGPD" })
      trail.push(n("Postgres: Salvar Foto"), n("Msg: Pergunta LGPD"))
      replies.push(bot.askLgpd)
      break
    case "DENUNCIA_LGPD": {
      const body = buildReport(session, messageText, ctx)
      trail.push(n("Code: Montar Denuncia"), n("HTTP: Registrar Denuncia (core-api)"))
      if (ctx.fail) {
        call = { method: "POST", path: "/reports", body, status: null }
        trail.push(n("Msg: Erro ao Registrar"))
        replies.push(bot.registerError)
        break
      }
      const protocol = generateProtocol(ctx.now, ctx.random)
      reports = [
        {
          protocol,
          type: body.type,
          species: body.species ?? null,
          status: "RECEIVED",
          address: body.address,
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          allowContact: body.allowContact,
          createdAt: ctx.now,
          updatedAt: ctx.now,
        },
        ...reports,
      ]
      call = { method: "POST", path: "/reports", body, status: 201, response: { protocol } }
      set({ current_step: "INICIO", temp_tipo: null, temp_animal: null, temp_local: null, temp_foto: null })
      trail.push(
        n("Postgres: Resetar Sessao Final"),
        n("Msg: Confirmacao Cidadao"),
        n("Msg: Formatar Alerta Fiscais"),
        { name: "HTTP: Disparar Alerta Fiscais", disabled: true },
      )
      replies.push(fill(bot.confirm, { protocolo: protocol }))
      break
    }
    case "CONSULTA_PROTOCOLO": {
      set({ current_step: "INICIO" })
      const path = `/reports/protocol/${encodeURIComponent(messageText.slice(0, 40))}`
      trail.push(n("Postgres: Reset Sessao Consulta"), n("HTTP: Consultar Protocolo (core-api)"))
      if (ctx.fail) {
        call = { method: "GET", path, status: null }
        trail.push(n("Msg: Erro na Consulta"))
        replies.push(bot.lookupError)
        break
      }
      const report = ctx.reports.find((r) => r.protocol === normalizeProtocol(messageText))
      trail.push(n("Switch: Resultado Consulta"))
      if (report) {
        call = {
          method: "GET",
          path,
          status: 200,
          response: {
            protocol: report.protocol,
            type: report.type,
            status: report.status,
            createdAt: new Date(report.createdAt).toISOString(),
            updatedAt: new Date(report.updatedAt).toISOString(),
          },
        }
        trail.push(n("Msg: Status Encontrado"))
        replies.push(
          fill(bot.status, {
            protocolo: report.protocol,
            tipo: content.apiTypes[report.type],
            status: content.statuses[report.status],
            data: formatDate(report.updatedAt, content.dateLocale),
          }),
        )
      } else {
        call = { method: "GET", path, status: 404 }
        trail.push(n("Msg: Protocolo Nao Encontrado"))
        replies.push(bot.notFound)
      }
      break
    }
  }

  trail.push(send)
  return { session, reports, replies, exec: { trail, before, after: session, deleted: false, call } }
}

/** Versão "digitada" do protocolo para o botão de resposta rápida: minúsculas e espaços, como alguém digitaria. */
export function casualProtocol(protocol: string): string {
  return protocol.toLowerCase().replace(/-/g, " ")
}
