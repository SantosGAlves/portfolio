import { Section } from "@/components/layout/section"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { site } from "@/content/pt-BR/site"

// Fase 2: esqueleto da página inicial com as âncoras finais.
// As seções ganham conteúdo e componentes próprios na Fase 3.
const sections = [
  { id: "projetos", eyebrow: "Projetos selecionados", title: "Projetos" },
  { id: "construo", eyebrow: "O que eu construo", title: "Sistemas e resultados" },
  { id: "experiencia", eyebrow: "Experiência", title: "Onde trabalhei" },
  { id: "formacao", eyebrow: "Formação", title: "Formação e TCC" },
  { id: "contato", eyebrow: "Contato", title: "Vamos conversar" },
] as const

export default function Home() {
  const { profile, ui } = site

  return (
    <>
      <section id="topo" aria-labelledby="hero-titulo">
        <div className="container-site grid gap-8 pt-16 pb-18 md:pt-24 md:pb-24">
          <StatusIndicator>
            {profile.availability} · {profile.location}
          </StatusIndicator>
          <h1 id="hero-titulo" className="max-w-[14ch] text-display">
            Construo agentes de IA e automações que trabalham com dados reais.
          </h1>
          <p className="max-w-[46ch] text-muted-foreground">
            {profile.role}. Agentes que consultam bancos de dados, fluxos no n8n e
            integrações via API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="#projetos">
                Ver projetos
                <span aria-hidden="true" className="transition-transform duration-200 group-hover/button:translate-x-0.5">
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
      </section>

      {sections.map((s) => (
        <Section key={s.id} id={s.id} eyebrow={s.eyebrow} title={s.title}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">em construção</Badge>
            <p className="text-small text-subtle">Conteúdo desta seção entra na Fase 3.</p>
          </div>
        </Section>
      ))}
    </>
  )
}
