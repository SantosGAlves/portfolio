"use client"

import { usePathname } from "next/navigation"
import { localeLabel, locales, switchLocalePath, type Locale } from "@/lib/i18n"

type Props = { current: Locale; label: string }

// Links comuns (<a>): cada idioma tem seu próprio layout raiz,
// então a troca é sempre uma navegação completa.
export function LanguageSwitch({ current, label }: Props) {
  const pathname = usePathname()

  return (
    <nav aria-label={label} className="inline-flex rounded-lg border border-line-strong p-0.5 font-mono text-[0.75rem]">
      {locales.map((locale) => {
        const active = locale === current
        return (
          <a
            key={locale}
            href={active ? pathname : switchLocalePath(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={active ? "page" : undefined}
            className={`grid min-h-8 min-w-9 place-items-center rounded-md px-1.5 transition-colors duration-200 ${
              active ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {localeLabel[locale]}
          </a>
        )
      })}
    </nav>
  )
}
