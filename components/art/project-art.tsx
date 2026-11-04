import type { ProjectArt as ArtKind } from "@/content/project-schema"

// Composições abstratas dos cards: HTML/SVG renderizado no servidor, sem imagem,
// nítido em qualquer tela e nas cores do tema. Decorativas (aria-hidden): o card
// já tem título e descrição. Os dados nelas são ilustrativos.
// Quando houver telas reais, troque por next/image no card.

export function ProjectArt({ art, className = "" }: { art: ArtKind; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`@container relative isolate overflow-hidden bg-bg-deep select-none ${className}`}
    >
      {/* grade de pontos + luz suave atrás da composição */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(var(--brand-rgb)/0.1)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute inset-x-[10%] -bottom-1/3 -z-10 h-3/4 rounded-full bg-brand/10 opacity-70 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100" />
      {art === "battery" ? <BatteryArt /> : null}
      {art === "librasflow" ? <LibrasArt /> : null}
      {art === "automation" ? <AutomationArt /> : null}
      {art === "kanban" ? <KanbanArt /> : null}
      {art === "booking" ? <BookingArt /> : null}
    </div>
  )
}

const rows = [
  ["Onix", "2019", "1.0", "60 Ah", "R$ 459"],
  ["HB20", "2020", "1.0", "50 Ah", "R$ 419"],
  ["Gol", "2016", "1.6", "60 Ah", "R$ 459"],
  ["Corolla", "2021", "2.0", "70 Ah", "R$ 629"],
]
const cell = "px-[2cqi] py-[1.1cqi]"

