"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import { InlineScript } from "@/components/inline-script"
import type { SignatureContent } from "@/content/types"
import { afterLoad } from "@/lib/after-load"
import { createSignaturePlayer, type SignaturePlayer } from "@/lib/signature-player"
import s from "./signature.module.css"

type ScenarioKey = "known" | "unknown"

// Liga o modo animado antes da primeira pintura (sem flash do estado final),
// a menos que a pessoa prefira movimento reduzido.
const BOOT = `(function(){try{var f=document.currentScript.previousElementSibling;if(!f||matchMedia("(prefers-reduced-motion: reduce)").matches)return;f.setAttribute("data-live","");var m=f.querySelector("[data-msg]");if(m)m.setAttribute("data-idle","")}catch(e){}})()`

const CALL_HEAD = "buscar_bateria({"

// buttonClassName vem do servidor (buttonVariants), para o cn e o Radix não irem ao bundle do cliente.
export function Signature({ content, buttonClassName }: { content: SignatureContent; buttonClassName: string }) {
  const [scenario, setScenario] = useState<ScenarioKey>("known")
  const rootRef = useRef<HTMLElement>(null)
  const playerRef = useRef<SignaturePlayer | null>(null)
  const userStarted = useRef(false)
  const captionId = useId()
  const summaryId = useId()
  const toggleId = useId()
  const sc = content.scenarios[scenario]

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let player: SignaturePlayer | null = null
    const create = () => {
      player = createSignaturePlayer(root)
      playerRef.current = player
      if (userStarted.current) player.replay()
    }
    // Primeira vez: espera o load. Depois de trocar o cenário: começa na hora.
    let cancel = () => {}
    if (userStarted.current) create()
    else cancel = afterLoad(create)
    return () => {
      cancel()
      player?.destroy()
      playerRef.current = null
    }
  }, [scenario])

  return (
    <div className="min-w-0">
      <figure
        ref={rootRef}
        className={s.sig}
        aria-labelledby={captionId}
        aria-describedby={summaryId}
        suppressHydrationWarning
      >
        <div className={s.bar}>
          <span className="font-mono text-meta">{content.title}</span>
          <span className={s.chip}>{content.badge}</span>
        </div>

        <div key={scenario} className={s.body}>
          <div>
            <p className={s.label}>{content.labels.message}</p>
            <p className={s.msg} data-msg suppressHydrationWarning>
              {sc.message.map((part, i) =>
                typeof part === "string" ? (
                  <span key={i} data-seg>
                    <span data-v />
                    <span data-g>{part}</span>
                  </span>
                ) : (
                  <mark key={i} data-seg data-k={part.field} tabIndex={0}>
                    <span data-v />
                    <span data-g>{part.text}</span>
                  </mark>
                ),
              )}
            </p>
          </div>

          <div>
            <p className={s.label}>{content.labels.call}</p>
            <pre className={s.call}>
              <CodeLine n={CALL_HEAD.length}>
                <span className={s.fn}>buscar_bateria</span>({"{"}
              </CodeLine>
              {sc.call.map((arg, i) => {
                const comma = i < sc.call.length - 1 ? "," : ""
                return (
                  <CodeLine
                    key={arg.field}
                    n={2 + arg.field.length + 2 + arg.value.length + comma.length}
                    className={s.field}
                    field={arg.field}
                  >
                    {arg.field}: <b>{arg.value}</b>
                    {comma}
                  </CodeLine>
                )
              })}
              <CodeLine n={2}>{"})"}</CodeLine>
            </pre>
          </div>

          <div>
            <p className={s.label}>{content.labels.trace}</p>
            <ol className={s.trace}>
              {sc.trace.map((step) => (
                <li key={step.label} className={s.step} data-step data-final={step.state}>
                  <span className={s.icon} aria-hidden="true" />
                  <span>{step.label}</span>
                  <span className={s.status}>{step.status}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={s.replyWrap}>
            <p className={s.reply} data-reply>
              <span className={s.dots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={s.replyText}>{sc.reply}</span>
            </p>
          </div>
        </div>

        <div className={s.foot}>
          <label className={s.switch} htmlFor={toggleId}>
            <input
              id={toggleId}
              type="checkbox"
              checked={scenario === "unknown"}
              onChange={(e) => {
                userStarted.current = true
                setScenario(e.target.checked ? "unknown" : "known")
              }}
            />
            {content.unknownToggle}
          </label>
          <button
            type="button"
            className={buttonClassName}
            onClick={() => {
              userStarted.current = true
              playerRef.current?.replay()
            }}
          >
            {content.replay}
          </button>
        </div>
        <p id={summaryId} className="sr-only">
          {content.summary}
        </p>
      </figure>
      <InlineScript html={BOOT} />
      <p id={captionId} className="mt-3 font-mono text-meta text-subtle">
        {content.caption}
      </p>
    </div>
  )
}

function CodeLine({
  n,
  field,
  className,
  children,
}: {
  n: number
  field?: string
  className?: string
  children: React.ReactNode
}) {
  const style = { "--n": n, "--d": `${n * 11}ms` } as CSSProperties
  return (
    <span className={`${s.line} ${className ?? ""}`} data-line data-n={n} data-k={field} style={style}>
      {children}
    </span>
  )
}
