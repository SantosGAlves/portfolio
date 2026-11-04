"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

// Faixa de tecnologias rolando devagar (animação só de CSS, `animate-marquee`). Pausa ao passar o mouse
// (só em telas com hover), ao tocar na faixa e no botão abaixo dela (WCAG 2.2.2). Com prefers-reduced-motion
// vira uma grade parada e o botão some. A faixa é decorativa para leitores de tela (aria-hidden): a lista por
// categoria, logo abaixo, tem as mesmas tecnologias.
export function StackMarquee({
  children,
  duration,
  pause,
  play,
}: {
  children: ReactNode
  /** Segundos para uma volta completa. */
  duration: number
  pause: string
  play: string
}) {
  const [paused, setPaused] = useState(false)
  const toggle = () => setPaused((p) => !p)

  return (
    <div className="grid gap-2">
      <div
        aria-hidden="true"
        data-paused={paused ? "" : undefined}
        onClick={toggle}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        className="group/marquee -mx-4 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] sm:mx-0 motion-reduce:mx-0 motion-reduce:[mask-image:none]"
      >
        <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] group-data-paused/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          <div className="flex shrink-0 gap-3 pr-3 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:gap-2 motion-reduce:pr-0">
            {children}
          </div>
          <div className="flex shrink-0 gap-3 pr-3 motion-reduce:hidden">{children}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex min-h-10 items-center gap-2 justify-self-end rounded-sm px-1 font-mono text-meta text-muted-foreground transition-colors hover:text-foreground motion-reduce:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
          {paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />}
        </svg>
        {paused ? play : pause}
      </button>
    </div>
  )
}
