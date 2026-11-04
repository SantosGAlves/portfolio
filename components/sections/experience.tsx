import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects } from "@/lib/projects"

// Linha do tempo: período, empresa e rótulos à esquerda; função, contexto, o que fiz (verbo de ação)
// e os links para os estudos de caso relacionados à direita. Gaudium não tem link (NDA).
export function Experience({ locale }: { locale: Locale }) {
  const { sections, experience } = getContent(locale)
  const projects = getProjects(locale)
  const titleOf = (slug: string) => {
    const meta = projects.find((p) => p.slug === slug)?.meta
    if (!meta) throw new Error(`Experiência: estudo de caso desconhecido "${slug}"`)
    return meta.shortTitle ?? meta.title
  }

  return (
    <Section id={sections.experience.id} eyebrow={sections.experience.eyebrow} title={sections.experience.title}>
      <ol className="grid">
        {experience.items.map((item) => {
          const cases = item.caseStudies ?? []
          return (
            <li
              key={item.company}
              className="grid gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10"
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
              <div className="grid max-w-[44rem] content-start gap-3">
                <h3 className="text-body font-semibold">{item.role}</h3>
                <p className="text-small text-muted-foreground">{item.context}</p>
                <ul className="mt-1 grid gap-2.5">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-muted-foreground">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-brand" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {cases.length ? (
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <span className="font-mono text-meta text-subtle">
                      {cases.length === 1 ? experience.caseStudiesLabel.one : experience.caseStudiesLabel.other}
                    </span>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {cases.map((slug) => (
                        <li key={slug}>
                          <a
                            href={caseStudyPath(locale, slug)}
                            className="group/case rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"
                          >
                            {titleOf(slug)}
                            <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover/case:translate-x-0.5">
                              →
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
