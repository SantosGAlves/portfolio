// Espaço da demo enquanto o código dela não carrega (mesma altura aproximada, para a página não pular).
export function DemandasSkeleton() {
  return (
    <div aria-hidden="true" className="-mx-4 overflow-hidden border-y border-line bg-surface sm:mx-0 sm:rounded-card sm:border-x">
      <div className="h-[8.5rem] border-b border-line bg-surface-2/40" />
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl border border-line bg-surface-2/50 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  )
}
