import type { Metadata, Viewport } from "next"
import { getContent, homePath, languageAlternates, type Locale } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"

export function rootMetadata(locale: Locale): Metadata {
  const c = getContent(locale)
  const path = homePath(locale)

  return {
    metadataBase: getSiteUrl(),
    title: { default: c.seo.title, template: `%s · ${c.profile.name}` },
    description: c.seo.description,
    applicationName: c.profile.name,
    authors: [{ name: c.profile.name }],
    creator: c.profile.name,
    alternates: {
      canonical: path,
      languages: languageAlternates(homePath("pt-BR"), homePath("en")),
    },
    openGraph: {
      type: "website",
      locale: c.ogLocale,
      alternateLocale: locale === "pt-BR" ? ["en_US"] : ["pt_BR"],
      url: path,
      siteName: c.profile.name,
      title: c.seo.title,
      description: c.seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: c.seo.title,
      description: c.seo.description,
    },
  }
}

export const rootViewport: Viewport = {
  themeColor: "#0e0f12",
  colorScheme: "dark light",
}
