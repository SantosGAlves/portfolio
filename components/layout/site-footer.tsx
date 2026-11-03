import { site } from "@/content/pt-BR/site"

const YEAR = 2026

export function SiteFooter() {
  const { profile, ui } = site
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
              className="rounded-sm transition-colors duration-200 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ))}
          <span className="text-subtle">{ui.footerNote}</span>
        </div>
      </div>
    </footer>
  )
}
