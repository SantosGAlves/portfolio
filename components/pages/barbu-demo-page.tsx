import { BarbuDemoLoader } from "@/components/demos/barbu/loader"
import { getBarbuContent } from "@/lib/demos"
import type { Locale } from "@/lib/i18n"
import { DemoPageShell } from "./demo-page-shell"

// Página da demo do Barbú (/demos/barbu e /en/demos/barbu).
export function BarbuDemoPage({ locale }: { locale: Locale }) {
  const content = getBarbuContent(locale)
  return (
    <DemoPageShell locale={locale} slug="barbu" page={content.page}>
      <BarbuDemoLoader content={content} />
    </DemoPageShell>
  )
}
