import type { Metadata } from "next"
import { CaseStudyPage } from "@/components/pages/case-study-page"
import { caseStudyMetadata, caseStudyParams } from "@/lib/case-study-route"

export const generateStaticParams = caseStudyParams

export async function generateMetadata({ params }: PageProps<"/en/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return caseStudyMetadata("en", slug)
}

export default async function Page({ params }: PageProps<"/en/projects/[slug]">) {
  const { slug } = await params
  return <CaseStudyPage locale="en" slug={slug} />
}
