import { CopyButton } from "@/components/copy-button"
import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"
import { getContent, type Locale } from "@/lib/i18n"

export function Contact({ locale }: { locale: Locale }) {
  const { sections, contact, profile, ui } = getContent(locale)
  const channels = [
    { label: "LinkedIn", value: profile.links.linkedin.replace(/^https:\/\/(www\.)?/, ""), href: profile.links.linkedin, external: true },
    { label: "GitHub", value: profile.links.github.replace(/^https:\/\//, ""), href: profile.links.github, external: true },
    { label: "CV", value: ui.downloadCv, href: profile.links.cv, external: false, download: true },
  ]

  return (
    <Section id={sections.contact.id} eyebrow={sections.contact.eyebrow} title={sections.contact.title} intro={contact.intro}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid content-start gap-4">
          <p className="font-mono text-meta text-subtle">{contact.emailLabel}</p>
          <a
            href={`mailto:${profile.email}`}
            className="justify-self-start rounded-sm text-[clamp(1.375rem,1rem+1.8vw,2.25rem)] font-semibold tracking-[-0.025em] break-all text-foreground decoration-brand underline-offset-[0.2em] hover:underline"
          >
            {profile.email}
          </a>
          <div>
            <CopyButton
              value={profile.email}
              label={contact.copyEmail}
              copiedLabel={contact.copied}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            />
          </div>
        </div>
        <ul className="grid content-start">
          {channels.map((c) => (
            <li key={c.label} className="border-t border-line last:border-b">
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(c.download ? { download: true } : {})}
                className="group/link grid min-h-14 grid-cols-[6rem_1fr_auto] items-center gap-4 py-3 transition-colors duration-200 hover:text-foreground"
              >
                <span className="font-mono text-meta text-subtle">{c.label}</span>
                <span className="truncate text-small text-muted-foreground transition-colors group-hover/link:text-foreground">
                  {c.value}
                </span>
                <span aria-hidden="true" className="text-brand transition-transform duration-200 group-hover/link:translate-x-0.5">
                  {c.external ? "↗" : "↓"}
                </span>
                {c.external ? <span className="sr-only">{ui.opensInNewTab}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
