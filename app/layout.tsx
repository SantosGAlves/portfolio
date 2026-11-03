import type { Metadata, Viewport } from "next"
import { Geist_Mono, Schibsted_Grotesk } from "next/font/google"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { site } from "@/content/pt-BR/site"
import { getSiteUrl } from "@/lib/site-url"
import "./globals.css"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

// Todo o site é gerado no build. Se algo passar a depender da requisição,
// o build falha em vez de virar renderização no servidor.
export const ensureStatic = "navigation"

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: site.seo.title,
    template: `%s · ${site.profile.name}`,
  },
  description: site.seo.description,
  applicationName: site.profile.name,
  authors: [{ name: site.profile.name }],
  creator: site.profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.profile.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
}

export const viewport: Viewport = {
  themeColor: "#0e0f12",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${schibsted.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only rounded-control bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          {site.ui.skipToContent}
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
