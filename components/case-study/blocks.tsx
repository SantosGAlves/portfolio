import Image from "next/image"
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"

// Blocos disponíveis dentro dos .mdx dos estudos de caso (sem import:
// registrados em mdx-components.tsx). Todos são componentes de servidor.

type FlowStep = { title: string; detail?: string; alt?: boolean; accent?: boolean }

/**
 * Diagrama de fluxo em etapas: horizontal a partir de 1024px, vertical no celular.
 * `alt: true` marca um caminho alternativo (borda tracejada), como um fallback;
 * antes dele aparece `altLabel` ("ou") em vez da seta. `accent: true` destaca uma etapa (ex.: o resultado final).
 * No desktop o diagrama passa um pouco da coluna de texto para caber as etapas.
 */
export function Flow({ steps, caption, altLabel = "/" }: { steps: FlowStep[]; caption?: string; altLabel?: string }) {
  return (
    <figure className="my-10 grid gap-3 lg:-mx-24">
      <ol className="grid gap-2 lg:auto-cols-fr lg:grid-flow-col lg:gap-0">
        {steps.map((step, i) => (
          <li key={step.title} className="relative grid lg:grid-cols-[1fr_1.5rem]">
            <div
              className={`grid content-start gap-1.5 rounded-xl border p-4 ${steps.length > 5 ? "lg:p-3.5" : ""} ${
                step.accent
                  ? "border-brand-line bg-brand-soft"
                  : step.alt
                    ? "border-dashed border-brand-line bg-surface"
                    : "border-line bg-surface"
              }`}
            >
              {/* Na etapa em destaque o fundo é verde: o cinza "subtle" ficava em 4,2:1 (abaixo do AA). */}
              <span className={`font-mono text-meta ${step.accent ? "text-muted-foreground" : "text-subtle"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-small font-semibold ${step.accent ? "text-brand" : "text-foreground"}`}>{step.title}</span>
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

type ChatLabels = { customer: string; agent: string }

/**
 * Conversa de exemplo no formato de chat, com selo (ex.: "exemplo ilustrativo").
 * Filhos: <Message from="customer|agent"> e <ChatNote label="...">.
 * Cliente à direita, agente à esquerda; o nome de quem fala fica só para leitores de tela.
 */
export function Chat({
  title,
  badge,
  customer,
  agent,
  children,
}: {
  title: string
  badge: string
  customer: string
  agent: string
  children: ReactNode
}) {
  const labels: ChatLabels = { customer, agent }
  const items = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => cloneElement(child as ReactElement<{ labels?: ChatLabels }>, { labels }))

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3">
        <span className="font-mono text-meta text-foreground">{title}</span>
        <span className="rounded-full border border-brand-line bg-brand-soft px-2.5 py-0.5 font-mono text-meta text-brand">
          {badge}
        </span>
      </figcaption>
      <ol className="grid gap-2 p-3 sm:p-4">{items}</ol>
    </figure>
  )
}

export function Message({
  from,
  labels,
  children,
}: {
  from: "customer" | "agent"
  labels?: ChatLabels
  children: ReactNode
}) {
  const customer = from === "customer"
  return (
    <li
      className={`grid max-w-[88%] gap-2 rounded-2xl border px-3.5 py-2.5 text-small text-foreground sm:max-w-[80%] [&_ol]:my-0 [&_ol]:gap-1 [&_ol]:text-foreground [&_p]:m-0 [&_p]:text-foreground ${
        customer
          ? "justify-self-end rounded-br-md border-brand-line bg-brand-soft"
          : "justify-self-start rounded-bl-md border-line bg-surface-2"
      }`}
    >
      {labels ? <span className="sr-only">{customer ? labels.customer : labels.agent}:</span> : null}
      {children}
    </li>
  )
}

/** Linha de sistema dentro do chat: o que acontece nos bastidores. */
export function ChatNote({ label, children }: { label: string; labels?: ChatLabels; children: ReactNode }) {
  return (
    <li className="mt-2 grid gap-1 rounded-lg border border-dashed border-line-strong px-3.5 py-2.5 text-small text-muted-foreground [&_code]:text-[0.8125rem] [&_p]:m-0">
      <span className="font-mono text-meta text-brand">{label}</span>
      <div>{children}</div>
    </li>
  )
}

/** Moldura para mídia larga (vídeo ou imagem), um pouco além da coluna de texto no desktop. */
export function MediaFigure({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-10 grid gap-3 lg:-mx-24">
      {children}
      {caption ? <figcaption className="font-mono text-meta text-subtle">{caption}</figcaption> : null}
    </figure>
  )
}

/** Grade de capturas de tela; cada uma é um <Shot>. */
export function Gallery({ children }: { children: ReactNode }) {
  return <div className="my-10 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:-mx-24">{children}</div>
}

// gallery = dentro de <Gallery>; column = sozinha, na coluna de texto;
// wide = sozinha, passando um pouco da coluna (diagramas largos).
const shotLayouts = {
  gallery: { figure: "", sizes: "(min-width: 1024px) 456px, (min-width: 640px) 50vw, 100vw" },
  column: { figure: "my-10", sizes: "(min-width: 768px) 736px, 100vw" },
  wide: { figure: "my-10 lg:-mx-24", sizes: "(min-width: 1024px) 928px, 100vw" },
}

export function Shot({
  src,
  alt,
  width,
  height,
  caption,
  layout = "gallery",
}: {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  layout?: keyof typeof shotLayouts
}) {
  return (
    <figure className={`grid content-start gap-2.5 ${shotLayouts[layout].figure}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={shotLayouts[layout].sizes}
        className="h-auto w-full rounded-lg border border-line"
      />
      {caption ? <figcaption className="text-small text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  )
}

/**
 * Tabela de dados pequena (o MDX daqui não tem tabelas em Markdown).
 * `highlight` = índice da linha em destaque (ex.: o valor adotado).
 */
export function DataTable({
  caption,
  head,
  rows,
  highlight,
}: {
  caption?: string
  head: string[]
  rows: string[][]
  highlight?: number
}) {
  return (
    <figure className="my-8 grid gap-3">
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full border-collapse text-left text-small">
          <thead className="bg-surface-2">
            <tr>
              {head.map((cell) => (
                <th key={cell} scope="col" className="px-4 py-2.5 font-mono text-meta font-normal text-subtle">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.join("|")} className={`border-t border-line ${i === highlight ? "bg-brand-soft" : ""}`}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-foreground">
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className="px-4 py-2.5 text-muted-foreground">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption className="font-mono text-meta text-subtle">{caption}</figcaption> : null}
    </figure>
  )
}

/**
 * Figura reproduzida de um artigo (gráfico, matriz): cartão claro nos dois temas,
 * porque a imagem original tem fundo branco. Legenda em mono com o rótulo,
 * uma nota (ex.: idioma dos rótulos) e o link para a imagem em tamanho real.
 */
export function PaperFigure({
  src,
  alt,
  width,
  height,
  label,
  caption,
  note,
  fullLabel,
  newTab,
}: {
  src: string
  alt: string
  width: number
  height: number
  label: string
  caption: string
  note?: string
  fullLabel: string
  newTab: string
}) {
  return (
    <figure className="my-10 grid gap-3">
      <div className="rounded-xl border border-line bg-white p-3 sm:p-5">
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 768px) 696px, 92vw" className="h-auto w-full" />
      </div>
      <figcaption className="grid gap-1 font-mono text-meta text-subtle">
        <span>
          <span className="text-brand">{label}</span> · {caption}
        </span>
        <span>
          {note ? `${note} · ` : null}
          <a href={src} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline hover:underline-offset-4">
            {fullLabel}
            <span aria-hidden="true"> ↗</span>
            <span className="sr-only"> {newTab}</span>
          </a>
        </span>
      </figcaption>
    </figure>
  )
}
