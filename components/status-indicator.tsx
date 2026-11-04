import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Ponto de status com pulso discreto. O pulso some com prefers-reduced-motion.
export function StatusIndicator({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 font-mono text-meta text-muted-foreground", className)}>
      <span aria-hidden="true" className="relative size-[7px] shrink-0 rounded-full bg-ok">
        <span className="absolute -inset-1 animate-status-ping rounded-full border border-ok opacity-0" />
      </span>
      {children}
    </p>
  )
}
