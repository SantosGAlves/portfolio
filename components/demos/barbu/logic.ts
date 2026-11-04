import type { BarbuDemoContent, BarbuNoticeType, BarbuServiceId } from "@/content/demos/barbu-types"

// Regras e formatos do app Barbú (Tela_Home_Inicial/lib), sem React.
// booking_page.dart: horários fixos, consulta de ocupados por barbeiro + dia, documento em
// `bookings`, aviso em `notifications/{uid}/items`, lembrete 60 min antes e webhook do n8n.

export const allTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
/** O seletor de dias do app mostra 14 dias a partir de hoje. */
export const dayCount = 14

export type Screen = "splash" | "login" | "register" | "app" | "booking" | "success" | "loyalty" | "products"
export type Tab = "home" | "history" | "notifications" | "profile"

export type User = { uid: string; name: string; email: string; phone: string }

export type Booking = {
  id: string
  service: BarbuServiceId
  barber: string
  /** YYYY-MM-DD, como o app grava. */
  date: string
  time: string
  status: "confirmado" | "cancelado"
  createdAt: number
}

export type Notice = { id: string; type: BarbuNoticeType; title: string; msg: string; read: boolean; createdAt: number }

export type BackstageEvent = { id: string; kind: "booking" | "cancel"; at: number; booking: Booking; user: User }

export type Data = { user: User | null; bookings: Booking[]; notices: Notice[]; events: BackstageEvent[]; seq: number }

/** Substitui {chave} pelos valores. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

/** Data local (não UTC) no formato do app: YYYY-MM-DD. */
export function dateString(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function addDays(ms: number, days: number): number {
  const d = new Date(ms)
  d.setDate(d.getDate() + days)
  return d.getTime()
}

export function parseDate(date: string, time = "00:00"): Date {
  const [y, m, d] = date.split("-").map(Number)
  const [h, min] = time.split(":").map(Number)
  return new Date(y, m - 1, d, h, min)
}

export function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(parseDate(date))
}

export function formatDateTime(ms: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(ms)
}

/** Pequeno hash determinístico, para os ocupados não mudarem a cada visita ao mesmo dia. */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

/**
 * Horários ocupados de um barbeiro num dia: dois ou três "de outros clientes" (sorteados pelo dia)
 * mais os agendamentos do visitante. Como no app, a consulta não filtra o status:
 * um agendamento cancelado continua ocupando o horário.
 */
export function busyTimes(barber: string, date: string, bookings: Booking[]): Set<string> {
  const h = hash(`${barber}|${date}`)
  const count = 2 + (h % 2)
  const busy = new Set<string>()
  for (let i = 0; busy.size < count && i < 12; i++) busy.add(allTimes[(h >>> (i * 3)) % allTimes.length])
  for (const b of bookings) if (b.barber === barber && b.date === date) busy.add(b.time)
  return busy
}

export function createSeed(content: BarbuDemoContent, now: number): Data {
  const bookings: Booking[] = content.seed.history.map((h, i) => ({
    id: `seed-${i + 1}`,
    service: h.service,
    barber: h.barber,
    date: dateString(addDays(now, h.daysFromToday)),
    time: h.time,
    status: h.status,
    createdAt: addDays(now, h.daysFromToday - 3),
  }))
  const promo = content.notifications.samples[0]
  return {
    user: null,
    bookings,
    notices: [{ id: "seed-n1", type: promo.type, title: promo.title, msg: promo.msg, read: false, createdAt: addDays(now, -1) }],
    events: [],
    seq: 1,
  }
}

/** No histórico, um agendamento confirmado que já passou aparece como concluído (history_page.dart). */
export function displayStatus(b: Booking, now: number): "confirmado" | "cancelado" | "concluido" {
  if (b.status === "confirmado" && parseDate(b.date, b.time).getTime() < now) return "concluido"
  return b.status
}

export function upcoming(bookings: Booking[], now: number): Booking[] {
  return bookings
    .filter((b) => b.status === "confirmado" && parseDate(b.date, b.time).getTime() >= now)
    .sort((a, b) => parseDate(a.date, a.time).getTime() - parseDate(b.date, b.time).getTime())
}

/** Hora do lembrete local: 60 minutos antes do horário. */
export function reminderAt(b: Booking): number {
  return parseDate(b.date, b.time).getTime() - 60 * 60_000
}

// ---------------------------------------------------------------- formatos enviados

export function bookingDoc(b: Booking, user: User, content: BarbuDemoContent) {
  return {
    userId: user.uid,
    service: content.services[b.service].name,
    barber: b.barber,
    date: b.date,
    time: b.time,
    status: "confirmado",
    createdAt: new Date(b.createdAt).toISOString(),
  }
}

export function noticeDoc(b: Booking, content: BarbuDemoContent) {
  return {
    type: "booking",
    titulo: content.notifications.bookingTitle,
    msg: fill(content.notifications.bookingMsg, {
      servico: content.services[b.service].name,
      barbeiro: b.barber,
      data: b.date,
      hora: b.time,
    }),
    lida: false,
    createdAt: new Date(b.createdAt).toISOString(),
  }
}

/** Corpo do POST para o webhook do n8n, com as mesmas chaves do app. */
export function webhookPayload(b: Booking, user: User, content: BarbuDemoContent) {
  return {
    userName: user.name,
    userEmail: user.email,
    date: b.date,
    time: b.time,
    barber: b.barber,
    service: content.services[b.service].name,
  }
}

export function json(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
