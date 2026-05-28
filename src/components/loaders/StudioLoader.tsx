"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────

const PARTICLE_COUNT = 60

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#7b4fcf", "#3b6fd4", "#9b6de8", "#4a90d9", "#c084fc"]

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 2.4 + 0.7,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.4 + 0.1),
      opacity: Math.random() * 0.65 + 0.3,
      color:  colors[Math.floor(Math.random() * colors.length)],
    }))

    let rafId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY
        p.opacity -= 0.0008

        if (p.y < 0 || p.opacity <= 0) {
          p.x       = Math.random() * canvas.width
          p.y       = canvas.height + 10
          p.opacity = Math.random() * 0.65 + 0.3
          p.speedX  = (Math.random() - 0.5) * 0.3
          p.speedY  = -(Math.random() * 0.4 + 0.1)
        }
      })

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 1 }}
    />
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function StudioLoader() {
  const [progress, setProgress] = useState(0)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    let value = 0
    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 6) + 2
      if (value >= 100) {
        value = 100
        clearInterval(interval)
        setTimeout(() => {
          setHide(true)
          document.body.style.overflow = "auto"
        }, 900)
      }
      setProgress(value)
    }, 90)
    return () => {
      clearInterval(interval)
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-999999 bg-black overflow-hidden"
        >
          {/* PARTICLES */}
          <ParticleCanvas />

          {/* GRAIN */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-screen"
            style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", zIndex: 2 }}
          />

          {/* AMBIENT GLOW CENTER */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(90,40,180,0.2) 0%, transparent 70%)",
              zIndex: 2,
            }}
          />

          {/* VIGNETTE */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)",
              zIndex: 3,
            }}
          />

          {/* CONTENT */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* TOP INFO */}
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-white/35">
                <p>One Last Time</p>
                <p>{progress}</p>
              </div>

              {/* IMAGE */}
              <div className="overflow-hidden relative">
                <motion.img
                  initial={{ scale: 1.2, filter: "blur(12px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                  src="https://qzjxfmdilqdybxkhhpdk.supabase.co/storage/v1/object/public/textures/loader/asojdwa.jpg"
                  alt="loader"
                  className="h-[340px] w-[240px] object-cover"
                  style={{ filter: "brightness(0.65) saturate(0.7)" }}
                />

                {/* IMAGE OVERLAY GRADIENT */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                  }}
                />
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-3 h-px w-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #7b4fcf, #4a90d9)",
                    transition: "width 0.15s ease",
                    boxShadow: "0 0 8px rgba(120,80,200,0.6)",
                  }}
                />
              </div>

              {/* LOADING TEXT */}
              <p className="mt-2 text-center text-[9px] uppercase tracking-[0.25em] text-white/20">
                Loading experience
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
