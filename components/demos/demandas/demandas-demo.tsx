"use client"

import { buttonVariants } from "@/components/ui/button"
import { useEffect, useMemo, useReducer, useState, type DragEvent } from "react"
import { statuses, type DemandasDemoContent, type Status } from "@/content/demos/demandas-types"
import { AutomationsDrawer } from "./automations"
import { NewTicketDialog, UsersDialog } from "./forms"
import {
  canEdit,
  computeSla,
  createSeed,
  currentUser,
  eventForMove,
  fill,
  formatDate,
  idleTickets,
  toDateInput,
  loadState,
  reducer,
  saveState,
  toCsv,
  visibleTickets,
  type Action,
  type MoveVia,
  type Ticket,
  type User,
  type View,
  type Viewer,
} from "./logic"
import { PriorityTag, SectorTag, SlaBar, slaLabel } from "./parts"
import { TicketDialog } from "./ticket-dialog"

// Demo da plataforma de demandas. Carregada só no navegador (ver loader.tsx):
// o estado começa do localStorage ou dos dados de exemplo.

function initState(content: DemandasDemoContent) {
  return loadState(content) ?? createSeed(content, Date.now())
}

/** Hora atual. Fora do componente para o lint saber que só roda em eventos e efeitos. */
function readNow() {
  return Date.now()
}

type Toast = { id: number; text: string; showEvents?: boolean }

const columnDot: Record<Status, string> = {
  entrada: "bg-subtle",
  andamento: "bg-foreground",
  pausado: "bg-warn",
  concluido: "bg-ok",
}

