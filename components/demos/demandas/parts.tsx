"use client"

import { useEffect, useRef, type ReactNode } from "react"
import type { DemandasDemoContent, Priority } from "@/content/demos/demandas-types"
import type { SlaState } from "./logic"

// Peças pequenas da demo: janela (<dialog> nativo), barra de SLA e etiquetas.

/**
 * Janela modal com o <dialog> nativo: foco preso, Esc fecha e o foco volta
 * para quem abriu. `side` vira uma gaveta presa à direita.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  side = false,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  side?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // Clique no fundo escurecido (fora da caixa) fecha.
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`border border-line bg-surface p-0 text-foreground shadow-card backdrop:bg-black/60 ${
        side
          ? "m-0 ml-auto h-dvh max-h-none w-[min(34rem,100vw)] max-w-none border-y-0 border-r-0"
          : "m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100vw-2rem))] max-w-none rounded-card"
      }`}
    >
      {open ? children : null}
    </dialog>
  )
}

const slaColor: Record<SlaState, string> = {
  ok: "bg-ok",
  warning: "bg-warn",
  critical: "bg-danger",
  late: "bg-danger",
  done: "bg-ok",
  none: "bg-line-strong",
}

export const slaText: Record<SlaState, string> = {
  ok: "text-muted-foreground",
  warning: "text-warn",
  critical: "text-danger",
  late: "text-danger",
  done: "text-ok",
  none: "text-subtle",
}

export function slaLabel(state: SlaState, content: DemandasDemoContent): string {
  const map: Record<SlaState, string> = {
    ok: content.sla.onTrack,
    warning: content.sla.warning,
    critical: content.sla.critical,
    late: content.sla.late,
    done: content.sla.done,
    none: content.sla.none,
  }
  return map[state]
}

/** Barra de SLA (decorativa: o texto ao lado ou o rótulo sr-only diz o estado). */
export function SlaBar({ pct, state, large = false }: { pct: number; state: SlaState; large?: boolean }) {
  return (
    <span aria-hidden="true" className={`block overflow-hidden rounded-full bg-surface-2 ${large ? "h-2" : "h-1.5"}`}>
      <span className={`block h-full rounded-full ${slaColor[state]}`} style={{ width: `${Math.round(pct)}%` }} />
    </span>
  )
}

const priorityStyle: Record<Priority, string> = {
  alta: "border-danger/45 text-danger",
  media: "border-warn/45 text-warn",
  baixa: "border-line-strong text-muted-foreground",
}

export function PriorityTag({ priority, label }: { priority: Priority; label: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] uppercase ${priorityStyle[priority]}`}>
      {label}
    </span>
  )
}

export function SectorTag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
      <span aria-hidden="true">→ </span>
      {label}
    </span>
  )
}

/** Ícone de fechar (×) para os botões só com ícone. */
export function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

export const inputClass =
  "w-full rounded-control border border-input bg-background px-3 py-2 text-small text-foreground placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
export const labelClass = "grid gap-1.5 text-small font-medium text-foreground"
