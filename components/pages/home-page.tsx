import { Section } from "@/components/layout/section"
import { Hero } from "@/components/sections/hero"
import { Badge } from "@/components/ui/badge"
import type { SectionKey } from "@/content/types"
import { getContent, type Locale } from "@/lib/i18n"

// Ordem das seções da página inicial. O conteúdo de cada uma entra na Fase 3.
const order: SectionKey[] = ["projects", "build", "experience", "education", "contact"]

export function HomePage({ locale }: { locale: Locale }) {
  const { sections, ui } = getContent(locale)

  return (
    <>
      <Hero locale={locale} />
      {order.map((key) => (
        <Section key={key} id={sections[key].id} eyebrow={sections[key].eyebrow} title={sections[key].title}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{ui.inProgress}</Badge>
            <p className="text-small text-subtle">{ui.sectionPlaceholder}</p>
          </div>
        </Section>
      ))}
    </>
  )
}
