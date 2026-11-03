"use client"

import { useEffect, useRef } from "react"

// Régua de progresso de rolagem, fixa à direita, só em telas a partir de 1280px.
// Cada seção com [data-rail] vira uma marca; a marca acende quando a seção é alcançada.
export function ScrollRail() {
  const barRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const fill = fillRef.current
    const pct = pctRef.current
    if (!bar || !fill || !pct) return
    const wide = window.matchMedia("(min-width: 80rem)")
    let ticks: { el: HTMLSpanElement; at: number }[] = []
    let frame = 0

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    function update() {
      frame = 0
      const max = maxScroll()
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      fill!.style.setProperty("--p", p.toFixed(4))
      pct!.textContent = `${Math.round(p * 100)}%`
      for (const t of ticks) t.el.toggleAttribute("data-on", p + 0.001 >= t.at)
    }
    function layout() {
      if (!wide.matches) return
      const max = maxScroll()
      for (const t of ticks) t.el.remove()
      ticks = Array.from(document.querySelectorAll<HTMLElement>("[data-rail]")).map((section) => {
        const at = max > 0 ? Math.min(1, Math.max(0, (section.getBoundingClientRect().top + window.scrollY) / max)) : 0
        const el = document.createElement("span")
        el.className =
          "absolute -left-[3px] h-0.5 w-2 rounded-full bg-muted-foreground transition-[left,width,background-color] duration-200 data-on:-left-1.5 data-on:w-3.5 data-on:bg-foreground"
        el.style.top = `calc(${(at * 100).toFixed(3)}% - 1px)`
        bar!.append(el)
        return { el, at }
      })
      update()
    }
    const onScroll = () => {
      if (!frame && wide.matches) frame = requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(document.body)
    window.addEventListener("scroll", onScroll, { passive: true })
    wide.addEventListener("change", layout)
    layout()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", onScroll)
      wide.removeEventListener("change", layout)
      for (const t of ticks) t.el.remove()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 right-[max(1.25rem,env(safe-area-inset-right,0px))] z-40 hidden h-[44vh] w-[34px] -translate-y-1/2 flex-col items-center gap-3 xl:flex"
    >
      <span ref={pctRef} className="min-h-[1em] font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
        0%
      </span>
      <div ref={barRef} className="relative w-0.5 flex-1 rounded-full bg-line-strong">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top scale-y-(--p) rounded-full bg-brand"
          style={{ "--p": 0 } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
