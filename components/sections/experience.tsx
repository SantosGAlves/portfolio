import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects } from "@/lib/projects"

// Experiência, tudo à vista (sem "Ver mais"): cargo, empresa, período, selo, contexto, todos os tópicos e os links
// para os estudos de caso (rótulo sempre acima dos links). Gaudium não tem link (NDA).
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
              className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10"
            >
              <div className="grid content-start gap-1.5">
                <p className="font-mono text-meta text-subtle">{item.period}</p>
                <p className="text-h3">{item.company}</p>
                {item.tags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="grid max-w-[44rem] content-start gap-2.5">
                <h3 className="text-body font-semibold">{item.role}</h3>
                <p className="text-small text-muted-foreground">{item.context}</p>
                <ul className="grid gap-2">
                  {item.highlights.map((h) => (
                    <Highlight key={h}>{h}</Highlight>
                  ))}
                </ul>
                {cases.length ? (
                  <div className="grid gap-1">
                    <span className="font-mono text-meta text-subtle">
                      {cases.length === 1 ? experience.caseStudiesLabel.one : experience.caseStudiesLabel.other}
                    </span>
                    <ul className="flex flex-wrap gap-x-5">
                      {cases.map((slug) => (
                        <li key={slug}>
                          <a
                            href={caseStudyPath(locale, slug)}
                            className="group/case inline-block rounded-sm py-2 text-small leading-6 font-semibold text-brand hover:underline hover:underline-offset-4"
                          >
                            {titleOf(slug)}
                            {/* espaço que não quebra: a seta fica junto da última palavra */}
                            {"\u00a0"}
                            <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover/case:translate-x-0.5">
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

function Highlight({ children }: { children: string }) {
  return (
    <li className="flex gap-3 text-muted-foreground">
      {/* Marcador neutro: verde fica só para o que é clicável. */}
      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
      <span>{children}</span>
    </li>
  )
}
