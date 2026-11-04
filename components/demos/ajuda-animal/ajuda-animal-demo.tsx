"use client"

import { BatteryFull, Dog, MapPin, Paperclip, PawPrint, RotateCcw, SendHorizontal, SignalHigh, Wifi, X } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { AjudaAnimalDemoContent, AjudaPlace, QuickReply } from "@/content/demos/ajuda-animal-types"
import { Backstage } from "./backstage"
import { WhatsAppText } from "./format"
import { casualProtocol, handle, nextStatus, type Exec, type Input, type Report, type Session } from "./logic"

// Simulador da conversa com o bot do Ajuda Animal. Carregado só no navegador (loader.tsx):
// tudo fica em memória e volta ao início ao recarregar ou no botão "Recomeçar".

/** Hora atual e números aleatórios fora do componente: só rodam em eventos. */
function readNow() {
  return Date.now()
}
function random() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
}
function messageId() {
  let id = "3EB0"
  for (let i = 0; i < 12; i++) id += "0123456789ABCDEF"[Math.floor(random() * 16)]
  return id
}

/** Telefone fictício (só dígitos, como o fluxo guarda). */
const phone = "5512900000000"
const replyDelay = 650

// Tela de chat escura e neutra, sem a identidade visual do WhatsApp.
const ui = {
  screen: "bg-[#0e1013]",
  bar: "bg-[#1a1d21]",
  inBubble: "bg-[#1f2328]",
  outBubble: "bg-[#2b3642]",
  muted: "text-[#9aa3ab]",
  chip: "border border-white/15 bg-[#1a1d21] text-[#e9edef] hover:border-white/30",
}
const focus = "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#7ee08f]"

type Msg = { id: number; at: number } & ({ from: "user"; input: Input } | { from: "bot"; text: string })

