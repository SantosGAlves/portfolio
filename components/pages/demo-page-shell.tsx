import type { ReactNode } from "react"
import { buttonVariants } from "@/components/ui/button"
import { demos, type DemoSlug } from "@/lib/demos"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath, getCaseStudy } from "@/lib/projects"

/** Textos comuns das páginas de demo (content/<idioma>/demos/<slug>.ts → page). */
export type DemoPageText = {
  banner: string
  back: string
  eyebrow: string
  title: string
  intro: string
  repoLink: string
  notesTitle: string
  notes: string[]
}

// Moldura das páginas /demos/<slug>: faixa fixa, link de volta ao caso, título,
// "Ver código no GitHub", a demo e as notas sobre o que é real e o que é simulado.
// A faixa tem altura fixa (--demo-banner-h), para a demo poder ocupar o resto da tela no celular.
export function DemoPageShell({ locale, slug, page, children }: { locale: Locale; slug: DemoSlug; page: DemoPageText; children: ReactNode }) {
  const { ui } = getContent(locale)
  const projectSlug = demos[slug].project
  const project = getCaseStudy(locale, projectSlug)

  return (
    <div className="[--demo-banner-h:3rem] min-[26rem]:[--demo-banner-h:2.25rem]">
      <div className="sticky top-(--header-h) z-40 flex h-(--demo-banner-h) items-center border-b border-brand-line bg-background/95 backdrop-blur-sm">
        <p className="container-site text-center font-mono text-meta leading-snug text-brand">{page.banner}</p>
      </div>

      <div className="container-site pt-8 pb-20 md:pt-10">
        <a
          href={caseStudyPath(locale, projectSlug)}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          {page.back}
        </a>

        <header className="mt-6 grid max-w-3xl gap-4">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="text-title">{page.title}</h1>
          <p className="text-muted-foreground">{page.intro}</p>
          {project?.meta.repo ? (
            <a
              href={project.meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({ variant: "outline", size: "sm" })} justify-self-start`}
            >
              {page.repoLink}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">{ui.opensInNewTab}</span>
            </a>
          ) : null}
        </header>

        <div className="mt-10">{children}</div>

        <section aria-labelledby="demo-notes" className="mt-14 grid max-w-3xl gap-3">
          <h2 id="demo-notes" className="text-h3">
            {page.notesTitle}
          </h2>
          <ul className="grid list-disc gap-2 pl-5 text-muted-foreground marker:text-subtle">
            {page.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
