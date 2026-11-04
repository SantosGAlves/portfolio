import type { DemoSectionText } from "./section-types"

// Simulador de recarga do caso dos carregadores de veículos elétricos (seção "Experimente").
// Regra do painel real: tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída).
// Carros e carregadores são fictícios; os números ficam aqui e os nomes, em content/<idioma>/demos/carregadores.ts.

export const evCars = [
  { id: "compacto", batteryKwh: 30, acLimitKw: 3.7 },
  { id: "hatch", batteryKwh: 44, acLimitKw: 7.4 },
  { id: "seda", batteryKwh: 64, acLimitKw: 11 },
  { id: "suv", batteryKwh: 82, acLimitKw: 11 },
  { id: "van", batteryKwh: 75, acLimitKw: 22 },
] as const
export type EvCarId = (typeof evCars)[number]["id"]

/** Um carregador pode ter uma ou mais saídas, cada uma com a sua potência (kW). */
export const evChargers = [
  { id: "p1", outputs: [3.7] },
  { id: "r7", outputs: [7.4] },
  { id: "d11", outputs: [7.4, 11] },
  { id: "t22", outputs: [11, 22] },
] as const
export type EvChargerId = (typeof evChargers)[number]["id"]

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
  /** {n} = número de saídas */
  outputsCount: { one: string; other: string }
  resultsTitle: string
  /** {n}, {kw} */
  output: string
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
