import { Capabilities } from "@/components/sections/capabilities"
import { Contact } from "@/components/sections/contact"
import { Education } from "@/components/sections/education"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { JsonLd, personJsonLd } from "@/lib/json-ld"
import type { Locale } from "@/lib/i18n"

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={personJsonLd(locale)} />
      <Hero locale={locale} />
      <Projects locale={locale} />
      <Capabilities locale={locale} />
      <Experience locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
