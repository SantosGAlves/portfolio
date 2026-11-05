import { siWhatsapp } from "simple-icons"
import { CopyButton } from "@/components/copy-button"
import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"
import { getContent, type Locale } from "@/lib/i18n"

// E-mail em destaque, com "Copiar e-mail" e o botão do WhatsApp (link wa.me; o número não aparece na página).
// À direita, LinkedIn e GitHub. O site não tem CV para download, de propósito.
export function Contact({ locale }: { locale: Locale }) {
  const { sections, contact, profile, ui } = getContent(locale)
  const channels = [
    { label: "LinkedIn", value: profile.links.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: profile.links.linkedin },
    { label: "GitHub", value: profile.links.github.replace(/^https:\/\//, ""), href: profile.links.github },
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
          <div className="flex flex-wrap items-center gap-3">
            <a href={profile.links.whatsapp} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[1.125rem]">
                <path d={siWhatsapp.path} />
              </svg>
              {contact.whatsapp}
              <span className="sr-only">{ui.opensInNewTab}</span>
            </a>
            <CopyButton
              value={profile.email}
              label={contact.copyEmail}
              copiedLabel={contact.copied}
              className={buttonVariants({ variant: "outline" })}
            />
          </div>
        </div>
        <ul className="grid content-start">
          {channels.map((c) => (
            <li key={c.label} className="border-t border-line last:border-b">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link grid min-h-14 grid-cols-[6rem_1fr_auto] items-center gap-4 py-3 transition-colors duration-200 hover:text-foreground"
              >
                <span className="font-mono text-meta text-subtle">{c.label}</span>
                <span className="truncate text-small text-muted-foreground transition-colors group-hover/link:text-foreground">
                  {c.value}
                </span>
                <span aria-hidden="true" className="text-brand transition-transform duration-200 group-hover/link:translate-x-0.5">
                  ↗
                </span>
                <span className="sr-only">{ui.opensInNewTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
