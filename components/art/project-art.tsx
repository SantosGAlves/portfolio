import type { CSSProperties, ReactNode } from "react"
import type { ProjectArt as ArtKind } from "@/content/project-schema"

// Ilustrações dos cards de projeto: composições abstratas em SVG, todas no mesmo sistema
// (viewBox 320×200, traço de 1,5, painéis arredondados, um único acento verde, grade de pontos
// e brilho embaixo). A paleta é sempre a escura do site, também no tema claro: a arte funciona
// como uma "tela" dentro do card. Decorativas (aria-hidden): o card já tem título e descrição.
// Fotos, prints e vídeos reais ficam só dentro dos estudos de caso.

const c = {
  bg: "#0a0b0d",
  panel: "#15171b",
  panel2: "#1b1e23",
  line: "#2a2d33",
  strong: "#3d414a",
  muted: "#4b505a",
  text: "#8b8f98",
  accent: "#7ee08f",
  soft: "rgb(126 224 143 / 0.14)",
}
const stroke = { strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const

export function ProjectArt({ art, className = "" }: { art: ArtKind; className?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: c.bg } as CSSProperties}
      className={`relative isolate overflow-hidden select-none ${className}`}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(126_224_143/0.1)_1px,transparent_1px)] bg-size-[18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]" />
      <div className="absolute inset-x-[15%] -bottom-1/3 -z-10 h-2/3 rounded-full bg-[rgb(126_224_143/0.1)] opacity-80 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100" />
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 size-full transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1 motion-reduce:transition-none"
      >
        {arts[art]}
      </svg>
    </div>
  )
}

/** Barrinha de "texto" dentro dos painéis. */
function Bar({ x, y, w, fill = c.muted }: { x: number; y: number; w: number; fill?: string }) {
  return <rect x={x} y={y} width={w} height={4} rx={2} fill={fill} />
}

// Agente de IA + banco: conversa à esquerda, banco à direita, ligados por uma consulta.
const agent = (
  <g {...stroke}>
    <rect x={58} y={38} width={128} height={124} rx={10} fill={c.panel} stroke={c.strong} />
    <line x1={58} y1={58} x2={186} y2={58} stroke={c.line} />
    <circle cx={72} cy={48} r={4} fill={c.accent} stroke="none" />
    <Bar x={82} y={46} w={44} />
    <rect x={68} y={68} width={78} height={18} rx={9} fill={c.panel2} stroke={c.line} />
    <Bar x={78} y={75} w={52} />
    <rect x={96} y={94} width={80} height={18} rx={9} fill={c.soft} stroke={c.accent} />
    <Bar x={106} y={101} w={56} fill={c.accent} />
    <rect x={68} y={120} width={92} height={18} rx={9} fill={c.panel2} stroke={c.line} />
    <Bar x={78} y={127} w={64} />
    <circle cx={76} cy={150} r={2} fill={c.text} stroke="none" />
    <circle cx={84} cy={150} r={2} fill={c.text} stroke="none" />
    <circle cx={92} cy={150} r={2} fill={c.text} stroke="none" />
    <path d="M186 103 H210" stroke={c.accent} strokeDasharray="3 4" />
    <circle cx={198} cy={103} r={3} fill={c.accent} stroke="none" />
    <path d="M212 64 v76 a30 9 0 0 0 60 0 v-76" fill={c.panel} stroke={c.strong} />
    <ellipse cx={242} cy={64} rx={30} ry={9} fill={c.panel2} stroke={c.strong} />
    <path d="M212 89 a30 9 0 0 0 60 0 M212 114 a30 9 0 0 0 60 0" fill="none" stroke={c.line} />
    <rect x={226} y={99} width={32} height={5} rx={2.5} fill={c.accent} stroke="none" />
    <Bar x={230} y={124} w={24} />
  </g>
)

