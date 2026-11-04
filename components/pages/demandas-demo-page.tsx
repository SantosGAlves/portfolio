import { DemandasDemoLoader } from "@/components/demos/demandas/loader"
import { buttonVariants } from "@/components/ui/button"
import { demos, getDemandasContent } from "@/lib/demos"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getCaseStudy } from "@/lib/projects"

// Página da demo da plataforma de demandas (/demos/demandas e /en/demos/demandas).
export function DemandasDemoPage({ locale }: { locale: Locale }) {
  const content = getDemandasContent(locale)
  const { ui } = getContent(locale)
  const project = getCaseStudy(locale, demos.demandas.project)
  const p = content.page

  return (
    <>
      {/* Faixa fixa logo abaixo do header */}
      <div className="sticky top-(--header-h) z-40 border-b border-brand-line bg-background/95 backdrop-blur-sm">
        <p className="container-site py-2 text-center font-mono text-meta text-brand">{p.banner}</p>
      </div>

      <div className="container-site pt-8 pb-20 md:pt-10">
        <a
          href={caseStudyPath(locale, demos.demandas.project)}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          {p.back}
        </a>

        <header className="mt-6 grid max-w-3xl gap-4">
          <p className="eyebrow">{p.eyebrow}</p>
          <h1 className="text-title">{p.title}</h1>
          <p className="text-muted-foreground">{p.intro}</p>
          {project?.meta.repo ? (
            <a
              href={project.meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({ variant: "outline", size: "sm" })} justify-self-start`}
            >
              {p.repoLink}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">{ui.opensInNewTab}</span>
            </a>
          ) : null}
        </header>

        <div className="mt-10">
          <DemandasDemoLoader content={content} />
        </div>

        <section aria-labelledby="demo-notes" className="mt-14 grid max-w-3xl gap-3">
          <h2 id="demo-notes" className="text-h3">
            {p.notesTitle}
          </h2>
          <ul className="grid list-disc gap-2 pl-5 text-muted-foreground marker:text-subtle">
            {p.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
