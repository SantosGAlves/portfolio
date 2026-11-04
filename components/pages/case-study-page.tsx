import type { ComponentProps } from "react"
import { notFound } from "next/navigation"
import { ProjectArt } from "@/components/art/project-art"
import { MediaFigure } from "@/components/case-study/blocks"
import { LiveDemo } from "@/components/case-study/live-demo"
import { LoopVideo } from "@/components/case-study/loop-video"
import { TryIt } from "@/components/case-study/try-it"
import { Signature } from "@/components/hero/signature"
import { buttonVariants } from "@/components/ui/button"
import { getContent, homePath, type Locale } from "@/lib/i18n"
import { isDemoSlug } from "@/lib/demos"
import { caseStudyPath, getCaseStudy, getNextCaseStudy } from "@/lib/projects"

// Template do estudo de caso. A ordem das seções do texto vem do .mdx:
// contexto e problema → minha função → solução e arquitetura → stack →
// decisões e trade-offs → resultado → aprendizados.
export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getCaseStudy(locale, slug)
  if (!project) notFound()

  const { caseStudy: copy, projects, sections, ui } = getContent(locale)
  const { meta, Body, fallback, contentLocale } = project
  const next = getNextCaseStudy(locale, slug)
  const video = meta.media.video
  const demo = meta.demo
  if (demo && !isDemoSlug(demo)) throw new Error(`Demo desconhecida em ${slug}: ${demo} (veja lib/demos.ts)`)

  // Blocos do MDX que dependem do idioma do texto (rótulos de botão e conteúdo do site).
  const textCopy = getContent(contentLocale)
  const bodyComponents = {
    Video: ({ caption, ...props }: Omit<ComponentProps<typeof LoopVideo>, "playLabel" | "pauseLabel"> & { caption?: string }) => (
      <MediaFigure caption={caption}>
        <LoopVideo
          {...props}
          playLabel={textCopy.caseStudy.video.play}
          pauseLabel={textCopy.caseStudy.video.pause}
          className="rounded-xl border border-line"
        />
      </MediaFigure>
    ),
    // Seção "Experimente": a demo do projeto (meta.demo), no ponto do texto em que o <Demo /> aparece.
    Demo: () => (demo && isDemoSlug(demo) ? <TryIt slug={demo} locale={contentLocale} /> : null),
    Signature: () => (
      <div className="my-10">
        <Signature content={textCopy.signature} buttonClassName={buttonVariants({ variant: "outline", size: "sm" })} />
      </div>
    ),
  }
  const metaRows = [
    { label: copy.meta.role, value: meta.role },
    { label: copy.meta.period, value: meta.period },
    { label: copy.meta.status, value: projects.status[meta.status] },
    { label: copy.meta.stack, value: meta.stack.join(" · ") },
  ]

  return (
    // @container: a seção "Experimente" sai da coluna de texto e usa a largura do conteúdo (50cqi).
    <article lang={fallback ? contentLocale : undefined} className="@container container-site pt-8 pb-20 md:pt-12">
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
        {meta.live || meta.repo || meta.privateCode ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {meta.live && meta.liveEmbed ? (
                <>
                  <LiveDemo
                    embed={meta.liveEmbed}
                    href={meta.live}
                    lang={fallback ? locale : undefined}
                    triggerClassName={buttonVariants()}
                    closeClassName={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                    text={{
                      trigger: projects.liveDialog.trigger,
                      eyebrow: projects.liveDialog.eyebrow,
                      title: meta.title,
                      intro: meta.liveIntro,
                      loading: projects.liveDialog.loading,
                      frameTitle: projects.liveDialog.frameTitle.replace("{titulo}", meta.title),
                      close: projects.liveDialog.close,
                      note: meta.demoNote,
                      fallback: projects.liveDialog.fallback,
                      external: meta.liveExternal ?? projects.liveDialog.external,
                      opensInNewTab: ui.opensInNewTab,
                    }}
                  />
                  <a
                    href={meta.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold text-foreground hover:underline hover:underline-offset-4"
                  >
                    {meta.liveExternal ?? projects.liveDialog.external}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">{ui.opensInNewTab}</span>
                  </a>
                </>
              ) : meta.live ? (
                <a
                  href={meta.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang={fallback ? locale : undefined}
                  className={buttonVariants()}
                >
                  {projects.liveLink}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">{ui.opensInNewTab}</span>
                </a>
              ) : null}
              {meta.repo ? (
                <a
                  href={meta.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang={fallback ? locale : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold hover:underline hover:underline-offset-4 ${
                    meta.live ? "text-foreground" : "text-brand"
                  }`}
                >
                  {projects.repoLink}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">{ui.opensInNewTab}</span>
                </a>
              ) : null}
            </div>
            {meta.live && meta.demoNote ? <p className="max-w-[60ch] text-small text-subtle">{meta.demoNote}</p> : null}
            {!meta.repo && meta.privateCode ? (
              <p className="max-w-[60ch] border-l-2 border-line-strong pl-3 text-small text-muted-foreground">{meta.privateCode}</p>
            ) : null}
          </div>
        ) : null}
      </header>

      <dl className="mt-10 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {metaRows.map((row) => (
          <div key={row.label} className="grid content-start gap-1 border-line py-4 not-first:border-t sm:not-first:border-t-0 sm:px-5 sm:first:pl-0 sm:even:border-l lg:border-l lg:first:border-l-0">
            <dt className="font-mono text-meta text-subtle">{row.label}</dt>
            <dd className="text-small">{row.value}</dd>
          </div>
        ))}
      </dl>

      {video ? (
        // Vídeo de origem estreita (ex.: gravação de webcam) fica na largura da coluna de texto, sem esticar.
        <figure className={`mt-10 grid gap-3 ${video.width < 1000 ? "mx-auto w-full max-w-[46rem]" : ""}`}>
          {video.controls ? (
            // Vídeo longo: controles nativos e nada é baixado antes do play (preload="none").
            <video
              controls
              playsInline
              preload="none"
              poster={video.poster}
              width={video.width}
              height={video.height}
              aria-label={video.label}
              className="block h-auto w-full rounded-card border border-line bg-surface"
            >
              <source src={video.src} type="video/mp4" />
            </video>
          ) : (
            <LoopVideo
              src={video.src}
              poster={video.poster}
              width={video.width}
              height={video.height}
              label={video.label}
              playLabel={copy.video.play}
              pauseLabel={copy.video.pause}
              className="rounded-card border border-line bg-surface"
            />
          )}
          {video.caption ? (
            <figcaption lang={fallback ? contentLocale : undefined} className="font-mono text-meta text-subtle">
              {video.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <ProjectArt art={meta.art} className="mt-10 aspect-[4/3] rounded-card border border-line sm:aspect-[16/9] lg:aspect-[16/7]" />
      )}

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
        {meta.draft ? (
          <p lang={fallback ? locale : undefined} className="mb-10 font-mono text-meta text-subtle">
            {copy.illustrativeNotice}
          </p>
        ) : null}
        <Body components={bodyComponents} />
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
