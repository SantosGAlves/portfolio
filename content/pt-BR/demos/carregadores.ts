import type { CarregadoresDemoContent } from "@/content/demos/carregadores-types"

// Simulador de recarga (caso dos carregadores de veículos elétricos). Carros e carregadores fictícios.
export const carregadores: CarregadoresDemoContent = {
  numberLocale: "pt-BR",
  section: {
    badge: "Simulação com dados fictícios · carros e carregadores inventados",
    intro:
      "Escolha um carro e veja quanto tempo ele leva para carregar de 0 a 100% em cada saída de cada carregador. É a conta do simulador do painel: a bateria dividida pela menor potência entre o limite AC do carro e a saída.",
    notesTitle: "O que é igual ao sistema e o que é simulado",
    notes: [
      "Igual ao sistema: a regra, tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída), e o carregador com uma ou mais saídas, cada uma com a sua potência.",
      "Simulado: os carros, os carregadores e as potências são fictícios. Não há banco, n8n nem agente; a conta roda no seu navegador.",
      "A regra é uma estimativa de 0 a 100%: não conta perdas na recarga nem a desaceleração perto da carga completa.",
      "Só recarga em corrente alternada (AC), como no simulador do painel. Na conversa, o agente também usa os dados de recarga em DC.",
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
    p1: "Portátil P1",
    r7: "Residencial R7",
    d11: "Duo D11",
    t22: "Totem T22",
  },
  outputsCount: { one: "1 saída", other: "{n} saídas" },
  resultsTitle: "Tempo de 0 a 100% em cada saída",
  output: "Saída {n} · {kw} kW",
  duration: "{h} h {m} min",
  formula: "{bateria} ÷ min({ac}; {saida}) = {bateria} ÷ {usada}",
  limitedByCar: "limitado pelo carro",
  limitedByCharger: "limitado pelo carregador",
  fastest: "mais rápido",
  ruleLabel: "Regra",
  rule: "tempo (h) = bateria (kWh) ÷ min(limite AC do carro, potência da saída)",
}
