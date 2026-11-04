"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { DemandasDemoContent, Status } from "@/content/demos/demandas-types"
import {
  canEdit,
  computeSla,
  fill,
  formatDate,
  formatDateTime,
  formatMinutes,
  minutesWithClock,
  type MoveVia,
  type Ticket,
  type User,
} from "./logic"
import { CloseIcon, Dialog, PriorityTag, SectorTag, SlaBar, labelClass, inputClass, slaLabel, slaText } from "./parts"

// Detalhe do ticket: assumir, pausar, concluir, excluir (admin) e notas no histórico.

export function TicketDialog({
  ticket,
  user,
  viewerLabel,
  now,
  content,
  onClose,
  onMove,
  onRemove,
  onNote,
}: {
  ticket: Ticket | null
  user: User
  viewerLabel: string
  now: number
  content: DemandasDemoContent
  onClose: () => void
  onMove: (id: string, status: Status, via: MoveVia) => void
  onRemove: (id: string) => void
  onNote: (id: string, text: string) => void
}) {
  return (
    <Dialog open={ticket !== null} onClose={onClose} labelledBy="demo-ticket-title">
      {ticket ? (
        <TicketBody
          key={ticket.id}
          ticket={ticket}
          user={user}
          viewerLabel={viewerLabel}
          now={now}
          content={content}
          onClose={onClose}
          onMove={onMove}
          onRemove={onRemove}
          onNote={onNote}
        />
      ) : null}
    </Dialog>
  )
}

