import { Button } from "@/components/ui/button"
import { site } from "@/content/pt-BR/site"

// Header fixo e discreto. A borda inferior aparece ao rolar via
// animação ligada à rolagem (CSS puro, sem JS). Navegadores sem suporte
// mostram a borda o tempo todo.
export function SiteHeader() {
  const { profile, nav, ui } = site

  return (
    <header className="site-header sticky top-[env(safe-area-inset-top,0px)] z-50 border-b bg-background/90 backdrop-blur-sm">
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <a
          href="#topo"
          className="rounded-sm text-[0.9375rem] font-bold tracking-[-0.01em] text-foreground"
        >
          <span className="sm:hidden">{profile.shortName}</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <nav aria-label={ui.navLabel} className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 text-small text-muted-foreground md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-sm transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm">
            <a href={profile.links.cv} download>
              {ui.downloadCv}
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
