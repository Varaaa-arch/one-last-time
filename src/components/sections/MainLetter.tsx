"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ShatteredHeart from "../3d/Shatteredheart"

gsap.registerPlugin(ScrollTrigger)

// ─── TYPING TEXT ──────────────────────────────────────────────────────────────

function TypingLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref      = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    if (!isInView) return
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 28)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [isInView, text, delay])

  return (
    <span ref={ref}>
      {displayed}
      {isInView && displayed.length < text.length && (
        <span className="animate-pulse text-white/40">|</span>
      )}
    </span>
  )
}

// ─── PROMISES ─────────────────────────────────────────────────────────────────

const PROMISES = [
  "Aku janji untuk mendengarkan, bukan hanya menunggu giliran bicara.",
  "Aku janji untuk hadir, bahkan di saat aku ingin menghilang.",
  "Aku janji untuk menghargai lelahmu, seperti aku menghargai lelahku.",
  "Aku janji ini bukan sekadar kata-kata.",
]

function PromiseItem({
  text,
  index,
  onVisible,
}: {
  text: string
  index: number
  onVisible: (i: number) => void
}) {
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => { setChecked(true); onVisible(index) }, 400)
    return () => clearTimeout(t)
  }, [isInView, index, onVisible])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="flex items-start gap-4"
    >
      <motion.div
        animate={checked
          ? { borderColor: "rgba(160,80,220,0.8)", background: "rgba(123,79,207,0.15)" }
          : { borderColor: "rgba(255,255,255,0.15)", background: "transparent" }
        }
        transition={{ duration: 0.5 }}
        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border"
      >
        <motion.svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <motion.path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="rgba(200,120,255,0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={checked ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          />
        </motion.svg>
      </motion.div>
      <p
        className="text-[clamp(14px,1.8vw,16px)] font-light leading-relaxed transition-colors duration-500"
        style={{ color: checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.4)" }}
      >
        {text}
      </p>
    </motion.div>
  )
}

// ─── LETTER ───────────────────────────────────────────────────────────────────

const LETTER_PARAGRAPHS = [
  "Di antara riuhnya dunia dan cepatnya waktu berlalu, kamu adalah satu-satunya tempat di mana aku menemukan jeda. Kamu bukan sekadar kehadiran dalam hidupku, kamu adalah ketenangan yang selalu aku cari setelah lelahnya hari, sebuah pelabuhan yang menjanjikan damai saat badai di luar sana sedang tak menentu.",
  "Setiap kali aku menatapmu, atau bahkan sekadar memikirkan namamu, dunia seakan melambat. Ada semacam magis dalam caramu tertawa, dalam caramu menatap, yang membuat segala hal yang tadinya terasa berat, seketika luruh dan menjadi ringan. Kamu adalah bukti nyata bahwa keindahan tidak selalu harus berteriak, ia cukup hadir dengan caramu yang lembut, yang tanpa sadar telah menjahit setiap celah di hatiku hingga terasa utuh kembali.",
  "Terima kasih karena telah menjadi rumah yang tidak pernah lelah menyambutku pulang. Terima kasih telah menjadi sosok yang membuatku ingin terus menjadi versi terbaik dari diriku, bukan karena dituntut, tapi karena aku ingin layak berada di sisimu.",
  "Aku tidak berjanji akan selalu memberikan hari-hari yang sempurna, tapi aku berjanji untuk selalu ada di sampingmu mendengarkan setiap ceritamu, merayakan kemenangan kecilmu, dan mendekapmu erat saat dunia mungkin sedang tidak berpihak padamu. Kamu adalah segalanya yang aku butuhkan, dan aku mencintaimu lebih dari sekadar kata-kata yang bisa aku susun hari ini.",
  "Tetaplah di sini, bersamaku, melangkah melewati apa pun yang ada di depan. Karena bagiku, kebahagiaan yang sesungguhnya bukanlah tentang di mana kita berada, tapi dengan siapa aku menjalaninya. Dan bagiku, orang itu adalah kamu.",
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function MainLetter() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [checkedCount, setCheckedCount] = useState(0)

  const handlePromiseVisible = (i: number) => {
    setCheckedCount((prev) => Math.max(prev, i + 1))
    gsap.to(progressRef, {
      current: Math.min(1, (i + 1) / PROMISES.length),
      duration: 1.2,
      ease: "power2.out",
    })
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => { progressRef.current = self.progress },
    })
    return () => trigger.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="main-letter"
      className="relative w-full bg-black"
      style={{ minHeight: "300vh" }} // panjang scroll zone
    >
      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* ── STICKY CONTAINER ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* VIGNETTE */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)" }}
        />

        {/* 3D HEART — center of sticky viewport */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[420px] w-[420px]">
            <Canvas
              camera={{ fov: 50, position: [0, 0, 6] }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent", width: "100%", height: "100%" }}
            >
              <ShatteredHeart progress={progressRef} />
            </Canvas>
          </div>

          {/* GLOW under heart */}
          <div
            className="pointer-events-none absolute rounded-full blur-3xl"
            style={{
              width: "300px", height: "100px",
              bottom: "calc(50% - 240px)",
              background: `rgba(123,79,207,${0.04 + checkedCount * 0.07})`,
              transition: "background 1s ease",
            }}
          />
        </div>

        {/* SECTION LABEL — top center, fades in */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-1">
            Satu Surat Terakhir
          </p>
          <h2
            className="text-[clamp(22px,3vw,40px)] font-semibold tracking-[-0.04em] text-white"
            style={{ textShadow: "0 0 40px rgba(120,80,200,0.3)" }}
          >
            Untuk Kamu
          </h2>
        </motion.div>

        {/* SCROLL HINT — bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/15">
          <span className="text-[9px] uppercase tracking-[0.3em]">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── SCROLLABLE TEXT — overlays the sticky heart ── */}
      <div
        className="relative z-20 mx-auto max-w-lg px-6"
        style={{ marginTop: "-100vh", paddingTop: "110vh" }} // starts below sticky
      >

        {/* LETTER BODY */}
        <div className="mb-16 space-y-6 rounded-2xl border border-white/8 bg-black/70 p-8 backdrop-blur-xl">
          {LETTER_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="text-[clamp(14px,1.9vw,17px)] font-light leading-[1.9] text-white/65"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
            >
              <TypingLine text={para} delay={i * 180} />
            </motion.p>
          ))}
        </div>

        {/* PROMISES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-white/25">
            Janjiku
          </p>
          <div className="space-y-5 rounded-2xl border border-white/8 bg-black/70 p-7 backdrop-blur-xl">
            {PROMISES.map((text, i) => (
              <PromiseItem key={i} text={text} index={i} onVisible={handlePromiseVisible} />
            ))}
          </div>
        </motion.div>

        {/* SIGN-OFF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-12 pb-32 text-right"
        >
          <p
            className="text-[12px] font-light italic text-white/25 tracking-wide"
            style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
          >
            — Seseorang yang selalu mencintai mu,
          </p>
          <p className="mt-1 text-[13px] font-light text-white/40 tracking-widest uppercase">
            Bizar.
          </p>
        </motion.div>

      </div>
    </section>
  )
}