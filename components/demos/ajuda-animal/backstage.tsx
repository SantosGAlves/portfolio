"use client"

import { useId, type ReactNode } from "react"
import type { AjudaAnimalDemoContent } from "@/content/demos/ajuda-animal-types"
import { buttonVariants } from "@/components/ui/button"
import { sessionFields, type ApiCall, type Exec, type Report, type Session } from "./logic"

// Painel "Nos bastidores": o que o n8n e o core-api fazem com cada mensagem.
// Usa as cores do site (fica ao lado do celular e, em telas menores, numa folha por cima dele).

const statusText: Record<number, string> = { 200: "OK", 201: "Created", 404: "Not Found" }

export function Backstage({
  content,
  exec,
  reports,
  fail,
  onFail,
  onAdvance,
}: {
  content: AjudaAnimalDemoContent
  exec: Exec | null
  reports: Report[]
  fail: boolean
  onFail: (value: boolean) => void
  onAdvance: (protocol: string) => void
}) {
  const t = content.backstage
  const id = useId()

  return (
    <div className="grid gap-6">
      <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => onFail(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
          aria-describedby={`${id}-fail`}
        />
        <span className="grid gap-1">
          <span className="text-small font-semibold">{t.fail}</span>
          <span id={`${id}-fail`} className="text-[0.8125rem] text-muted-foreground">
            {t.failHint}
          </span>
        </span>
      </label>

      <Section n="01" title={t.trailTitle} note={exec ? t.trailNote : undefined}>
        {exec ? (
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[0.75rem]">
            {exec.trail.map((node, i) => (
              <li key={`${node.name}-${i}`} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-subtle">
                    →
                  </span>
                ) : null}
                <span
                  className={`rounded-md border px-2 py-1 ${
                    node.disabled ? "border-dashed border-line text-subtle line-through" : "border-line bg-surface-2 text-foreground"
                  }`}
                >
                  {node.name}
                </span>
                {node.disabled ? <span className="text-subtle no-underline">({t.disabled})</span> : null}
              </li>
            ))}
          </ol>
        ) : (
          <Empty>{t.trailEmpty}</Empty>
        )}
      </Section>

      <Section n="02" title={t.sessionTitle}>
        {exec?.deleted ? (
          <Empty>{t.sessionDeleted}</Empty>
        ) : exec?.after ? (
          <SessionTable before={exec.before} after={exec.after} changed={t.changed} />
        ) : (
          <Empty>{t.sessionNone}</Empty>
        )}
      </Section>

      <Section n="03" title={t.requestTitle}>
        {exec?.call ? <Request call={exec.call} content={content} /> : <Empty>{t.requestNone}</Empty>}
      </Section>

      <Section n="04" title={t.panelTitle} note={t.panelNote}>
        <Dashboard content={content} reports={reports} onAdvance={onAdvance} />
      </Section>
    </div>
  )
}

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h3 className="flex items-baseline gap-2 text-small font-semibold">
          <span className="font-mono text-meta text-brand">{n}</span>
          {title}
        </h3>
        {note ? <p className="text-[0.8125rem] text-muted-foreground">{note}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line p-4 text-[0.8125rem] text-muted-foreground">{children}</p>
}

function SessionTable({ before, after, changed }: { before: Session | null; after: Session; changed: string }) {
  return (
    <dl className="grid overflow-hidden rounded-xl border border-line font-mono text-[0.75rem]">
      {sessionFields.map((field) => {
        const value = after[field]
        const isChanged = before ? before[field] !== value : true
        return (
          <div
            key={field}
            className={`grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] gap-3 px-3 py-2 not-first:border-t not-first:border-line ${
              isChanged ? "bg-brand-soft" : "bg-surface"
            }`}
          >
            <dt className={isChanged ? "text-brand" : "text-subtle"}>
              {field}
              {isChanged ? <span className="sr-only"> ({changed})</span> : null}
            </dt>
            <dd className={`break-words ${value === null ? "text-subtle" : "text-foreground"}`}>{value === null ? "null" : value}</dd>
          </div>
        )
      })}
    </dl>
  )
}