export default function AjudaAnimalDemo({ content }: { content: AjudaAnimalDemoContent }) {
  const t = content.chat
  const [messages, setMessages] = useState<Msg[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [exec, setExec] = useState<Exec | null>(null)
  const [fail, setFail] = useState(false)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState("")
  const [attachOpen, setAttachOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const seq = useRef(0)
  const timer = useRef<number | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const quickRef = useRef<HTMLDivElement>(null)
  const refocusQuick = useRef(false)
  const [clock, setClock] = useState(readNow)

  useEffect(() => {
    const id = window.setInterval(() => setClock(readNow()), 60_000)
    return () => {
      window.clearInterval(id)
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  // Nova mensagem: rola até o fim da conversa.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing])

  // A resposta rápida clicada some enquanto o bot "digita"; o foco volta para o grupo de respostas.
  useEffect(() => {
    if (!typing && refocusQuick.current) {
      refocusQuick.current = false
      quickRef.current?.focus({ preventScroll: true })
    }
  }, [typing])

  function send(input: Input, fromQuick = false) {
    if (typing) return
    const now = readNow()
    const result = handle(input, { content, session, reports, fail, now, phone, pushName: t.pushName, random })
    const userMsg: Msg = { id: seq.current++, at: now, from: "user", input }
    setMessages((m) => [...m, userMsg])
    setSession(result.session)
    setReports(result.reports)
    setExec(result.exec)
    setAttachOpen(false)
    setTyping(true)
    refocusQuick.current = fromQuick
    timer.current = window.setTimeout(() => {
      const at = readNow()
      const replies: Msg[] = result.replies.map((text) => ({ id: seq.current++, at, from: "bot", text }))
      setMessages((m) => [...m, ...replies])
      setTyping(false)
    }, replyDelay)
  }

  function sendText(text: string, fromQuick = false) {
    if (text.trim()) send({ kind: "text", text }, fromQuick)
  }

  function shareLocation(fromQuick = false) {
    const shared = messages.filter((m) => m.from === "user" && m.input.kind === "location").length
    send({ kind: "location", place: content.places[shared % content.places.length] }, fromQuick)
  }

  function sendPhoto(fromQuick = false) {
    send({ kind: "photo", id: messageId() }, fromQuick)
  }

  function restart() {
    if (timer.current) window.clearTimeout(timer.current)
    setMessages([])
    setSession(null)
    setReports([])
    setExec(null)
    setTyping(false)
    setDraft("")
    setAttachOpen(false)
  }

  function advance(protocol: string) {
    const at = readNow()
    setReports((rs) =>
      rs.map((r) => {
        const next = nextStatus(r.status)
        return r.protocol === protocol && next ? { ...r, status: next, updatedAt: at } : r
      }),
    )
  }

  const step = session?.current_step ?? "INICIO"
  const lastProtocol = reports[0]?.protocol
  const quick: ReactNode = typing ? null : (
    <QuickReplies
      step={step}
      content={content}
      lastProtocol={lastProtocol}
      onText={(text) => sendText(text, true)}
      onLocation={() => shareLocation(true)}
      onPhoto={() => sendPhoto(true)}
    />
  )
  const time = (ms: number) => new Intl.DateTimeFormat(content.dateLocale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(ms)

  const backstage = (
    <Backstage content={content} exec={exec} reports={reports} fail={fail} onFail={setFail} onAdvance={advance} />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
      <div className="grid justify-items-center gap-4 lg:sticky lg:top-[calc(var(--header-h)+var(--demo-reserve)+1.5rem)]">
        {/* No celular do visitante a conversa ocupa a tela abaixo do header; a partir de 640px, moldura de celular. */}
        <div className="-mx-4 h-[calc(100svh-var(--header-h)-var(--demo-reserve))] w-[calc(100%+2rem)] overflow-hidden sm:mx-0 sm:h-[min(52rem,calc(100svh-var(--header-h)-8rem))] sm:min-h-[38rem] sm:w-[24.5rem] sm:rounded-[3rem] sm:border-[10px] sm:border-[#1c1d21] sm:shadow-card">
          <div className={`flex h-full flex-col ${ui.screen}`}>
            <div aria-hidden="true" className={`hidden h-9 shrink-0 items-center justify-between px-7 pt-1 text-xs font-semibold text-white sm:flex ${ui.bar}`}>
              <span>{time(clock)}</span>
              <span className="h-5 w-24 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <SignalHigh className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </span>
            </div>

            <div
              role="region"
              aria-label={content.frameLabel}
              lang={content.dateLocale === "pt-BR" ? "pt-BR" : "en"}
              className="relative flex min-h-0 flex-1 flex-col font-sans text-[#e9edef] [color-scheme:dark]"
            >
              <div inert={sheetOpen} className="flex min-h-0 flex-1 flex-col">
                <header className={`flex h-14 shrink-0 items-center gap-2 px-3 ${ui.bar}`}>
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2b3642]">
                    <PawPrint className="size-5 text-[#e9edef]" />
                  </span>
                  <span className="ml-1 grid min-w-0 flex-1 leading-tight">
                    <span className="truncate text-[0.9375rem] font-semibold">{t.title}</span>
                    <span className={`truncate text-xs ${ui.muted}`}>{typing ? t.typing : t.subtitle}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className={`min-h-10 rounded-full border border-white/15 px-3 text-xs font-semibold lg:hidden ${focus}`}
                  >
                    {t.backstage}
                  </button>
                  <button type="button" onClick={restart} aria-label={t.restart} title={t.restart} className={`grid size-10 place-items-center rounded-full ${focus}`}>
                    <RotateCcw aria-hidden="true" className="size-[1.125rem]" />
                  </button>
                </header>

                <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                  {messages.length === 0 ? (
                    <p className={`mx-auto mt-6 w-fit max-w-[16rem] rounded-lg ${ui.bar} px-3 py-2 text-center text-xs ${ui.muted}`}>{t.start}</p>
                  ) : null}
                  <ul role="log" aria-live="polite" aria-relevant="additions" className="grid gap-2">
                    {messages.map((m) => (
                      <Bubble key={m.id} msg={m} content={content} time={time(m.at)} />
                    ))}
                  </ul>
                  {typing ? (
                    <p aria-hidden="true" className={`mt-2 w-fit rounded-lg ${ui.inBubble} px-3 py-2 text-xs ${ui.muted}`}>
                      {t.typing}
                    </p>
                  ) : null}
                </div>

                <div ref={quickRef} tabIndex={-1} role="group" aria-label={t.quickLabel} className="shrink-0 px-3 pb-2 outline-none">
                  {quick}
                </div>

                {attachOpen ? (
                  <div className="flex shrink-0 gap-2 px-3 pb-2">
                    <ActionButton icon={MapPin} label={t.shareLocation} onClick={() => shareLocation()} />
                    <ActionButton icon={Dog} label={t.sendPhoto} onClick={() => sendPhoto()} />
                  </div>
                ) : null}

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (typing || !draft.trim()) return
                    sendText(draft)
                    setDraft("")
                  }}
                  className={`flex shrink-0 items-center gap-2 px-2 py-2 ${ui.bar}`}
                >
                  <button
                    type="button"
                    aria-label={t.attach}
                    aria-expanded={attachOpen}
                    onClick={() => setAttachOpen((v) => !v)}
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${ui.muted} ${focus}`}
                  >
                    <Paperclip aria-hidden="true" className="size-5" />
                  </button>
                  <label className="sr-only" htmlFor="ajuda-input">
                    {t.inputLabel}
                  </label>
                  <input
                    id="ajuda-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t.placeholder}
                    autoComplete="off"
                    maxLength={500}
                    className={`h-10 min-w-0 flex-1 rounded-full bg-[#0e1013] px-4 text-[0.9375rem] text-[#e9edef] placeholder:text-[#9aa3ab] ${focus}`}
                  />
                  <button type="submit" aria-label={t.send} className={`grid size-10 shrink-0 place-items-center rounded-full bg-[#2b3642] ${focus}`}>
                    <SendHorizontal aria-hidden="true" className="size-5" />
                  </button>
                </form>
              </div>

              {sheetOpen ? (
                <Sheet title={content.backstage.title} intro={content.backstage.intro} close={content.backstage.close} onClose={() => setSheetOpen(false)}>
                  {backstage}
                </Sheet>
              ) : null}
            </div>

            <div aria-hidden="true" className={`hidden h-6 shrink-0 place-items-center sm:grid ${ui.bar}`}>
              <span className="h-1 w-28 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="ajuda-backstage" className="hidden rounded-card border border-line bg-surface-2/40 p-5 lg:grid lg:gap-5 lg:p-6">
        <div className="grid gap-1">
          <h3 id="ajuda-backstage" className="text-h3">
            {content.backstage.title}
          </h3>
          <p className="text-small text-muted-foreground">{content.backstage.intro}</p>
        </div>
        {sheetOpen ? null : backstage}
      </section>
    </div>
  )
}

function Bubble({ msg, content, time }: { msg: Msg; content: AjudaAnimalDemoContent; time: string }) {
  const t = content.chat
  const mine = msg.from === "user"
  return (
    <li className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[0.875rem] leading-snug break-words ${mine ? `${ui.outBubble} rounded-tr-sm` : `${ui.inBubble} rounded-tl-sm`}`}>
        <span className="sr-only">{mine ? t.you : t.bot}: </span>
        {msg.from === "bot" ? (
          <WhatsAppText text={msg.text} />
        ) : msg.input.kind === "text" ? (
          <WhatsAppText text={msg.input.text} />
        ) : msg.input.kind === "location" ? (
          <LocationCard place={msg.input.place} label={t.location} />
        ) : (
          <PhotoCard alt={t.photoAlt} />
        )}
        <span className={`float-right mt-1 ml-3 text-[0.6875rem] leading-none ${ui.muted}`}>{time}</span>
      </div>
    </li>
  )
}

function LocationCard({ place, label }: { place: AjudaPlace; label: string }) {
  return (
    <span className="grid w-56 max-w-full gap-2">
      <svg viewBox="0 0 224 96" aria-hidden="true" className="w-full rounded-lg bg-[#1d2a25]">
        <g fill="none" stroke="#33463e" strokeWidth="7" strokeLinecap="round">
          <path d="M-5 30 C 60 26, 140 40, 230 34" />
          <path d="M-5 74 C 70 80, 150 64, 230 70" />
          <path d="M60 -5 C 66 40, 54 70, 70 101" />
          <path d="M160 -5 C 154 40, 170 70, 162 101" />
        </g>
        <path d="M112 30c-8 0-14 6-14 14 0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14Z" fill="#e8b04b" />
        <circle cx="112" cy="44" r="5" fill="#1d2a25" />
      </svg>
      <span className="grid">
        <span className="sr-only">{label}: </span>
        <span className="font-semibold">{place.name}</span>
        <span className={`text-xs ${ui.muted}`}>
          {place.address} · {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
        </span>
      </span>
    </span>
  )
}

function PhotoCard({ alt }: { alt: string }) {
  return (
    <span role="img" aria-label={alt} className="grid aspect-[4/3] w-56 max-w-full place-items-center rounded-lg bg-[#3b4a40]">
      <Dog aria-hidden="true" className="size-16 text-[#d9c9a3]" strokeWidth={1.5} />
    </span>
  )
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof MapPin; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium ${ui.chip} ${focus}`}>
      <Icon aria-hidden="true" className="size-4 text-[#e8b04b]" />
      {label}
    </button>
  )
}

function QuickReplies({
  step,
  content,
  lastProtocol,
  onText,
  onLocation,
  onPhoto,
}: {
  step: Session["current_step"]
  content: AjudaAnimalDemoContent
  lastProtocol?: string
  onText: (text: string) => void
  onLocation: () => void
  onPhoto: () => void
}) {
  const q = content.quick
  const t = content.chat
  const chip = (reply: QuickReply | string, key: string) => {
    const r = typeof reply === "string" ? { send: reply } : reply
    return (
      <button
        key={key}
        type="button"
        onClick={() => onText(r.send)}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] ${ui.chip} ${focus}`}
      >
        <span className="font-semibold">{r.send}</span>
        {r.label ? <span className={ui.muted}>{r.label}</span> : null}
      </button>
    )
  }

  let items: ReactNode[] = []
  if (step === "INICIO") items = [chip(q.hello, "hello")]
  else if (step === "MENU") items = q.menu.map((r) => chip(r, r.send))
  else if (step === "DENUNCIA_TIPO") items = q.tipo.map((r) => chip(r, r.send))
  else if (step === "DENUNCIA_ANIMAL") items = q.animals.map((a) => chip(a, a))
  else if (step === "DENUNCIA_LOCAL")
    items = [<ActionButton key="loc" icon={MapPin} label={t.shareLocation} onClick={onLocation} />, chip(q.address, "address")]
  else if (step === "DENUNCIA_FOTO") items = [<ActionButton key="photo" icon={Dog} label={t.sendPhoto} onClick={onPhoto} />, chip(q.skip, "skip")]
  else if (step === "DENUNCIA_LGPD") items = q.lgpd.map((r) => chip(r, r.send))
  else if (step === "CONSULTA_PROTOCOLO")
    items = [...(lastProtocol ? [chip(casualProtocol(lastProtocol), "mine")] : []), chip(q.unknownProtocol, "unknown")]

  if (step !== "INICIO" && step !== "MENU") items.push(chip(t.menu, "menu"))

  return <div className="flex flex-wrap gap-1.5">{items}</div>
}

function Sheet({ title, intro, close, onClose, children }: { title: string; intro: string; close: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>("button")?.focus()
    return () => opener?.focus()
  }, [])
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ajuda-sheet"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      className="absolute inset-0 z-30 flex flex-col bg-background text-foreground [color-scheme:normal]"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="grid gap-0.5">
          <h2 id="ajuda-sheet" className="text-[1.0625rem] font-semibold">
            {title}
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">{intro}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={close}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-brand"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
    </div>
  )
}
