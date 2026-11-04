import { Fragment, type CSSProperties } from "react"

// Diagrama de arquitetura em dois blocos (ex.: "minha parte" e "sistema da equipe"), ligados por uma seta
// com rótulo. Cada bloco tem uma fila de etapas e, opcionalmente, um item ligado por baixo a uma delas
// (ex.: o banco de sessões do n8n, o painel que consome a API).
// No celular tudo vira uma coluna, na ordem do DOM; a partir de 1024px, filas horizontais.

type ArchNode = { title: string; detail?: string }
type ArchSide = ArchNode & {
  /** Índice da etapa do bloco à qual o item se liga. */
  under: number
  /** Rótulo da ligação (ex.: "lê e grava", "JWT"). */
  link: string
  /** both = as duas direções; up = do item para a etapa. */
  dir?: "both" | "up"
}
type ArchGroup = { label: string; mine?: boolean; nodes: ArchNode[]; side?: ArchSide }

export function Architecture({ groups, link, caption }: { groups: ArchGroup[]; link: string; caption?: string }) {
  return (
    <figure className="my-10 grid gap-3 lg:-mx-24">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,3fr)_8rem_minmax(0,2fr)] lg:gap-0">
        {groups.map((group, g) => (
          <div key={group.label} className="contents">
            {g > 0 ? (
              <div className="grid justify-items-center gap-1 py-1 text-center font-mono text-meta text-brand lg:mt-[4.6rem] lg:self-start lg:px-2">
                {/* Quebra só entre palavras (não no hífen de "x-service-key"). */}
                <span>
                  {link.split(" ").map((word, i) => (
                    <Fragment key={i}>
                      {i > 0 ? " " : null}
                      <span className="whitespace-nowrap">{word}</span>
                    </Fragment>
                  ))}
                </span>
                <span aria-hidden="true" className="lg:hidden">
                  ↓
                </span>
                <span aria-hidden="true" className="hidden h-px w-full bg-brand lg:block" />
              </div>
            ) : null}
            <Group group={group} />
          </div>
        ))}
      </div>
      {caption ? <figcaption className="font-mono text-meta text-subtle">{caption}</figcaption> : null}
    </figure>
  )
}

function Group({ group }: { group: ArchGroup }) {
  const { nodes, side } = group
  const cols = nodes.map(() => "minmax(0,1fr)").join(" 1.25rem ")
  // Posição no desktop: etapa i na coluna 2i+1; setas nas colunas pares; o item de baixo nas linhas 2 e 3.
  const at = (col: number, row: number) => ({ "--c": String(col), "--r": String(row) }) as CSSProperties
  const place = "lg:[grid-column:var(--c)] lg:[grid-row:var(--r)]"

  return (
    <div className={`grid content-start gap-3 rounded-xl border p-4 ${group.mine ? "border-brand-line bg-brand-soft" : "border-line"}`}>
      <p className={`font-mono text-meta ${group.mine ? "text-brand" : "text-subtle"}`}>{group.label}</p>
      <div style={{ "--arch-cols": cols } as CSSProperties} className="grid gap-2 lg:gap-x-0 lg:gap-y-0 lg:[grid-template-columns:var(--arch-cols)]">
        {nodes.map((node, i) => (
          <div key={node.title} className="contents">
            <Box node={node} style={at(2 * i + 1, 1)} className={place} />
            {side && side.under === i ? (
              <>
                <div
                  style={at(2 * i + 1, 2)}
                  className={`flex items-center gap-2 pl-4 font-mono text-meta ${group.mine ? "text-muted-foreground" : "text-subtle"} lg:grid lg:justify-items-center lg:gap-0 lg:py-1 lg:pl-0 ${place}`}
                >
                  <span aria-hidden="true">{side.dir === "up" ? "↑" : "↕"}</span>
                  <span>{side.link}</span>
                </div>
                <Box node={side} style={at(2 * i + 1, 3)} className={`ml-4 border-dashed lg:ml-0 ${place}`} />
              </>
            ) : null}
            {i < nodes.length - 1 ? (
              <span aria-hidden="true" style={at(2 * i + 2, 1)} className={`grid place-items-center font-mono text-subtle ${place}`}>
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function Box({ node, style, className = "" }: { node: ArchNode; style: CSSProperties; className?: string }) {
  return (
    <div style={style} className={`grid content-start gap-1 rounded-lg border border-line bg-surface p-3 ${className}`}>
      <span className="text-small font-semibold text-foreground">
        {/* Nome de tabela (whatsapp_sessions) pode quebrar depois do "_". */}
        {node.title.split("_").map((part, i) => (
          <Fragment key={i}>
            {i > 0 ? (
              <>
                _<wbr />
              </>
            ) : null}
            {part}
          </Fragment>
        ))}
      </span>
      {node.detail ? <span className="text-[0.8125rem] leading-snug text-muted-foreground">{node.detail}</span> : null}
    </div>
  )
}
