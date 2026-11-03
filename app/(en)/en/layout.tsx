import { RootDocument } from "@/components/layout/root-document"
import { rootMetadata, rootViewport } from "@/lib/metadata"
import "../../globals.css"

// Layout raiz do inglês (/en).
export const ensureStatic = "navigation"
export const metadata = rootMetadata("en")
export const viewport = rootViewport

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>
}
