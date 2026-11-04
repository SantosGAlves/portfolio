"use client"

import dynamic from "next/dynamic"
import type { AjudaAnimalDemoContent } from "@/content/demos/ajuda-animal-types"

// O simulador guarda tudo em memória e usa o relógio do visitante: roda só no navegador.
// O import dinâmico mantém o JavaScript dele fora das outras páginas.
const AjudaAnimalDemo = dynamic(() => import("./ajuda-animal-demo"), {
  ssr: false,
  loading: () => <DemoSkeleton />,
})

export function AjudaAnimalDemoLoader({ content }: { content: AjudaAnimalDemoContent }) {
  return <AjudaAnimalDemo content={content} />
}

function DemoSkeleton() {
  return (
    <div aria-hidden="true" className="grid justify-items-center gap-4 lg:justify-items-start">
      <div className="h-7 w-72 max-w-full rounded-full bg-surface-2" />
      <div className="-mx-4 h-[calc(100svh-var(--header-h)-var(--demo-banner-h))] w-[calc(100%+2rem)] bg-[#0e1013] sm:mx-0 sm:h-[min(52rem,calc(100svh-var(--header-h)-8rem))] sm:min-h-[38rem] sm:w-[24.5rem] sm:rounded-[3rem] sm:border-[10px] sm:border-[#1c1d21]" />
    </div>
  )
}
