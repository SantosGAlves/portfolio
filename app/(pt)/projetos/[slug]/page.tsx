import type { Metadata } from "next"
import { CaseStudyPage } from "@/components/pages/case-study-page"
import { caseStudyMetadata, caseStudyParams } from "@/lib/case-study-route"

export const generateStaticParams = caseStudyParams
// O site navega com <a> (página inteira), sem navegação instantânea do Next: tira a página da validação
// de dev que reclamava do `params` fora de <Suspense>. Não muda o build (cada caso continua pré-renderizado).
export const instant = false

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return caseStudyMetadata("pt-BR", slug)
}

export default async function Page({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params
  return <CaseStudyPage locale="pt-BR" slug={slug} />
}
