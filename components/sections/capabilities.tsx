import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"

// "O que eu faço": quatro áreas curtas, gerais, sem ligar a projetos específicos
// (as tecnologias ficam na seção "Tecnologias"; as provas, nos estudos de caso).
export function Capabilities({ locale }: { locale: Locale }) {
  const { sections, build } = getContent(locale)

  return (
    <Section id={sections.build.id} eyebrow={sections.build.eyebrow} title={sections.build.title} intro={build.intro}>
      <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {build.areas.map((area, i) => (
          <li key={area.title} className="grid grid-rows-[auto_auto_1fr_auto] gap-3 rounded-card border border-line bg-surface p-5 sm:p-6">
            <span className="font-mono text-meta text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-h3">{area.title}</h3>
            <p className="text-muted-foreground">{area.text}</p>
            <p className="mt-2 border-t border-line pt-4 font-mono text-meta text-muted-foreground">
              {area.items.map((item, k) => (
                <span key={item}>
                  {k ? " · " : null}
                  <span className="whitespace-nowrap">{item}</span>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
