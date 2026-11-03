import { RootDocument } from "@/components/layout/root-document"
import { rootMetadata, rootViewport } from "@/lib/metadata"
import "../globals.css"

// Layout raiz do português (padrão, na raiz do site).
// Todo o site é gerado no build: se algo passar a depender da requisição, o build falha.
export const ensureStatic = "navigation"
export const metadata = rootMetadata("pt-BR")
export const viewport = rootViewport

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="pt-BR">{children}</RootDocument>
}
