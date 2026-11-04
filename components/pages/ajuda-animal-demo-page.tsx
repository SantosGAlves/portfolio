import { AjudaAnimalDemoLoader } from "@/components/demos/ajuda-animal/loader"
import { getAjudaAnimalContent } from "@/lib/demos"
import type { Locale } from "@/lib/i18n"
import { DemoPageShell } from "./demo-page-shell"

// Página da demo do Ajuda Animal (/demos/ajuda-animal e /en/demos/ajuda-animal).
// O código é privado: no lugar do botão do GitHub, a página mostra a nota do estudo de caso.
export function AjudaAnimalDemoPage({ locale }: { locale: Locale }) {
  const content = getAjudaAnimalContent(locale)
  return (
    <DemoPageShell locale={locale} slug="ajuda-animal" page={content.page}>
      <AjudaAnimalDemoLoader content={content} />
    </DemoPageShell>
  )
}
