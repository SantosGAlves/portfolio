import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
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
