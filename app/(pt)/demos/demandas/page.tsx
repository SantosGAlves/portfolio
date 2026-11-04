import { DemandasDemoPage } from "@/components/pages/demandas-demo-page"
import { demandasDemoMetadata } from "@/lib/demos"

export const metadata = demandasDemoMetadata("pt-BR")

export default function Page() {
  return <DemandasDemoPage locale="pt-BR" />
}
