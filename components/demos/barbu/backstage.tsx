"use client"

import type { ReactNode } from "react"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"
import { bookingDoc, fill, formatDate, formatDateTime, json, noticeDoc, reminderAt, webhookPayload, type BackstageEvent } from "./logic"

// "Nos bastidores": o que o app grava e envia ao confirmar ou cancelar (booking_page.dart, history_page.dart).
// Dois tons: "site" (painel ao lado do celular, nas cores do tema) e "app" (folha dentro do celular).

type Tone = "site" | "app"

const palette: Record<Tone, { card: string; code: string; text: string; muted: string; label: string; accent: string; line: string }> = {
  site: {
    card: "border-line bg-surface",
    code: "bg-surface-2 text-foreground",
    text: "text-foreground",
    muted: "text-muted-foreground",
    label: "text-subtle",
    accent: "text-brand",
    line: "border-line",
  },
  app: {
    card: "border-white/10 bg-[#1A1A1A]",
    code: "bg-black/50 text-white/85",
    text: "text-white",
    muted: "text-[#B3B3B3]",
    label: "text-[#8A8A8A]",
    accent: "text-[#EF5350]",
    line: "border-white/10",
  },
}

export function eventTitle(event: BackstageEvent, content: BarbuDemoContent): string {
  const vars = { data: formatDate(event.booking.date, content.dateLocale), hora: event.booking.time }
  return fill(event.kind === "booking" ? content.backstage.eventBooking : content.backstage.eventCancel, vars)
}

export function BackstageDetail({ event, content, tone }: { event: BackstageEvent; content: BarbuDemoContent; tone: Tone }) {
  const t = content.backstage
  const p = palette[tone]
  const b = event.booking

  if (event.kind === "cancel") {
    return (
      <div className="grid gap-3">
        <Step n={1} title={`${t.bookingDoc} · update`} note={t.cancelNote} tone={tone}>
          <Code tone={tone}>{json({ [`bookings/${b.id}`]: { status: "cancelado" } })}</Code>
        </Step>
      </div>
    )
  }

  const email = webhookPayload(b, event.user, content)
  return (
    <div className="grid gap-3">
      <Step n={1} title={t.bookingDoc} note={t.bookingNote} tone={tone}>
        <Code tone={tone}>{json({ [`bookings/${b.id}`]: bookingDoc(b, event.user, content) })}</Code>
      </Step>
      <Step n={2} title={t.noticeDoc} tone={tone}>
        <Code tone={tone}>{json(noticeDoc(b, content))}</Code>
      </Step>
      <Step n={3} title={t.reminder} note={fill(t.reminderAt, { quando: formatDateTime(reminderAt(b), content.dateLocale) })} tone={tone}>
        <div className={`rounded-xl border ${p.card} px-3.5 py-3`}>
          <p className={`text-[0.8125rem] font-semibold ${p.text}`}>{t.reminderTitle}</p>
          <p className={`text-[0.8125rem] ${p.muted}`}>
            {fill(t.reminderBody, { servico: content.services[b.service].name, barbeiro: b.barber, hora: b.time })}
          </p>
        </div>
      </Step>
      <Step n={4} title={t.webhook} note={t.webhookNote} tone={tone}>
        <Code tone={tone}>{json(email)}</Code>
      </Step>
      <Step n={5} title={t.emailLabel} note={t.emailNote} tone={tone}>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white text-[#1f1f1f]">
          <dl className="grid gap-0.5 border-b border-black/10 px-4 py-2.5 text-[0.75rem] text-[#555]">
            <div className="flex gap-1.5">
              <dt>{t.to}:</dt>
              <dd className="text-[#1f1f1f]">
                {email.userName} &lt;{email.userEmail}&gt;
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt>{t.subject}:</dt>
              <dd className="font-semibold text-[#1f1f1f]">{t.emailSubject}</dd>
            </div>
          </dl>
          <p className="bg-[#0A0A0A] py-2 text-center text-[0.75rem] font-black tracking-[0.4em] text-white">BARBÚ</p>
          <div className="grid gap-2 px-4 py-4 text-[0.8125rem]">
            <p className="font-semibold">{fill(t.emailHeading, { nome: email.userName.split(" ")[0] })}</p>
            <p className="text-[#444]">{t.emailLead}</p>
            <dl className="grid gap-0.5 border-l-2 border-[#D32F2F] bg-[#f6f6f6] px-3 py-2">
              {(
                [
                  [t.emailFields.service, email.service],
                  [t.emailFields.barber, email.barber],
                  [t.emailFields.date, formatDate(email.date, content.dateLocale)],
                  [t.emailFields.time, email.time],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex gap-1.5">
                  <dt className="font-semibold">{label}:</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="pt-1 text-center text-[0.6875rem] text-[#666]">{t.emailFooter}</p>
          </div>
        </div>
      </Step>
    </div>
  )
}

function Step({ n, title, note, tone, children }: { n: number; title: string; note?: string; tone: Tone; children: ReactNode }) {
  const p = palette[tone]
  return (
    <section className="grid gap-1.5">
      <h4 className={`flex items-baseline gap-2 text-[0.8125rem] font-semibold ${p.text}`}>
        <span className={`font-mono text-[0.6875rem] ${p.accent}`}>0{n}</span>
        {title}
      </h4>
      {note ? <p className={`text-[0.75rem] leading-relaxed ${p.label}`}>{note}</p> : null}
      {children}
    </section>
  )
}

function Code({ tone, children }: { tone: Tone; children: string }) {
  return (
    <pre className={`rounded-xl px-3.5 py-3 font-mono text-[0.6875rem] leading-relaxed break-words whitespace-pre-wrap ${palette[tone].code}`}>
      {children}
    </pre>
  )
}

/** Painel ao lado do celular (telas largas): todos os eventos, o mais novo aberto. */
export function BackstagePanel({ events, content }: { events: BackstageEvent[]; content: BarbuDemoContent }) {
  const t = content.backstage
  return (
    <section aria-labelledby="barbu-backstage" className="grid content-start gap-4 rounded-card border border-line bg-surface p-5">
      <div className="grid gap-1">
        <h3 id="barbu-backstage" className="text-h3">
          {t.title}
        </h3>
        <p className="text-small text-muted-foreground">{t.intro}</p>
      </div>
      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-small text-subtle">{t.empty}</p>
      ) : (
        <ol className="grid gap-3" aria-live="polite">
          {events.map((event, i) => (
            <li key={event.id}>
              <details open={i === 0} className="group rounded-xl border border-line bg-background/40">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 text-small font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="font-mono text-meta text-subtle transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {eventTitle(event, content)}
                </summary>
                <div className="px-4 pb-4">
                  <BackstageDetail event={event} content={content} tone="site" />
                </div>
              </details>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
