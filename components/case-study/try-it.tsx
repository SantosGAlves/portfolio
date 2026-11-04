import type { ReactNode } from "react"
import { AjudaAnimalSkeleton } from "@/components/demos/ajuda-animal/skeleton"
import { BarbuSkeleton } from "@/components/demos/barbu/skeleton"
import { DemandasSkeleton } from "@/components/demos/demandas/skeleton"
import { getDemoContent, type DemoSlug } from "@/lib/demos"
import { getContent, type Locale } from "@/lib/i18n"
import { LazyDemo } from "./lazy-demo"

// Seção "Experimente" do estudo de caso (<Demo /> no MDX): título, o que dá para fazer, selo, a demo e
// as notas sobre o que é real e o que é simulado. Texto na coluna de leitura; a demo usa a largura
// toda do conteúdo (o <article> do caso é um container, daí o 50cqi) e, no celular, a da tela.
// --demo-reserve: altura que fica livre fora da demo no celular, para a página continuar rolando.

const skeletons: Record<DemoSlug, () => ReactNode> = {
  demandas: DemandasSkeleton,
  barbu: BarbuSkeleton,
  "ajuda-animal": AjudaAnimalSkeleton,
}

export function TryIt({ slug, locale }: { slug: DemoSlug; locale: Locale }) {
  const { tryIt } = getContent(locale).caseStudy
  const demo = getDemoContent(slug, locale)
  const Skeleton = skeletons[slug]
  const text = demo.section
  const headingId = tryIt.id

  return (
    <section aria-labelledby={headingId} className="mt-14 mx-[calc(50%-50cqi)]">
      <div className="mx-auto grid max-w-[46rem] justify-items-start gap-4">
        <h2 id={headingId} className="scroll-mt-24 text-h2">
          {tryIt.title}
        </h2>
        <p className="text-muted-foreground">{text.intro}</p>
        <p className="rounded-full border border-brand-line bg-brand-soft px-3 py-1 font-mono text-meta text-brand">{text.badge}</p>
      </div>

      <div className="mt-8 [--demo-reserve:3rem] sm:[--demo-reserve:0px]">
        <LazyDemo
          {...({ slug, content: demo } as Parameters<typeof LazyDemo>[0])}
          fallback={
            <>
              <Skeleton />
              <p role="status" className="sr-only">
                {tryIt.loading}
              </p>
            </>
          }
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-[46rem] gap-3">
        <h3 className="text-h3">{text.notesTitle}</h3>
        <ul className="grid list-disc gap-2 pl-5 text-muted-foreground marker:text-subtle">
          {text.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
