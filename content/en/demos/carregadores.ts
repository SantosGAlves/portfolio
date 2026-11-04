import type { CarregadoresDemoContent } from "@/content/demos/carregadores-types"

// Charging simulator (EV chargers case study). Fictional cars and chargers.
export const carregadores: CarregadoresDemoContent = {
  numberLocale: "en-US",
  section: {
    badge: "Simulation with fictional data · made-up cars and chargers",
    intro:
      "Pick a car and see how long it takes to charge from 0 to 100% on each output of each charger. It is the dashboard simulator's calculation: the battery divided by the lower power between the car's AC limit and the output.",
    notesTitle: "What matches the system and what is simulated",
    notes: [
      "Same as the system: the rule, time (h) = battery (kWh) ÷ min(car's AC limit, output power), and chargers with one or more outputs, each with its own power.",
      "Simulated: the cars, chargers and power ratings are fictional. There is no database, n8n or agent; the calculation runs in your browser.",
      "The rule is a 0 to 100% estimate: it doesn't count charging losses or the slowdown near a full charge.",
      "AC charging only, as in the dashboard simulator. In the conversation, the agent also uses DC charging data.",
    ],
  },
  frameLabel: "Charging time simulator",
  carLegend: "Pick a car",
  carSpec: "{bateria} kWh · AC up to {ac} kW",
  carNames: {
    compacto: "City Compact",
    hatch: "Electric Hatch",
    seda: "Executive Sedan",
    suv: "Family SUV",
    van: "Delivery Van",
  },
  chargerNames: {
    p1: "Portable P1",
    r7: "Home R7",
    d11: "Duo D11",
    t22: "Totem T22",
  },
  outputsCount: { one: "1 output", other: "{n} outputs" },
  resultsTitle: "Time from 0 to 100% on each output",
  output: "Output {n} · {kw} kW",
  duration: "{h} h {m} min",
  formula: "{bateria} ÷ min({ac}, {saida}) = {bateria} ÷ {usada}",
  limitedByCar: "limited by the car",
  limitedByCharger: "limited by the charger",
  fastest: "fastest",
  ruleLabel: "Rule",
  rule: "time (h) = battery (kWh) ÷ min(car's AC limit, output power)",
}
