// Executa `fn` depois do evento load e de um momento ocioso do navegador,
// para animações nunca competirem com o primeiro carregamento (LCP).
export function afterLoad(fn: () => void): () => void {
  let cancelled = false
  let idleId = 0
  let timeoutId = 0

  const schedule = () => {
    if (cancelled) return
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => !cancelled && fn(), { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(() => !cancelled && fn(), 200)
    }
  }

  if (document.readyState === "complete") schedule()
  else window.addEventListener("load", schedule, { once: true })

  return () => {
    cancelled = true
    window.removeEventListener("load", schedule)
    if (idleId && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId)
    if (timeoutId) window.clearTimeout(timeoutId)
  }
}
