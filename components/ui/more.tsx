import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// "Ver mais": detalhe recolhido num <details> nativo (fechado por padrão; teclado e leitor de tela funcionam
// sem JS). O rótulo é verde porque é clicável e troca para "Ver menos" quando abre.
// Não aninhe um <More> dentro de outro: o rótulo usa group-open/more, que pegaria o <details> de fora.
export function More({
  more,
  less,
  children,
  className,
  bodyClassName,
}: {
  more: string
  /** Rótulo com o bloco aberto (sem ele, mantém `more`). */
  less?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <details className={cn("group/more", className)}>
      <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4 [&::-webkit-details-marker]:hidden">
        {less ? (
          <>
            <span className="group-open/more:hidden">{more}</span>
            <span className="hidden group-open/more:inline">{less}</span>
          </>
        ) : (
          more
        )}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 transition-transform duration-200 group-open/more:rotate-180 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </summary>
      <div className={cn("mt-3", bodyClassName)}>{children}</div>
    </details>
  )
}
