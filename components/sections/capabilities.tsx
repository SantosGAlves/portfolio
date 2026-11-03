import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"

// "O que eu construo": três áreas com o mesmo peso, sem barras de nível nem parede de badges.
export function Capabilities({ locale }: { locale: Locale }) {
  const { sections, build } = getContent(locale)
  const { languages, workflow } = build

  return (
    <Section id={sections.build.id} eyebrow={sections.build.eyebrow} title={sections.build.title} intro={build.intro}>
      <ol className="grid gap-5 md:grid-cols-3">
        {build.areas.map((area, i) => (
          <li key={area.title} className="grid content-start gap-4 rounded-card border border-line bg-surface p-5 sm:p-6">
            <span className="font-mono text-meta text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-h3">{area.title}</h3>
            <p className="text-muted-foreground">{area.text}</p>
            <div className="grid gap-2 border-t border-line pt-4">
              <p className="font-mono text-meta text-subtle">{build.includesLabel}</p>
              <ul className="grid gap-1.5 text-small">
                {area.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-mono text-meta text-muted-foreground">
              <span className="sr-only">{build.toolsLabel}: </span>
              {area.tools.join(" · ")}
            </p>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-2 md:gap-12">
        <div className="grid content-start gap-4">
          <h3 className="eyebrow">{languages.title}</h3>
          <dl className="grid gap-3">
            <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-mono text-meta text-subtle sm:pt-1">{languages.primaryLabel}</dt>
              <dd>
                <span className="text-h3">{languages.primary.name}</span>
                <span className="text-muted-foreground"> · {languages.primary.note}</span>
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-mono text-meta text-subtle sm:pt-0.5">{languages.otherLabel}</dt>
              <dd className="text-muted-foreground">{languages.other.join(", ")}</dd>
            </div>
          </dl>
        </div>
        <div className="grid content-start gap-4">
          <h3 className="eyebrow">{workflow.title}</h3>
          <p className="max-w-[52ch] text-muted-foreground">{workflow.text}</p>
        </div>
      </div>
    </Section>
  )
}
