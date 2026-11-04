import createMDX from "@next/mdx"
import type { NextConfig } from "next"

// As demos ficavam em /demos/<slug>; agora são a seção "Experimente" do próprio caso.
// Mapa demo → estudo de caso (igual ao meta.demo dos .mdx). Âncoras: content/<idioma>/site.ts → caseStudy.tryIt.id.
const movedDemos: Record<string, string> = {
  demandas: "gestao-de-demandas",
  barbu: "barbu",
  "ajuda-animal": "ajuda-animal",
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Só no `next dev`: o servidor de desenvolvimento bloqueia o JavaScript de dev pedido por outra origem.
  // Com `-H 0.0.0.0`, abrir pelo IP da máquina (ex.: no celular, na rede local) é outra origem, e a página
  // fica sem JavaScript. 192.168.15.13 é o IP desta máquina; o curinga cobre a troca de IP pelo DHCP.
  allowedDevOrigins: ["192.168.15.13", "192.168.*.*"],
  async redirects() {
    return Object.entries(movedDemos).flatMap(([demo, project]) => [
      { source: `/demos/${demo}`, destination: `/projetos/${project}#experimente`, permanent: true },
      { source: `/en/demos/${demo}`, destination: `/en/projects/${project}#try-it`, permanent: true },
    ])
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      // CSS Modules ficam fora do loader do Tailwind: com `as: "*.css"` eles
      // perdiam o escopo e as classes (ex.: signature.module.css) sumiam.
      "*.css": {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

// Os estudos de caso são arquivos .mdx em content/<idioma>/projects/, importados
// por lib/projects.ts (não são páginas). Sem plugins remark/rehype por enquanto.
const withMDX = createMDX({})

export default withMDX(nextConfig)
