// Fundo "Fluxo" do hero: trilhas ortogonais com pacotes de dados correndo.
// Canvas 2D, sem biblioteca. Carregado sob demanda depois do load.
//
// - pausa quando o hero sai da tela ou a aba fica oculta
// - prefers-reduced-motion: desenha um quadro parado
// - celular/toque: metade das trilhas, 20 fps, sem reação ao cursor
// - cor lida de --brand-rgb e --fx-strength; refaz ao trocar de tema

type Point = [number, number]
type Packet = { s: number; v: number }
type Path = { pts: Point[]; cum: number[]; len: number; packets: Packet[] }

const TAU = Math.PI * 2

export function startFlowField(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  const maybeCtx = canvas.getContext("2d")
  if (!maybeCtx) return () => {}
  const ctx: CanvasRenderingContext2D = maybeCtx

  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)")
  const lightMq = window.matchMedia("(max-width: 767px), (pointer: coarse)")
  const light = () => lightMq.matches

  let W = 0
  let H = 0
  let dpr = 1
  let rgb: [number, number, number] = [126, 224, 143]
  let strength = 1
  let raf = 0
  let last = 0
  let visible = true
  let grid = 44
  let paths: Path[] = []
  let base: HTMLCanvasElement | null = null
  const pointer = { x: 0, y: 0, on: false }

  function readColor() {
    const styles = getComputedStyle(document.documentElement)
    const parts = styles.getPropertyValue("--brand-rgb").trim().split(/\s+/).map(Number)
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) rgb = [parts[0], parts[1], parts[2]]
    strength = Number.parseFloat(styles.getPropertyValue("--fx-strength")) || 1
  }
  const color = (alpha: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, alpha * strength)})`

  function pointAt(p: Path, distance: number): Point {
    const s = ((distance % p.len) + p.len) % p.len
    for (let i = 1; i < p.cum.length; i++) {
      if (p.cum[i] >= s) {
        const a = p.pts[i - 1]
        const b = p.pts[i]
        const k = (s - p.cum[i - 1]) / (p.cum[i] - p.cum[i - 1] || 1)
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
      }
    }
    return p.pts[p.pts.length - 1]
  }

  function strokeAll(c: CanvasRenderingContext2D, alpha: number) {
    c.strokeStyle = color(alpha)
    for (const p of paths) {
      c.beginPath()
      p.pts.forEach((pt, i) => (i ? c.lineTo(pt[0], pt[1]) : c.moveTo(pt[0], pt[1])))
      c.stroke()
    }
  }

  function makePaths() {
    grid = light() ? 56 : 44
    const rows = Math.max(3, Math.floor(H / grid))
    const count = light() ? 6 : 12
    paths = []
    for (let k = 0; k < count; k++) {
      let y = (1 + Math.floor(Math.random() * (rows - 1))) * grid
      let x = -grid
      const pts: Point[] = [[x, y]]
      while (x < W + grid) {
        x += grid * (2 + Math.floor(Math.random() * 5))
        pts.push([x, y])
        if (Math.random() < 0.6) {
          const step = (Math.random() < 0.5 ? -1 : 1) * grid * (1 + Math.floor(Math.random() * 2))
          const ny = Math.min((rows - 1) * grid, Math.max(grid, y + step))
          if (ny !== y) {
            y = ny
            pts.push([x, y])
          }
        }
      }
      const cum = [0]
      for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]))
      }
      const len = cum[cum.length - 1]
      const packets: Packet[] = []
      const n = Math.random() < 0.5 ? 1 : 2
      for (let m = 0; m < n; m++) packets.push({ s: Math.random() * len, v: 32 + Math.random() * 52 })
      paths.push({ pts, cum, len, packets })
    }
  }

  // Grade, trilhas e nós ficam num canvas fixo; por quadro só desenhamos os pacotes.
  function paintBase() {
    base = document.createElement("canvas")
    base.width = canvas.width
    base.height = canvas.height
    const b = base.getContext("2d")
    if (!b) return
    b.setTransform(dpr, 0, 0, dpr, 0, 0)
    b.fillStyle = color(0.05)
    for (let gx = 0; gx <= W; gx += grid) for (let gy = 0; gy <= H; gy += grid) b.fillRect(gx - 0.5, gy - 0.5, 1, 1)
    b.lineWidth = 1
    strokeAll(b, 0.06)
    b.fillStyle = color(0.12)
    for (const p of paths) p.pts.forEach((pt, i) => i && i < p.pts.length - 1 && b.fillRect(pt[0] - 1.5, pt[1] - 1.5, 3, 3))
  }

  function draw(dt: number, still: boolean) {
    ctx.clearRect(0, 0, W, H)
    if (base) ctx.drawImage(base, 0, 0, W, H)
    if (pointer.on) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, 150, 0, TAU)
      ctx.clip()
      ctx.lineWidth = 1
      strokeAll(ctx, 0.18)
      ctx.restore()
    }
    for (const p of paths) {
      for (const k of p.packets) {
        if (!still) k.s = (k.s + k.v * dt) % p.len
        for (let m = 0; m < 7; m++) {
          const q = pointAt(p, k.s - m * 7)
          ctx.fillStyle = color(0.45 * (1 - m / 7))
          ctx.fillRect(q[0] - 1.5, q[1] - 1.5, 3, 3)
        }
      }
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, light() ? 1 : 1.5)
    W = Math.max(1, Math.round(r.width))
    H = Math.max(1, Math.round(r.height))
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    readColor()
    makePaths()
    paintBase()
    draw(0, true)
  }

  const running = () => visible && !document.hidden && !reduceMq.matches

  function loop(now: number) {
    raf = 0
    if (!running()) return
    const fps = light() ? 20 : 60
    if (now - last >= 1000 / fps - 2) {
      const dt = Math.min(0.064, (now - last) / 1000)
      last = now
      draw(dt, false)
    }
    raf = requestAnimationFrame(loop)
  }
  function start() {
    if (!raf && running()) {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const onPointerMove = (e: PointerEvent) => {
    if (light()) return
    const r = canvas.getBoundingClientRect()
    pointer.x = e.clientX - r.left
    pointer.y = e.clientY - r.top
    pointer.on = true
  }
  const onPointerLeave = () => {
    pointer.on = false
  }
  const onVisibility = () => (document.hidden ? stop() : start())
  const onReduce = () => {
    stop()
    draw(0, true)
    start()
  }
  let resizeTimer = 0
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(resize, 150)
  }

  const themeObserver = new MutationObserver(() => {
    readColor()
    paintBase()
    draw(0, true)
  })
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })

  host.addEventListener("pointermove", onPointerMove)
  host.addEventListener("pointerleave", onPointerLeave)
  document.addEventListener("visibilitychange", onVisibility)
  reduceMq.addEventListener("change", onReduce)
  window.addEventListener("resize", onResize)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  io.observe(host)

  resize()
  canvas.dataset.ready = ""
  start()

  return () => {
    stop()
    window.clearTimeout(resizeTimer)
    host.removeEventListener("pointermove", onPointerMove)
    host.removeEventListener("pointerleave", onPointerLeave)
    document.removeEventListener("visibilitychange", onVisibility)
    reduceMq.removeEventListener("change", onReduce)
    window.removeEventListener("resize", onResize)
    themeObserver.disconnect()
    io.disconnect()
  }
}
