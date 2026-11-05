/** Domínio público do site. */
export const SITE_URL = "https://santosgalves.online"

// URL pública do site, usada em metadata, canônicas, hreflang, sitemap, robots, Open Graph e JSON-LD.
// Ordem: variável definida à mão > domínio público em qualquer build de produção (Vercel, prévias ou
// `next start` local; prévias apontam a canônica para o domínio) > localhost no `next dev`.
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return new URL(explicit)
  if (process.env.NODE_ENV === "production") return new URL(SITE_URL)
  return new URL("http://localhost:3000")
}
