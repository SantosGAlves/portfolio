import type { CarregadoresDemoContent } from "@/content/demos/carregadores-types"

// Simulador de recarga (caso dos carregadores de veículos elétricos). Carros e carregadores fictícios.
export const carregadores: CarregadoresDemoContent = {
  numberLocale: "pt-BR",
  section: {
    badge: "Simulação com dados fictícios · carros e carregadores inventados",
    intro:
      "Escolha um carro e veja quanto tempo ele leva para carregar de 0 a 100% em cada carregador: no portátil com plugues trocáveis, em cada plugue. É a conta do simulador do painel, a mesma que o agente faz na conversa: a bateria dividida pela menor potência entre o limite AC do carro e a saída.",
    notesTitle: "O que é igual ao sistema e o que é simulado",
    notes: [
      "Igual ao sistema: a regra, tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída), e os tipos de produto: portátil com plugues trocáveis (cada plugue é uma saída), portátil de uma saída e wallbox.",
      "Simulado: os nomes, os carros e as baterias são fictícios. A potência dos plugues é a corrente vezes 220 V, arredondada. Não há banco, n8n nem agente; a conta roda no seu navegador.",
      "A regra é uma estimativa de 0 a 100%: não conta perdas na recarga nem a desaceleração perto da carga completa.",
      "Só recarga em corrente alternada (AC), como no simulador do painel. Na conversa, o agente também informava o tempo na recarga rápida em DC, que aqui não é simulada.",
    ],
  },
  frameLabel: "Simulador de tempo de recarga",
  carLegend: "Escolha o carro",
  carSpec: "{bateria} kWh · AC até {ac} kW",
  carNames: {
    compacto: "Compacto Urbano",
    hatch: "Hatch Elétrico",
    seda: "Sedã Executivo",
    suv: "SUV Família",
    van: "Van de Entregas",
  },
  chargerNames: {
    flex: "Portátil Flex",
    fixo: "Portátil Fixo 32",
    wallbox: "Wallbox W7",
  },
  outputsCount: { plugs: "{n} plugues trocáveis", single: "1 saída" },
  resultsTitle: "Tempo de 0 a 100% em cada saída",
  output: { plug: "Plugue de {a} A · ≈ {kw} kW", amps: "{a} A · ≈ {kw} kW", power: "{kw} kW" },
  duration: "{h} h {m} min",
  formula: "{bateria} ÷ min({ac}; {saida}) = {bateria} ÷ {usada}",
  limitedByCar: "limitado pelo carro",
  limitedByCharger: "limitado pelo carregador",
  fastest: "mais rápido",
  ruleLabel: "Regra",
  rule: "tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída)",
}