export default function DemandasDemo({ content }: { content: DemandasDemoContent }) {
  const [state, dispatch] = useReducer(reducer, content, initState)
  const [now, setNow] = useState(readNow)
  const [view, setView] = useState<View>("board")
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<"new" | "users" | "n8n" | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<Status | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const user = currentUser(state)
  const c = content

  // O SLA e o cronômetro andam sozinhos.
  useEffect(() => {
    const id = window.setInterval(() => setNow(readNow()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => saveState(content, state), [content, state])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(id)
  }, [toast])

  const tickets = useMemo(
    () =>
      visibleTickets(state, view, query, (t) =>
        [t.code, t.title, t.requesterName, c.sectors[t.target], c.sectors[t.requesterSector]].join(" ")
      ),
    [state, view, query, c.sectors]
  )

  function notify(text: string, showEvents = false) {
    setToast({ id: readNow(), text, showEvents })
  }

  /** Executa a ação com a hora atual e avisa se ela gerou um evento para o n8n. */
  function act(action: Action, event: string | null = null) {
    dispatch(action)
    setNow(readNow())
    if (event) notify(fill(c.toasts.sent, { evento: event }), true)
  }

  function move(ticket: Ticket, status: Status, via: MoveVia) {
    if (ticket.status === status) return
    if (!canEdit(user, ticket)) {
      notify(c.ticket.forbidden)
      return
    }
    act({ type: "move", now: readNow(), id: ticket.id, status, via }, eventForMove(ticket, status, via))
  }

  function onDrop(e: DragEvent, status: Status) {
    e.preventDefault()
    setOverColumn(null)
    const id = e.dataTransfer.getData("text/plain") || dragId
    const ticket = state.tickets.find((t) => t.id === id)
    if (ticket) move(ticket, status, "status")
    setDragId(null)
  }

  function exportCsv() {
    const blob = new Blob(["﻿" + toCsv(tickets, c)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = c.csv.filename
    link.click()
    URL.revokeObjectURL(url)
    notify(fill(c.toasts.exported, { n: tickets.length }))
  }

  function setViewer(viewer: Viewer) {
    dispatch({ type: "setViewer", viewer })
    if (viewer === "collaborator" && dialog === "users") setDialog(null)
  }

  const viewerLabel = state.viewer === "admin" ? c.viewer.admin : c.viewer.collaborator
  const openTicket = openId ? (state.tickets.find((t) => t.id === openId) ?? null) : null
  const toolbarButton = buttonVariants({ variant: "outline", size: "sm" })

  return (
    <div className="grid gap-4">
      {/* No celular o quadro vai de ponta a ponta da tela; a partir de 640px, card com borda. */}
      <div className="-mx-4 overflow-hidden border-y border-line bg-surface sm:mx-0 sm:rounded-card sm:border-x">
        {/* Barra do app: marca neutra e o seletor de perfil */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3 sm:px-5">
          <p className="flex items-center gap-2.5 font-semibold text-foreground">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-md border border-line-strong bg-surface-2 font-mono text-[0.6875rem] text-foreground">
              {c.brand
                .split(" ")
                .filter((w) => w.length > 2)
                .map((w) => w[0])
                .join("")}
            </span>
            {c.brand}
          </p>
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">{c.viewer.label}</legend>
            <span aria-hidden="true" className="font-mono text-meta text-subtle">
              {c.viewer.label}
            </span>
            <div className="flex rounded-control border border-line-strong p-0.5">
              {(["admin", "collaborator"] as const).map((v) => {
                const profile = state.users.find((u) => u.id === state.viewerIds[v])
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={state.viewer === v}
                    onClick={() => setViewer(v)}
                    className={`rounded-[calc(var(--radius)-2px)] px-2.5 py-1 text-[0.8125rem] transition-colors ${
                      state.viewer === v ? "bg-surface-2 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v === "admin" ? c.viewer.admin : c.viewer.collaborator}
                    <span className="text-subtle">
                      {" "}
                      · {profile?.name} ({profile ? c.sectors[profile.sector] : ""})
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        {/* Regra do perfil atual */}
        <p className="flex items-start gap-3 border-b border-line bg-surface-2/50 px-4 py-2.5 text-small text-muted-foreground sm:px-5">
          <span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-[0.6875rem] text-muted-foreground">
            {user.name[0]}
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {user.name} · {c.sectors[user.sector]}
            </span>{" "}
            {state.viewer === "admin" ? c.viewer.ruleAdmin : c.viewer.ruleCollaborator}
          </span>
        </p>

        {/* Ferramentas */}
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div role="group" aria-label={c.views.label} className="flex rounded-control border border-line-strong p-0.5">
            {(["board", "mine"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`rounded-[calc(var(--radius)-2px)] px-2.5 py-1 text-[0.8125rem] transition-colors ${
                  view === v ? "bg-surface-2 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.views[v]}
              </button>
            ))}
          </div>
          <label className="min-w-0 flex-1 basis-44">
            <span className="sr-only">{c.toolbar.search}</span>
            <input
              type="search"
              name="busca"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${c.toolbar.search}…`}
              className="h-9 w-full rounded-control border border-input bg-background px-3 text-small text-foreground placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} className={toolbarButton}>
              {c.toolbar.export}
            </button>
            {user.isAdmin ? (
              <button type="button" onClick={() => setDialog("users")} className={toolbarButton}>
                {c.toolbar.users}
              </button>
            ) : null}
            <button type="button" onClick={() => setDialog("n8n")} className={toolbarButton}>
              {c.toolbar.automations}
              {state.events.length ? (
                <span className="rounded-full bg-surface-2 px-1.5 font-mono text-[0.6875rem] text-foreground">{state.events.length}</span>
              ) : null}
            </button>
            <button type="button" onClick={() => setDialog("new")} className={buttonVariants({ size: "sm" })}>
              <span aria-hidden="true">+</span>
              {c.toolbar.newTicket}
            </button>
          </div>
        </div>

        {/* Quadro */}
        <div role="region" aria-label={c.board.label} className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          {statuses.map((status) => {
            const items = tickets.filter((t) => t.status === status)
            const headingId = `demo-col-${status}`
            return (
              <section
                key={status}
                aria-labelledby={headingId}
                onDragOver={(e) => {
                  if (!dragId) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  if (overColumn !== status) setOverColumn(status)
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOverColumn(null)
                }}
                onDrop={(e) => onDrop(e, status)}
                className={`grid min-h-44 content-start gap-3 rounded-xl border p-3 transition-colors ${
                  overColumn === status ? "border-brand-line bg-brand-soft" : "border-line bg-surface-2/50"
                }`}
              >
                <h3 id={headingId} className="flex items-center justify-between gap-2 px-1">
                  <span className="flex items-center gap-2 font-mono text-meta tracking-[0.08em] text-foreground uppercase">
                    <span aria-hidden="true" className={`size-2 rounded-full ${columnDot[status]}`} />
                    {c.statuses[status]}
                  </span>
                  <span className="rounded-full border border-line-strong px-2 font-mono text-meta text-muted-foreground">
                    <span aria-hidden="true">{items.length}</span>
                    <span className="sr-only">{fill(c.board.count, { n: items.length })}</span>
                  </span>
                </h3>
                {items.length ? (
                  <ol className="grid gap-3">
                    {items.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        user={user}
                        now={now}
                        content={c}
                        dragging={dragId === ticket.id}
                        onOpen={() => setOpenId(ticket.id)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", ticket.id)
                          e.dataTransfer.effectAllowed = "move"
                          setDragId(ticket.id)
                        }}
                        onDragEnd={() => {
                          setDragId(null)
                          setOverColumn(null)
                        }}
                      />
                    ))}
                  </ol>
                ) : (
                  <p className="px-1 text-small text-subtle">{view === "mine" && !query && tickets.length === 0 ? c.board.emptyMine : c.board.empty}</p>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-subtle">{c.toolbar.hint}</p>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm(c.toolbar.resetConfirm)) return
            dispatch({ type: "reset", state: createSeed(content, readNow()) })
            setView("board")
            setQuery("")
            notify(c.toasts.reset)
          }}
          className="rounded-sm py-0.5 text-small text-muted-foreground underline decoration-line-strong underline-offset-4 hover:text-foreground"
        >
          {c.toolbar.reset}
        </button>
      </div>

      <TicketDialog
        ticket={openTicket}
        user={user}
        viewerLabel={viewerLabel}
        now={now}
        content={c}
        onClose={() => setOpenId(null)}
        onMove={(id, status, via) => {
          const ticket = state.tickets.find((t) => t.id === id)
          if (ticket) move(ticket, status, via)
        }}
        onRemove={(id) => {
          act({ type: "remove", id })
          setOpenId(null)
        }}
        onNote={(id, text) => {
          act({ type: "note", now: readNow(), id, text })
          notify(c.toasts.noteAdded)
        }}
      />

      <NewTicketDialog
        open={dialog === "new"}
        user={user}
        now={now}
        content={c}
        onClose={() => setDialog(null)}
        onCreate={(draft) => {
          act({ type: "create", now: readNow(), draft }, "novo_ticket")
          setDialog(null)
          // Colaborador abrindo para outro setor: o card some do Kanban dele (regra real).
          if (!user.isAdmin && draft.target !== user.sector) {
            notify(fill(c.toasts.createdOther, { setor: c.sectors[draft.target], meuSetor: c.sectors[user.sector] }), true)
          }
        }}
      />

      <UsersDialog
        open={dialog === "users"}
        state={state}
        content={c}
        onClose={() => setDialog(null)}
        onAdd={(newUser) => {
          dispatch({ type: "addUser", user: newUser })
          // Senha temporária no formato do sistema real (8 caracteres + "@"); só exibida, nada é enviado.
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
          return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + "@"
        }}
        onToggleAdmin={(id) => dispatch({ type: "toggleAdmin", id })}
        onRemove={(id) => dispatch({ type: "removeUser", id })}
      />

      <AutomationsDrawer
        open={dialog === "n8n"}
        events={state.events}
        content={c}
        onClose={() => setDialog(null)}
        onRunCheck={() => {
          const at = readNow()
          const idle = idleTickets(state, at)
          if (!idle.length) {
            notify(c.automations.checkNone)
            return
          }
          act({ type: "inactivityCheck", now: at }, "alerta_inatividade")
        }}
      />

      {/* Avisos: região sempre presente para leitores de tela */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-end sm:left-auto">
        {toast ? (
          <div
            key={toast.id}
            className="pointer-events-auto flex max-w-sm items-center gap-4 rounded-control border border-line-strong bg-surface-2 px-4 py-3 text-small text-foreground shadow-card"
          >
            <span>{toast.text}</span>
            {toast.showEvents && dialog !== "n8n" ? (
              <button
                type="button"
                onClick={() => {
                  setToast(null)
                  setOpenId(null)
                  setDialog("n8n")
                }}
                className="shrink-0 font-semibold text-brand hover:underline hover:underline-offset-4"
              >
                {c.toasts.view}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TicketCard({
  ticket,
  user,
  now,
  content,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  ticket: Ticket
  user: User
  now: number
  content: DemandasDemoContent
  dragging: boolean
  onOpen: () => void
  onDragStart: (e: DragEvent) => void
  onDragEnd: () => void
}) {
  const editable = canEdit(user, ticket)
  const sla = computeSla(ticket, now)

  return (
    <li
      draggable={editable}
      onDragStart={editable ? onDragStart : undefined}
      onDragEnd={onDragEnd}
      // O card todo abre o detalhe no clique; o botão do título é o caminho pelo teclado.
      onClick={onOpen}
      className={`grid cursor-pointer gap-2.5 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-line-strong has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-brand ${
        dragging ? "opacity-40" : ""
      } ${editable ? "active:cursor-grabbing" : ""}`}
    >
      <h4 className="text-small leading-snug font-semibold text-foreground">
        <span className="mr-1.5 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">#{ticket.code}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen()
          }}
          aria-label={`${fill(content.card.open, { codigo: ticket.code })}: ${ticket.title}`}
          className="text-left outline-none"
        >
          {ticket.title}
        </button>
      </h4>
      <p className="flex flex-wrap gap-1.5">
        <PriorityTag priority={ticket.priority} label={content.priorities[ticket.priority]} />
        <SectorTag label={content.sectors[ticket.target]} />
      </p>
      <p className="grid gap-0.5 text-[0.8125rem] text-muted-foreground">
        <span>
          {content.card.origin}: {content.sectors[ticket.requesterSector]}
        </span>
        <span>
          {content.card.from}: {ticket.requesterName}
        </span>
      </p>
      <div className="grid gap-1.5">
        <SlaBar pct={sla.pct} state={sla.state} />
        <p className="flex items-center justify-between gap-2 font-mono text-[0.6875rem] text-subtle">
          <span>
            <span className="sr-only">{slaLabel(sla.state, content)} · </span>
            {formatDate(toDateInput(ticket.createdAt), content.dateLocale)}
          </span>
          {!editable ? <span>{content.card.readOnly}</span> : null}
        </p>
      </div>
    </li>
  )
}
