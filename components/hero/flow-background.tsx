"use client"

import { useEffect, useRef } from "react"
import { afterLoad } from "@/lib/after-load"

// O canvas entra vazio no HTML; o motor (lib/flow-field) só é baixado
// depois do load, em um chunk separado.
export function FlowBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    let stop: (() => void) | undefined
    let disposed = false
    const cancel = afterLoad(() => {
      import("@/lib/flow-field").then(({ startFlowField }) => {
        if (!disposed) stop = startFlowField(canvas, host)
      })
    })

    return () => {
      disposed = true
      cancel()
      stop?.()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="hero-bg pointer-events-none absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-1000 ease-out-soft data-ready:opacity-100"
    />
  )
}
