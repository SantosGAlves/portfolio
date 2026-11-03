import { FlowBackground } from "@/components/hero/flow-background"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { getContent, type Locale } from "@/lib/i18n"

// O nome (texto puro, fontes pré-carregadas) é o elemento do LCP.
// O fundo só começa a animar depois do load. A assinatura interativa fica no
// estudo de caso do agente (seção "Como funciona").
export function Hero({ locale }: { locale: Locale }) {
  const { hero, profile, sections, ui } = getContent(locale)

  return (
    <section id="topo" data-rail aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <FlowBackground />
      <div className="container-site grid gap-10 pt-10 pb-16 lg:gap-14 lg:pt-16 lg:pb-22">
        <div className="grid gap-5">
          <StatusIndicator>
            {profile.availability} · {profile.location}
          </StatusIndicator>
          <div>
            <p className="mt-3 font-mono text-[0.875rem] text-brand">{hero.greeting}</p>
            <h1 id="hero-heading" className="mt-2 text-name">
              <span className="block">{hero.firstName}</span>{" "}
              <span className="mt-[0.06em] block pl-[0.04em] font-serif text-[0.96em] leading-[0.95] font-normal tracking-[-0.025em] italic">
                {hero.lastName}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid gap-10 lg:gap-12">
          <div className="grid max-w-[46rem] content-start gap-6">
            <p className="max-w-[30ch] text-role">
              {/* "função · foco": a linha só quebra depois do "·" */}
              {hero.role.split(" · ").map((part, i, all) => (
                <span key={part}>
                  {i ? " " : null}
                  <span className={i ? "whitespace-nowrap text-muted-foreground" : "whitespace-nowrap"}>
                    {part}
                    {i < all.length - 1 ? " ·" : null}
                  </span>
                </span>
              ))}
            </p>
            <p className="max-w-[46ch] text-muted-foreground">{hero.lede}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={`#${sections.projects.id}`}>
                  {hero.ctaProjects}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/button:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.links.cv} download>
                  {ui.downloadCv}
                </a>
              </Button>
            </div>
          </div>
          <dl className="grid lg:grid-cols-3 lg:gap-8">
            {hero.facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[5.75rem_minmax(0,1fr)] content-start gap-3 border-t py-3 text-small lg:grid-cols-1 lg:gap-1.5 lg:pt-4"
              >
                <dt className="pt-0.5 font-mono text-meta text-subtle">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