// LibrasFlow: os 21 pontos da mão fazendo a letra L, num visor de câmera, com a letra reconhecida.
const handPoints: Array<[number, number]> = [
  [160, 168], [143, 160], [127, 153], [112, 149], [97, 147],
  [150, 120], [148, 98], [147, 78], [146, 60],
  [163, 117], [167, 102], [173, 110], [172, 120],
  [175, 120], [179, 107], [184, 114], [182, 123],
  [186, 126], [190, 115], [194, 121], [191, 129],
]
const handLinks: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
]
const lit = new Set(["0-1", "1-2", "2-3", "3-4", "0-5", "5-6", "6-7", "7-8"])
const hand = (
  <g {...stroke}>
    <path d="M84 48 V36 H100 M220 36 H236 V48 M236 160 V172 H220 M100 172 H84 V160" fill="none" stroke={c.text} />
    {handLinks.map(([a, b]) => (
      <line
        key={`${a}-${b}`}
        x1={handPoints[a][0]}
        y1={handPoints[a][1]}
        x2={handPoints[b][0]}
        y2={handPoints[b][1]}
        stroke={lit.has(`${a}-${b}`) ? c.accent : c.strong}
      />
    ))}
    {handPoints.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2.8} fill={i <= 8 ? c.accent : c.text} stroke="none" />
    ))}
    <rect x={200} y={54} width={40} height={30} rx={7} fill={c.soft} stroke={c.accent} />
    <text x={220} y={75} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={17} fontWeight={700} fill={c.accent} stroke="none">
      L
    </text>
    <path d="M200 94 H240" stroke={c.line} />
    <path d="M200 94 H230" stroke={c.accent} />
  </g>
)

// Plataforma de demandas: quadro Kanban com um card sendo arrastado entre colunas.
const columns = [56, 110, 164, 218]
const cards: Record<number, number[]> = { 0: [64, 88, 112], 1: [64, 88], 2: [64], 3: [64, 88, 112] }
const kanban = (
  <g {...stroke}>
    {columns.map((x, i) => (
      <g key={x}>
        <rect x={x} y={36} width={46} height={130} rx={8} fill={c.panel} stroke={c.line} />
        <circle cx={x + 9} cy={48} r={2.5} fill={i === 1 ? c.accent : c.text} stroke="none" />
        <Bar x={x + 15} y={46} w={20} />
        {cards[i].map((y) => (
          <g key={y}>
            <rect x={x + 5} y={y - 4} width={36} height={20} rx={4} fill={c.panel2} stroke={c.line} />
            <Bar x={x + 10} y={y + 2} w={i === 3 ? 18 : 24} />
          </g>
        ))}
      </g>
    ))}
    <path d="M152 124 C 162 132, 172 132, 182 124" fill="none" stroke={c.accent} strokeDasharray="3 4" />
    <g transform="rotate(-7 175 104)">
      <rect x={153} y={94} width={44} height={24} rx={5} fill={c.soft} stroke={c.accent} />
      <Bar x={159} y={101} w={28} fill={c.accent} />
      <Bar x={159} y={109} w={16} />
    </g>
  </g>
)

// Barbú: celular com a grade de horários (um escolhido, um ocupado) e o aviso de confirmação ao lado.
const slotX = [136, 152, 168]
const slotY = [78, 93, 108]
const phone = (
  <g {...stroke}>
    <rect x={122} y={22} width={76} height={156} rx={15} fill={c.panel} stroke={c.strong} />
    <rect x={148} y={29} width={24} height={6} rx={3} fill={c.bg} stroke="none" />
    <Bar x={134} y={46} w={30} fill={c.text} />
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={138 + i * 15} cy={63} r={4.5} fill={i === 1 ? c.soft : c.panel2} stroke={i === 1 ? c.accent : c.line} />
    ))}
    {slotY.map((y, r) =>
      slotX.map((x, k) => {
        const chosen = r === 1 && k === 1
        const taken = r === 0 && k === 2
        return (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={13} height={10} rx={3} fill={chosen ? c.soft : c.panel2} stroke={chosen ? c.accent : c.line} />
            {taken ? <line x1={x + 2} y1={y + 5} x2={x + 11} y2={y + 5} stroke={c.muted} /> : null}
          </g>
        )
      }),
    )}
    <rect x={134} y={150} width={52} height={14} rx={7} fill={c.accent} stroke="none" />
    <path d="M198 104 H212" stroke={c.accent} strokeDasharray="3 4" />
    <rect x={212} y={86} width={66} height={36} rx={8} fill={c.panel} stroke={c.line} />
    <circle cx={226} cy={104} r={6} fill={c.soft} stroke={c.accent} />
    <path d="M223.5 104 l2 2 l3.5 -4" fill="none" stroke={c.accent} />
    <Bar x={238} y={97} w={30} fill={c.text} />
    <Bar x={238} y={107} w={22} />
  </g>
)

