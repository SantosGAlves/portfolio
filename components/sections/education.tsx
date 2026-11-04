import type { ReactNode } from "react"
import { Section } from "@/components/layout/section"
import { More } from "@/components/ui/more"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects } from "@/lib/projects"

// "Formação e competências", compacta: uma linha para a formação (com o TCC), uma para os idiomas e uma para
// "Como eu trabalho". Os níveis dos idiomas e cada qualidade, com a prova e os links, ficam em "Ver mais".
export function Education({ locale }: { locale: Locale }) {
  const { sections, education, ui } = getContent(locale)
  const { capstone } = education
  const projects = getProjects(locale)
  const titleOf = (slug: string) => {
    const meta = projects.find((p) => p.slug === slug)?.meta
    if (!meta) throw new Error(`Formação: estudo de caso desconhecido "${slug}"`)
    return meta.shortTitle ?? meta.title
  }
  const link =
    "group/link inline-flex min-h-8 items-center rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"
  const arrow = (char: string) => (
    <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
      {char}
    </span>
  )

  return (
    <Section id={sections.education.id} eyebrow={sections.education.eyebrow} title={sections.education.title}>
      <dl className="grid border-t border-line">
        <Row label={education.formationTitle}>
          <p className="text-foreground">
            {education.degree} · <span className="text-muted-foreground">{education.school} · {education.period}</span>
          </p>
          <p className="text-small text-muted-foreground">
            <span className="font-mono text-meta text-subtle">{capstone.label}</span> · {capstone.title}: {capstone.text}{" "}
            <a href={caseStudyPath(locale, capstone.slug)} className={link}>
              {capstone.link}
              {arrow("→")}
            </a>
          </p>
        </Row>

        <Row label={education.languagesTitle}>
          <p className="text-foreground">{education.languages.map((l) => l.name).join(" · ")}</p>
          <More more={ui.more} less={ui.less}>
            <dl className="grid gap-2">
              {education.languages.map((lang) => (
                <div key={lang.name} className="grid gap-x-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <dt className="font-semibold text-foreground">{lang.name}</dt>
                  <dd className="text-muted-foreground">{lang.level}</dd>
                </div>
              ))}
            </dl>
          </More>
        </Row>

        <Row label={education.workTitle}>
          <p className="text-foreground">{education.work.map((t) => t.label).join(" · ")}</p>
          <More more={ui.more} less={ui.less}>
            <ul className="grid gap-4">
              {education.work.map((trait) => (
                <li key={trait.label} className="grid gap-1 border-t border-line pt-3 first:border-t-0 first:pt-0">
                  <p className="font-semibold text-foreground">{trait.label}</p>
                  <p className="text-muted-foreground">{trait.text}</p>
                  <ul className="flex flex-wrap gap-x-5">
                    {(trait.cases ?? []).map((slug) => (
                      <li key={slug}>
                        <a href={caseStudyPath(locale, slug)} className={link}>
                          {titleOf(slug)}
                          {arrow("→")}
                        </a>
                      </li>
                    ))}
                    {(trait.links ?? []).map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                          {l.label}
                          {arrow("↗")}
                          <span className="sr-only"> {ui.opensInNewTab}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </More>
        </Row>
      </dl>
    </Section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-1 border-b border-line py-4 md:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="font-mono text-meta text-subtle md:pt-1">{label}</dt>
      <dd className="grid content-start gap-1">{children}</dd>
    </div>
  )
}
