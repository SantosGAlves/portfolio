"use client"

import { ChevronLeft, Scissors, type LucideIcon } from "lucide-react"
import { useEffect, useRef, type ReactNode } from "react"

// Peças do app Barbú, nas cores de lib/core/theme/app_theme.dart:
// fundo #0A0A0A, cards #1A1A1A, barra #121212, vermelho #D32F2F.
// Texto vermelho usa #EF5350 (o #D32F2F não passa AA como texto sobre o fundo escuro).

export const c = {
  bg: "bg-[#0A0A0A]",
  card: "bg-[#1A1A1A]",
  nav: "bg-[#121212]",
  red: "bg-[#D32F2F]",
  redText: "text-[#EF5350]",
  muted: "text-[#8A8A8A]",
  soft: "text-[#B3B3B3]",
  line: "border-white/[0.06]",
}

/** Foco visível dentro do app (o vermelho do app, com folga para não sumir no botão vermelho). */
export const focus = "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#EF5350]"

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const icon = { sm: "size-9", md: "size-16", lg: "size-20" }[size]
  const text = { sm: "text-lg tracking-[0.45em]", md: "text-[1.75rem] tracking-[0.4em]", lg: "text-2xl tracking-[0.35em]" }[size]
  return (
    <div className="grid justify-items-center gap-2">
      <Scissors aria-hidden="true" className={`${icon} text-[#D32F2F]`} strokeWidth={1.75} />
      <p className={`pl-[0.4em] font-black text-white ${text}`}>BARBÚ</p>
    </div>
  )
}

export function AppBar({ title, back, onBack }: { title?: string; back?: string; onBack?: () => void }) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-1 px-2">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label={back} className={`grid size-11 place-items-center rounded-full text-[#EF5350] ${focus}`}>
          <ChevronLeft aria-hidden="true" className="size-6" />
        </button>
      ) : null}
      {title ? <h3 className="text-lg font-bold text-white">{title}</h3> : null}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-14 w-full rounded-[15px] text-[0.9375rem] font-bold tracking-wide transition-[transform,background-color] active:scale-[0.98] disabled:active:scale-100 ${
        disabled ? "bg-white/10 text-white/30" : "bg-[#D32F2F] text-white shadow-[0_8px_15px_rgb(211_47_47/0.3)]"
      } ${focus} ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  icon: Icon,
  name,
  type = "text",
  autoComplete,
  inputMode,
  defaultValue,
}: {
  label: string
  icon: LucideIcon
  name: string
  type?: string
  autoComplete?: string
  inputMode?: "email" | "tel" | "text"
  defaultValue?: string
}) {
  return (
    <label className={`flex items-center gap-3 rounded-[15px] border ${c.line} ${c.card} px-4 focus-within:border-[#D32F2F]`}>
      <Icon aria-hidden="true" className="size-5 shrink-0 text-[#EF5350]" />
      <span className="grid flex-1 py-2">
        <span className={`text-xs ${c.muted}`}>{label}</span>
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          defaultValue={defaultValue}
          className="w-full bg-transparent text-[0.9375rem] text-white outline-none"
        />
      </span>
    </label>
  )
}

/** Aviso do app (SnackBar). A região fica sempre no DOM para leitores de tela. */
export function Snackbar({ text, raised }: { text: string | null; raised: boolean }) {
  return (
    <div role="status" aria-live="polite" className={`pointer-events-none absolute inset-x-3 z-40 ${raised ? "bottom-[5.5rem]" : "bottom-4"}`}>
      {text ? <p className="rounded-lg bg-[#323232] px-4 py-3 text-sm text-white shadow-lg">{text}</p> : null}
    </div>
  )
}

/**
 * Diálogo dentro do celular (AlertDialog do app). O resto da tela fica `inert` enquanto ele está aberto
 * (quem chama cuida disso); Esc e o fundo fecham, e o foco vai para o primeiro campo ou botão.
 */
export function AppDialog({ labelledBy, onClose, children }: { labelledBy: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = ref.current
    const opener = document.activeElement as HTMLElement | null
    box?.querySelector<HTMLElement>("input, button")?.focus()
    return () => opener?.focus()
  }, [])
  return (
    <div
      className="absolute inset-0 z-30 grid place-items-center bg-black/65 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose()
        }}
        className={`grid w-full gap-4 rounded-[20px] ${c.card} p-6`}
      >
        {children}
      </div>
    </div>
  )
}

export function TextButton({ children, onClick, className = "" }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-11 rounded-md px-2 text-sm font-semibold ${focus} ${className}`}>
      {children}
    </button>
  )
}
