import type { MDXComponents } from "mdx/types"
import type { ComponentProps } from "react"
import { Architecture } from "@/components/case-study/architecture"
import { Chat, ChatNote, DataTable, Decision, Flow, Gallery, Message, Metric, Metrics, PaperFigure, Shot } from "@/components/case-study/blocks"

// Estilo do texto dos estudos de caso (content/<idioma>/projects/*.mdx)
// e os blocos que podem ser usados neles sem import.

/** id estável a partir do texto do título, para links diretos às seções. */
function slugify(children: unknown): string | undefined {
  if (typeof children !== "string") return undefined
  return children
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(children)} className="mt-14 mb-4 scroll-mt-24 text-h2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 mb-2 text-h3">{children}</h3>,
  p: (props) => <p className="my-4 text-muted-foreground" {...props} />,
  ul: (props) => <ul className="my-4 grid list-disc gap-2 pl-5 text-muted-foreground marker:text-subtle" {...props} />,
  ol: (props) => <ol className="my-4 grid list-decimal gap-2 pl-5 text-muted-foreground marker:text-subtle" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className="text-brand underline decoration-brand-line underline-offset-4 hover:decoration-brand"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    )
  },
  code: (props) => (
    <code className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground" {...props} />
  ),
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-line-strong pl-4 text-foreground" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
  Flow,
  Architecture,
  Decision,
  Metrics,
  Metric,
  Chat,
  Message,
  ChatNote,
  Gallery,
  Shot,
  DataTable,
  PaperFigure,
}

export function useMDXComponents(): MDXComponents {
  return components
}
