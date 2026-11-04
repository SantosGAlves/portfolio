import Image from "next/image"
import { ProjectArt } from "@/components/art/project-art"
import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects, hasCaseStudy, type Project } from "@/lib/projects"

// Hierarquia: o primeiro destaque em largura total, os outros destaques em duas
// colunas, os secundários em cards menores sem imagem e, por fim, uma lista
// compacta de repositórios ("Mais no GitHub"). "planned" vira uma faixa discreta.
export function Projects({ locale }: { locale: Locale }) {
  const { sections, projects: copy, profile, ui } = getContent(locale)
  const all = getProjects(locale)
  const active = all.filter((p) => p.meta.status !== "planned")
  const [lead, ...featured] = active.filter((p) => p.meta.tier === "featured")
  const secondary = active.filter((p) => p.meta.tier === "secondary")
  const planned = all.filter((p) => p.meta.status === "planned")

  return (
    <Section id={sections.projects.id} eyebrow={sections.projects.eyebrow} title={sections.projects.title} intro={copy.intro}>
      <div className="grid gap-5">
        {lead ? <FeaturedCard project={lead} locale={locale} lead /> : null}
        {featured.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((p) => (
              <FeaturedCard key={p.slug} project={p} locale={locale} />
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

      {secondary.length ? (
        <div className="mt-14 grid gap-5">
          <h3 className="eyebrow">{copy.secondaryTitle}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {secondary.map((p) => (
              <SecondaryCard key={p.slug} project={p} locale={locale} />
            ))}
          </div>
        </div>
      ) : null}

      {copy.more.items.length ? (
        <div className="mt-14 grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="eyebrow">{copy.more.title}</h3>
            <ExternalLink href={profile.links.github} newTab={ui.opensInNewTab} className="text-small font-semibold text-brand hover:underline hover:underline-offset-4">
              {copy.more.allLink}
            </ExternalLink>
          </div>
          <ul className="grid border-t border-line">
            {copy.more.items.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/more grid gap-1 rounded-sm py-4 md:grid-cols-[15rem_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                >
                  <span className="font-semibold text-foreground transition-colors group-hover/more:text-brand">
                    {item.title}
                    <span className="sr-only"> {ui.opensInNewTab}</span>
                  </span>
                  <span className="text-small text-muted-foreground">{item.text}</span>
                  <span className="font-mono text-meta text-subtle">
                    {item.stack}
                    <span aria-hidden="true" className="ml-2 text-brand">
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  )
}

/** Link externo: nova aba, aviso para leitores de tela e seta ↗. */
function ExternalLink({
  href,
  newTab,
  className,
  children,
}: {
  href: string
  newTab: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span aria-hidden="true" className="ml-1.5 inline-block">
        ↗
      </span>
      <span className="sr-only"> {newTab}</span>
    </a>
  )
}

/** Selo discreto nos projetos com demo interativa (no próprio caso ou ao vivo). */
function DemoBadge({ project, label }: { project: Project; label: string }) {
  const { meta } = project
  if (!meta.demo && !meta.liveEmbed) return null
  return <span className="rounded-full border border-line-strong px-2 leading-5 text-muted-foreground">{label}</span>
}

const cardShell =
  "group/card relative overflow-hidden rounded-card border border-line bg-surface transition-colors duration-300 hover:border-line-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-brand"

function FeaturedCard({ project, locale, lead = false }: { project: Project; locale: Locale; lead?: boolean }) {
  const { projects: copy, ui } = getContent(locale)
  const { meta, slug, fallback, contentLocale } = project
  const titleId = `projeto-${slug}`
  const cover = meta.media.cover
  const page = hasCaseStudy(project)
  const media = lead ? "aspect-[16/9] lg:aspect-[16/7]" : "aspect-[16/10]"

  return (
    <article aria-labelledby={titleId} lang={fallback ? contentLocale : undefined} className={`grid grid-rows-[auto_1fr] ${cardShell}`}>
      {cover?.fit === "frame" ? (
        // Captura de tela em moldura: a tela "sobe" do fundo e é cortada embaixo.
        <div className={`relative overflow-hidden bg-surface-2 px-4 pt-4 sm:px-8 sm:pt-8 ${lead ? "lg:px-14 lg:pt-10" : ""} ${media}`}>
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes={lead ? "(min-width: 1280px) 1100px, 92vw" : "(min-width: 768px) 45vw, 92vw"}
            className="h-auto w-full rounded-t-lg border border-b-0 border-line-strong transition-transform duration-500 ease-out group-hover/card:-translate-y-1 motion-reduce:transition-none"
          />
        </div>
      ) : cover ? (
        <div className={`relative overflow-hidden bg-surface-2 ${media}`}>
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={lead ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.02] motion-reduce:transition-none"
          />
        </div>
      ) : (
        <ProjectArt art={meta.art} className={lead ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]" : media} />
      )}
      <div className={`grid content-start gap-3 border-t border-line ${lead ? "p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:gap-x-12" : "p-5 sm:p-6"}`}>
        <div className="grid gap-3">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-meta">
            <span className="text-brand">{meta.kind}</span>
            <span className="text-subtle">· {copy.status[meta.status]}</span>
            <DemoBadge project={project} label={copy.demoBadge} />
          </p>
          <h3 id={titleId} className={lead ? "text-h2" : "text-h3"}>
            {meta.title}
          </h3>
          <p className="max-w-[62ch] text-muted-foreground">{meta.summary}</p>
          {meta.stack.length ? <p className="font-mono text-meta text-subtle">{meta.stack.join(" · ")}</p> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 self-end lg:justify-end">
          {page ? (
            <a
              href={caseStudyPath(locale, slug)}
              hrefLang={fallback ? contentLocale : undefined}
              className="inline-flex items-center gap-1.5 text-small font-semibold text-brand outline-none after:absolute after:inset-0 after:content-['']"
            >
              {fallback ? copy.caseStudyFallbackLink : copy.caseStudyLink}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover/card:translate-x-0.5">
                →
              </span>
            </a>
          ) : null}
          {meta.repo ? (
            <ExternalLink
              href={meta.repo}
              newTab={ui.opensInNewTab}
              className={
                page
                  ? "relative z-10 text-small text-muted-foreground transition-colors hover:text-foreground"
                  : "text-small font-semibold text-brand outline-none after:absolute after:inset-0 after:content-['']"
              }
            >
              {copy.repoLink}
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function SecondaryCard({ project, locale }: { project: Project; locale: Locale }) {
  const { projects: copy, ui } = getContent(locale)
  const { meta, slug, fallback, contentLocale } = project
  const page = hasCaseStudy(project)
  const stretched = "outline-none after:absolute after:inset-0 after:content-['']"

  return (
    <article
      aria-labelledby={`projeto-${slug}`}
      lang={fallback ? contentLocale : undefined}
      className={`grid content-start gap-3 p-5 ${cardShell}`}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-meta">
        <span className="text-brand">{meta.kind}</span>
        <span className="text-subtle">· {copy.status[meta.status]}</span>
        <DemoBadge project={project} label={copy.demoBadge} />
      </p>
      <h4 id={`projeto-${slug}`} className="text-body font-semibold">
        {meta.title}
      </h4>
      <p className="text-small text-muted-foreground">{meta.summary}</p>
      {meta.stack.length ? <p className="font-mono text-meta text-subtle">{meta.stack.join(" · ")}</p> : null}
      {page ? (
        <a
          href={caseStudyPath(locale, slug)}
          hrefLang={fallback ? contentLocale : undefined}
          className={`mt-1 inline-flex items-center gap-1.5 justify-self-start text-small font-semibold text-brand ${stretched}`}
        >
          {fallback ? copy.caseStudyFallbackLink : copy.caseStudyLink}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover/card:translate-x-0.5">
            →
          </span>
        </a>
      ) : meta.repo ? (
        <ExternalLink
          href={meta.repo}
          newTab={ui.opensInNewTab}
          className={`mt-1 justify-self-start text-small font-semibold text-brand ${stretched}`}
        >
          {copy.repoLink}
        </ExternalLink>
      ) : null}
    </article>
  )
}
