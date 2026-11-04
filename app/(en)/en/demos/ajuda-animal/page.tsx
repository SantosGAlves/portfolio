import { AjudaAnimalDemoPage } from "@/components/pages/ajuda-animal-demo-page"
import { ajudaAnimalDemoMetadata } from "@/lib/demos"

export const metadata = ajudaAnimalDemoMetadata("en")

export default function Page() {
  return <AjudaAnimalDemoPage locale="en" />
}
