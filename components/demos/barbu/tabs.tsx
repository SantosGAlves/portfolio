"use client"

import {
  Bell,
  BellPlus,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock,
  History,
  House,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Scissors,
  ShoppingBag,
  Smartphone,
  Star,
  Tag,
  Trash2,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import type { BarbuDemoContent, BarbuNoticeType } from "@/content/demos/barbu-types"
import { displayStatus, fill, formatDate, formatDateTime, upcoming, type Booking, type Notice, type Tab, type User } from "./logic"
import { AppBar, Logo, c, focus } from "./ui"

// Abas do app (home_page.dart → MainNavigation) e as telas "em breve".

export function BottomNav({ tab, content, onTab }: { tab: Tab; content: BarbuDemoContent; onTab: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; icon: LucideIcon; label: string }> = [
    { id: "home", icon: House, label: content.nav.home },
    { id: "history", icon: History, label: content.nav.history },
    { id: "notifications", icon: Bell, label: content.nav.notifications },
    { id: "profile", icon: UserIcon, label: content.nav.profile },
  ]
  return (
    <nav aria-label={content.nav.label} className={`absolute inset-x-0 bottom-0 z-20 h-20 border-t ${c.line} ${c.nav}`}>
      <ul className="grid h-full grid-cols-4">
        {items.map(({ id, icon: Icon, label }) => {
          const active = tab === id
          return (
            <li key={id} className="grid">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onTab(id)}
                className={`grid place-content-center justify-items-center gap-1 ${focus} -outline-offset-4`}
              >
                <span className={`grid place-items-center rounded-xl p-2 ${active ? "bg-[#D32F2F]/10" : ""}`}>
                  <Icon aria-hidden="true" className={`size-6 ${active ? "text-[#EF5350]" : "text-white/40"}`} />
                </span>
                <span className={`text-[0.6875rem] ${active ? "font-bold text-[#EF5350]" : "text-[#8A8A8A]"}`}>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const scroll = "h-full overflow-y-auto overscroll-contain pb-24"

export function HomeTab({
  content,
  user,
  onAvatar,
  onPromo,
  onBook,
  onLoyalty,
  onProducts,
  onContact,
}: {
  content: BarbuDemoContent
  user: User
  onAvatar: () => void
  onPromo: () => void
  onBook: () => void
  onLoyalty: () => void
  onProducts: () => void
  onContact: () => void
}) {
  const t = content.home
  const tiles: Array<{ label: string; icon: LucideIcon; onClick: () => void }> = [
    { label: t.tiles.book, icon: CalendarDays, onClick: onBook },
    { label: t.tiles.loyalty, icon: Star, onClick: onLoyalty },
    { label: t.tiles.products, icon: ShoppingBag, onClick: onProducts },
    { label: t.tiles.contact, icon: Smartphone, onClick: onContact },
  ]
  return (
    <div className={scroll}>
      <div className="flex items-center justify-between p-6">
        <div>
          <p className={c.muted}>{t.welcome}</p>
          <p className="text-[1.375rem] font-bold text-white">{user.name.split(" ")[0]}</p>
        </div>
        <button type="button" onClick={onAvatar} aria-label={t.avatar} className={`grid size-12 place-items-center rounded-full bg-[#D32F2F] ${focus}`}>
          <UserIcon aria-hidden="true" className="size-6 text-white" />
        </button>
      </div>
      <div className="pt-1 pb-5">
        <Logo size="sm" />
      </div>
      <div className="mx-6 grid justify-items-start gap-1 rounded-[25px] bg-[#D32F2F] p-5">
        <p className="text-xs font-bold text-white">{t.promoLabel}</p>
        <p className="text-[1.375rem] leading-tight font-black whitespace-pre-line text-white">{t.promoTitle}</p>
        <button type="button" onClick={onPromo} className={`mt-3 min-h-10 rounded-full bg-white px-5 text-sm font-medium text-black ${focus}`}>
          {t.promoCta}
        </button>
      </div>
      <h2 className="px-6 pt-7 pb-4 text-lg font-bold text-white">{t.servicesTitle}</h2>
      <ul className="grid grid-cols-2 gap-4 px-6">
        {tiles.map(({ label, icon: Icon, onClick }) => (
          <li key={label}>
            <button
              type="button"
              onClick={onClick}
              className={`grid aspect-square w-full place-content-center justify-items-center gap-3 rounded-[28px] border-[1.5px] ${c.line} ${c.card} transition-[transform,background-color] active:scale-95 active:bg-[#D32F2F] ${focus}`}
            >
              <Icon aria-hidden="true" className="size-11 text-[#EF5350]" strokeWidth={1.75} />
              <span className="font-bold tracking-wider text-white/75">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const statusTone = {
  confirmado: "border-[#64B5F6]/50 bg-[#64B5F6]/10 text-[#64B5F6]",
  cancelado: "border-[#EF5350]/50 bg-[#EF5350]/10 text-[#EF5350]",
  concluido: "border-[#69F0AE]/50 bg-[#69F0AE]/10 text-[#69F0AE]",
}

export function HistoryTab({
  content,
  bookings,
  now,
  onCancel,
}: {
  content: BarbuDemoContent
  bookings: Booking[]
  now: number
  onCancel: (id: string) => void
}) {
  const t = content.history
  const sorted = [...bookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
  return (
    <div className={scroll}>
      <AppBar title={t.title} />
      {sorted.length === 0 ? (
        <p className={`px-6 pt-16 text-center ${c.muted}`}>{t.empty}</p>
      ) : (
        <ul className="grid gap-4 px-5 pt-2">
          {sorted.map((b) => {
            const status = displayStatus(b, now)
            return (
              <li key={b.id} className={`grid gap-3 rounded-[20px] border ${c.line} ${c.card} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">{content.services[b.service].name}</p>
                    <p className={c.muted}>{fill(t.barber, { nome: b.barber })}</p>
                  </div>
                  <span className={`shrink-0 rounded-lg border px-2 py-1 text-[0.625rem] font-bold ${statusTone[status]}`}>{t.status[status]}</span>
                </div>
                <p className={`flex gap-5 border-t border-white/10 pt-3 text-sm ${c.muted}`}>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {formatDate(b.date, content.dateLocale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="size-4" />
                    {b.time}
                  </span>
                </p>
                {status === "confirmado" ? (
                  <button
                    type="button"
                    onClick={() => onCancel(b.id)}
                    className={`min-h-11 rounded-[10px] border border-[#EF5350] text-sm font-semibold text-[#EF5350] ${focus}`}
                  >
                    {t.cancel}
                  </button>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const noticeStyle: Record<BarbuNoticeType, { icon: LucideIcon; color: string; dot: string }> = {
  booking: { icon: CalendarDays, color: "text-[#69F0AE] bg-[#69F0AE]/10", dot: "bg-[#69F0AE]" },
  promo: { icon: Tag, color: "text-[#FFD740] bg-[#FFD740]/10", dot: "bg-[#FFD740]" },
  info: { icon: Star, color: "text-[#EF5350] bg-[#EF5350]/10", dot: "bg-[#EF5350]" },
}

export function NotificationsTab({
  content,
  notices,
  onTest,
  onRead,
  onRemove,
}: {
  content: BarbuDemoContent
  notices: Notice[]
  onTest: () => void
  onRead: (id: string) => void
  onRemove: (id: string) => void
}) {
  const t = content.notifications
  return (
    <div className={scroll}>
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        <button
          type="button"
          onClick={onTest}
          aria-label={t.testLabel}
          className={`flex min-h-9 items-center gap-1.5 rounded-full border border-[#EF5350]/40 bg-[#D32F2F]/10 px-3 text-xs font-bold text-[#EF5350] ${focus}`}
        >
          <BellPlus aria-hidden="true" className="size-4" />
          {t.test}
        </button>
      </div>
      {notices.length === 0 ? (
        <div className={`mx-6 mt-6 grid justify-items-center gap-2 rounded-[20px] border ${c.line} ${c.card} p-8 text-center`}>
          <Bell aria-hidden="true" className="size-12 text-white/25" />
          <p className={`font-semibold ${c.muted}`}>{t.empty}</p>
          <p className="text-sm leading-relaxed text-[#8A8A8A]">{t.emptyText}</p>
        </div>
      ) : (
        <ul className="grid gap-3 px-5">
          {notices.map((n) => {
            const s = noticeStyle[n.type]
            return (
              <li
                key={n.id}
                className={`flex items-start gap-3 rounded-[18px] border p-4 ${n.read ? `${c.line} bg-[#141414]` : "border-white/15 bg-[#1A1A1A]"}`}
              >
                <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-xl ${s.color}`}>
                  <s.icon className="size-5" />
                </span>
                <button type="button" onClick={() => onRead(n.id)} className={`grid flex-1 gap-1 rounded-md text-left ${focus}`}>
                  <span className="flex items-center gap-2">
                    <span className={`font-semibold ${n.read ? "text-white/70" : "text-white"}`}>{n.title}</span>
                    {!n.read ? (
                      <span className={`size-2 rounded-full ${s.dot}`}>
                        <span className="sr-only">{t.unread}</span>
                      </span>
                    ) : null}
                  </span>
                  <span className="text-sm text-[#8A8A8A]">{n.msg}</span>
                  <span className="text-[0.6875rem] text-[#8A8A8A]">{formatDateTime(n.createdAt, content.dateLocale)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(n.id)}
                  aria-label={`${t.remove}: ${n.title}`}
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-white/35 hover:text-white ${focus}`}
                >
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const infoIcon = { location: MapPin, clock: Clock, chat: MessageCircle, camera: Camera }

export function ProfileTab({
  content,
  user,
  bookings,
  now,
  onEdit,
  onHistory,
  onNotifications,
  onLogout,
  onLink,
}: {
  content: BarbuDemoContent
  user: User
  bookings: Booking[]
  now: number
  onEdit: () => void
  onHistory: () => void
  onNotifications: () => void
  onLogout: () => void
  onLink: () => void
}) {
  const t = content.profile
  const next = upcoming(bookings, now)
  const row = `flex w-full items-center gap-4 rounded-[15px] ${c.card} p-4 text-left ${focus}`
  return (
    <div className={scroll}>
      <AppBar title={t.title} />
      <div className="grid justify-items-center gap-1 px-6 pt-2 pb-6 text-center">
        <span aria-hidden="true" className="mb-2 grid size-20 place-items-center rounded-full bg-[#D32F2F] text-3xl font-bold text-white">
          {user.name[0]?.toUpperCase()}
        </span>
        <p className="text-xl font-bold text-white">{user.name}</p>
        <p className={`text-sm ${c.muted}`}>{user.email}</p>
        <p className={`text-sm ${c.muted}`}>{user.phone}</p>
        <button type="button" onClick={onEdit} className={`mt-2 flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-white ${focus}`}>
          <Pencil aria-hidden="true" className="size-4 text-[#EF5350]" />
          {t.edit}
        </button>
      </div>

      <Section title={t.upcoming}>
        {next.length === 0 ? (
          <p className={`rounded-[15px] ${c.card} p-4 text-sm ${c.muted}`}>{t.noUpcoming}</p>
        ) : (
          <ul className="grid gap-3">
            {next.map((b) => (
              <li key={b.id} className={`flex items-center gap-4 rounded-[15px] ${c.card} p-4`}>
                <Scissors aria-hidden="true" className="size-5 shrink-0 text-[#EF5350]" />
                <span className="grid flex-1">
                  <span className="font-semibold text-white">{content.services[b.service].name}</span>
                  <span className={`text-sm ${c.muted}`}>
                    {fill(t.upcomingLine, { data: formatDate(b.date, content.dateLocale), hora: b.time, barbeiro: b.barber })}
                  </span>
                </span>
                <span className="text-xs font-semibold text-[#69F0AE]">{t.confirmed}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.settings}>
        <div className="grid gap-3">
          <button type="button" onClick={onHistory} className={row}>
            <History aria-hidden="true" className="size-5 text-[#EF5350]" />
            <span className="grid flex-1">
              <span className="font-semibold text-white">{t.history}</span>
              <span className={`text-xs ${c.muted}`}>{t.historyHint}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-5 text-white/30" />
          </button>
          <button type="button" onClick={onNotifications} className={row}>
            <Bell aria-hidden="true" className="size-5 text-[#EF5350]" />
            <span className="grid flex-1">
              <span className="font-semibold text-white">{t.notifications}</span>
              <span className={`text-xs ${c.muted}`}>{t.notificationsHint}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-5 text-white/30" />
          </button>
          <button type="button" onClick={onLogout} className={row}>
            <LogOut aria-hidden="true" className="size-5 text-[#EF5350]" />
            <span className="flex-1 font-semibold text-[#EF5350]">{t.logout}</span>
          </button>
        </div>
      </Section>

      <Section title={t.shopTitle}>
        <div className={`grid gap-4 rounded-[20px] ${c.card} p-5`}>
          <div className="flex items-center gap-3">
            <Scissors aria-hidden="true" className="size-8 text-[#D32F2F]" />
            <div>
              <p className="font-black tracking-[0.3em] text-white">{t.shopName}</p>
              <p className={`text-xs ${c.muted}`}>{t.shopSub}</p>
            </div>
          </div>
          <ul className="grid gap-1">
            {t.info.map((item) => {
              const Icon = infoIcon[item.icon]
              return (
                <li key={item.label}>
                  <button type="button" onClick={onLink} className={`flex w-full items-start gap-3 rounded-lg py-2 text-left ${focus}`}>
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#EF5350]" />
                    <span className="grid">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span className={`text-sm whitespace-pre-line ${c.muted}`}>{item.value}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 px-5 pb-6">
      <h3 className="text-base font-bold text-white">{title}</h3>
      {children}
    </section>
  )
}

export function WipScreen({ title, text, badge, back, icon: Icon, onBack }: { title: string; text: string; badge: string; back: string; icon: LucideIcon; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <AppBar title={title} back={back} onBack={onBack} />
      <div className="grid flex-1 place-content-center justify-items-center gap-4 px-8 text-center">
        <Icon aria-hidden="true" className="size-14 text-[#D32F2F]" strokeWidth={1.5} />
        <span className="rounded-full border border-[#FFD740]/40 bg-[#FFD740]/10 px-3 py-1 text-xs font-bold text-[#FFD740]">{badge}</span>
        <p className={c.soft}>{text}</p>
      </div>
    </div>
  )
}
