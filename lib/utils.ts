import { createCn } from "cn/config"

// Ensina ao cn a escala tipográfica do site (app/globals.css).
// Sem isso, `text-small` seria lido como cor e um `text-foreground`
// no mesmo elemento apagaria o tamanho da fonte.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["name", "role", "h2", "h3", "body", "small", "meta"] }],
    },
  },
})
