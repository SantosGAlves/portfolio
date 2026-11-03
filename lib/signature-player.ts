// Anima a assinatura do hero manipulando atributos data-* do DOM já renderizado
// pelo React (components/hero/signature.tsx). Sem re-render por caractere.
//
// Sequência (~6–7 s): mensagem digitada → entidades destacadas → chamada escrita
// linha a linha → etapas da execução ficam ✓ → resposta aparece.
// Pausa fora da tela; com prefers-reduced-motion mostra o estado final parado.

const TIMING = {
  start: 300,
  charMin: 22,
  charVar: 24,
  afterMessage: 260,
  perEntity: 220,
  beforeCall: 120,
  perCodeChar: 11,
  perLine: 50,
  beforeTrace: 140,
  stepRun: 460,
  stepGap: 110,
  replyTyping: 700,
}

export type SignaturePlayer = { replay: () => void; destroy: () => void }

type Segment = { el: HTMLElement; v: HTMLElement; g: HTMLElement; text: string }

const on = (el: Element, attr: string, value = true) =>
  value ? el.setAttribute(attr, "") : el.removeAttribute(attr)

export function createSignaturePlayer(root: HTMLElement): SignaturePlayer {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const msg = root.querySelector<HTMLElement>("[data-msg]")
  const reply = root.querySelector<HTMLElement>("[data-reply]")
  const segments: Segment[] = Array.from(root.querySelectorAll<HTMLElement>("[data-seg]")).map((el) => {
    const v = el.querySelector<HTMLElement>("[data-v]")!
    const g = el.querySelector<HTMLElement>("[data-g]")!
    return { el, v, g, text: (v.textContent ?? "") + (g.textContent ?? "") }
  })
  const marks = segments.filter((s) => s.el.hasAttribute("data-k")).map((s) => s.el)
  const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"))
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"))

  let runId = 0
  let paused = true
  let visible = false
  let started = false

  function idle() {
    on(root, "data-live")
    if (msg) on(msg, "data-idle")
    for (const s of segments) {
      s.v.textContent = ""
      s.g.textContent = s.text
      on(s.el, "data-typing", false)
      on(s.el, "data-on", false)
    }
    for (const l of lines) {
      on(l, "data-typing", false)
      on(l, "data-on", false)
    }
    for (const st of steps) st.removeAttribute("data-state")
    if (reply) {
      on(reply, "data-typing", false)
      on(reply, "data-on", false)
    }
  }

  // Estado final = sem data-live (o CSS mostra tudo).
  function finish() {
    for (const s of segments) {
      s.v.textContent = s.text
      s.g.textContent = ""
    }
    on(root, "data-live", false)
  }

  // Espera que só conta enquanto o painel está visível; aborta se outra execução começar.
  function wait(ms: number, id: number) {
    return new Promise<boolean>((resolve) => {
      let left = ms
      let last = performance.now()
      const tick = (now: number) => {
        if (id !== runId) return resolve(false)
        if (!paused) left -= now - last
        last = now
        if (left <= 0) return resolve(true)
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  }

  async function run() {
    const id = ++runId
    if (reduce) return finish()
    idle()
    if (!(await wait(TIMING.start, id))) return
    if (msg) on(msg, "data-idle", false)

    for (let i = 0; i < segments.length; i++) {
      const s = segments[i]
      on(s.el, "data-typing")
      for (let c = 1; c <= s.text.length; c++) {
        s.v.textContent = s.text.slice(0, c)
        s.g.textContent = s.text.slice(c)
        if (!(await wait(TIMING.charMin + Math.random() * TIMING.charVar, id))) return
      }
      if (i < segments.length - 1) on(s.el, "data-typing", false)
    }
    if (!(await wait(TIMING.afterMessage, id))) return
    const lastSeg = segments.at(-1)
    if (lastSeg) on(lastSeg.el, "data-typing", false)

    for (const m of marks) {
      on(m, "data-on")
      if (!(await wait(TIMING.perEntity, id))) return
    }
    if (!(await wait(TIMING.beforeCall, id))) return

    for (const l of lines) {
      const n = Number(l.dataset.n) || 8
      on(l, "data-typing")
      if (!(await wait(n * TIMING.perCodeChar + TIMING.perLine, id))) return
      on(l, "data-typing", false)
      on(l, "data-on")
    }
    if (!(await wait(TIMING.beforeTrace, id))) return

    for (const st of steps) {
      st.dataset.state = "run"
      if (!(await wait(TIMING.stepRun, id))) return
      st.dataset.state = st.dataset.final ?? "done"
      if (!(await wait(TIMING.stepGap, id))) return
    }

    if (reply) {
      on(reply, "data-typing")
      if (!(await wait(TIMING.replyTyping, id))) return
      on(reply, "data-typing", false)
      on(reply, "data-on")
    }
  }

  function setPaused(value: boolean) {
    paused = value
    on(root, "data-paused", value)
  }

  // Destaque cruzado: termo na mensagem ↔ campo na chamada.
  function highlight(field: string | null) {
    root.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => on(el, "data-hl", field !== null && el.dataset.k === field))
  }
  const onOver = (e: Event) => highlight((e.target as HTMLElement).closest<HTMLElement>("[data-k]")?.dataset.k ?? null)
  const onLeave = () => highlight(null)
  const onFocusIn = (e: FocusEvent) => {
    const k = (e.target as HTMLElement).closest<HTMLElement>("[data-k]")?.dataset.k
    if (k) highlight(k)
  }
  const onVisibility = () => setPaused(document.hidden || !visible)

  root.addEventListener("mouseover", onOver)
  root.addEventListener("mouseleave", onLeave)
  root.addEventListener("focusin", onFocusIn)
  root.addEventListener("focusout", onLeave)
  document.addEventListener("visibilitychange", onVisibility)

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      setPaused(!visible || document.hidden)
      if (visible && !started) {
        started = true
        void run()
      }
    },
    { threshold: 0.35 },
  )

  if (reduce) finish()
  else {
    idle()
    io.observe(root)
  }

  return {
    replay() {
      started = true
      setPaused(document.hidden)
      void run()
    },
    destroy() {
      runId++
      io.disconnect()
      root.removeEventListener("mouseover", onOver)
      root.removeEventListener("mouseleave", onLeave)
      root.removeEventListener("focusin", onFocusIn)
      root.removeEventListener("focusout", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      highlight(null)
    },
  }
}
