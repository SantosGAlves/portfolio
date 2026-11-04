import type { DemoSectionText } from "./section-types"

// Simulador de recarga do caso dos carregadores de veículos elétricos (seção "Experimente").
// Regra do painel real: tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída).
// Carros e carregadores são fictícios; os números ficam aqui e os nomes, em content/<idioma>/demos/carregadores.ts.

export const evCars = [
  { id: "compacto", batteryKwh: 30, acLimitKw: 3.7 },
  { id: "hatch", batteryKwh: 42, acLimitKw: 6.6 },
  { id: "seda", batteryKwh: 60, acLimitKw: 7.4 },
  { id: "suv", batteryKwh: 82, acLimitKw: 11 },
  { id: "van", batteryKwh: 75, acLimitKw: 11 },
] as const
export type EvCarId = (typeof evCars)[number]["id"]

/**
 * Tipos de produto do cliente (nomes fictícios): portátil com plugues trocáveis, em que cada plugue é uma saída
 * com potência diferente; portátil de uma saída; wallbox. Potência dos plugues = corrente × 220 V, arredondada.
 * `amps` = corrente do plugue ou do portátil; sem `amps`, a saída mostra só a potência (wallbox).
 */
export type EvOutput = { kw: number; amps?: number }
export type EvChargerId = "flex" | "fixo" | "wallbox"
export const evChargers: ReadonlyArray<{ id: EvChargerId; plugs: boolean; outputs: ReadonlyArray<EvOutput> }> = [
  {
    id: "flex",
    plugs: true,
    outputs: [
      { amps: 10, kw: 2.2 },
      { amps: 16, kw: 3.5 },
      { amps: 20, kw: 4.4 },
      { amps: 32, kw: 7 },
    ],
  },
  { id: "fixo", plugs: false, outputs: [{ amps: 32, kw: 7 }] },
  { id: "wallbox", plugs: false, outputs: [{ kw: 7.2 }] },
]

export type CarregadoresDemoContent = {
  /** Locale do Intl para os números (pt-BR, en-US). */
  numberLocale: string
  section: DemoSectionText
  /** Rótulo da região do simulador para leitores de tela. */
  frameLabel: string
  carLegend: string
  /** {bateria}, {ac} */
  carSpec: string
  carNames: Record<EvCarId, string>
  chargerNames: Record<EvChargerId, string>
  /** Subtítulo do carregador. plugs: {n} = número de plugues; single: uma saída. */
  outputsCount: { plugs: string; single: string }
  resultsTitle: string
  /** Rótulos das saídas: plugue trocável ({a} A, {kw} kW), portátil de uma saída ({a}, {kw}) e só potência ({kw}). */
  output: { plug: string; amps: string; power: string }
  /** {h}, {m} */
  duration: string
  /** {bateria}, {ac}, {saida}, {usada} */
  formula: string
  limitedByCar: string
  limitedByCharger: string
  /** Só para leitores de tela: a saída mais rápida aparece em verde. */
  fastest: string
  ruleLabel: string
  rule: string
}
