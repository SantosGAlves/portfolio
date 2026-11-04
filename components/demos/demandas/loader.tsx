"use client"

import dynamic from "next/dynamic"
import type { DemandasDemoContent } from "@/content/demos/demandas-types"

// A demo depende do relógio e do localStorage do visitante: roda só no navegador.
// O import dinâmico mantém o JavaScript dela fora das outras páginas.
const DemandasDemo = dynamic(() => import("./demandas-demo"), {
  ssr: false,
  loading: () => <DemoSkeleton />,
})

export function DemandasDemoLoader({ content }: { content: DemandasDemoContent }) {
  return <DemandasDemo content={content} />
}

function DemoSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="h-[8.5rem] border-b border-line bg-surface-2/40" />
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl border border-line bg-surface-2/50 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  )
}
