import { ProjectArt } from "@/components/art/project-art"
import { Section } from "@/components/layout/section"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getProjects, hasCaseStudy, type Project } from "@/lib/projects"

// Projetos: cards com o mesmo peso, em duas colunas (uma no celular), na ordem de `meta.order`.
// Cada card tem a arte padronizada, o ano, o selo de status, o título, uma frase, até 4 tecnologias e o
// rodapé com "Ver projeto →" e "▶ Testar demo".
// "planned" vira uma faixa discreta. "Outros projetos" é a seção seguinte (OtherProjects).
export function Projects({ locale }: { locale: Locale }) {
  const { sections, projects: copy } = getContent(locale)
  const all = getProjects(locale)
  const featured = all.filter((p) => p.meta.status !== "planned" && p.meta.tier === "featured")
  const planned = all.filter((p) => p.meta.status === "planned")

  return (
    <Section id={sections.projects.id} eyebrow={sections.projects.eyebrow} title={sections.projects.title} intro={copy.intro}>
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} />
        ))}
      </div>

      {planned.length ? (
        <div className="grid gap-5">
          {planned.map((p) => (
            <div
              key={p.slug}
              lang={p.fallback ? p.contentLocale : undefined}
              className="grid gap-x-8 gap-y-2 rounded-card border border-dashed border-line-strong p-5 sm:grid-cols-[auto_1fr] sm:items-baseline sm:p-6"
            >
              <p className="font-mono text-meta text-subtle">
                {copy.plannedLabel} · {copy.status.planned}
              </p>
              <p className="text-small text-muted-foreground">{p.meta.tagline ?? p.meta.summary}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  )
}

// "Outros projetos": lista compacta com ano e uma linha (projetos `secondary` + repositórios do
// site.ts → projects.more) e o link para todos os repositórios.
export function OtherProjects({ locale }: { locale: Locale }) {
  const { sections, projects: copy, profile, ui } = getContent(locale)
  const active = getProjects(locale).filter((p) => p.meta.status !== "planned")

  const others = [
    ...active
      .filter((p) => p.meta.tier === "secondary")
      .map((p) => ({
        title: p.meta.shortTitle ?? p.meta.title,
        year: yearOf(p.meta.period),
        text: p.meta.tagline ?? p.meta.summary,
        href: hasCaseStudy(p) ? caseStudyPath(locale, p.slug) : (p.meta.repo ?? profile.links.github),
        lang: p.fallback ? p.contentLocale : undefined,
      })),
    ...copy.more.items.map((item) => ({ ...item, lang: undefined })),
  ]

  return (
    <Section id={sections.other.id} eyebrow={sections.other.eyebrow} title={sections.other.title} intro={copy.otherIntro}>
      <div className="grid gap-4">
        <ul className="grid border-t border-line">
          {others.map((item) => {
            const external = /^https?:\/\//.test(item.href)
            return (
              <li key={item.href} lang={item.lang} className="border-b border-line">
                <a
                  href={item.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group/more grid grid-cols-[3.25rem_minmax(0,1fr)_auto] gap-x-4 gap-y-1 rounded-sm py-4 md:grid-cols-[3.25rem_17rem_minmax(0,1fr)_auto] md:items-baseline md:gap-x-6"
                >
                  <span className="font-mono text-meta text-subtle">{item.year}</span>
                  <span className="font-semibold text-foreground transition-colors group-hover/more:text-brand">
                    {item.title}
                    {external ? <span className="sr-only"> {ui.opensInNewTab}</span> : null}
                  </span>
                  <span className="col-start-2 row-start-2 text-small text-muted-foreground md:col-start-auto md:row-start-auto">
                    {item.text}
                  </span>
                  <span aria-hidden="true" className="col-start-3 row-start-1 font-mono text-meta text-brand md:col-start-auto md:row-start-auto">
                    {external ? "↗" : "→"}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-start rounded-sm py-0.5 text-small font-semibold text-brand hover:underline hover:underline-offset-4"
        >
          {copy.more.allLink}
          <span aria-hidden="true" className="ml-1.5 inline-block">
            ↗
          </span>
          <span className="sr-only"> {ui.opensInNewTab}</span>
        </a>
      </div>
    </Section>
  )
}

/** Ano do projeto: o trecho do `period` antes do " · " ("2025–2026 · Hunt Sales" → "2025–2026"). */
function yearOf(period: string): string {
  return period.split(" · ")[0]
}

// Card clicável inteiro (o link do título cobre o card com ::after), com cara de botão também no celular,
// onde não há hover: borda forte, leve elevação, "Ver projeto →" sempre visível no rodapé, na cor de ação, e
// retorno ao tocar (:active). "▶ Testar demo" é um segundo link, por cima, direto para a demo do caso.
const cardShell =
  "group/card relative grid grid-rows-[auto_1fr] overflow-hidden rounded-card border border-line-strong bg-surface shadow-card transition-[border-color,transform,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-brand-line has-[a:active]:translate-y-0 has-[a:active]:bg-surface-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0"

function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const { projects: copy, ui } = getContent(locale)
  const { meta, slug, fallback, contentLocale } = project
  const titleId = `projeto-${slug}`
  const page = hasCaseStudy(project)
  const href = page ? caseStudyPath(locale, slug) : meta.repo
  const external = !page
  const demo = page && (meta.demo || meta.liveEmbed || meta.badges.includes("demo"))
  const demoHref = `${caseStudyPath(locale, slug)}#${getContent(contentLocale).caseStudy.tryIt.id}`
  const delivered = meta.badges.includes("delivered")

  return (
    <article aria-labelledby={titleId} lang={fallback ? contentLocale : undefined} className={cardShell}>
      <ProjectArt art={meta.art} className="aspect-[2/1] border-b border-line sm:aspect-[16/10]" />
      <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 p-5 sm:p-6">
        <p className="flex min-h-[1.375rem] flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
          <span className="text-subtle">{yearOf(meta.period)}</span>
          {delivered ? (
            <span lang={fallback ? locale : undefined} className="rounded-full border border-ok-line px-2 leading-5 text-ok">
              {copy.deliveredBadge}
            </span>
          ) : null}
        </p>
        <h3 id={titleId} className="text-h3">
          {href ? (
            <a
              href={href}
              hrefLang={fallback ? contentLocale : undefined}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {meta.shortTitle ?? meta.title}
              {external ? <span className="sr-only"> {ui.opensInNewTab}</span> : null}
            </a>
          ) : (
            (meta.shortTitle ?? meta.title)
          )}
        </h3>
        <div className="grid content-start gap-3">
          <p className="text-muted-foreground">{meta.tagline ?? meta.summary}</p>
          {meta.stack.length ? (
            <ul className="flex flex-wrap gap-2">
              {meta.stack.slice(0, 4).map((tech) => (
                <li key={tech} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-meta text-muted-foreground">
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {/* Rodapé: a ação do card (o link do título já cobre o card; este texto é só a pista visual). */}
        <div lang={fallback ? locale : undefined} className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-small font-semibold text-brand">
            {external ? copy.viewCode : copy.viewProject}
            <span className="transition-transform duration-200 group-hover/card:translate-x-0.5">{external ? "↗" : "→"}</span>
          </span>
          {demo ? (
            <a
              href={demoHref}
              className="relative z-10 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-line px-3 font-mono text-meta text-brand transition-colors hover:bg-brand-soft active:bg-brand-soft"
            >
              <span aria-hidden="true">▶</span>
              {copy.tryDemo}
              <span className="sr-only">: {meta.shortTitle ?? meta.title}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
