"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { useRouter } from "next/navigation"

const CORRECT_PASSWORD = "080824"

export default function PasswordGate() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Shake on error
  useEffect(() => {
    if (!error) return
    gsap.timeline()
      .to(dotsRef.current, { x: -8, duration: 0.08, ease: "power2.out", stagger: 0.02 })
      .to(dotsRef.current, { x: 8,  duration: 0.08, ease: "power2.out", stagger: 0.02 })
      .to(dotsRef.current, { x: -5, duration: 0.06, ease: "power2.out", stagger: 0.02 })
      .to(dotsRef.current, { x: 0,  duration: 0.06, ease: "power2.out", stagger: 0.02 })
      .then(() => { setError(false); setInput("") })
  }, [error])

  // Success — set cookie lalu navigate
  useEffect(() => {
    if (!success || !containerRef.current) return
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        document.cookie = "verified=true; path=/; max-age=86400"
        router.push("/letter")
      },
    })
  }, [success, router])

  const handleKey = (digit: string) => {
    if (input.length >= 6) return
    const next = input + digit
    setInput(next)

    if (next.length === 6) {
      if (next === CORRECT_PASSWORD) {
        setSuccess(true)
        gsap.to(dotsRef.current, { scale: 1.3, duration: 0.3, ease: "back.out(2)", stagger: 0.05 })
      } else {
        setTimeout(() => setError(true), 150)
      }
    }
  }

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1))

  const keys = [
    ["1","2","3"],
    ["4","5","6"],
    ["7","8","9"],
    ["","0","⌫"],
  ]

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* AMBIENT GLOW */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-all duration-700"
        style={{
          width: "600px", height: "600px",
          background: success
            ? "radial-gradient(circle, rgba(40,180,100,0.12) 0%, transparent 70%)"
            : error
            ? "radial-gradient(circle, rgba(180,40,40,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(90,40,180,0.14) 0%, transparent 70%)",
        }}
      />

      {/* VIGNETTE */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)" }}
      />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-10"
      >
        {/* HEADER */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-3">
            Private Access
          </p>
          <h1
            className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.04em] text-white"
            style={{ textShadow: "0 0 60px rgba(120,80,200,0.3)" }}
          >
            {success ? "Selamat datang." : "Masukkan tanggal kita."}
          </h1>
          <p className="mt-2 text-[12px] text-white/20 tracking-wide font-light">
            {success ? "Membuka surat..." : "hanya kamu yang tahu."}
          </p>
        </div>

        {/* DOTS */}
        <div className="flex items-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotsRef.current[i] = el }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: input.length > i ? 1 : 0.6,
                  background: success
                    ? "rgba(40,200,100,0.9)"
                    : error
                    ? "rgba(200,60,60,0.9)"
                    : input.length > i
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="h-3 w-3 rounded-full"
              />
            </div>
          ))}
        </div>

        {/* KEYPAD */}
        <AnimatePresence>
          {!success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              {keys.flat().map((key, i) => {
                if (key === "") return <div key={i} />
                const isBackspace = key === "⌫"
                return (
                  <motion.button
                    key={i}
                    onClick={() => isBackspace ? handleBackspace() : handleKey(key)}
                    whileTap={{ scale: 0.88 }}
                    transition={{ duration: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm text-white/60 font-light tracking-wider transition-colors duration-200 hover:bg-white/8 hover:text-white/90 hover:border-white/15 cursor-pointer"
                    style={{ fontSize: isBackspace ? "18px" : "20px" }}
                  >
                    {key}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] uppercase tracking-[0.3em] text-red-400/60"
            >
              Bukan tanggal yang benar.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Hidden keyboard input */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6)
            if (val.length > input.length) handleKey(val[val.length - 1])
            else handleBackspace()
          }}
          className="absolute opacity-0 pointer-events-none"
          maxLength={6}
          inputMode="numeric"
        />
      </motion.div>
    </div>
  )
}