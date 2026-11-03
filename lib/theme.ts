export type Theme = "dark" | "light"

export const THEME_STORAGE_KEY = "theme"
export const defaultTheme: Theme = "dark"
export const themeColor: Record<Theme, string> = { dark: "#0e0f12", light: "#f5f6f7" }

/** Aplica o tema no <html> e na cor da barra do navegador. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor[theme])
}

// Roda no <head> antes da primeira pintura: lê a preferência salva (padrão: escuro).
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark")t=${JSON.stringify(defaultTheme)};var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?${JSON.stringify(
  themeColor.light,
)}:${JSON.stringify(themeColor.dark)});}catch(e){}})()`
