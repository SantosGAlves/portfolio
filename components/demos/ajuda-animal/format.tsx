import { Fragment, type ReactNode } from "react"

// Formatação de mensagem do WhatsApp: *negrito*, _itálico_ (um dentro do outro) e quebras de linha.
const token = /(\*[^*\n]+\*|_[^_\n]+_)/

function inline(text: string, key: string): ReactNode[] {
  return text.split(token).map((part, i) => {
    const k = `${key}-${i}`
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <strong key={k}>{inline(part.slice(1, -1), k)}</strong>
    if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) return <em key={k}>{inline(part.slice(1, -1), k)}</em>
    return <Fragment key={k}>{part}</Fragment>
  })
}

export function WhatsAppText({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {inline(line, String(i))}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  )
}
