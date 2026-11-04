import type { DemoSectionText } from "./section-types"

// Tipos do conteúdo da demo do Barbú (seção "Experimente" do caso). Textos em content/<idioma>/demos/barbu.ts.
// Dados iguais aos do app (Tela_Home_Inicial/lib/models/service_model.dart); pessoas e contatos fictícios.

export const barbuServiceIds = ["corte", "barba", "combo"] as const
export type BarbuServiceId = (typeof barbuServiceIds)[number]

export type BarbuNoticeType = "booking" | "promo" | "info"

export type BarbuDemoContent = {
  /** Locale do Intl para datas (pt-BR, en-US). */
  dateLocale: string
  section: DemoSectionText
  /** Rótulo da região do protótipo para leitores de tela. */
  frameLabel: string
  splash: { brand: string; loading: string }
  login: {
    tagline: string
    email: string
    password: string
    forgot: string
    submit: string
    guest: string
    noAccount: string
    signUp: string
    hint: string
  }
  forgot: {
    title: string
    text: string
    email: string
    cancel: string
    send: string
    sent: string
    invalid: string
  }
  register: {
    title: string
    subtitle: string
    back: string
    name: string
    phone: string
    email: string
    password: string
    submit: string
    required: string
    invalidEmail: string
    weak: string
  }
  home: {
    welcome: string
    avatar: string
    logoutTitle: string
    logoutText: string
    cancel: string
    logout: string
    promoLabel: string
    promoTitle: string
    promoCta: string
    promoToast: string
    servicesTitle: string
    tiles: { book: string; loyalty: string; products: string; contact: string }
  }
  services: Record<BarbuServiceId, { name: string; price: string }>
  barbers: string[]
  /** Domingo primeiro (como `weekday % 7` no app). */
  weekdays: string[]
  booking: {
    title: string
    back: string
    /** {n} = etapa atual. */
    stepLabel: string
    stepNames: [string, string, string]
    chooseDay: string
    times: string
    busy: string
    /** Horário de hoje que já passou (só na demo). */
    past: string
    checking: string
    noTimes: string
    realtimeNote: string
    next: string
    confirm: string
  }
  success: {
    title: string
    /** {barbeiro} */
    text: string
    backstage: string
    home: string
  }
  backstage: {
    title: string
    intro: string
    empty: string
    close: string
    /** {data} {hora} */
    eventBooking: string
    eventCancel: string
    bookingDoc: string
    bookingNote: string
    noticeDoc: string
    cancelNote: string
    reminder: string
    /** {quando} */
    reminderAt: string
    reminderTitle: string
    /** {servico} {barbeiro} {hora} */
    reminderBody: string
    webhook: string
    webhookNote: string
    emailLabel: string
    emailNote: string
    emailSubject: string
    /** {nome} */
    emailHeading: string
    emailLead: string
    emailFields: { service: string; barber: string; date: string; time: string }
    emailFooter: string
    to: string
    subject: string
  }
  history: {
    title: string
    empty: string
    /** {nome} */
    barber: string
    status: { confirmado: string; cancelado: string; concluido: string }
    cancel: string
    cancelled: string
  }
  notifications: {
    title: string
    testLabel: string
    test: string
    empty: string
    emptyText: string
    remove: string
    removed: string
    /** {titulo} */
    created: string
    unread: string
    /** Título da notificação criada ao agendar. */
    bookingTitle: string
    /** {servico} {barbeiro} {data} {hora} */
    bookingMsg: string
    /** As três notificações de teste do app (o botão "Testar" alterna entre elas). */
    samples: Array<{ type: BarbuNoticeType; title: string; msg: string }>
  }
  profile: {
    title: string
    edit: string
    editSoon: string
    upcoming: string
    noUpcoming: string
    /** {data} {hora} {barbeiro} */
    upcomingLine: string
    confirmed: string
    settings: string
    history: string
    historyHint: string
    notifications: string
    notificationsHint: string
    logout: string
    shopTitle: string
    shopName: string
    shopSub: string
    info: Array<{ icon: "location" | "clock" | "chat" | "camera"; label: string; value: string }>
    linksOff: string
  }
  wip: { badge: string; loyaltyTitle: string; loyaltyText: string; productsTitle: string; productsText: string; back: string }
  nav: { home: string; history: string; notifications: string; profile: string; label: string }
  seed: {
    guestName: string
    guestEmail: string
    guestPhone: string
    /** Agendamentos anteriores do visitante (dias relativos a hoje). */
    history: Array<{ service: BarbuServiceId; barber: string; daysFromToday: number; time: string; status: "confirmado" | "cancelado" }>
  }
}
