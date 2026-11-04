import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects } from "@/lib/projects"

// "Formação e competências": formação (com o TCC) e idiomas lado a lado; depois "Como eu trabalho",
// em que cada qualidade vem com a prova e os links para os casos que a mostram.
export function Education({ locale }: { locale: Locale }) {
  const { sections, education, ui } = getContent(locale)
  const { capstone } = education
  const projects = getProjects(locale)
  const titleOf = (slug: string) => {
    const meta = projects.find((p) => p.slug === slug)?.meta
    if (!meta) throw new Error(`Formação: estudo de caso desconhecido "${slug}"`)
    return meta.shortTitle ?? meta.title
  }
  const link = "group/link rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"

  return (
    <Section id={sections.education.id} eyebrow={sections.education.eyebrow} title={sections.education.title}>
      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="formacao-titulo" className="grid content-start gap-5 rounded-card border border-line bg-surface p-5 sm:p-6">
          <h3 id="formacao-titulo" className="eyebrow">
            {education.formationTitle}
          </h3>
          <div className="grid gap-1.5">
            <p className="text-h3">{education.degree}</p>
            <p className="text-muted-foreground">
              {education.school} · {education.period}
            </p>
          </div>
          <div className="grid gap-1.5 border-t border-line pt-5">
            <p className="font-mono text-meta text-subtle">{capstone.label}</p>
            <p className="font-semibold text-foreground">{capstone.title}</p>
            <p className="text-small text-muted-foreground">{capstone.text}</p>
            <a href={caseStudyPath(locale, capstone.slug)} className={`mt-1 justify-self-start ${link}`}>
              {capstone.link}
              <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </section>

        <section aria-labelledby="idiomas-titulo" className="grid content-start gap-5 rounded-card border border-line bg-surface p-5 sm:p-6">
          <h3 id="idiomas-titulo" className="eyebrow">
            {education.languagesTitle}
          </h3>
          <dl className="grid gap-4">
            {education.languages.map((lang) => (
              <div key={lang.name} className="grid gap-1 border-t border-line pt-4 first:border-t-0 first:pt-0">
                <dt className="font-semibold text-foreground">{lang.name}</dt>
                <dd className="text-muted-foreground">{lang.level}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section aria-labelledby="como-trabalho-titulo" className="grid gap-4">
        <h3 id="como-trabalho-titulo" className="eyebrow">
          {education.workTitle}
        </h3>
        <ul className="grid border-t border-line">
          {education.work.map((trait) => (
            <li key={trait.label} className="grid gap-x-6 gap-y-1.5 border-b border-line py-5 md:grid-cols-[13rem_minmax(0,1fr)]">
              <p className="font-semibold text-foreground">{trait.label}</p>
              <div className="grid gap-2">
                <p className="text-muted-foreground">{trait.text}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {(trait.cases ?? []).map((slug) => (
                    <li key={slug}>
                      <a href={caseStudyPath(locale, slug)} className={link}>
                        {titleOf(slug)}
                        <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                  {(trait.links ?? []).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                        {l.label}
                        <span aria-hidden="true" className="ml-1.5 inline-block">
                          ↗
                        </span>
                        <span className="sr-only"> {ui.opensInNewTab}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Section>
  )
}
