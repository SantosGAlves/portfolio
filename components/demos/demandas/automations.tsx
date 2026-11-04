"use client"

import { buttonVariants } from "@/components/ui/button"
import type { DemandasDemoContent, DemoEventName } from "@/content/demos/demandas-types"
import { emailVars, eventPayload, fill, formatTime, type DemoEvent } from "./logic"
import { CloseIcon, Dialog } from "./parts"

// Painel "Automações (n8n)": o evento que o sistema real envia ao webhook
// a cada ação, com o JSON e a prévia do e-mail que o n8n mandaria.

const accent: Record<DemoEventName, { border: string; text: string }> = {
  novo_ticket: { border: "border-brand", text: "text-brand" },
  ticket_assumido: { border: "border-warn", text: "text-warn" },
  ticket_concluido: { border: "border-ok", text: "text-ok" },
  alerta_inatividade: { border: "border-danger", text: "text-danger" },
}

export function AutomationsDrawer({
  open,
  events,
  content,
  onClose,
  onRunCheck,
}: {
  open: boolean
  events: DemoEvent[]
  content: DemandasDemoContent
  onClose: () => void
  onRunCheck: () => void
}) {
  const a = content.automations

  return (
    <Dialog open={open} onClose={onClose} labelledBy="demo-n8n-title" side>
      <div className="grid min-h-full content-start">
        <header className="sticky top-0 z-10 grid gap-3 border-b border-line bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <h2 id="demo-n8n-title" className="text-h3">
              {a.title}
            </h2>
            <button type="button" onClick={onClose} aria-label={a.close} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
              <CloseIcon />
            </button>
          </div>
          <p className="text-small text-muted-foreground">{a.intro}</p>
          <button type="button" onClick={onRunCheck} className={`${buttonVariants({ variant: "outline", size: "sm" })} justify-self-start`}>
            {a.runCheck}
          </button>
        </header>

        {events.length ? (
          <ol className="grid gap-3 px-5 py-5">
            {events.map((event, i) => (
              <li key={event.id}>
                <EventItem event={event} content={content} defaultOpen={i === 0} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-5 py-6 text-small text-subtle">{a.empty}</p>
        )}
      </div>
    </Dialog>
  )
}

function EventItem({ event, content, defaultOpen }: { event: DemoEvent; content: DemandasDemoContent; defaultOpen: boolean }) {
  const a = content.automations
  const template = content.emails[event.name]
  const vars = emailVars(event.ticket, content)
  const tone = accent[event.name]

  return (
    <details open={defaultOpen} className="group rounded-xl border border-line bg-background">
      <summary className="grid cursor-pointer list-none gap-1 rounded-xl px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="flex items-baseline gap-2">
            <span aria-hidden="true" className="inline-block font-mono text-meta text-subtle transition-transform group-open:rotate-90">
              ›
            </span>
            <span className={`font-mono text-meta ${tone.text}`}>{event.name}</span>
          </span>
          <span className="font-mono text-meta text-subtle">
            {event.source === "webhook" ? a.webhook : a.schedule} · {formatTime(event.at, content.dateLocale)}
          </span>
        </span>
        <span className="text-small text-foreground">
          {a.events[event.name]} · #{event.ticket.code} {event.ticket.title}
        </span>
      </summary>

      <div className="grid gap-4 border-t border-line px-4 py-4">
        <section className="grid gap-2">
          <h3 className="font-mono text-meta text-subtle">{a.email}</h3>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <dl className="grid gap-1 border-b border-line px-4 py-3 text-[0.8125rem]">
              <div>
                <dt className="inline text-subtle">{a.to}: </dt>
                <dd className="inline text-foreground">{fill(template.to, vars)}</dd>
              </div>
              <div>
                <dt className="inline text-subtle">{a.subject}: </dt>
                <dd className="inline font-semibold text-foreground">{fill(template.subject, vars)}</dd>
              </div>
            </dl>
            <p className="border-b border-line bg-surface-2 px-4 py-2 text-center font-mono text-meta tracking-[0.12em] text-foreground uppercase">
              {content.brand}
            </p>
            <div className="grid gap-3 px-4 py-4 text-small">
              <p className="font-semibold text-foreground">{fill(template.heading, vars)}</p>
              <p className="text-muted-foreground">{fill(template.lead, vars)}</p>
              <dl className={`grid gap-1 rounded-md border-l-2 bg-surface-2 px-3 py-2.5 ${tone.border}`}>
                {template.fields.map(([label, value]) => (
                  <div key={label}>
                    <dt className="inline font-semibold text-foreground">{label}: </dt>
                    <dd className="inline text-muted-foreground">{fill(value, vars)}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[0.8125rem] text-subtle">{fill(template.outro, vars)}</p>
              <span className="justify-self-start rounded-control bg-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-primary-foreground">
                {template.cta}
              </span>
            </div>
            <p className="border-t border-line px-4 py-2 text-center text-[0.75rem] text-subtle">{a.footer}</p>
          </div>
        </section>

        <section className="grid gap-2">
          <h3 className="font-mono text-meta text-subtle">{event.source === "webhook" ? a.payload : a.checkResult}</h3>
          <pre className="rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-[0.75rem] leading-relaxed break-words whitespace-pre-wrap text-foreground">
            {eventPayload(event)}
          </pre>
          <p className="text-[0.75rem] text-subtle">{a.fieldsNote}</p>
        </section>
      </div>
    </details>
  )
}
