"use client"

import { CircleCheck, CircleCheckBig, Scissors, Sparkles, Star, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { barbuServiceIds, type BarbuDemoContent, type BarbuServiceId } from "@/content/demos/barbu-types"
import { addDays, allTimes, busyTimes, dateString, dayCount, fill, parseDate, type Booking } from "./logic"
import { AppBar, PrimaryButton, c, focus } from "./ui"

// Agendamento em 3 etapas (booking_page.dart): serviço → barbeiro → data e horário.

const serviceIcon: Record<BarbuServiceId, LucideIcon> = { corte: Scissors, barba: Sparkles, combo: Star }

export type BookingDraft = { service: BarbuServiceId; barber: string; date: string; time: string }

export function BookingFlow({
  content,
  now,
  bookings,
  onBack,
  onConfirm,
}: {
  content: BarbuDemoContent
  now: number
  bookings: Booking[]
  onBack: () => void
  onConfirm: (draft: BookingDraft) => void
}) {
  const t = content.booking
  const [step, setStep] = useState(0)
  const [service, setService] = useState<BarbuServiceId | null>(null)
  const [barber, setBarber] = useState<string | null>(null)
  // Começa em hoje só se ainda houver horário pela frente; à noite, abre no dia seguinte (sem grade vazia).
  const [dayIndex, setDayIndex] = useState(() => (allTimes.some((tm) => parseDate(dateString(now), tm).getTime() > now) ? 0 : 1))
  const [time, setTime] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const date = dateString(addDays(now, dayIndex))
  const busy = barber ? busyTimes(barber, date, bookings) : new Set<string>()
  // Só na demo: hoje, o horário que já passou fica desativado (o app permitia marcar).
  const past = new Set(allTimes.filter((tm) => parseDate(date, tm).getTime() <= now))
  const free = allTimes.filter((tm) => !busy.has(tm) && !past.has(tm))

  // A cada troca de dia o app consulta o Firestore; aqui um atraso curto mostra essa etapa.
  useEffect(() => {
    if (!checking) return
    const id = window.setTimeout(() => setChecking(false), 450)
    return () => window.clearTimeout(id)
  }, [checking])

  const canGoNext = (step === 0 && service) || (step === 1 && barber) || (step === 2 && time && !checking)

  return (
    <div className="flex h-full flex-col">
      <AppBar title={t.title} back={t.back} onBack={step === 0 ? onBack : () => setStep(step - 1)} />

      <div className="flex shrink-0 justify-center gap-2 py-4" role="img" aria-label={`${fill(t.stepLabel, { n: step + 1 })}: ${t.stepNames[step]}`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-[width,background-color] duration-300 ${step === i ? "w-12" : "w-8"} ${step >= i ? "bg-[#D32F2F]" : "bg-white/10"}`}
          />
        ))}
      </div>
      <h3 className="sr-only" aria-live="polite">
        {fill(t.stepLabel, { n: step + 1 })}: {t.stepNames[step]}
      </h3>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {step === 0 ? (
          <ul className="grid gap-4 p-5">
            {barbuServiceIds.map((id) => {
              const s = content.services[id]
              const Icon = serviceIcon[id]
              const selected = service === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setService(id)}
                    className={`flex w-full items-center gap-5 rounded-[20px] border p-5 text-left transition-colors ${
                      selected ? "border-white/30 bg-[#D32F2F]" : `${c.line} ${c.card}`
                    } ${focus}`}
                  >
                    <Icon aria-hidden="true" className={`size-7 shrink-0 ${selected ? "text-white" : "text-[#EF5350]"}`} />
                    <span className="grid flex-1">
                      <span className="text-lg font-bold text-white">{s.name}</span>
                      <span className={selected ? "text-white/80" : c.muted}>{s.price}</span>
                    </span>
                    {selected ? <CircleCheck aria-hidden="true" className="size-6 text-white" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}

        {step === 1 ? (
          <ul className="grid gap-3 p-5">
            {content.barbers.map((b) => {
              const selected = barber === b
              return (
                <li key={b}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setBarber(b)
                      setTime(null)
                    }}
                    className={`flex w-full items-center gap-4 rounded-[15px] border-2 ${c.card} p-4 text-left ${
                      selected ? "border-[#D32F2F]" : "border-transparent"
                    } ${focus}`}
                  >
                    <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-[#D32F2F] font-semibold text-white">
                      {b[0]}
                    </span>
                    <span className="flex-1 font-semibold text-white">{b}</span>
                    <span
                      aria-hidden="true"
                      className={`grid size-5 place-items-center rounded-full border-2 ${selected ? "border-[#EF5350]" : "border-white/15"}`}
                    >
                      {selected ? <span className="size-2.5 rounded-full bg-[#EF5350]" /> : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 pb-5">
            <p className={`px-5 ${c.muted}`}>{t.chooseDay}</p>
            <ul className="flex gap-2.5 overflow-x-auto overscroll-x-contain px-5 pb-1 [scrollbar-width:none]">
              {Array.from({ length: dayCount }, (_, i) => {
                const d = new Date(addDays(now, i))
                const selected = dayIndex === i
                return (
                  <li key={i} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-label={new Intl.DateTimeFormat(content.dateLocale, { weekday: "long", day: "numeric", month: "long" }).format(d)}
                      onClick={() => {
                        setDayIndex(i)
                        setTime(null)
                        setChecking(true)
                      }}
                      className={`grid h-20 w-16 place-content-center justify-items-center rounded-[15px] ${selected ? "bg-[#D32F2F]" : c.card} ${focus}`}
                    >
                      <span className="text-xl font-bold text-white">{d.getDate()}</span>
                      <span className={`text-xs ${selected ? "text-white" : c.muted}`}>{content.weekdays[d.getDay()]}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <p className={`mt-4 px-5 ${c.muted}`}>{t.times}</p>
            {checking ? (
              <p role="status" className={`flex items-center gap-3 px-5 py-6 text-sm ${c.muted}`}>
                <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-[#D32F2F] border-t-transparent motion-reduce:animate-none" />
                {t.checking}
              </p>
            ) : free.length === 0 ? (
              <p className={`px-5 py-6 text-center ${c.muted}`}>{t.noTimes}</p>
            ) : (
              <ul className="grid grid-cols-4 gap-2.5 px-5">
                {allTimes.map((tm) => {
                  const gone = past.has(tm)
                  const taken = gone || busy.has(tm)
                  const note = gone ? t.past : t.busy
                  const selected = time === tm
                  return (
                    <li key={tm}>
                      <button
                        type="button"
                        disabled={taken}
                        aria-pressed={selected}
                        aria-label={taken ? `${tm}, ${note}` : tm}
                        onClick={() => setTime(tm)}
                        className={`grid h-12 w-full place-content-center rounded-lg text-sm ${
                          taken ? "bg-[#1A1A1A]/60 text-white/30" : selected ? "bg-[#D32F2F] text-white" : `${c.card} ${c.soft}`
                        } ${focus}`}
                      >
                        <span className={taken ? "line-through" : ""}>{tm}</span>
                        {taken ? <span className="text-[0.625rem] leading-none text-[#8A8A8A]">{note}</span> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            <p className={`px-5 pt-2 text-xs leading-relaxed ${c.muted}`}>{t.realtimeNote}</p>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 p-5">
        <PrimaryButton
          disabled={!canGoNext}
          onClick={() => {
            if (step < 2) {
              setStep(step + 1)
              if (step + 1 === 2) setChecking(true)
            } else if (service && barber && time) {
              onConfirm({ service, barber, date, time })
            }
          }}
        >
          {step === 2 ? t.confirm : t.next}
        </PrimaryButton>
      </div>
    </div>
  )
}

export function Success({
  content,
  barber,
  onBackstage,
  onHome,
}: {
  content: BarbuDemoContent
  barber: string
  onBackstage: () => void
  onHome: () => void
}) {
  const t = content.success
  return (
    <div className="grid h-full place-items-center overflow-y-auto p-7">
      <div className={`grid w-full justify-items-center gap-4 rounded-[20px] ${c.card} p-7 text-center`}>
        <CircleCheckBig aria-hidden="true" className="size-20 text-[#D32F2F]" strokeWidth={1.5} />
        <h3 className="text-[1.375rem] font-bold text-white">{t.title}</h3>
        <p className={c.soft}>{fill(t.text, { barbeiro: barber })}</p>
        <button
          type="button"
          onClick={onBackstage}
          className={`min-h-11 rounded-[10px] border border-[#EF5350]/60 px-4 text-sm font-semibold text-[#EF5350] ${focus}`}
        >
          {t.backstage}
        </button>
        <button type="button" onClick={onHome} className={`min-h-11 rounded-[10px] bg-[#D32F2F] px-5 text-sm font-semibold text-white ${focus}`}>
          {t.home}
        </button>
      </div>
    </div>
  )
}
