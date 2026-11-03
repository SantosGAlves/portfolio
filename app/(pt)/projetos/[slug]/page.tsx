import type { Metadata } from "next"
import { CaseStudyPage } from "@/components/pages/case-study-page"
import { caseStudyMetadata, caseStudyParams } from "@/lib/case-study-route"

export const generateStaticParams = caseStudyParams

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return caseStudyMetadata("pt-BR", slug)
}

export default async function Page({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params
  return <CaseStudyPage locale="pt-BR" slug={slug} />
}
