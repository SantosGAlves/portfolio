"use client"

import { useEffect, useRef, useState } from "react"
import { afterLoad } from "@/lib/after-load"

export type LoopVideoProps = {
  src: string
  poster: string
  width: number
  height: number
  /** Descrição para leitores de tela. */
  label: string
  playLabel: string
  pauseLabel: string
  /** Vídeo abaixo da primeira tela: o poster vira um <img loading="lazy">. O atributo poster do
   * <video> sempre baixa na hora e disputava banda com fontes e CSS no carregamento. */
  lazyPoster?: boolean
  className?: string
}

// Vídeo sem som e em loop. Até o load da página só aparece o poster; o arquivo
// é baixado quando o vídeo entra na tela e pausa quando sai.
// Com prefers-reduced-motion não toca sozinho: fica o poster e o botão "Reproduzir".
export function LoopVideo({ src, poster, width, height, label, playLabel, pauseLabel, lazyPoster = false, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  // Com lazyPoster, a imagem fica por cima até o primeiro quadro do vídeo aparecer.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) userPaused.current = true
    let io: IntersectionObserver | null = null

    const cancel = afterLoad(() => {
      setReady(true)
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (userPaused.current) return
            if (!video.getAttribute("src")) video.src = src
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(video)
    })

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onPlaying = () => setStarted(true)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("playing", onPlaying)
    return () => {
      cancel()
      io?.disconnect()
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("playing", onPlaying)
    }
  }, [src])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (playing) {
      userPaused.current = true
      video.pause()
    } else {
      userPaused.current = false
      if (!video.getAttribute("src")) video.src = src
      video.play().catch(() => {})
    }
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <video
        ref={ref}
        poster={lazyPoster ? undefined : poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="block h-auto w-full"
      />
      {lazyPoster && !started ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster de vídeo, já otimizado em .webp
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      ) : null}
      {ready ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 bottom-3 inline-flex min-h-9 items-center gap-2 rounded-full border border-line-strong bg-background/90 px-3 font-mono text-meta text-foreground transition-colors hover:border-brand-line hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span aria-hidden="true" className="grid size-3 place-items-center">
            {playing ? (
              <svg viewBox="0 0 12 12" className="size-3 fill-current">
                <rect x="2" y="1.5" width="2.75" height="9" rx="0.5" />
                <rect x="7.25" y="1.5" width="2.75" height="9" rx="0.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" className="size-3 fill-current">
                <path d="M3 1.6v8.8a.5.5 0 0 0 .76.43l7-4.4a.5.5 0 0 0 0-.86l-7-4.4A.5.5 0 0 0 3 1.6Z" />
              </svg>
            )}
          </span>
          {playing ? pauseLabel : playLabel}
        </button>
      ) : null}
    </div>
  )
}
