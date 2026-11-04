import { LanguageSwitch } from "@/components/layout/language-switch"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { getContent, homePath, type Locale } from "@/lib/i18n"

// Header fixo e discreto. A borda inferior aparece ao rolar via animação
// ligada à rolagem (CSS puro). Sem suporte, a borda fica sempre visível.
export function SiteHeader({ locale }: { locale: Locale }) {
  const { profile, nav, sections, ui } = getContent(locale)
  const home = homePath(locale)

  return (
    <header className="site-header sticky top-[env(safe-area-inset-top,0px)] z-50 border-b bg-background/90 backdrop-blur-sm">
      <div className="container-site flex h-(--header-h) items-center justify-between gap-4">
        <a href={home} className="shrink-0 rounded-sm text-[0.9375rem] font-bold tracking-[-0.01em] text-foreground">
          {/* Nome curto no celular e entre 1024 e 1280 px, onde o menu de seis links ocupa o espaço. */}
          <span className="sm:hidden lg:inline xl:hidden">{profile.shortName}</span>
          <span className="hidden sm:inline lg:hidden xl:inline">{profile.name}</span>
        </a>

        <div className="flex items-center gap-3">
          <nav aria-label={ui.navLabel} className="mr-1 hidden lg:block xl:mr-3">
            <ul className="flex items-center gap-5 text-small text-muted-foreground xl:gap-7">
              {nav.map((key) => (
                <li key={key}>
                  <a
                    href={`${home}#${sections[key].id}`}
                    className="rounded-sm whitespace-nowrap transition-colors duration-200 hover:text-foreground"
                  >
                    {sections[key].nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitch current={locale} label={ui.languageLabel} />
          <ThemeToggle
            labels={{ toLight: ui.themeToLight, toDark: ui.themeToDark }}
            className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          />
          <Button asChild variant="outline" size="sm" className="hidden min-[420px]:inline-flex">
            <a href={profile.links.cv} download>
              {ui.downloadCv}
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