// Painel de gestão (veículos → baterias) com o agente ao lado, levemente sobreposto.
// Em cards estreitos (container < 30rem) o agente some e o painel ocupa tudo.
function BatteryArt() {
  return (
    <div className="absolute inset-0 grid place-items-center p-[5cqi]">
      <div className="flex w-[min(100%,54rem)] items-center transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1">
        <div className="min-w-0 flex-1 overflow-hidden rounded-[1.4cqi] border border-line-strong bg-surface shadow-card">
          <div className="flex items-center justify-between gap-[2cqi] border-b border-line px-[2cqi] py-[1.4cqi] font-mono text-[max(9px,1.4cqi)] text-muted-foreground">
            <span className="truncate">painel · veículos → baterias</span>
            <span className="shrink-0 rounded-[0.5cqi] border border-brand-line px-[1cqi] py-[0.3cqi] text-brand">+ cadastrar</span>
          </div>
          <table className="w-full border-collapse font-mono text-[max(9px,1.4cqi)]">
            <thead>
              <tr className="text-left text-subtle">
                {["modelo", "ano", "câmbio", "bateria", "preço"].map((h) => (
                  <th key={h} className={`${cell} font-normal`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {rows.map((r, ri) => (
                <tr key={r[0]} className={`border-t border-line ${ri === 0 ? "bg-brand-soft text-foreground" : ""}`}>
                  {r.map((c, i) => (
                    <td key={i} className={`${cell} whitespace-nowrap ${i === 3 && ri === 0 ? "text-brand" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-dashed border-brand-line">
                <td className={`${cell} text-foreground`}>Kwid</td>
                <td className={cell}>2024</td>
                <td className={cell}>1.0</td>
                <td colSpan={2} className={`${cell} whitespace-nowrap text-brand`}>pré-cadastro</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="relative z-10 -ml-[3cqi] grid w-[34%] shrink-0 gap-[1.2cqi] rounded-[1.4cqi] border border-line-strong bg-surface p-[1.8cqi] text-[max(9px,1.4cqi)] shadow-card @max-[30rem]:hidden">
          <span className="justify-self-start rounded-[1cqi] rounded-bl-[0.3cqi] bg-surface-2 px-[1.4cqi] py-[0.8cqi] text-foreground">
            tem bateria pro onix 2019?
          </span>
          <span className="font-mono text-brand">buscar_bateria(…)</span>
          <span className="justify-self-end rounded-[1cqi] rounded-br-[0.3cqi] border border-brand-line bg-brand-soft px-[1.4cqi] py-[0.8cqi] text-foreground">
            60 Ah, R$ 459. Reservo?
          </span>
        </div>
      </div>
    </div>
  )
}

// Mão aberta em pontos de referência, com a letra reconhecida.
const hand: [number, number][] = [
  [100, 182], // punho
  [72, 160], [56, 136], [46, 114], [38, 96], // polegar
  [84, 112], [80, 82], [78, 62], [77, 44], // indicador
  [102, 108], [102, 74], [102, 52], [102, 32], // médio
  [120, 112], [124, 82], [126, 62], [127, 46], // anelar
  [136, 122], [146, 100], [152, 84], [156, 70], // mínimo
]
const bones: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
]

function LibrasArt() {
  return (
    <div className="absolute inset-0 grid place-items-center p-[5cqi]">
      <svg viewBox="0 0 320 200" className="h-full max-h-[86%] w-auto overflow-visible transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1">
        <rect x="40" y="16" width="136" height="178" rx="10" fill="none" stroke="var(--brand-line)" strokeDasharray="4 5" />
        <g stroke="var(--line-strong)" strokeWidth="2" strokeLinecap="round">
          {bones.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={hand[a][0] + 8} y1={hand[a][1]} x2={hand[b][0] + 8} y2={hand[b][1]} />
          ))}
        </g>
        <g fill="var(--brand)">
          {hand.map(([x, y], i) => (
            <circle key={i} cx={x + 8} cy={y} r={i === 0 ? 4 : 3} />
          ))}
        </g>
        <g fontFamily="var(--font-mono)">
          <rect x="204" y="62" width="92" height="76" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
          <text x="218" y="84" fontSize="10" fill="var(--text-subtle)">letra</text>
          <text x="216" y="124" fontSize="38" fontFamily="var(--font-serif)" fontStyle="italic" fill="var(--text)">
            A
          </text>
          <text x="254" y="124" fontSize="10" fill="var(--brand)">→ texto</text>
        </g>
      </svg>
    </div>
  )
}

// Fluxo de automação: nós conectados, no estilo de um editor de workflows.
const nodes = [
  { x: 14, y: 90, w: 78, label: "webhook", sub: "mensagem" },
  { x: 120, y: 90, w: 82, label: "classificar", sub: "pedido" },
  { x: 232, y: 46, w: 78, label: "responder", sub: "automático", brand: true },
  { x: 232, y: 134, w: 78, label: "equipe", sub: "notificar" },
]

function AutomationArt() {
  return (
    <div className="absolute inset-0 grid place-items-center p-[5cqi]">
      <svg viewBox="0 0 324 200" className="h-full max-h-[86%] w-auto overflow-visible transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1">
        <g fill="none" stroke="var(--line-strong)" strokeWidth="1.5">
          <path d="M92 106 C106 106 106 106 120 106" />
          <path d="M202 106 C218 106 216 62 232 62" stroke="var(--brand)" strokeOpacity="0.7" />
          <path d="M202 106 C218 106 216 150 232 150" strokeDasharray="4 4" />
        </g>
        {nodes.map((n) => (
          <g key={n.label} fontFamily="var(--font-mono)">
            <rect x={n.x} y={n.y} width={n.w} height="32" rx="8" fill="var(--surface)" stroke={n.brand ? "var(--brand-line)" : "var(--line-strong)"} />
            <text x={n.x + 10} y={n.y + 14} fontSize="9.5" fill="var(--text)">{n.label}</text>
            <text x={n.x + 10} y={n.y + 25} fontSize="8" fill="var(--text-subtle)">{n.sub}</text>
          </g>
        ))}
        <g fill="var(--brand)">
          <circle cx="92" cy="106" r="2.5" />
          <circle cx="202" cy="106" r="2.5" />
          <circle cx="120" cy="106" r="2.5" />
        </g>
        <text x="14" y="70" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-subtle)">n8n · fluxo</text>
      </svg>
    </div>
  )
}

// Kanban com barras de SLA e o evento que vai para o n8n. Status como no código.
type KanbanCard = { w: number; sla: number; alert?: boolean; done?: boolean }
const columns: { title: string; cards: KanbanCard[] }[] = [
  { title: "entrada", cards: [{ w: 62, sla: 30 }, { w: 48, sla: 12 }] },
  { title: "andamento", cards: [{ w: 70, sla: 92, alert: true }, { w: 54, sla: 60 }] },
  { title: "concluido", cards: [{ w: 58, sla: 100, done: true }] },
]

// O SVG ocupa a área toda e se ajusta pela menor dimensão (preserveAspectRatio padrão),
// para caber tanto no card (16:10) quanto no topo do estudo de caso (16:7).
function KanbanArt() {
  return (
    <div className="absolute inset-[7%]">
      <svg viewBox="0 0 330 214" className="size-full overflow-visible transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1">
        {columns.map((col, ci) => {
          const x = 8 + ci * 100
          return (
            <g key={col.title} fontFamily="var(--font-mono)">
              <text x={x + 4} y="22" fontSize="9" fill="var(--text-subtle)">
                {col.title}
              </text>
              <rect x={x} y="30" width="88" height="150" rx="9" fill="none" stroke="var(--line)" />
              {col.cards.map((card, i) => {
                const y = 38 + i * 50
                const bar = card.alert ? "var(--brand)" : card.done ? "var(--ok)" : "var(--line-strong)"
                return (
                  <g key={i}>
                    <rect x={x + 6} y={y} width="76" height="42" rx="6" fill="var(--surface)" stroke={card.alert ? "var(--brand-line)" : "var(--line-strong)"} />
                    <rect x={x + 13} y={y + 9} width={card.w * 0.8} height="5" rx="2.5" fill="var(--text-muted)" opacity="0.55" />
                    <rect x={x + 13} y={y + 19} width={card.w * 0.5} height="4" rx="2" fill="var(--text-subtle)" opacity="0.4" />
                    <rect x={x + 13} y={y + 31} width="62" height="3" rx="1.5" fill="var(--surface-2)" />
                    <rect x={x + 13} y={y + 31} width={(62 * card.sla) / 100} height="3" rx="1.5" fill={bar} />
                  </g>
                )
              })}
            </g>
          )
        })}
        <g fontFamily="var(--font-mono)">
          <path d="M184 80 C 214 80 214 196 244 196" fill="none" stroke="var(--brand)" strokeOpacity="0.6" strokeDasharray="3 4" />
          <rect x="222" y="186" width="100" height="22" rx="6" fill="var(--surface)" stroke="var(--brand-line)" />
          <text x="230" y="200" fontSize="8.5" fill="var(--brand)">
            n8n · ticket_assumido
          </text>
        </g>
      </svg>
    </div>
  )
}

const slots = [
  ["09:00", "free"],
  ["10:00", "busy"],
  ["11:00", "free"],
  ["14:00", "picked"],
  ["15:00", "busy"],
  ["16:00", "free"],
  ["17:00", "free"],
  ["18:00", "busy"],
] as const

// App de agendamento (Barbú): celular com as etapas, os dias e a grade de horários
// (ocupados riscados, um escolhido), ligado ao webhook do n8n.
function BookingArt() {
  return (
    <div className="absolute inset-[7%]">
      <svg viewBox="0 0 330 214" className="size-full overflow-visible transition-transform duration-500 ease-out-soft group-hover/card:-translate-y-1">
        <g fontFamily="var(--font-mono)">
          <rect x="70" y="4" width="112" height="206" rx="18" fill="var(--surface)" stroke="var(--line-strong)" />
          <rect x="108" y="11" width="36" height="5" rx="2.5" fill="var(--surface-2)" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={98 + i * 20} y="26" width={i === 2 ? 22 : 16} height="3" rx="1.5" fill="var(--brand)" opacity={i === 2 ? 1 : 0.5} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={82 + i * 23} y="40" width="19" height="26" rx="5" fill={i === 1 ? "var(--brand)" : "var(--surface-2)"} />
              <rect x={87 + i * 23} y="47" width="9" height="5" rx="2" fill={i === 1 ? "var(--bg)" : "var(--text-subtle)"} opacity="0.7" />
              <rect x={86 + i * 23} y="56" width="11" height="3" rx="1.5" fill={i === 1 ? "var(--bg)" : "var(--text-subtle)"} opacity="0.45" />
            </g>
          ))}
          <rect x="82" y="77" width="34" height="4" rx="2" fill="var(--text-subtle)" opacity="0.45" />
          {slots.map(([time, state], i) => {
            const x = 82 + (i % 2) * 46
            const y = 88 + Math.floor(i / 2) * 22
            const picked = state === "picked"
            const busy = state === "busy"
            return (
              <g key={time}>
                <rect
                  x={x}
                  y={y}
                  width="42"
                  height="17"
                  rx="5"
                  fill={picked ? "var(--brand)" : "var(--surface-2)"}
                  stroke={picked ? "none" : "var(--line)"}
                  opacity={busy ? 0.5 : 1}
                />
                <text x={x + 21} y={y + 11.5} fontSize="7.5" textAnchor="middle" fill={picked ? "var(--bg)" : busy ? "var(--text-subtle)" : "var(--text-muted)"}>
                  {time}
                </text>
                {busy ? <line x1={x + 9} y1={y + 8.5} x2={x + 33} y2={y + 8.5} stroke="var(--text-subtle)" strokeWidth="0.8" /> : null}
              </g>
            )
          })}
          <rect x="82" y="182" width="88" height="16" rx="5" fill="var(--brand)" opacity="0.9" />
          <rect x="108" y="188" width="36" height="4" rx="2" fill="var(--bg)" opacity="0.7" />
        </g>
        <g fontFamily="var(--font-mono)">
          <path d="M176 154 C 214 154 206 70 236 70" fill="none" stroke="var(--brand)" strokeOpacity="0.6" strokeDasharray="3 4" />
          <rect x="216" y="46" width="104" height="22" rx="6" fill="var(--surface)" stroke="var(--brand-line)" />
          <text x="224" y="60" fontSize="8.5" fill="var(--brand)">
            bookings.add()
          </text>
          <rect x="216" y="76" width="104" height="22" rx="6" fill="var(--surface)" stroke="var(--line-strong)" />
          <text x="224" y="90" fontSize="8.5" fill="var(--text-muted)">
            n8n · webhook
          </text>
        </g>
      </svg>
    </div>
  )
}
