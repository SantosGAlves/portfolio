"use client"

import { useEffect, useRef, useState } from "react"

// Demonstração pública aberta numa janela dentro do estudo de caso (iframe com câmera).
// O iframe só existe com a janela aberta: fechar destrói a página embutida e desliga a câmera.
// Classes dos botões vêm do servidor (buttonVariants), para o cn e o Radix não irem ao bundle do cliente.

export type LiveDemoText = {
  trigger: string
  eyebrow: string
  title: string
  intro?: string
  loading: string
  frameTitle: string
  close: string
  note?: string
  fallback: string
  external: string
  opensInNewTab: string
}

export function LiveDemo({
  embed,
  href,
  text,
  lang,
  triggerClassName,
  closeClassName,
}: {
  embed: string
  href: string
  text: LiveDemoText
  lang?: string
  triggerClassName: string
  closeClassName: string
}) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    if (!open) return
    // A página de trás não rola com a janela aberta.
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        lang={lang}
        aria-haspopup="dialog"
        onClick={() => {
          setLoaded(false)
          setOpen(true)
        }}
        className={triggerClassName}
      >
        {text.trigger}
      </button>

      <dialog
        ref={ref}
        lang={lang}
        aria-labelledby="live-demo-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) setOpen(false)
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-background p-0 text-foreground backdrop:bg-black/70 sm:m-auto sm:h-[calc(100dvh-3rem)] sm:w-[min(80rem,calc(100vw-3rem))] sm:rounded-card sm:border sm:border-line sm:shadow-card"
      >
        {open ? (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
            <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-2.5 sm:px-6 sm:py-4">
              <div className="grid gap-1">
                <p className="eyebrow">{text.eyebrow}</p>
                <h2 id="live-demo-title" className="text-h3">
                  {text.title}
                </h2>
                {/* No celular o texto vai para o rodapé, para sobrar altura para a câmera. */}
                {text.intro ? <p className="hidden max-w-[75ch] text-small text-muted-foreground sm:block">{text.intro}</p> : null}
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={text.close} className={closeClassName}>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </header>

            <div className="relative bg-surface">
              {!loaded ? (
                <p role="status" className="absolute inset-0 grid place-items-center font-mono text-meta text-subtle">
                  {text.loading}
                </p>
              ) : null}
              <iframe
                src={embed}
                title={text.frameTitle}
                allow="camera"
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 size-full border-0"
              />
            </div>

            <footer className="grid gap-1 border-t border-line px-4 py-2.5 text-[0.8125rem] sm:px-6 sm:py-3 sm:text-small">
              {text.intro ? <p className="text-muted-foreground sm:hidden">{text.intro}</p> : null}
              {text.note ? <p className="hidden text-subtle sm:block">{text.note}</p> : null}
              <p className="text-muted-foreground">
                {text.fallback}{" "}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {text.external}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">{text.opensInNewTab}</span>
                </a>
              </p>
            </footer>
          </div>
        ) : null}
      </dialog>
    </>
  )
}