// Ajuda Animal: mapa com ruas, o pino da denúncia e a mensagem que a originou.
const map = (
  <g {...stroke}>
    <rect x={48} y={32} width={224} height={138} rx={10} fill={c.panel} stroke={c.line} />
    <path d="M48 120 C 110 108, 150 150, 272 126" fill="none" stroke={c.panel2} strokeWidth={9} />
    <path d="M142 32 V170" fill="none" stroke={c.panel2} strokeWidth={7} />
    <path d="M48 72 H272" fill="none" stroke={c.panel2} strokeWidth={5} />
    <path d="M222 32 C 214 80, 236 120, 228 170" fill="none" stroke={c.panel2} strokeWidth={4} />
    {[
      [156, 84, 22, 18],
      [156, 140, 28, 16],
      [240, 84, 22, 22],
      [62, 132, 30, 20],
      [100, 84, 26, 16],
    ].map(([x, y, w, h]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={3} fill="none" stroke={c.line} />
    ))}
    <ellipse cx={198} cy={118} rx={24} ry={7} fill="none" stroke={c.accent} opacity={0.25} />
    <ellipse cx={198} cy={118} rx={13} ry={4} fill="none" stroke={c.accent} opacity={0.55} />
    <path d="M198 117 C 188 103, 184 97, 184 90 a14 14 0 0 1 28 0 c0 7 -4 13 -14 27z" fill={c.accent} stroke="none" />
    <circle cx={198} cy={90} r={5} fill={c.bg} stroke="none" />
    <rect x={62} y={44} width={62} height={22} rx={8} fill={c.panel2} stroke={c.accent} />
    <Bar x={70} y={50} w={30} fill={c.accent} />
    <Bar x={70} y={57} w={44} />
  </g>
)

// Carregadores de veículos elétricos: totem com raio na tela, cabo até o plugue e a bateria enchendo.
const charger = (
  <g {...stroke}>
    <rect x={92} y={36} width={62} height={126} rx={10} fill={c.panel} stroke={c.strong} />
    <rect x={102} y={48} width={42} height={30} rx={5} fill={c.panel2} stroke={c.line} />
    <path d="M126 53 L116 65 H123 L119 74 L130 61 H123 Z" fill={c.accent} stroke="none" />
    <Bar x={104} y={88} w={30} />
    <Bar x={104} y={96} w={20} />
    <circle cx={123} cy={122} r={7} fill={c.panel2} stroke={c.line} />
    <rect x={84} y={160} width={78} height={8} rx={4} fill={c.panel2} stroke={c.line} />
    <path d="M154 122 C 184 122, 172 156, 202 152" fill="none" stroke={c.strong} strokeWidth={4} />
    <rect x={200} y={144} width={20} height={16} rx={4} fill={c.panel2} stroke={c.strong} />
    <path d="M220 149 h5 M220 155 h5" stroke={c.strong} />
    <rect x={198} y={62} width={70} height={34} rx={7} fill={c.panel} stroke={c.strong} />
    <rect x={268} y={72} width={6} height={14} rx={2} fill={c.strong} stroke="none" />
    <rect x={203} y={67} width={44} height={24} rx={4} fill={c.accent} stroke="none" />
    <path d="M218 67 V91 M233 67 V91" stroke={c.bg} />
    <Bar x={198} y={106} w={40} fill={c.text} />
    <Bar x={198} y={115} w={26} />
  </g>
)

// Projeto planejado: moldura tracejada com um sinal de mais.
const planned = (
  <g {...stroke}>
    <rect x={104} y={46} width={112} height={108} rx={12} fill="none" stroke={c.strong} strokeDasharray="4 5" />
    <path d="M160 86 V114 M146 100 H174" stroke={c.accent} />
  </g>
)

const arts: Record<ArtKind, ReactNode> = { agent, hand, kanban, phone, map, charger, planned }
