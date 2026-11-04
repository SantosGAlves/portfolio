"use client"

import { BatteryFull, ShoppingBag, SignalHigh, Star, Wifi } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"
import { Login, Register, Splash } from "./auth"
import { BackstageDetail, BackstagePanel } from "./backstage"
import { BookingFlow, Success, type BookingDraft } from "./booking"
import { createSeed, fill, type Data, type Screen, type Tab, type User } from "./logic"
import { BottomNav, HistoryTab, HomeTab, NotificationsTab, ProfileTab, WipScreen } from "./tabs"
import { AppDialog, Snackbar, c, focus } from "./ui"

// Protótipo do Barbú. Carregado só no navegador (loader.tsx): tudo fica em memória
// e volta ao início quando a página recarrega.

/** Hora atual. Fora do componente para o lint saber que só roda em eventos e efeitos. */
function readNow() {
  return Date.now()
}

const splashMs = 1800

export default function BarbuDemo({ content }: { content: BarbuDemoContent }) {
  const [now, setNow] = useState(readNow)
  const [data, setData] = useState<Data>(() => createSeed(content, readNow()))
  const [screen, setScreen] = useState<Screen>("splash")
  const [tab, setTab] = useState<Tab>("home")
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [lastBarber, setLastBarber] = useState("")
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (screen !== "splash") return
    const id = window.setTimeout(() => setScreen("login"), splashMs)
    return () => window.clearTimeout(id)
  }, [screen])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(id)
  }, [toast])

  // Troca de tela: o foco vai para o topo do app, como uma navegação nova.
  useEffect(() => {
    if (screen === "splash") return
    appRef.current?.querySelector<HTMLElement>("[data-screen]")?.focus({ preventScroll: true })
  }, [screen, tab])

  function notify(text: string) {
    setToast({ id: readNow(), text })
  }

  function signIn(user: User) {
    setData((d) => ({ ...d, user }))
    setTab("home")
    setScreen("app")
  }

  function guestFromEmail(email: string): User {
    const local = email.split("@")[0]?.replace(/[._-]+/g, " ").trim()
    const name = local ? local.replace(/\b\w/g, (ch) => ch.toUpperCase()) : content.seed.guestName
    return { uid: "demo-uid", name, email: email || content.seed.guestEmail, phone: content.seed.guestPhone }
  }

  function confirm(draft: BookingDraft) {
    const at = readNow()
    setData((d) => {
      if (!d.user) return d
      const booking = { id: `bk${String(d.seq).padStart(3, "0")}`, ...draft, status: "confirmado" as const, createdAt: at }
      const notice = {
        id: `n${d.seq}`,
        type: "booking" as const,
        title: content.notifications.bookingTitle,
        msg: fill(content.notifications.bookingMsg, {
          servico: content.services[draft.service].name,
          barbeiro: draft.barber,
          data: draft.date,
          hora: draft.time,
        }),
        read: false,
        createdAt: at,
      }
      return {
        ...d,
        bookings: [booking, ...d.bookings],
        notices: [notice, ...d.notices],
        events: [{ id: `e${d.seq}`, kind: "booking" as const, at, booking, user: d.user }, ...d.events],
        seq: d.seq + 1,
      }
    })
    setNow(at)
    setLastBarber(draft.barber)
    setScreen("success")
  }

  function cancel(id: string) {
    const at = readNow()
    setData((d) => {
      const target = d.bookings.find((b) => b.id === id)
      if (!target || !d.user) return d
      const booking = { ...target, status: "cancelado" as const }
      return {
        ...d,
        bookings: d.bookings.map((b) => (b.id === id ? booking : b)),
        events: [{ id: `e${d.seq}`, kind: "cancel" as const, at, booking, user: d.user }, ...d.events],
        seq: d.seq + 1,
      }
    })
    notify(content.history.cancelled)
  }

  function addTestNotice() {
    const sample = content.notifications.samples[data.seq % content.notifications.samples.length]
    const at = readNow()
    setData((d) => ({
      ...d,
      notices: [{ id: `n${d.seq}`, type: sample.type, title: sample.title, msg: sample.msg, read: false, createdAt: at }, ...d.notices],
      seq: d.seq + 1,
    }))
    notify(fill(content.notifications.created, { titulo: sample.title }))
  }

  const user = data.user
  const overlay = logoutOpen || sheetOpen
  const showNav = screen === "app"
  const time = new Intl.DateTimeFormat(content.dateLocale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)

  let body: ReactNode = null
  if (screen === "splash") body = <Splash content={content} />
  else if (screen === "login")
    body = <Login content={content} notify={notify} onRegister={() => setScreen("register")} onSignIn={(email) => signIn(guestFromEmail(email))} />
  else if (screen === "register")
    body = (
      <Register
        content={content}
        notify={notify}
        onBack={() => setScreen("login")}
        onCreate={(u) => signIn({ uid: "demo-uid", ...u })}
      />
    )
  else if (!user) body = null
  else if (screen === "booking")
    body = <BookingFlow content={content} now={now} bookings={data.bookings} onBack={() => setScreen("app")} onConfirm={confirm} />
  else if (screen === "success")
    body = (
      <Success
        content={content}
        barber={lastBarber}
        onBackstage={() => setSheetOpen(true)}
        onHome={() => {
          setTab("home")
          setScreen("app")
        }}
      />
    )
  else if (screen === "loyalty")
    body = (
      <WipScreen title={content.wip.loyaltyTitle} text={content.wip.loyaltyText} badge={content.wip.badge} back={content.wip.back} icon={Star} onBack={() => setScreen("app")} />
    )
  else if (screen === "products")
    body = (
      <WipScreen
        title={content.wip.productsTitle}
        text={content.wip.productsText}
        badge={content.wip.badge}
        back={content.wip.back}
        icon={ShoppingBag}
        onBack={() => setScreen("app")}
      />
    )
  else if (tab === "home")
    body = (
      <HomeTab
        content={content}
        user={user}
        onAvatar={() => setLogoutOpen(true)}
        onPromo={() => notify(content.home.promoToast)}
        onBook={() => setScreen("booking")}
        onLoyalty={() => setScreen("loyalty")}
        onProducts={() => setScreen("products")}
        onContact={() => setTab("profile")}
      />
    )
  else if (tab === "history") body = <HistoryTab content={content} bookings={data.bookings} now={now} onCancel={cancel} />
  else if (tab === "notifications")
    body = (
      <NotificationsTab
        content={content}
        notices={data.notices}
        onTest={addTestNotice}
        onRead={(id) => setData((d) => ({ ...d, notices: d.notices.map((n) => (n.id === id ? { ...n, read: true } : n)) }))}
        onRemove={(id) => {
          setData((d) => ({ ...d, notices: d.notices.filter((n) => n.id !== id) }))
          notify(content.notifications.removed)
        }}
      />
    )
  else
    body = (
      <ProfileTab
        content={content}
        user={user}
        bookings={data.bookings}
        now={now}
        onEdit={() => notify(content.profile.editSoon)}
        onHistory={() => setTab("history")}
        onNotifications={() => setTab("notifications")}
        onLogout={() => setLogoutOpen(true)}
        onLink={() => notify(content.profile.linksOff)}
      />
    )

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
      <div className="grid justify-items-center gap-4">
        <p className="rounded-full border border-brand-line bg-brand-soft px-3 py-1 text-center font-mono text-meta text-brand">{content.page.badge}</p>

        {/* No celular do visitante o app ocupa a tela abaixo do header; a partir de 640px, moldura de celular. */}
        <div className="-mx-4 h-[calc(100svh-var(--header-h)-var(--demo-banner-h))] w-[calc(100%+2rem)] overflow-hidden sm:mx-0 sm:h-[min(52rem,calc(100svh-var(--header-h)-7rem))] sm:min-h-[40rem] sm:w-[24.5rem] sm:rounded-[3rem] sm:border-[10px] sm:border-[#1c1d21] sm:shadow-card">
          <div className={`flex h-full flex-col ${c.bg}`}>
            <div aria-hidden="true" className="hidden h-9 shrink-0 items-center justify-between px-7 pt-1 text-xs font-semibold text-white sm:flex">
              <span>{time}</span>
              <span className="h-5 w-24 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <SignalHigh className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </span>
            </div>

            <div
              ref={appRef}
              role="region"
              aria-label={content.frameLabel}
              lang={content.dateLocale === "pt-BR" ? "pt-BR" : "en"}
              className="relative min-h-0 flex-1 font-sans text-white [color-scheme:dark]"
            >
              <div inert={overlay} className="h-full">
                <div key={`${screen}-${tab}`} data-screen tabIndex={-1} className="h-full outline-none">
                  {body}
                </div>
                {showNav ? <BottomNav tab={tab} content={content} onTab={setTab} /> : null}
              </div>

              {logoutOpen ? (
                <AppDialog labelledBy="barbu-logout" onClose={() => setLogoutOpen(false)}>
                  <h3 id="barbu-logout" className="text-lg font-bold text-white">
                    {content.home.logoutTitle}
                  </h3>
                  <p className={c.soft}>{content.home.logoutText}</p>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setLogoutOpen(false)} className={`min-h-11 rounded-md px-3 text-sm font-semibold ${c.muted} ${focus}`}>
                      {content.home.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoutOpen(false)
                        setData((d) => ({ ...d, user: null }))
                        setScreen("login")
                      }}
                      className={`min-h-11 rounded-[10px] bg-[#D32F2F] px-4 text-sm font-bold text-white ${focus}`}
                    >
                      {content.home.logout}
                    </button>
                  </div>
                </AppDialog>
              ) : null}

              {sheetOpen && data.events[0] ? (
                <BackstageSheet content={content} onClose={() => setSheetOpen(false)}>
                  <BackstageDetail event={data.events[0]} content={content} tone="app" />
                </BackstageSheet>
              ) : null}

              <Snackbar key={toast?.id} text={toast?.text ?? null} raised={showNav} />
            </div>

            <div aria-hidden="true" className="hidden h-6 shrink-0 place-items-center sm:grid">
              <span className="h-1 w-28 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <BackstagePanel events={data.events} content={content} />
      </div>
    </div>
  )
}

function BackstageSheet({ content, onClose, children }: { content: BarbuDemoContent; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>("button")?.focus()
    return () => opener?.focus()
  }, [])
  return (
    <div
      className="absolute inset-0 z-30 flex items-end bg-black/65"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="barbu-sheet"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose()
        }}
        className="flex max-h-[88%] w-full flex-col rounded-t-[24px] border-t border-white/10 bg-[#121212]"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-4 pb-2">
          <h3 id="barbu-sheet" className="text-lg font-bold text-white">
            {content.backstage.title}
          </h3>
          <button type="button" onClick={onClose} className={`min-h-10 rounded-md px-2 text-sm font-semibold text-[#EF5350] ${focus}`}>
            {content.backstage.close}
          </button>
        </div>
        <p className="shrink-0 px-5 pb-3 text-[0.8125rem] text-[#8A8A8A]">{content.backstage.intro}</p>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">{children}</div>
      </div>
    </div>
  )
}
