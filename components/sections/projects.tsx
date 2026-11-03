import { ProjectArt } from "@/components/art/project-art"
import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects, type Project } from "@/lib/projects"

// Projeto principal em largura total; os demais lado a lado; "planned" vira uma faixa discreta.
export function Projects({ locale }: { locale: Locale }) {
  const { sections, projects: copy } = getContent(locale)
  const all = getProjects(locale)
  const featured = all.filter((p) => p.meta.featured && p.meta.status !== "planned")
  const rest = all.filter((p) => !p.meta.featured && p.meta.status !== "planned")
  const planned = all.filter((p) => p.meta.status === "planned")

  return (
    <Section id={sections.projects.id} eyebrow={sections.projects.eyebrow} title={sections.projects.title} intro={copy.intro}>
      <div className="grid gap-5">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} featured />
        ))}
        {rest.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} locale={locale} />
            ))}
          </div>
        ) : null}
        {planned.map((p) => (
          <div
            key={p.slug}
            lang={p.fallback ? p.contentLocale : undefined}
            className="grid gap-x-8 gap-y-2 rounded-card border border-dashed border-line-strong p-5 sm:grid-cols-[auto_1fr] sm:items-baseline sm:p-6"
          >
            <p className="font-mono text-meta text-brand">
              {copy.plannedLabel} · {copy.status.planned}
            </p>
            <p className="text-small text-muted-foreground">{p.meta.summary}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function ProjectCard({ project, locale, featured = false }: { project: Project; locale: Locale; featured?: boolean }) {
  const { projects: copy } = getContent(locale)
  const { meta, slug, fallback, contentLocale } = project
  const titleId = `projeto-${slug}`

  return (
    <article
      aria-labelledby={titleId}
      lang={fallback ? contentLocale : undefined}
      className="group/card relative grid overflow-hidden rounded-card border border-line bg-surface transition-colors duration-300 hover:border-line-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-brand"
    >
      <ProjectArt
        art={meta.art}
        className={featured ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]" : "aspect-[16/10]"}
      />
      <div className={`grid content-start gap-3 border-t border-line ${featured ? "p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:gap-x-12" : "p-5 sm:p-6"}`}>
        <div className="grid gap-3">
          <p className="flex flex-wrap gap-x-2 font-mono text-meta">
            <span className="text-brand">{meta.kind}</span>
            <span className="text-subtle">· {copy.status[meta.status]}</span>
          </p>
          <h3 id={titleId} className={featured ? "text-h2" : "text-h3"}>
            {meta.title}
          </h3>
          <p className="max-w-[62ch] text-muted-foreground">{meta.summary}</p>
          {featured && meta.stack.length ? (
            <p className="font-mono text-meta text-subtle">{meta.stack.join(" · ")}</p>
          ) : null}
        </div>
        <a
          href={caseStudyPath(locale, slug)}
          hrefLang={fallback ? contentLocale : undefined}
          className="mt-1 inline-flex items-center gap-1.5 self-end justify-self-start text-small font-semibold text-brand outline-none after:absolute after:inset-0 after:content-['']"
        >
          {fallback ? copy.caseStudyFallbackLink : copy.caseStudyLink}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover/card:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </article>
  )
}