function Request({ call, content }: { call: ApiCall; content: AjudaAnimalDemoContent }) {
  const t = content.backstage
  const head = [`${call.method} ${call.path}`, "x-service-key: ••••", ...(call.body ? ["Content-Type: application/json"] : [])].join("\n")
  return (
    <div className="grid gap-2">
      <pre className="overflow-hidden rounded-xl border border-line bg-surface-2 p-3 font-mono text-[0.75rem] leading-relaxed break-words whitespace-pre-wrap text-foreground">
        {head}
        {call.body ? `\n\n${JSON.stringify(call.body, null, 2)}` : null}
      </pre>
      <div className="grid gap-1.5 rounded-xl border border-line p-3">
        <p className="font-mono text-[0.75rem]">
          {call.status ? (
            <span className={call.status < 300 ? "text-ok" : "text-warn"}>
              {call.status} {statusText[call.status]}
            </span>
          ) : (
            <span className="text-danger">{t.noResponse}</span>
          )}
          {call.response && call.method === "POST" ? <span className="text-subtle"> · {t.responseExcerpt}</span> : null}
        </p>
        {call.response ? (
          <pre className="font-mono text-[0.75rem] leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
            {JSON.stringify(call.response, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  )
}

// Mapa fictício: só ruas genéricas e os pinos, sem base cartográfica.
const bbox = { minLat: -23.318, maxLat: -23.293, minLng: -45.982, maxLng: -45.948 }

function Dashboard({ content, reports, onAdvance }: { content: AjudaAnimalDemoContent; reports: Report[]; onAdvance: (protocol: string) => void }) {
  const t = content.backstage
  // Mais antiga = 1, como numa lista do painel.
  const ordered = [...reports].reverse()
  const seen = new Map<string, number>()
  const pins = ordered.flatMap((r, i) => {
    if (r.latitude === null || r.longitude === null) return []
    const key = `${r.latitude},${r.longitude}`
    const shift = seen.get(key) ?? 0
    seen.set(key, shift + 1)
    const x = ((r.longitude - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * 320 + shift * 13
    const y = ((bbox.maxLat - r.latitude) / (bbox.maxLat - bbox.minLat)) * 180
    return [{ n: i + 1, x, y, resolved: r.status === "RESOLVED" }]
  })

  return (
    <div className="grid gap-3">
      <svg viewBox="0 0 320 180" role="img" aria-label={t.mapLabel} className="w-full rounded-xl border border-line bg-surface">
        <g className="fill-none stroke-line-strong" strokeWidth="6" strokeLinecap="round">
          <path d="M-10 52 C 80 44, 170 70, 330 58" />
          <path d="M-10 128 C 90 136, 200 112, 330 124" />
          <path d="M70 -10 C 76 60, 62 120, 80 190" />
          <path d="M190 -10 C 182 70, 206 120, 196 190" />
        </g>
        <g className="fill-none stroke-line" strokeWidth="2">
          <path d="M-10 90 L 330 96" />
          <path d="M130 -10 L 138 190" />
          <path d="M255 -10 L 262 190" />
        </g>
        {pins.map((p) => (
          <g key={p.n} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <circle r="9" className={p.resolved ? "fill-ok" : "fill-brand"} />
            <text textAnchor="middle" dy="3.5" className="fill-background font-mono text-[9px] font-semibold">
              {p.n}
            </text>
          </g>
        ))}
      </svg>

      {ordered.length === 0 ? (
        <Empty>{t.panelEmpty}</Empty>
      ) : (
        <ol className="grid gap-2">
          {ordered.map((r, i) => {
            const done = r.status === "RESOLVED"
            return (
              <li key={r.protocol} className="grid gap-2 rounded-xl border border-line bg-surface p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span aria-hidden="true" className={`grid size-5 place-items-center rounded-full font-mono text-[0.6875rem] font-semibold text-background ${done ? "bg-ok" : "bg-brand"}`}>
                    {i + 1}
                  </span>
                  <span className="font-mono text-small font-semibold">{r.protocol}</span>
                  <span className={`ml-auto rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] ${done ? "border-ok text-ok" : "border-brand-line text-brand"}`}>
                    {content.statuses[r.status]}
                  </span>
                </div>
                <p className="text-[0.8125rem] text-muted-foreground">
                  {content.apiTypes[r.type]} · {r.species ? content.species[r.species] : "–"} · {r.allowContact ? t.contact : t.anonymous}
                </p>
                <p className="text-[0.8125rem] break-words text-subtle">
                  {r.address}
                  {r.latitude === null ? ` · ${t.noCoords}` : null}
                </p>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => onAdvance(r.protocol)}
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} justify-self-start`}
                >
                  {done ? t.resolved : t.advance}
                  <span className="sr-only"> · {r.protocol}</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
