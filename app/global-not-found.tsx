import type { Metadata } from "next"
import { InlineScript } from "@/components/inline-script"
import { buttonVariants } from "@/components/ui/button"
import { fontVariables } from "@/lib/fonts"
import { getContent, homePath, type Locale } from "@/lib/i18n"
import { themeBootScript } from "@/lib/theme"
import "./globals.css"

// 404 do site todo (experimental.globalNotFound no next.config.ts). Não passa pelos layouts raiz e não sabe o
// idioma do endereço, então mostra português e inglês, com o tema salvo e as fontes do site.
const pt = getContent("pt-BR")
const en = getContent("en")

export const metadata: Metadata = {
  title: `404 · ${pt.notFound.title} · ${pt.profile.name}`,
  description: `${pt.notFound.text} ${en.notFound.text}`,
}

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <InlineScript html={themeBootScript} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <header className="border-b">
          <div className="container-site flex h-16 items-center">
            <a href={homePath("pt-BR")} className="rounded-sm font-semibold tracking-[-0.02em]">
              {pt.profile.name}
            </a>
          </div>
        </header>
        <main className="container-site grid flex-1 content-center gap-12 py-16">
          <p className="font-mono text-meta text-subtle">404</p>
          <Block locale="pt-BR" />
          <div className="border-t border-line" />
          <Block locale="en" />
        </main>
      </body>
    </html>
  )
}

function Block({ locale }: { locale: Locale }) {
  const { notFound, sections } = getContent(locale)
  const home = homePath(locale)
  const Heading = locale === "pt-BR" ? "h1" : "h2"

  return (
    <section lang={locale} className="grid max-w-[40rem] justify-items-start gap-4">
      <Heading className="text-h2 text-balance">{notFound.title}</Heading>
      <p className="text-muted-foreground">{notFound.text}</p>
      <div className="flex flex-wrap gap-3">
        <a href={home} className={buttonVariants({ variant: locale === "pt-BR" ? "default" : "outline" })}>
          {notFound.home}
        </a>
        <a href={`${home}#${sections.projects.id}`} className={buttonVariants({ variant: "outline" })}>
          {notFound.projects}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
