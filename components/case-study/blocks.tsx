import type { ReactNode } from "react"

// Blocos disponíveis dentro dos .mdx dos estudos de caso (sem import:
// registrados em mdx-components.tsx). Todos são componentes de servidor.

type FlowStep = { title: string; detail?: string; alt?: boolean }

/**
 * Diagrama de fluxo em etapas: horizontal a partir de 1024px, vertical no celular.
 * `alt: true` marca um caminho alternativo (borda tracejada), como um fallback;
 * antes dele aparece `altLabel` ("ou") em vez da seta.
 * No desktop o diagrama passa um pouco da coluna de texto para caber as etapas.
 */
export function Flow({ steps, caption, altLabel = "/" }: { steps: FlowStep[]; caption?: string; altLabel?: string }) {
  return (
    <figure className="my-10 grid gap-3 lg:-mx-24">
      <ol className="grid gap-2 lg:auto-cols-fr lg:grid-flow-col lg:gap-0">
        {steps.map((step, i) => (
          <li key={step.title} className="relative grid lg:grid-cols-[1fr_1.5rem]">
            <div
              className={`grid content-start gap-1.5 rounded-xl border bg-surface p-4 ${
                step.alt ? "border-dashed border-brand-line" : "border-line"
              }`}
            >
              <span className="font-mono text-meta text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-small font-semibold text-foreground">{step.title}</span>
              {step.detail ? <span className="text-[0.8125rem] leading-snug text-muted-foreground">{step.detail}</span> : null}
            </div>
            {i < steps.length - 1 ? (
              steps[i + 1].alt ? (
                <span className="grid h-6 place-items-center font-mono text-meta text-brand lg:h-auto">{altLabel}</span>
              ) : (
                <span aria-hidden="true" className="grid h-5 place-items-center font-mono text-subtle lg:h-auto">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </span>
              )
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption className="font-mono text-meta text-subtle">{caption}</figcaption> : null}
    </figure>
  )
}

/** Uma decisão de projeto: o que foi escolhido, por quê e o que se perdeu. */
export function Decision({ title, tradeoff, children }: { title: string; tradeoff?: string; children: ReactNode }) {
  return (
    <section className="my-5 grid gap-2 rounded-xl border border-line bg-surface p-5">
      <h3 className="text-h3">{title}</h3>
      <div className="grid gap-3 text-muted-foreground [&_p]:m-0">{children}</div>
      {tradeoff ? (
        <p className="mt-1 border-t border-line pt-3 text-small text-muted-foreground">
          <span className="mr-2 font-mono text-meta text-brand">trade-off</span>
          {tradeoff}
        </p>
      ) : null}
    </section>
  )
}

/** Grade de métricas. Sem número real, use value="[CONFIRMAR]". */
export function Metrics({ children }: { children: ReactNode }) {
  return <dl className="my-6 grid gap-3 sm:grid-cols-3">{children}</dl>
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="grid content-start gap-1 rounded-xl border border-line bg-surface p-4">
      <dt className="order-2 text-small text-muted-foreground">{label}</dt>
      <dd className="order-1 text-h3 text-foreground">{value}</dd>
    </div>
  )
}
