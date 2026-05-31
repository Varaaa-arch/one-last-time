"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { createClient } from "@supabase/supabase-js"

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const WA_NUMBER = "6285697350772" // ganti dengan nomor kamu
const WA_URL    = `https://wa.me/${WA_NUMBER}`

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── PARTICLES ────────────────────────────────────────────────────────────────

function WarmParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#f97316", "#fb923c", "#fbbf24", "#f59e0b", "#ffffff"]

    const particles = Array.from({ length: 50 }, () => ({
      x:      Math.random() * canvas.width,
      y:      canvas.height + Math.random() * 200,
      size:   Math.random() * 1.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.4 + 0.1),
      opacity: Math.random() * 0.4 + 0.1,
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
        p.opacity -= 0.0005
        if (p.y < 0 || p.opacity <= 0) {
          p.x       = Math.random() * canvas.width
          p.y       = canvas.height + 10
          p.opacity = Math.random() * 0.4 + 0.1
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
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize) }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function FinalScene() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const isInView    = useInView(sectionRef, { once: true, margin: "-100px" })
  const loggedRef   = useRef(false)

  // Log completion ke Supabase — hanya sekali
  useEffect(() => {
    if (!isInView || loggedRef.current) return
    loggedRef.current = true

    const logCompletion = async () => {
      try {
        await supabase.from("user_logs").insert({
          event:      "completed_story",
          status:     "reached_end",
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        console.error("Supabase log error:", err)
      }
    }

    logCompletion()
  }, [isInView])

  const handleTalk = () => {
    window.open(WA_URL, "_blank")
  }

  return (
    <section
      ref={sectionRef}
      id="final-scene"
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6"
      style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(194,65,12,0.18) 0%, rgba(120,40,0,0.08) 40%, #000000 75%)",
      }}
    >
      {/* WARM PARTICLES */}
      <WarmParticles />

      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.03] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* SUNRISE GLOW — bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-1"
        style={{
          width: "900px",
          height: "400px",
          background: "radial-gradient(ellipse at bottom, rgba(251,146,60,0.12) 0%, rgba(249,115,22,0.06) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* VIGNETTE */}
      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)" }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center">

        {/* EYEBROW */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-[10px] uppercase tracking-[0.5em] text-orange-300/30"
        >
          Akhir dari cerita ini
        </motion.p>

        {/* MAIN TEXT */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="max-w-2xl text-[clamp(32px,5vw,72px)] font-semibold leading-[1.1] tracking-[-0.04em] text-white"
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            textShadow: "0 0 80px rgba(251,146,60,0.2), 0 0 160px rgba(249,115,22,0.1)",
          }}
        >
          Terima kasih sudah mencintaiku.
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          className="max-w-md text-[clamp(13px,1.8vw,16px)] font-light leading-relaxed text-white/35"
          style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontStyle: "italic" }}
        >
          Apapun yang terjadi selanjutnya, aku ingin kamu tahu, kamu berarti lebih dari yang bisa aku ungkapkan.
        </motion.p>

        {/* DIVIDER */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 1 }}
          className="h-px w-24 origin-center"
          style={{ background: "linear-gradient(to right, transparent, rgba(251,146,60,0.4), transparent)" }}
        />

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        >
          <motion.button
            onClick={handleTalk}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(251,146,60,0.2), inset 0 0 20px rgba(251,146,60,0.05)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="group relative flex items-center gap-3 rounded-full border border-orange-400/20 bg-orange-400/5 px-10 py-5 backdrop-blur-md"
          >
            {/* GLOW RING */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(251,146,60,1) 0%, transparent 70%)" }}
            />

            <span
              className="relative text-[11px] uppercase tracking-[0.3em] font-light text-orange-200/70 transition-colors duration-300 group-hover:text-orange-100"
              style={{ fontFamily: "var(--font-sans, sans-serif)" }}
            >
              Ayo, kita bicara lagi
            </span>

            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-orange-300/50 text-sm group-hover:text-orange-200"
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* SIGN OFF */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1.8 }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/10"
        >
          One Last Time - 2026
        </motion.p>

      </div>
    </section>
  )
}