"use client"

import { useId, useMemo, useState } from "react"
import { evCars, evChargers, type CarregadoresDemoContent, type EvCarId } from "@/content/demos/carregadores-types"
import { chargeTime, fill, splitHours } from "./logic"

// Simulador de recarga: o visitante escolhe um carro e vê o tempo de 0 a 100% em cada saída de cada
// carregador, pela regra do painel. As barras são proporcionais ao tempo (a mais longa ocupa tudo);
// as saídas mais rápidas (pode haver empate, quando o limite é o do carro) ficam em verde.
export default function CarregadoresDemo({ content: c }: { content: CarregadoresDemoContent }) {
  const [carId, setCarId] = useState<EvCarId>("seda")
  const name = useId()
  const nf = useMemo(() => new Intl.NumberFormat(c.numberLocale, { maximumFractionDigits: 1 }), [c.numberLocale])
  const car = evCars.find((x) => x.id === carId) ?? evCars[0]

  const rows = evChargers.map((charger) => ({
    charger,
    outputs: charger.outputs.map((kw, i) => ({ n: i + 1, kw, ...chargeTime(car.batteryKwh, car.acLimitKw, kw) })),
  }))
  const allHours = rows.flatMap((r) => r.outputs.map((o) => o.hours))
  const longest = Math.max(...allHours)
  const fastest = Math.min(...allHours)
  const duration = (hours: number) => fill(c.duration, splitHours(hours))

  return (
    <div className="-mx-4 overflow-hidden border-y border-line bg-surface sm:mx-0 sm:rounded-card sm:border-x">
      <div role="region" aria-label={c.frameLabel} className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div role="radiogroup" aria-labelledby={`${name}-legend`} className="grid content-start gap-3 border-b border-line p-4 sm:p-5 lg:border-r lg:border-b-0">
          <p id={`${name}-legend`} className="font-mono text-meta text-subtle">
            {c.carLegend}
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {evCars.map((option) => {
              const checked = option.id === carId
              return (
                <label
                  key={option.id}
                  className={`grid cursor-pointer gap-0.5 rounded-xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                    checked ? "border-brand-line bg-brand-soft" : "border-line bg-surface-2/40 hover:border-line-strong"
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={option.id}
                    checked={checked}
                    onChange={() => setCarId(option.id)}
                    className="sr-only"
                  />
                  <span className={`text-small font-semibold ${checked ? "text-foreground" : "text-muted-foreground"}`}>{c.carNames[option.id]}</span>
                  {/* Sobre o fundo verde do carro escolhido, o cinza "subtle" não passa no AA. */}
                  <span className={`font-mono text-[0.75rem] ${checked ? "text-muted-foreground" : "text-subtle"}`}>
                    {fill(c.carSpec, { bateria: nf.format(option.batteryKwh), ac: nf.format(option.acLimitKw) })}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="grid content-start gap-4 p-4 sm:p-5">
          <div aria-live="polite" className="grid gap-1">
            <p className="font-mono text-meta text-subtle">{c.resultsTitle}</p>
            <p className="text-h3">
              {c.carNames[car.id]}
              <span className="ml-2 font-mono text-meta font-normal text-muted-foreground">
                {fill(c.carSpec, { bateria: nf.format(car.batteryKwh), ac: nf.format(car.acLimitKw) })}
              </span>
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {rows.map(({ charger, outputs }) => (
              <li key={charger.id} className="grid content-start gap-3 rounded-xl border border-line bg-surface-2/40 p-4">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-foreground">{c.chargerNames[charger.id]}</span>
                  <span className="font-mono text-meta text-subtle">
                    {outputs.length === 1 ? c.outputsCount.one : fill(c.outputsCount.other, { n: outputs.length })}
                  </span>
                </p>
                <ul className="grid gap-3">
                  {outputs.map((o) => {
                    const best = o.hours === fastest
                    return (
                      <li key={o.n} className="grid gap-1.5">
                        <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <span className="font-mono text-meta text-muted-foreground">{fill(c.output, { n: o.n, kw: nf.format(o.kw) })}</span>
                          <span className={`font-semibold tabular-nums ${best ? "text-brand" : "text-foreground"}`}>
                            {duration(o.hours)}
                            {best ? <span className="sr-only"> ({c.fastest})</span> : null}
                          </span>
                        </p>
                        <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-line">
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 ease-out-soft motion-reduce:transition-none ${best ? "bg-brand" : "bg-muted-foreground/60"}`}
                            style={{ width: `${Math.max(4, (o.hours / longest) * 100)}%` }}
                          />
                        </div>
                        <p className="flex flex-wrap gap-x-2 font-mono text-[0.75rem] text-subtle">
                          <span>
                            {fill(c.formula, {
                              bateria: nf.format(car.batteryKwh),
                              ac: nf.format(car.acLimitKw),
                              saida: nf.format(o.kw),
                              usada: nf.format(o.usedKw),
                            })}
                          </span>
                          <span className="whitespace-nowrap">· {o.limitedBy === "car" ? c.limitedByCar : c.limitedByCharger}</span>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <p className="rounded-lg border border-line px-3 py-2 font-mono text-[0.75rem] text-muted-foreground">
            <span className="mr-2 text-brand">{c.ruleLabel}</span>
            {c.rule}
          </p>
        </div>
      </div>
    </div>
  )
}
