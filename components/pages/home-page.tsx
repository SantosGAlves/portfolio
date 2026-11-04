import { Capabilities } from "@/components/sections/capabilities"
import { Contact } from "@/components/sections/contact"
import { Education } from "@/components/sections/education"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { OtherProjects, Projects } from "@/components/sections/projects"
import { Stack } from "@/components/sections/stack"
import { JsonLd, personJsonLd } from "@/lib/json-ld"
import type { Locale } from "@/lib/i18n"

// Ordem da página inicial. O menu do header (site.ts → nav) segue a mesma ordem, e cada seção
// vira uma marca na régua de progresso (data-rail), na ordem em que aparece.
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={personJsonLd(locale)} />
      <Hero locale={locale} />
      <Capabilities locale={locale} />
      <Experience locale={locale} />
      <Stack locale={locale} />
      <Projects locale={locale} />
      <OtherProjects locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
