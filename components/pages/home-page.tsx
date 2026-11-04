import { Contact } from "@/components/sections/contact"
import { Education } from "@/components/sections/education"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { Now } from "@/components/sections/now"
import { OtherProjects, Projects } from "@/components/sections/projects"
import { Stack } from "@/components/sections/stack"
import { JsonLd, personJsonLd } from "@/lib/json-ld"
import type { Locale } from "@/lib/i18n"

// Ordem da página inicial, pensada para um recrutador entender quem eu sou em menos de 5 minutos e chegar
// rápido às demos (roteiro do victrhugo.site): hero → experiência → projetos → agora → tecnologias → outros
// projetos → formação → contato. O menu do header (site.ts → nav) segue a mesma ordem, e cada seção vira uma
// marca na régua de progresso (data-rail). Detalhe fica em "Ver mais" (components/ui/more.tsx).
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={personJsonLd(locale)} />
      <Hero locale={locale} />
      <Experience locale={locale} />
      <Projects locale={locale} />
      <Now locale={locale} />
      <Stack locale={locale} />
      <OtherProjects locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
