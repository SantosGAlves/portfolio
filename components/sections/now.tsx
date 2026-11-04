import { Section } from "@/components/layout/section"
import { More } from "@/components/ui/more"
import { getContent, type Locale } from "@/lib/i18n"
import { caseStudyPath } from "@/lib/projects"

// "Agora" (como o "Currently" do victrhugo.site): três linhas sobre o que estou fazendo neste momento.
// Em "Ver mais": o parágrafo sobre mim e as quatro áreas da antiga seção "O que eu faço".
export function Now({ locale }: { locale: Locale }) {
  const { sections, now, hero, build, projects } = getContent(locale)

  return (
    <Section id={sections.now.id} eyebrow={sections.now.eyebrow} title={sections.now.title}>
      <ul className="grid border-t border-line">
        {now.items.map((item) => (
          <li key={item.label} className="grid gap-x-6 gap-y-1 border-b border-line py-4 md:grid-cols-[10rem_minmax(0,1fr)]">
            <p className="font-mono text-meta text-subtle md:pt-0.5">{item.label}</p>
            <p className="text-foreground">
              {item.text}
              {item.case ? (
                <a
                  href={caseStudyPath(locale, item.case)}
                  className="group/now ml-2 inline-flex min-h-6 items-center gap-1 rounded-sm text-small font-semibold whitespace-nowrap text-brand hover:underline hover:underline-offset-4"
                >
                  {projects.viewProject}
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover/now:translate-x-0.5">
                    →
                  </span>
                </a>
              ) : null}
            </p>
          </li>
        ))}
      </ul>

      <More more={now.more} bodyClassName="grid gap-6">
        <p className="max-w-[60ch] text-muted-foreground">{hero.lede}</p>
        <div className="grid gap-3">
          <p className="text-small text-muted-foreground">{build.intro}</p>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {build.areas.map((area) => (
              <li key={area.title} className="grid content-start gap-1 border-t border-line pt-3">
                <p className="font-semibold text-foreground">{area.title}</p>
                <p className="text-small text-muted-foreground">{area.text}</p>
                <p className="font-mono text-meta text-subtle">{area.items.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </More>
    </Section>
  )
}
