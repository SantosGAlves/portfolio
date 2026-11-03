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

// Seção padrão da página: rótulo mono em lilás, título e conteúdo.
export function Section({ id, eyebrow, title, intro, children, className }: SectionProps) {
  const titleId = `${id}-titulo`

  return (
    <section id={id} aria-labelledby={titleId} className={cn("border-t", className)}>
      <div className="container-site grid gap-10 py-18 md:py-24">
        <header className="grid max-w-prose gap-3">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId} className="text-h2">
            {title}
          </h2>
          {intro ? <div className="text-muted-foreground">{intro}</div> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
