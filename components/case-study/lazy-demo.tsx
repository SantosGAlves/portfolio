"use client"

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react"
import type { DemoContentMap, DemoSlug } from "@/lib/demos"

// Carrega o código da demo só quando a seção chega perto da tela (IntersectionObserver + import dinâmico).
// Até lá fica o esqueleto que veio do servidor, na mesma altura. Cada demo é um chunk próprio.
// A demo usa o relógio e a memória do navegador, então nunca é renderizada no servidor.
const loaders: { [S in DemoSlug]: () => Promise<{ default: ComponentType<{ content: DemoContentMap[S] }> }> } = {
  demandas: () => import("@/components/demos/demandas/demandas-demo"),
  barbu: () => import("@/components/demos/barbu/barbu-demo"),
  "ajuda-animal": () => import("@/components/demos/ajuda-animal/ajuda-animal-demo"),
}

type Props = { [S in DemoSlug]: { slug: S; content: DemoContentMap[S]; fallback: ReactNode } }[DemoSlug]

export function LazyDemo({ slug, content, fallback }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [Demo, setDemo] = useState<ComponentType<{ content: typeof content }> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let active = true
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        void loaders[slug]().then((mod) => {
          if (active) setDemo(() => mod.default as ComponentType<{ content: typeof content }>)
        })
      },
      // Começa a baixar um pouco antes de a seção entrar na tela.
      { rootMargin: "300px 0px" },
    )
    observer.observe(el)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [slug])

  return <div ref={ref}>{Demo ? <Demo content={content} /> : fallback}</div>
}
