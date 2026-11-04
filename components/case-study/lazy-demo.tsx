"use client"

import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react"
import type { DemoContentMap, DemoSlug } from "@/lib/demos"

// Carrega o código da demo só quando a seção chega perto da tela (import dinâmico). Até lá fica o
// esqueleto que veio do servidor, na mesma altura. Cada demo é um chunk próprio e nunca é renderizada no
// servidor (usa o relógio e a memória do navegador).
//
// Gatilhos, do principal ao plano B:
// 1. IntersectionObserver (dispara com rolagem por toque, roda do mouse ou teclado; não depende de hover);
// 2. conferência da posição a cada scroll, touchend e resize, caso o observador não dispare
//    (alguns navegadores embutidos em apps);
// 3. sem IntersectionObserver, carrega na hora;
// 4. botão "Carregar a demo" sobre o esqueleto, e "Tentar de novo" se o download falhar.
const loaders: { [S in DemoSlug]: () => Promise<{ default: ComponentType<{ content: DemoContentMap[S] }> }> } = {
  demandas: () => import("@/components/demos/demandas/demandas-demo"),
  barbu: () => import("@/components/demos/barbu/barbu-demo"),
  "ajuda-animal": () => import("@/components/demos/ajuda-animal/ajuda-animal-demo"),
  carregadores: () => import("@/components/demos/carregadores/carregadores-demo"),
}

export type LazyDemoText = { load: string; loading: string; error: string; retry: string }

// O conteúdo vem de getDemoContent(slug) no servidor, então slug e conteúdo sempre combinam.
type Props = {
  slug: DemoSlug
  content: DemoContentMap[DemoSlug]
  fallback: ReactNode
  text: LazyDemoText
  buttonClassName: string
}

const MARGIN = 300 // px: começa a baixar um pouco antes de a seção entrar na tela

export function LazyDemo({ slug, content, fallback, text, buttonClassName }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const [state, setState] = useState<"idle" | "loading" | "error">("idle")
  const [Demo, setDemo] = useState<ComponentType<{ content: typeof content }> | null>(null)

  const load = useCallback(() => {
    if (started.current) return
    started.current = true
    setState("loading")
    loaders[slug]()
      .then((mod) => setDemo(() => mod.default as ComponentType<{ content: typeof content }>))
      .catch(() => {
        started.current = false
        setState("error")
      })
  }, [slug])

  useEffect(() => {
    const el = ref.current
    if (!el || Demo) return
    if (typeof IntersectionObserver === "undefined") {
      load()
      return
    }
    const near = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight + MARGIN && r.bottom > -MARGIN
    }
    const check = () => {
      if (near()) load()
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) load()
    }, { rootMargin: `${MARGIN}px 0px` })
    observer.observe(el)
    const opts = { passive: true } as const
    window.addEventListener("scroll", check, opts)
    window.addEventListener("touchend", check, opts)
    window.addEventListener("resize", check, opts)
    check()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", check)
      window.removeEventListener("touchend", check)
      window.removeEventListener("resize", check)
    }
  }, [Demo, load])

  if (Demo) return <Demo content={content} />

  return (
    <div ref={ref} className="relative">
      {fallback}
      <div className="absolute inset-0 grid place-items-center p-4">
        {state === "loading" ? (
          <p role="status" className="rounded-full bg-background/90 px-3 py-1 font-mono text-meta text-muted-foreground">
            {text.loading}
          </p>
        ) : (
          <div className="grid justify-items-center gap-3 text-center">
            {state === "error" ? (
              <p role="alert" className="rounded-full bg-background/90 px-3 py-1 text-small text-foreground">
                {text.error}
              </p>
            ) : null}
            <button type="button" onClick={load} className={`${buttonClassName} bg-background`}>
              {state === "error" ? text.retry : text.load}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
