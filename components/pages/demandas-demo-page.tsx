import { DemandasDemoLoader } from "@/components/demos/demandas/loader"
import { getDemandasContent } from "@/lib/demos"
import type { Locale } from "@/lib/i18n"
import { DemoPageShell } from "./demo-page-shell"

// Página da demo da plataforma de demandas (/demos/demandas e /en/demos/demandas).
export function DemandasDemoPage({ locale }: { locale: Locale }) {
  const content = getDemandasContent(locale)
  return (
    <DemoPageShell locale={locale} slug="demandas" page={content.page}>
      <DemandasDemoLoader content={content} />
    </DemoPageShell>
  )
}
