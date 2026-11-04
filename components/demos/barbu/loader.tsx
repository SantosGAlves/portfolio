"use client"

import dynamic from "next/dynamic"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"

// O protótipo usa o relógio do visitante e fica todo em memória: roda só no navegador.
// O import dinâmico mantém o JavaScript dele fora das outras páginas.
const BarbuDemo = dynamic(() => import("./barbu-demo"), {
  ssr: false,
  loading: () => <DemoSkeleton />,
})

export function BarbuDemoLoader({ content }: { content: BarbuDemoContent }) {
  return <BarbuDemo content={content} />
}

function DemoSkeleton() {
  return (
    <div aria-hidden="true" className="grid justify-items-center gap-4">
      <div className="h-7 w-72 max-w-full rounded-full bg-surface-2" />
      <div className="-mx-4 h-[calc(100svh-var(--header-h)-var(--demo-banner-h))] w-[calc(100%+2rem)] bg-[#0A0A0A] sm:mx-0 sm:h-[min(52rem,calc(100svh-var(--header-h)-7rem))] sm:min-h-[40rem] sm:w-[24.5rem] sm:rounded-[3rem] sm:border-[10px] sm:border-[#1c1d21]" />
    </div>
  )
}
