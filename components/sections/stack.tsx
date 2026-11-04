import {
  siClaude,
  siDart,
  siDocker,
  siFirebase,
  siFlask,
  siFlutter,
  siGit,
  siGithub,
  siGo,
  siHtml5,
  siJavascript,
  siMediapipe,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siScikitlearn,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons"
import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"
import { techGroups, techName, type TechIcon, type TechItem } from "@/content/tech"
import { getContent, type Locale } from "@/lib/i18n"
import { StackMarquee } from "./stack-marquee"

// "Tecnologias": faixa com ícones monocromáticos (simple-icons) rolando devagar e, abaixo, a lista por
// categoria recolhida num <details> ("Ver por categoria", fechado por padrão; teclado e leitor de tela
// funcionam sem JS). Cada ícone entra uma vez no HTML, como <symbol>; a faixa (duas cópias) usa <use>.
const icons: Record<TechIcon, SimpleIcon> = {
  python: siPython,
  javascript: siJavascript,
  typescript: siTypescript,
  go: siGo,
  dart: siDart,
  scikitlearn: siScikitlearn,
  opencv: siOpencv,
  mediapipe: siMediapipe,
  pandas: siPandas,
  numpy: siNumpy,
  flask: siFlask,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  supabase: siSupabase,
  firebase: siFirebase,
  n8n: siN8n,
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  flutter: siFlutter,
  html5: siHtml5,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  render: siRender,
  vercel: siVercel,
  claude: siClaude,
}

/** Segundos por item numa volta da faixa (quanto maior, mais devagar). */
const SECONDS_PER_ITEM = 3.5

export function Stack({ locale }: { locale: Locale }) {
  const { sections, stack } = getContent(locale)
  const all = techGroups.flatMap((g) => g.items)
  const usedIcons = [...new Set(all.flatMap((i) => (i.icon ? [i.icon] : [])))]

  return (
    <Section id={sections.stack.id} eyebrow={sections.stack.eyebrow} title={sections.stack.title} intro={stack.intro}>
      <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
        <defs>
          {usedIcons.map((slug) => (
            <symbol key={slug} id={`si-${slug}`} viewBox="0 0 24 24">
              <path d={icons[slug].path} />
            </symbol>
          ))}
        </defs>
      </svg>

      <div className="grid gap-2">
        <StackMarquee duration={all.length * SECONDS_PER_ITEM} pause={stack.pause} play={stack.play}>
          {all.map((item) => (
            <TechPill key={techName(item, locale)} item={item} locale={locale} />
          ))}
        </StackMarquee>

        <details className="group/cat">
          <summary
            className={`${buttonVariants({ variant: "outline", size: "sm" })} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
          >
            {stack.byCategory}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-3.5 transition-transform duration-200 group-open/cat:rotate-180 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </summary>
          <dl className="mt-6 grid border-t border-line">
            {techGroups.map((group) => {
              const regular = group.items.filter((i) => i.level !== "used")
              const used = group.items.filter((i) => i.level === "used")
              return (
                <div key={group.key} className="grid gap-2.5 border-b border-line py-4 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-6">
                  <dt className="font-mono text-meta text-subtle md:pt-1">{stack.groups[group.key]}</dt>
                  <dd className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                    <ul className="flex flex-wrap gap-2">
                      {regular.map((item) => (
                        <li
                          key={techName(item, locale)}
                          className={`inline-flex items-baseline gap-1.5 rounded-full border px-2.5 py-0.5 text-small ${
                            item.level === "main" ? "border-line-strong text-foreground" : "border-line text-muted-foreground"
                          }`}
                        >
                          {techName(item, locale)}
                          {item.level === "main" ? <span className="font-mono text-[0.6875rem] text-subtle">{stack.mainLabel}</span> : null}
                        </li>
                      ))}
                    </ul>
                    {used.length ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-meta text-subtle">{stack.usedLabel}:</span>
                        <ul className="flex flex-wrap gap-2">
                          {used.map((item) => (
                            <li
                              key={techName(item, locale)}
                              className="rounded-full border border-dashed border-line-strong px-2.5 py-0.5 text-small text-muted-foreground"
                            >
                              {techName(item, locale)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </dd>
                </div>
              )
            })}
          </dl>
        </details>
      </div>
    </Section>
  )
}

/** Selo da faixa: ícone + nome; sem ícone no simple-icons, só o nome, no mesmo selo. */
function TechPill({ item, locale }: { item: TechItem; locale: Locale }) {
  const main = item.level === "main"
  return (
    <span
      className={`inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full border bg-surface px-4 text-small whitespace-nowrap motion-reduce:h-9 motion-reduce:gap-2 motion-reduce:px-3 ${
        main ? "border-line-strong text-foreground" : "border-line text-muted-foreground"
      }`}
    >
      {item.icon ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`size-[1.125rem] shrink-0 ${main ? "text-foreground" : "text-foreground/80"}`}>
          <use href={`#si-${item.icon}`} />
        </svg>
      ) : null}
      {techName(item, locale)}
    </span>
  )
}
