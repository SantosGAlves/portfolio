// Regra do simulador de recarga do painel: o gargalo é a menor potência entre o limite AC do carro
// e a saída do carregador. tempo (h) = bateria (kWh) ÷ min(limite AC, potência da saída).

export type ChargeResult = {
  /** Potência que de fato carrega o carro (kW). */
  usedKw: number
  hours: number
  limitedBy: "car" | "charger"
}

export function chargeTime(batteryKwh: number, acLimitKw: number, outputKw: number): ChargeResult {
  const usedKw = Math.min(acLimitKw, outputKw)
  return { usedKw, hours: batteryKwh / usedKw, limitedBy: acLimitKw <= outputKw ? "car" : "charger" }
}

/** Horas decimais → horas e minutos inteiros (minutos arredondados). */
export function splitHours(hours: number): { h: number; m: number } {
  const total = Math.round(hours * 60)
  return { h: Math.floor(total / 60), m: total % 60 }
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}
