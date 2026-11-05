import type { ComponentProps, ReactNode } from "react"
import { notFound } from "next/navigation"
import { MediaFigure } from "@/components/case-study/blocks"
import { LoopVideo } from "@/components/case-study/loop-video"
import { LiveTryIt, TryIt, TryItShell } from "@/components/case-study/try-it"
import { Signature } from "@/components/hero/signature"
import { buttonVariants } from "@/components/ui/button"
import { getContent, homePath, type Locale } from "@/lib/i18n"
import { isDemoSlug } from "@/lib/demos"
import { caseStudyPath, getCaseStudy, getNextCaseStudy } from "@/lib/projects"

// Estudo de caso, revelando aos poucos (o recrutador chega à demo na primeira ou segunda tela):
// 1. topo: título, frase de impacto, linha de fatos (papel · ano · resultado) e "Testar agora ↓" + "Código";
// 2. "Experimente": a demo (<Demo /> ou <TrySection> no MDX); sem demo, o vídeo do caso;
// 3. "Resultado": no máximo três tópicos;
// 4. "Como funciona": o diagrama, um parágrafo curto e o vídeo do caso (<CaseVideo />);
// 5. <Details>: "Ver detalhes técnicos", fechado por padrão, com o resumo, os metadados e o texto longo
//    (contexto, função, arquitetura, stack, decisões, aprendizados, galeria).
// A ordem vem do .mdx; este arquivo só fornece os blocos.
export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getCaseStudy(locale, slug)
  if (!project) notFound()

  const { caseStudy: copy, projects, sections, ui } = getContent(locale)
  const { meta, Body, fallback, contentLocale } = project
  const next = getNextCaseStudy(locale, slug)
  const video = meta.media.video
  const demo = meta.demo
  if (demo && !isDemoSlug(demo)) throw new Error(`Demo desconhecida em ${slug}: ${demo} (veja lib/demos.ts)`)
  // Há algo para testar na página: demo do site, versão pública embutida ou a assinatura (badges: "demo").
  const tryable = Boolean(demo || meta.liveEmbed || meta.badges.includes("demo"))

  // Blocos do MDX que dependem do idioma do texto (rótulos de botão e conteúdo do site).
  const textCopy = getContent(contentLocale)
  const metaRows = [
    { label: copy.meta.role, value: meta.role },
    { label: copy.meta.period, value: meta.period },
    { label: copy.meta.status, value: projects.status[meta.status] },
    { label: copy.meta.stack, value: meta.stack.join(" · ") },
  ]

  const mainVideo = video ? (
    // Vídeo de origem estreita (ex.: gravação de webcam) fica mais estreito, sem esticar.
    <figure className={`my-10 grid gap-3 ${video.width < 1000 ? "mx-auto w-full max-w-[46rem]" : ""}`}>
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
          playLabel={textCopy.caseStudy.video.play}
          pauseLabel={textCopy.caseStudy.video.pause}
          lazyPoster
          className="rounded-card border border-line bg-surface"
        />
      )}
      {video.caption ? <figcaption className="font-mono text-meta text-subtle">{video.caption}</figcaption> : null}
    </figure>
  ) : null

  const bodyComponents = {
    Video: ({ caption, ...props }: Omit<ComponentProps<typeof LoopVideo>, "playLabel" | "pauseLabel"> & { caption?: string }) => (
      <MediaFigure caption={caption}>
        <LoopVideo
          {...props}
          lazyPoster
          playLabel={textCopy.caseStudy.video.play}
          pauseLabel={textCopy.caseStudy.video.pause}
          className="rounded-xl border border-line"
        />
      </MediaFigure>
    ),
    // Seção "Experimente": a demo feita para o site (meta.demo) ou a versão pública embutida numa moldura
    // de navegador (meta.liveEmbed). Sem nenhuma das duas, o vídeo do caso ocupa o lugar.
    Demo: () =>
      demo && isDemoSlug(demo) ? (
        <TryIt slug={demo} locale={contentLocale} />
      ) : meta.live && meta.liveEmbed ? (
        <LiveTryIt
          locale={contentLocale}
          title={meta.title}
          embed={meta.liveEmbed}
          href={meta.live}
          intro={meta.liveIntro}
          note={meta.demoNote}
          preview={meta.livePreview}
        />
      ) : mainVideo ? (
        <TryItShell locale={contentLocale}>
          <div className="mx-auto max-w-[60rem]">{mainVideo}</div>
        </TryItShell>
      ) : null,
    // "Experimente" com outro conteúdo interativo (ex.: a assinatura do agente).
    TrySection: ({ intro, children }: { intro?: string; children: ReactNode }) => (
      <TryItShell locale={contentLocale} intro={intro}>
        <div className="mx-auto max-w-[52rem]">{children}</div>
      </TryItShell>
    ),
    // O vídeo do caso, em "Como funciona" (só nos casos com demo; sem demo ele já está em "Experimente").
    CaseVideo: () => (tryable && mainVideo ? <div className="lg:-mx-24">{mainVideo}</div> : null),
    Signature: () => <Signature content={textCopy.signature} buttonClassName={buttonVariants({ variant: "outline", size: "sm" })} />,
    // "Ver detalhes técnicos": fechado por padrão (teclado e leitor de tela funcionam sem JS). Abre com o
    // resumo, os metadados e o resumo em 30 segundos; depois, o texto longo do MDX.
    Details: ({ children }: { children: ReactNode }) => (
      <details className="group/details mt-16">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-control border border-line-strong bg-surface px-4 text-body font-semibold text-brand shadow-card transition-colors hover:border-brand-line active:bg-surface-2 sm:px-5 [&::-webkit-details-marker]:hidden">
          {textCopy.caseStudy.details}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 shrink-0 transition-transform duration-200 group-open/details:rotate-180 motion-reduce:transition-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </summary>
        <div className="pt-10">
          <p className="text-role font-normal text-muted-foreground">{meta.summary}</p>
          <dl className="mt-8 grid border-y border-line sm:grid-cols-2">
            {metaRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid content-start gap-1 border-line py-4 sm:px-5 ${i ? "border-t" : ""} ${i === 1 ? "sm:border-t-0" : ""} ${
                  i % 2 ? "sm:border-l" : "sm:pl-0"
                }`}
              >
                <dt lang={fallback ? locale : undefined} className="font-mono text-meta text-subtle">
                  {row.label}
                </dt>
                <dd className="text-small">{row.value}</dd>
              </div>
            ))}
          </dl>
          {meta.tldr.length ? (
            <section aria-labelledby="resumo" className="mt-10 grid gap-5 rounded-card border border-line bg-surface p-5 sm:p-7">
              <h2 id="resumo" className="eyebrow">
                {textCopy.caseStudy.summaryTitle}
              </h2>
              <dl className="grid gap-6">
                {meta.tldr.map((item) => (
                  <div key={item.label} className="grid content-start gap-2">
                    <dt className="text-small font-semibold text-foreground">{item.label}</dt>
                    <dd className="text-small text-muted-foreground">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          <div className="mt-14">{children}</div>
        </div>
      </details>
    ),
  }

  const facts = [meta.roleShort ?? meta.role, meta.period.split(" · ")[0], meta.outcome].filter((f): f is string => Boolean(f))

  return (
    // @container: a seção "Experimente" sai da coluna de texto e usa a largura do conteúdo (50cqi).
    <article lang={fallback ? contentLocale : undefined} className="@container container-site pt-6 pb-20 md:pt-10">
      <a
        href={`${homePath(locale)}#${sections.projects.id}`}
        lang={fallback ? locale : undefined}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"
      >
        <span aria-hidden="true">←</span>
        {copy.back}
      </a>

      {fallback && copy.fallbackNotice ? (
        <p lang={locale} className="mt-4 rounded-control border border-line-strong bg-surface-2 px-4 py-3 text-small">
          {copy.fallbackNotice}
        </p>
      ) : null}

      <header className="mx-auto mt-6 grid max-w-[46rem] gap-4">
        <p className="eyebrow">{meta.kind}</p>
        <h1 className="text-title text-balance">{meta.title}</h1>
        <p className="text-role font-normal text-balance text-muted-foreground">{meta.tagline ?? meta.summary}</p>
        <p className="font-mono text-meta text-subtle">
          {facts.map((fact, i) => (
            <span key={fact}>
              {i ? " · " : null}
              <span className={i === 2 ? "text-foreground" : i === 1 ? "whitespace-nowrap" : undefined}>{fact}</span>
            </span>
          ))}
        </p>
        {tryable || meta.live || meta.repo || meta.privateCode ? (
          <div className="mt-1 grid gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {tryable ? (
                <a href={`#${textCopy.caseStudy.tryIt.id}`} className={buttonVariants()}>
                  {textCopy.caseStudy.tryNow}
                  <span aria-hidden="true">↓</span>
                </a>
              ) : null}
              {meta.live && !meta.liveEmbed ? (
                <a
                  href={meta.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang={fallback ? locale : undefined}
                  className={buttonVariants({ variant: tryable ? "outline" : "default" })}
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
                  className={buttonVariants({ variant: "outline" })}
                >
                  {textCopy.caseStudy.code}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">{ui.opensInNewTab}</span>
                </a>
              ) : null}
            </div>
            {meta.live && !meta.liveEmbed && meta.demoNote ? <p className="max-w-[60ch] text-small text-subtle">{meta.demoNote}</p> : null}
            {!meta.repo && meta.privateCode ? (
              <p className="max-w-[60ch] border-l-2 border-line-strong pl-3 text-small text-muted-foreground">{meta.privateCode}</p>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-[46rem]">
        {meta.draft ? (
          <p lang={fallback ? locale : undefined} className="mt-8 font-mono text-meta text-subtle">
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
            <span className="flex items-baseline gap-2 text-h3 text-brand group-hover/next:underline group-hover/next:underline-offset-4">
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
