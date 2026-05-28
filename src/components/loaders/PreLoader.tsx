"use client"

import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { startAmbience } from "../audio/AudioManager"

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#7b4fcf", "#3b6fd4", "#9b6de8", "#4a90d9", "#c084fc", "#ffffff"]

    const particles = Array.from({ length: 80 }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -(Math.random() * 0.35 + 0.05),
      opacity: Math.random() * 0.65 + 0.25,
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
        p.opacity -= 0.0006
        if (p.y < 0 || p.opacity <= 0) {
          p.x       = Math.random() * canvas.width
          p.y       = canvas.height + 10
          p.opacity = Math.random() * 0.65 + 0.25
          p.speedX  = (Math.random() - 0.5) * 0.25
          p.speedY  = -(Math.random() * 0.35 + 0.05)
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function PreLoader() {
  const [entered, setEntered] = useState(false)
  const [time, setTime] = useState("")
  const container = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // REALTIME WIB CLOCK
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
      })
      setTime(formatted + " WIB")
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  // MOUSE PARALLAX
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!container.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 40
      const y = (e.clientY / window.innerHeight - 0.5) * 40
      gsap.to(".hero-title", { x, y, duration: 1.8, ease: "power3.out" })
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  // GSAP ENTRANCE ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      const cinematicEase = "power4.out"

      tl.fromTo(".hero-title",
        { opacity: 0, y: 140, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: cinematicEase }
      )
      tl.fromTo(".hero-subtext",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: cinematicEase },
        "-=1.2"
      )
      tl.fromTo(".hero-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: cinematicEase },
        "-=1"
      )
      tl.fromTo(".hero-btn",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, ease: cinematicEase },
        "-=0.9"
      )
      tl.fromTo(".bottom-text",
        { opacity: 0, y: 30 },
        { opacity: 0.3, y: 0, duration: 1.5, ease: "power2.out" },
        "-=0.5"
      ).to(".bottom-text", {
        opacity: 1, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut",
      })

      gsap.fromTo(".logo",  { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 })
      gsap.fromTo(".clock", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 })
    }, container)

    return () => ctx.revert()
  }, [])

  const handleEnterClick = () => {
    startAmbience()
    gsap.to(container.current, {
      opacity: 0,
      duration: 1.4,
      ease: "power3.inOut",
      onComplete: () => {
        setEntered(true)
        router.push("/main")
      },
    })
  }

  if (entered) return null

  return (
    <div ref={container} className="fixed inset-0 z-99999 overflow-hidden bg-black">

      {/* PARTICLES */}
      <ParticleCanvas />

      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.04] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* AMBIENT GLOW — bergerak tipis */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-1 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(90,40,180,0.18) 0%, rgba(30,60,180,0.08) 50%, transparent 70%)" }}
      />

      {/* SUBTLE HORIZONTAL LINES — biar nambah texture */}
      <div className="pointer-events-none absolute inset-0 z-1"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)",
        }}
      />

      {/* VIGNETTE */}
      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)" }}
      />

      {/* TOP BAR */}
      <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-8">
        <h1 className="logo text-[15px] font-medium uppercase tracking-[-0.03em] text-white/60">
          One Last Time
        </h1>
        <div className="clock rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/30 backdrop-blur-xl">
          {time}
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <h1
          className="hero-title max-w-[1200px] text-center text-[72px] font-semibold leading-[0.9] tracking-[-0.07em] text-white md:text-[140px]"
          style={{ textShadow: "0 0 80px rgba(120,80,200,0.35), 0 0 160px rgba(60,40,120,0.2)" }}
        >
          One Last Time.
        </h1>

        <p className="hero-subtext mt-6 text-center text-sm text-white/40 md:text-base">
          Put your headphones on for the best emotional experience.
        </p>

        {/* LINE dengan glow */}
        <div className="hero-line relative mt-10 h-px w-[260px] origin-center overflow-hidden">
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#7b4fcf]/60 to-transparent" />
        </div>

        <button
          onClick={handleEnterClick}
          className="hero-btn group mt-10 rounded-full border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.2em] text-white/60 transition-all duration-500 hover:border-[#7b4fcf]/60 hover:text-white hover:bg-[#7b4fcf]/10"
          style={{ boxShadow: "0 0 0 0 rgba(123,79,207,0)" }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(123,79,207,0.2)" }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 0 rgba(123,79,207,0)" }}
        >
          <span className="flex items-center gap-2">
            Enter
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        </button>
      </div>

      {/* BOTTOM TEXT */}
      <div className="bottom-text absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/20">
        Cinematic Interactive Experience
      </div>

    </div>
  )
}