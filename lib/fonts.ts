import { Geist_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google"

// Três famílias, todas variáveis (um arquivo cada) e servidas pelo próprio site.
export const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
})

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

// Só a itálica 400: aparece no sobrenome do hero (elemento do LCP), então fica pré-carregada.
// Peso fixo e sem o eixo opsz: o arquivo variável com opsz passava de 140 KB.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  variable: "--font-newsreader",
  display: "swap",
})

export const fontVariables = `${schibsted.variable} ${geistMono.variable} ${newsreader.variable}`
