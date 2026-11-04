import { BarbuDemoPage } from "@/components/pages/barbu-demo-page"
import { barbuDemoMetadata } from "@/lib/demos"

export const metadata = barbuDemoMetadata("en")

export default function Page() {
  return <BarbuDemoPage locale="en" />
}
