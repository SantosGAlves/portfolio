import { getContent, type Locale } from "@/lib/i18n"

const YEAR = 2026

export function SiteFooter({ locale }: { locale: Locale }) {
  const { profile, ui } = getContent(locale)
  const links = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
  ]

  return (
    <footer className="border-t">
      <div className="container-site flex flex-col gap-4 py-10 text-small text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-meta">
          © {YEAR} {profile.name} · {profile.location}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex min-h-8 items-center gap-1 rounded-sm font-semibold text-brand hover:underline hover:underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> {ui.opensInNewTab}</span>
            </a>
          ))}
          <span className="text-subtle">{ui.footerNote}</span>
        </div>
      </div>
    </footer>
  )
}
