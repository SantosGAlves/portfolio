import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath } from "@/lib/projects"

// Linha do tempo enxuta: período e empresa à esquerda, função e conquistas à direita.
export function Experience({ locale }: { locale: Locale }) {
  const { sections, experience } = getContent(locale)

  return (
    <Section id={sections.experience.id} eyebrow={sections.experience.eyebrow} title={sections.experience.title}>
      <ol className="grid">
        {experience.items.map((item) => (
          <li
            key={item.company}
            className="grid gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[15rem_1fr] md:gap-10"
          >
            <div className="grid content-start gap-2">
              <p className="font-mono text-meta text-subtle">{item.period}</p>
              <p className="text-h3">{item.company}</p>
              {item.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="brand">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="grid content-start gap-3">
              <h3 className="text-body font-semibold">{item.role}</h3>
              <p className="text-small text-muted-foreground">{item.context}</p>
              <ul className="mt-1 grid gap-2">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-muted-foreground">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-brand" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {item.caseStudy ? (
                <a
                  href={caseStudyPath(locale, item.caseStudy)}
                  className="mt-1 inline-flex items-center gap-1.5 justify-self-start rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"
                >
                  {experience.caseStudyLink}
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
