"use client"

import { useEffect, useRef, useState } from "react"

type Props = { value: string; label: string; copiedLabel: string; className: string }

// Copia um texto (o e-mail) e confirma numa região aria-live.
// className vem do servidor (buttonVariants), para o cn não ir ao bundle do cliente.
export function CopyButton({ value, label, copiedLabel, className }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={copy}>
        {copied ? copiedLabel : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </>
  )
}
