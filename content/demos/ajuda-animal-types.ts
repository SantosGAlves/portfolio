import type { DemoSectionText } from "./section-types"

// Textos da demo do Ajuda Animal (simulador da conversa do bot do WhatsApp).
// As mensagens do bot vêm do fluxo do n8n (n8n/Fluxo_ajuda_animal_whatsapp.json), sem os emojis.
// Formatação do WhatsApp: *negrito*, _itálico_ e quebras de linha.

export const ajudaTipos = ["ANIMAL_FERIDO", "MAUS_TRATOS", "ABANDONO", "SEM_AGUA_COMIDA", "OUTRO"] as const
export type AjudaTipo = (typeof ajudaTipos)[number]

/** Status que a demo percorre (o core-api tem também NOTIFIED e ARCHIVED). */
export const ajudaStatuses = ["RECEIVED", "UNDER_REVIEW", "INSPECTION_SCHEDULED", "RESOLVED"] as const
export type AjudaStatus = (typeof ajudaStatuses)[number]

export const ajudaSpecies = ["DOG", "CAT", "HORSE", "CATTLE", "PIG", "GOAT", "SHEEP", "BIRD", "RABBIT", "OTHER"] as const
export type AjudaSpecies = (typeof ajudaSpecies)[number]

export type AjudaPlace = { name: string; address: string; lat: number; lng: number }
export type QuickReply = { send: string; label?: string }

export type AjudaAnimalDemoContent = {
  dateLocale: string
  section: DemoSectionText
  frameLabel: string
  bot: {
    welcome: string
    askTipo: string
    askAnimal: string
    askLocal: string
    askFoto: string
    askLgpd: string
    /** {protocolo} */
    confirm: string
    askProtocol: string
    /** {protocolo} {tipo} {status} {data} */
    status: string
    notFound: string
    info: string
    invalid: string
    reset: string
    registerError: string
    lookupError: string
  }
  /** Palavras que voltam ao menu e que zeram a conversa (minúsculas). */
  commands: { menu: string[]; reset: string[] }
  /** Rótulos que o nó "Code: Montar Denuncia" põe na descrição, por opção do bot. */
  tipoLabels: Record<AjudaTipo, string>
  apiTypes: { ABUSE: string; ABANDONMENT: string }
  statuses: Record<AjudaStatus, string>
  species: Record<AjudaSpecies, string>
  /** Partes da descrição montada para o POST /reports. */
  description: {
    /** {animal} */
    animal: string
    notInformed: string
    /** {ref} */
    photo: string
    registered: string
    noAddress: string
    /** {lat} {lng} */
    sharedLocation: string
  }
  chat: {
    title: string
    subtitle: string
    backstage: string
    restart: string
    start: string
    inputLabel: string
    placeholder: string
    send: string
    typing: string
    you: string
    /** Nome fictício do perfil (vira reporterName quando a pessoa aceita contato). */
    pushName: string
    attach: string
    bot: string
    quickLabel: string
    shareLocation: string
    sendPhoto: string
    photoAlt: string
    location: string
    menu: string
  }
  quick: {
    hello: string
    menu: QuickReply[]
    tipo: QuickReply[]
    animals: string[]
    address: string
    skip: string
    lgpd: QuickReply[]
    unknownProtocol: string
  }
  /** Pontos fictícios enviados pelo botão de localização (em rodízio). */
  places: AjudaPlace[]
  backstage: {
    title: string
    intro: string
    fail: string
    failHint: string
    close: string
    trailTitle: string
    trailNote: string
    trailEmpty: string
    disabled: string
    sessionTitle: string
    sessionNone: string
    sessionDeleted: string
    changed: string
    requestTitle: string
    requestNone: string
    responseExcerpt: string
    noResponse: string
    panelTitle: string
    panelNote: string
    panelEmpty: string
    mapLabel: string
    noCoords: string
    anonymous: string
    contact: string
    advance: string
    resolved: string
  }
}
