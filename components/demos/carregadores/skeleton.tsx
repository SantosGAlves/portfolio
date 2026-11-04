// Espaço do simulador enquanto o código dele não carrega (mesma altura aproximada, para a página não pular).
export function CarregadoresSkeleton() {
  return (
    <div aria-hidden="true" className="-mx-4 grid overflow-hidden border-y border-line bg-surface sm:mx-0 sm:rounded-card sm:border-x lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="grid grid-cols-2 content-start gap-2 border-b border-line p-4 sm:p-5 lg:grid-cols-1 lg:border-r lg:border-b-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[3.75rem] rounded-xl border border-line bg-surface-2/40" />
        ))}
      </div>
      <div className="grid content-start gap-4 p-4 sm:p-5">
        <div className="h-12" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-surface-2/40 motion-reduce:animate-none" />
          ))}
        </div>
      </div>
    </div>
  )
}
