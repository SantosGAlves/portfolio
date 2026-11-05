import Image from "next/image"
import { siGithub } from "simple-icons"
import { FlowBackground } from "@/components/hero/flow-background"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { getContent, homePath, type Locale } from "@/lib/i18n"
import { caseStudyPath } from "@/lib/projects"

// Hero: cabe numa tela (360 × 780 no celular, sob o header). Foto redonda ao lado do nome, função, frase de
// efeito, quatro palavras-chave, três fatos com prova (cada um leva ao caso ou à seção que o comprova), um
// botão de destaque ("Ver projetos"), "Ver LinkedIn" e os links do GitHub e do e-mail. Sem CV, de propósito.
// O nome (texto puro, fontes pré-carregadas) é o elemento do LCP; a foto é pequena (avatar de 384 px em
// .webp, servido pelo next/image no tamanho exibido) e carrega na hora, sem preload no <head>.
export function Hero({ locale }: { locale: Locale }) {
  const { hero, profile, sections, contact, ui } = getContent(locale)
  const home = homePath(locale)
  const proofHref = (fact: (typeof hero.proof)[number]) =>
    fact.case ? caseStudyPath(locale, fact.case) : `${home}#${sections[fact.section ?? "projects"].id}`
  const linkClass =
    "inline-flex min-h-10 items-center gap-1.5 rounded-sm text-small font-semibold text-brand hover:underline hover:underline-offset-4"

  return (
    <section id="topo" data-rail aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <FlowBackground />
      <div className="container-site grid gap-5 pt-6 pb-10 sm:gap-6 sm:pt-10 lg:pt-14 lg:pb-16">
        <StatusIndicator>
          {profile.availability} · {profile.location}
        </StatusIndicator>

        <div className="flex items-center gap-4 sm:gap-6">
          <Image
            src="/foto/gustavo-avatar.webp"
            alt={hero.photoAlt}
            width={384}
            height={384}
            sizes="(min-width: 1024px) 144px, (min-width: 640px) 112px, 80px"
            loading="eager"
            fetchPriority="high"
            className="size-20 shrink-0 rounded-full border border-line-strong bg-surface-2 object-cover sm:size-28 lg:size-36"
          />
          <h1 id="hero-heading" className="min-w-0 text-name">
            <span className="block">{hero.firstName}</span>{" "}
            <span className="mt-[0.06em] block pl-[0.04em] font-serif text-[0.96em] leading-[0.95] font-normal tracking-[-0.025em] italic">
              {hero.lastName}
            </span>
          </h1>
        </div>

        <div className="grid max-w-[46rem] gap-3">
          <p className="font-mono text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-[0.875rem]">
            {/* "função · foco": a linha só quebra depois do "·" */}
            {hero.role.split(" · ").map((part, i, all) => (
              <span key={part}>
                {i ? " " : null}
                <span className="whitespace-nowrap">
                  {part}
                  {i < all.length - 1 ? " ·" : null}
                </span>
              </span>
            ))}
          </p>
          <p className="text-role text-balance">
            {/* Frase de efeito: uma linha por item (no celular, a segunda quebra equilibrada). */}
            {hero.tagline.map((line, i) => (
              <span key={line} className={i ? "block text-muted-foreground" : "block"}>
                {line}
              </span>
            ))}
          </p>
          <p className="font-mono text-meta text-subtle">
            {hero.keywords.map((word, i) => (
              <span key={word}>
                {i ? " · " : null}
                <span className="whitespace-nowrap">{word}</span>
              </span>
            ))}
          </p>
        </div>

        {/* Fatos com prova: o ✓ é status (ciano); o texto é link (sublinhado verde) para a prova. */}
        <ul className="grid gap-1 sm:flex sm:flex-wrap sm:gap-x-7">
          {hero.proof.map((fact) => (
            <li key={fact.text}>
              <a
                href={proofHref(fact)}
                className="group/proof inline-flex min-h-8 items-center gap-2 rounded-sm text-small font-semibold text-foreground underline decoration-brand-line decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {fact.text}
                <span aria-hidden="true" className="text-brand transition-transform duration-200 group-hover/proof:translate-x-0.5">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={`#${sections.projects.id}`}>
                {hero.ctaProjects}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover/button:translate-x-0.5">
                  ↓
                </span>
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                {hero.ctaLinkedin}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">{ui.opensInNewTab}</span>
              </a>
            </Button>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5">
            <li>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d={siGithub.path} />
                </svg>
                GitHub
                <span className="sr-only">{ui.opensInNewTab}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
                  <path d="m2.5 4.5 5.5 4.25 5.5-4.25" />
                </svg>
                {contact.emailLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
