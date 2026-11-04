import { DemandasDemoPage } from "@/components/pages/demandas-demo-page"
import { demandasDemoMetadata } from "@/lib/demos"

export const metadata = demandasDemoMetadata("en")

export default function Page() {
  return <DemandasDemoPage locale="en" />
}
