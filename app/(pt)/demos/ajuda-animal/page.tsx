import { AjudaAnimalDemoPage } from "@/components/pages/ajuda-animal-demo-page"
import { ajudaAnimalDemoMetadata } from "@/lib/demos"

export const metadata = ajudaAnimalDemoMetadata("pt-BR")

export default function Page() {
  return <AjudaAnimalDemoPage locale="pt-BR" />
}
