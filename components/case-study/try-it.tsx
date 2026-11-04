import type { ReactNode } from "react"
import Image from "next/image"
import { AjudaAnimalSkeleton } from "@/components/demos/ajuda-animal/skeleton"
import { BarbuSkeleton } from "@/components/demos/barbu/skeleton"
import { CarregadoresSkeleton } from "@/components/demos/carregadores/skeleton"
import { DemandasSkeleton } from "@/components/demos/demandas/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { getDemoContent, type DemoSlug } from "@/lib/demos"
import { getContent, type Locale } from "@/lib/i18n"
import { LazyDemo } from "./lazy-demo"
import { LiveFrame } from "./live-frame"

// Seção "Experimente" do estudo de caso (<Demo /> no MDX): título, o que dá para fazer, selo, a demo e
// as notas. Texto na coluna de leitura; a demo usa a largura toda do conteúdo (o <article> do caso é um
// container, daí o 50cqi) e, no celular, a da tela.
// --demo-reserve: altura que fica livre fora da demo no celular, para a página continuar rolando.

export function TryItShell({
  locale,
  intro,
  badge,
  children,
  notes,
}: {
  locale: Locale
  intro?: string
  badge?: string
  children: ReactNode
  notes?: ReactNode
}) {
  const { tryIt } = getContent(locale).caseStudy

  return (
    <section aria-labelledby={tryIt.id} className="mt-14 mx-[calc(50%-50cqi)]">
      <div className="mx-auto grid max-w-[46rem] justify-items-start gap-4">
        <h2 id={tryIt.id} className="scroll-mt-24 text-h2">
          {tryIt.title}
        </h2>
        {intro ? <p className="text-muted-foreground">{intro}</p> : null}
        {badge ? <p className="chip-note">{badge}</p> : null}
      </div>

      <div className="mt-8 [--demo-reserve:3rem] sm:[--demo-reserve:0px]">{children}</div>

      {notes ? <div className="mx-auto mt-10 grid max-w-[46rem] gap-3">{notes}</div> : null}
    </section>
  )
}

const skeletons: Record<DemoSlug, () => ReactNode> = {
  demandas: DemandasSkeleton,
  barbu: BarbuSkeleton,
  "ajuda-animal": AjudaAnimalSkeleton,
  carregadores: CarregadoresSkeleton,
}

/** Demo feita para o site (meta.demo): o código só carrega quando a seção chega perto da tela. */
export function TryIt({ slug, locale }: { slug: DemoSlug; locale: Locale }) {
  const { tryIt } = getContent(locale).caseStudy
  const demo = getDemoContent(slug, locale)
  const Skeleton = skeletons[slug]
  const text = demo.section

  return (
    <TryItShell
      locale={locale}
      intro={text.intro}
      badge={text.badge}
      notes={
        <>
          <h3 className="text-h3">{text.notesTitle}</h3>
          <ul className="grid list-disc gap-2 pl-5 text-muted-foreground marker:text-subtle">
            {text.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      }
    >
      <LazyDemo
        slug={slug}
        content={demo}
        fallback={<Skeleton />}
        text={{ load: tryIt.load, loading: tryIt.loading, error: tryIt.error, retry: tryIt.retry }}
        buttonClassName={buttonVariants({ variant: "outline" })}
      />
    </TryItShell>
  )
}

/** Versão pública do projeto (meta.liveEmbed) numa moldura de navegador; o iframe só carrega no clique. */
export function LiveTryIt({
  locale,
  title,
  embed,
  href,
  intro,
  note,
  preview,
}: {
  locale: Locale
  title: string
  embed: string
  href: string
  intro?: string
  note?: string
  /** Imagem parada da interface na moldura, antes do clique (sem controles). */
  preview?: { src: string; width: number; height: number; alt: string }
}) {
  const { caseStudy, ui } = getContent(locale)
  const text = caseStudy.liveFrame
  // librasflow.ifsp.dev: cabeçalho fixo de 60 px até 880 px de largura e 75 px acima disso (menu e botão do
  // GitHub aparecem); medido em 04/11/2026. O iframe sobe por essa altura e cresce na mesma medida.
  const crop =
    "-top-[60px] h-[calc(100%+60px)] @min-[881px]:-top-[75px] @min-[881px]:h-[calc(100%+75px)]"

  return (
    <TryItShell locale={locale} intro={intro} notes={note ? <p className="text-small text-subtle">{note}</p> : undefined}>
      <LiveFrame
        embed={embed}
        href={href}
        host={new URL(href).host}
        text={{
          start: text.start,
          hint: text.hint,
          privacy: text.privacy,
          stop: text.stop,
          open: text.open,
          opensInNewTab: ui.opensInNewTab,
          loading: text.loading,
          frameTitle: text.frameTitle.replace("{titulo}", title),
        }}
        preview={
          preview ? (
            <Image
              src={preview.src}
              width={preview.width}
              height={preview.height}
              alt={preview.alt}
              sizes="(min-width: 640px) 544px, 92vw"
              // fig-interface.webp tem uma moldura branca de 3 a 11 px (é um print): o clip-path corta a moldura.
              className="block h-auto w-full [clip-path:inset(1%_1.6%_1.5%_0.9%_round_0.75rem)]"
            />
          ) : null
        }
        startClassName={buttonVariants()}
        stopClassName={buttonVariants({ variant: "outline" })}
        cropClassName={crop}
      />
    </TryItShell>
  )
}
