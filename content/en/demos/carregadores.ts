import type { CarregadoresDemoContent } from "@/content/demos/carregadores-types"

// Charging simulator (EV chargers case study). Fictional cars and chargers.
export const carregadores: CarregadoresDemoContent = {
  numberLocale: "en-US",
  section: {
    badge: "Simulation with fictional data · made-up cars and chargers",
    intro:
      "Pick a car and see how long it takes to charge from 0 to 100% on each charger: on the portable charger with swappable plugs, on each plug. It is the dashboard simulator's calculation, the same one the agent makes in the conversation: the battery divided by the lower power between the car's AC limit and the output.",
    notesTitle: "What matches the system and what is simulated",
    notes: [
      "Same as the system: the rule, time (h) = battery (kWh) ÷ min(car's AC limit, output power), and the product types: a portable charger with swappable plugs (each plug is an output), a single-output portable charger and a wallbox.",
      "Simulated: the names, cars and batteries are fictional. Plug power is the current times 220 V, rounded. There is no database, n8n or agent; the calculation runs in your browser.",
      "The rule is a 0 to 100% estimate: it doesn't count charging losses or the slowdown near a full charge.",
      "AC charging only, as in the dashboard simulator. In the conversation, the agent also gave the DC fast-charging time, which is not simulated here.",
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
    flex: "Flex Portable",
    fixo: "Fixed Portable 32",
    wallbox: "Wallbox W7",
  },
  outputsCount: { plugs: "{n} swappable plugs", single: "1 output" },
  resultsTitle: "Time from 0 to 100% on each output",
  output: { plug: "{a} A plug · ≈ {kw} kW", amps: "{a} A · ≈ {kw} kW", power: "{kw} kW" },
  duration: "{h} h {m} min",
  formula: "{bateria} ÷ min({ac}, {saida}) = {bateria} ÷ {usada}",
  limitedByCar: "limited by the car",
  limitedByCharger: "limited by the charger",
  fastest: "fastest",
  ruleLabel: "Rule",
  rule: "time (h) = battery (kWh) ÷ min(car's AC limit, output power)",
}
