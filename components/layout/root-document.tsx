import type { ReactNode } from "react"
import { InlineScript } from "@/components/inline-script"
import { ScrollRail } from "@/components/layout/scroll-rail"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { fontVariables } from "@/lib/fonts"
import { getContent, type Locale } from "@/lib/i18n"
import { themeBootScript } from "@/lib/theme"

// Documento HTML compartilhado pelos layouts raiz de cada idioma
// (app/(pt)/layout.tsx e app/(en)/en/layout.tsx).
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { ui } = getContent(locale)

  return (
    <html lang={locale} data-theme="dark" className={fontVariables} suppressHydrationWarning>
      {/* App Router: <head> no layout raiz é o padrão. A regra abaixo vale para o
          Pages Router e dispara aqui só porque o arquivo fica fora de app/.
          O script precisa estar no <head> para aplicar o tema antes da primeira pintura. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <InlineScript html={themeBootScript} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only rounded-control bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          {ui.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <ScrollRail />
      </body>
    </html>
  )
}
