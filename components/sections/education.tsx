import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath } from "@/lib/projects"

export function Education({ locale }: { locale: Locale }) {
  const { sections, education } = getContent(locale)
  const { capstone } = education

  return (
    <Section id={sections.education.id} eyebrow={sections.education.eyebrow} title={sections.education.title}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid content-start gap-2 rounded-card border border-line bg-surface p-5 sm:p-6">
          <p className="font-mono text-meta text-subtle">{education.period}</p>
          <h3 className="text-h3">{education.degree}</h3>
          <p className="text-muted-foreground">
            {education.school} · {education.note}
          </p>
        </div>
        <div className="group/card relative grid content-start gap-2 rounded-card border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-brand sm:p-6">
          <p className="font-mono text-meta text-brand">{capstone.label}</p>
          <h3 className="text-h3">{capstone.title}</h3>
          <p className="text-muted-foreground">{capstone.text}</p>
          <a
            href={caseStudyPath(locale, capstone.slug)}
            className="mt-2 inline-flex items-center gap-1.5 justify-self-start text-small font-semibold text-brand outline-none after:absolute after:inset-0 after:content-['']"
          >
            {capstone.link}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover/card:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </Section>
  )
}
