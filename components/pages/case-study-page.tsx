import { notFound } from "next/navigation"
import { ProjectArt } from "@/components/art/project-art"
import { getContent, homePath, type Locale } from "@/lib/i18n"
import { caseStudyPath, getCaseStudy, getNextCaseStudy } from "@/lib/projects"

// Template do estudo de caso. A ordem das seções do texto vem do .mdx:
// contexto e problema → minha função → solução e arquitetura → stack →
// decisões e trade-offs → resultado → aprendizados.
export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getCaseStudy(locale, slug)
  if (!project) notFound()

  const { caseStudy: copy, projects, sections } = getContent(locale)
  const { meta, Body, fallback, contentLocale } = project
  const next = getNextCaseStudy(locale, slug)
  const metaRows = [
    { label: copy.meta.role, value: meta.role },
    { label: copy.meta.period, value: meta.period },
    { label: copy.meta.status, value: projects.status[meta.status] },
    { label: copy.meta.stack, value: meta.stack.join(" · ") },
  ]

  return (
    <article lang={fallback ? contentLocale : undefined} className="container-site pt-8 pb-20 md:pt-12">
      <a
        href={`${homePath(locale)}#${sections.projects.id}`}
        lang={fallback ? locale : undefined}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span>
        {copy.back}
      </a>

      {fallback && copy.fallbackNotice ? (
        <p lang={locale} className="mt-4 rounded-control border border-brand-line bg-brand-soft px-4 py-3 text-small">
          {copy.fallbackNotice}
        </p>
      ) : null}

      <header className="mt-8 grid max-w-4xl gap-5">
        <p className="eyebrow">{meta.kind}</p>
        <h1 className="text-title">{meta.title}</h1>
        <p className="max-w-[60ch] text-role font-normal text-muted-foreground">{meta.summary}</p>
      </header>

      <dl className="mt-10 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {metaRows.map((row) => (
          <div key={row.label} className="grid content-start gap-1 border-line py-4 not-first:border-t sm:not-first:border-t-0 sm:px-5 sm:first:pl-0 sm:even:border-l lg:border-l lg:first:border-l-0">
            <dt className="font-mono text-meta text-subtle">{row.label}</dt>
            <dd className="text-small">{row.value}</dd>
          </div>
        ))}
      </dl>

      <ProjectArt art={meta.art} className="mt-10 aspect-[4/3] rounded-card border border-line sm:aspect-[16/9] lg:aspect-[16/7]" />

      {meta.tldr.length ? (
        <section aria-labelledby="resumo" className="mt-12 grid gap-5 rounded-card border border-line bg-surface p-5 sm:p-7">
          <h2 id="resumo" className="eyebrow">
            {copy.summaryTitle}
          </h2>
          <dl className="grid gap-6 md:grid-cols-3">
            {meta.tldr.map((item) => (
              <div key={item.label} className="grid content-start gap-2">
                <dt className="text-small font-semibold text-foreground">{item.label}</dt>
                <dd className="text-small text-muted-foreground">{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <div className="mx-auto mt-16 max-w-[46rem]">
        <p lang={fallback ? locale : undefined} className="mb-10 font-mono text-meta text-subtle">
          {copy.illustrativeNotice}
        </p>
        <Body />
      </div>

      {next ? (
        <nav aria-label={copy.next} className="mx-auto mt-20 max-w-[46rem] border-t border-line pt-8">
          <a
            href={caseStudyPath(locale, next.slug)}
            lang={next.fallback ? next.contentLocale : undefined}
            className="group/next grid gap-1 rounded-sm"
          >
            <span lang={locale} className="font-mono text-meta text-subtle">
              {copy.next}
            </span>
            <span className="flex items-baseline gap-2 text-h3 transition-colors group-hover/next:text-brand">
              {next.meta.title}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover/next:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        </nav>
      ) : null}
    </article>
  )
}
