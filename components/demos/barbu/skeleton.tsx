// Espaço da demo enquanto o código dela não carrega: a moldura do celular, na mesma altura.
export function BarbuSkeleton() {
  return (
    <div aria-hidden="true" className="grid justify-items-center lg:justify-items-start">
      <div className="-mx-4 h-[calc(100svh-var(--header-h)-var(--demo-reserve))] w-[calc(100%+2rem)] bg-[#0A0A0A] sm:mx-0 sm:h-[min(52rem,calc(100svh-var(--header-h)-7rem))] sm:min-h-[40rem] sm:w-[24.5rem] sm:rounded-[3rem] sm:border-[10px] sm:border-[#1c1d21]" />
    </div>
  )
}
