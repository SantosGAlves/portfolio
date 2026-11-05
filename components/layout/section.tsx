import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  intro?: ReactNode
  children?: ReactNode
  className?: string
}

// Seção padrão da página: rótulo mono cinza, título e conteúdo.
// data-rail marca a seção na régua de progresso.
export function Section({ id, eyebrow, title, intro, children, className }: SectionProps) {
  const titleId = `${id}-heading`

  return (
    <section id={id} data-rail aria-labelledby={titleId} className={cn("border-t", className)}>
      <div className="container-site grid gap-8 py-14 md:py-20">
        <header className="grid max-w-prose gap-3">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId} className="text-h2 text-balance">
            {title}
          </h2>
          {intro ? <div className="text-muted-foreground">{intro}</div> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
