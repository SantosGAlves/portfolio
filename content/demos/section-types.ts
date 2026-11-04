// Textos da seção "Experimente" de cada demo, no estudo de caso (content/<idioma>/demos/<slug>.ts → section).
export type DemoSectionText = {
  /** Selo acima da demo: o que ela é e que os dados são fictícios. */
  badge: string
  /** O que dá para fazer na demo. */
  intro: string
  /** O que é igual ao sistema real e o que é simulado. */
  notesTitle: string
  notes: string[]
}