function TicketBody({
  ticket,
  user,
  viewerLabel,
  now,
  content,
  onClose,
  onMove,
  onRemove,
  onNote,
}: {
  ticket: Ticket
  user: User
  viewerLabel: string
  now: number
  content: DemandasDemoContent
  onClose: () => void
  onMove: (id: string, status: Status, via: MoveVia) => void
  onRemove: (id: string) => void
  onNote: (id: string, text: string) => void
}) {
  const c = content.ticket
  const [pending, setPending] = useState<"finish" | "remove" | null>(null)
  const [note, setNote] = useState("")
  const editable = canEdit(user, ticket)
  const sla = computeSla(ticket, now)
  const running = ticket.execution === "play" && ticket.status === "andamento"

  const control = buttonVariants({ variant: "outline", size: "sm" })

  return (
    <div className="grid">
      <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="grid gap-2">
          <h2 id="demo-ticket-title" className="text-h3">
            <span className="mr-2 rounded-md bg-surface-2 px-1.5 py-0.5 align-middle font-mono text-meta text-muted-foreground">
              #{ticket.code}
            </span>
            {ticket.title}
          </h2>
          <p className="flex flex-wrap gap-1.5">
            <PriorityTag priority={ticket.priority} label={content.priorities[ticket.priority]} />
            <SectorTag label={content.sectors[ticket.target]} />
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label={c.close} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
          <CloseIcon />
        </button>
      </header>

      <div className="border-b border-line px-5 py-3">
        {editable ? (
          pending ? (
            <div role="group" aria-label={pending === "finish" ? c.confirmFinish : c.confirmRemove} className="flex flex-wrap items-center gap-3">
              <p className="text-small text-foreground">{pending === "finish" ? c.confirmFinish : c.confirmRemove}</p>
              <button
                type="button"
                className={buttonVariants({ size: "sm" })}
                onClick={() => {
                  if (pending === "finish") onMove(ticket.id, "concluido", "status")
                  else onRemove(ticket.id)
                  setPending(null)
                }}
              >
                {c.confirm}
              </button>
              <button type="button" className={control} onClick={() => setPending(null)}>
                {c.cancel}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ticket.status !== "andamento" && ticket.status !== "concluido" ? (
                <button type="button" className={control} onClick={() => onMove(ticket.id, "andamento", "execucao")}>
                  <span aria-hidden="true">▶</span>
                  {ticket.status === "pausado" ? c.resume : c.assume}
                </button>
              ) : null}
              {ticket.status === "andamento" ? (
                <button type="button" className={control} onClick={() => onMove(ticket.id, "pausado", "execucao")}>
                  <span aria-hidden="true">❚❚</span>
                  {c.pause}
                </button>
              ) : null}
              {ticket.status !== "concluido" ? (
                <button type="button" className={control} onClick={() => setPending("finish")}>
                  <span aria-hidden="true">✓</span>
                  {c.finish}
                </button>
              ) : null}
              {user.isAdmin ? (
                <button type="button" className={cn(control, "text-danger hover:border-danger/60")} onClick={() => setPending("remove")}>
                  {c.remove}
                </button>
              ) : null}
            </div>
          )
        ) : (
          <p className="text-small text-muted-foreground">
            {fill(c.readOnly, {
              perfil: viewerLabel,
              setor: content.sectors[user.sector],
              destino: content.sectors[ticket.target],
            })}
          </p>
        )}
      </div>

      <div className="grid gap-6 px-5 py-5 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="grid content-start gap-6">
          <section className="grid gap-2">
            <h3 className="font-mono text-meta text-subtle">{c.brief}</h3>
            <p className="text-small whitespace-pre-line text-foreground">{ticket.description}</p>
          </section>

          <section className="grid gap-3">
            <h3 className="font-mono text-meta text-subtle">{c.history}</h3>
            {ticket.history.length ? (
              <ol className="grid gap-2.5 border-l border-line pl-4">
                {ticket.history.map((h, i) => (
                  <li key={i} className="grid gap-0.5 text-small">
                    <span className="font-semibold text-foreground">
                      {h.author}
                      <span className="ml-2 font-mono text-meta font-normal text-subtle">{formatDateTime(h.at, content.dateLocale)}</span>
                    </span>
                    <span className="text-muted-foreground">{h.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-small text-subtle">{c.noHistory}</p>
            )}
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!note.trim()) return
                onNote(ticket.id, note)
                setNote("")
              }}
            >
              <label className={labelClass}>
                <span className="sr-only">{c.noteLabel}</span>
                <textarea
                  name="nota"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder={c.notePlaceholder}
                  className={inputClass}
                />
              </label>
              <button type="submit" disabled={!note.trim()} className={`${control} justify-self-start disabled:opacity-50`}>
                {c.addNote}
              </button>
            </form>
          </section>
        </div>

        <dl className="grid content-start gap-4 text-small md:border-l md:border-line md:pl-5">
          <div className="grid gap-0.5">
            <dt className="font-mono text-meta text-subtle">{c.origin}</dt>
            <dd className="text-foreground">{ticket.requesterName}</dd>
            <dd className="text-muted-foreground">{content.sectors[ticket.requesterSector]}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-mono text-meta text-subtle">{c.destination}</dt>
            <dd>
              <SectorTag label={content.sectors[ticket.target]} />
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="font-mono text-meta text-subtle">{c.assignee}</dt>
            <dd className="text-foreground">{ticket.assigneeName ?? c.unassigned}</dd>
          </div>
          <div className="grid gap-1.5">
            <dt className="font-mono text-meta text-subtle">{c.sla}</dt>
            <dd className="text-foreground">{ticket.deadline ? formatDate(ticket.deadline, content.dateLocale) : c.noDeadline}</dd>
            <dd>
              <SlaBar pct={sla.pct} state={sla.state} large />
            </dd>
            <dd className="flex justify-between gap-2 font-mono text-meta">
              <span className={slaText[sla.state]}>{slaLabel(sla.state, content)}</span>
              <span className="text-muted-foreground">{sla.state === "none" ? "--" : `${Math.round(sla.pct)}%`}</span>
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="font-mono text-meta text-subtle">{c.timeSpent}</dt>
            <dd className="font-mono text-foreground">
              {formatMinutes(minutesWithClock(ticket, now))}
              {running ? <span aria-hidden="true" className="ml-2 inline-block size-1.5 rounded-full bg-ok align-middle" /> : null}
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="font-mono text-meta text-subtle">{c.status}</dt>
            <dd className="text-foreground">{content.statuses[ticket.status]}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
