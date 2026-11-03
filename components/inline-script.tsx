// Script inline que roda durante o parse do HTML, antes da primeira pintura.
// No cliente vira text/plain para o React não reexecutar nem avisar em dev.
// Padrão do guia "Preventing flash before hydration" do Next.js.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
