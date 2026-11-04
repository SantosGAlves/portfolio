"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

// Versão pública de um projeto dentro de uma moldura de navegador, na seção "Experimente".
// Antes do clique só existe a prévia (imagem parada da interface): nenhuma requisição ao site embutido.
// O iframe só existe enquanto a demo está ligada: "Encerrar", sair da página (pagehide) ou desmontar
// removem o iframe, e com ele a câmera.
// Classes dos botões vêm do servidor (buttonVariants), para o cn e o Radix não irem ao bundle do cliente.

export type LiveFrameText = {
  start: string
  /** Dica sob o botão (o site embutido ainda pede um clique para ligar a câmera). */
  hint?: string
  privacy: string
  stop: string
  open: string
  opensInNewTab: string
  loading: string
  frameTitle: string
}

export function LiveFrame({
  embed,
  href,
  host,
  text,
  preview,
  startClassName,
  stopClassName,
  cropClassName = "inset-y-0 h-full",
}: {
  embed: string
  href: string
  host: string
  text: LiveFrameText
  preview: ReactNode
  startClassName: string
  stopClassName: string
  /**
   * Posição e altura do iframe: para esconder o cabeçalho fixo do site embutido, o iframe sobe pela altura
   * dele e cresce na mesma medida (a caixa tem overflow hidden).
   */
  cropClassName?: string
}) {
  const [on, setOn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)
  // Para onde o foco vai depois de ligar ou desligar (não mexe no foco no primeiro render).
  const focusNext = useRef<"frame" | "start" | null>(null)

  useEffect(() => {
    const off = () => setOn(false)
    window.addEventListener("pagehide", off)
    return () => window.removeEventListener("pagehide", off)
  }, [])

  useEffect(() => {
    if (focusNext.current === "frame") frameRef.current?.focus()
    if (focusNext.current === "start") startRef.current?.focus()
    focusNext.current = null
  }, [on])

  const start = () => {
    setLoaded(false)
    focusNext.current = "frame"
    setOn(true)
  }
  const stop = () => {
    focusNext.current = "start"
    setOn(false)
  }

  return (
    <div className="grid gap-4">
      <div className="-mx-4 overflow-hidden border-y border-line bg-surface sm:mx-0 sm:rounded-card sm:border-x sm:shadow-card">
        {/* Barra da janela: só o endereço; os botões ficam abaixo da moldura (cabem no celular). */}
        <div className="flex h-11 items-center gap-3 border-b border-line bg-surface-2 px-3 sm:px-4">
          <span aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          <p className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-background px-3 py-1 font-mono text-meta text-muted-foreground">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            <span className="truncate">{host}</span>
          </p>
          <span aria-hidden="true" className="w-[2.625rem] shrink-0" />
        </div>

        {/* No celular: a tela sob o header (menos --demo-reserve), para caber a câmera e a letra reconhecida. */}
        {/* @container: o corte do cabeçalho do site embutido depende da largura do iframe, não da tela. */}
        <div className="@container relative h-[max(30rem,calc(100svh-var(--header-h)-var(--demo-reserve)-2.75rem))] overflow-hidden bg-bg-deep sm:h-[min(44rem,calc(100svh-var(--header-h)-6rem))] sm:min-h-[34rem]">
          {on ? (
            <>
              {!loaded ? (
                <p role="status" className="absolute inset-0 grid place-items-center font-mono text-meta text-subtle">
                  {text.loading}
                </p>
              ) : null}
              <iframe
                ref={frameRef}
                src={embed}
                title={text.frameTitle}
                allow="camera; fullscreen"
                onLoad={() => setLoaded(true)}
                className={`absolute inset-x-0 w-full border-0 ${cropClassName}`}
              />
            </>
          ) : (
            <div className="absolute inset-0 grid content-center justify-items-center gap-5 overflow-y-auto p-4 sm:p-8">
              <div className="w-full max-w-[34rem]">{preview}</div>
              <button ref={startRef} type="button" onClick={start} className={startClassName}>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                  <rect x="1.5" y="4" width="9" height="8" rx="1.5" />
                  <path d="M10.5 7.2 14.5 5v6l-4-2.2" />
                </svg>
                {text.start}
              </button>
              {text.hint ? <p className="-mt-2 text-center text-small font-semibold text-foreground">{text.hint}</p> : null}
              <p className="max-w-[36ch] text-center text-small text-muted-foreground">{text.privacy}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {on ? (
          <button type="button" onClick={stop} className={stopClassName}>
            {text.stop}
          </button>
        ) : null}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold text-foreground hover:underline hover:underline-offset-4"
        >
          {text.open}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">{text.opensInNewTab}</span>
        </a>
      </div>
    </div>
  )
}
