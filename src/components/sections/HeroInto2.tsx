"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"

gsap.registerPlugin(ScrollTrigger)

export default function HeroIntro() {
  const sectionRef     = useRef<HTMLDivElement>(null)
  const textRef        = useRef<HTMLDivElement>(null)
  const msg1Ref        = useRef<HTMLDivElement>(null)
  const msg2Ref        = useRef<HTMLDivElement>(null)
  const msg3Ref        = useRef<HTMLDivElement>(null)
  const btnRef         = useRef<HTMLButtonElement>(null)
  const cameraZRef     = useRef<number>(14)

  const [cameraProgress, setCameraProgress] = useState(0)

  const lenis = useLenis()

  const handleSkip = () => {
    lenis?.scrollTo("#what-i-realized", {
      duration: 2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            // Camera zoom: z dari 14 → 1 seiring scroll
            const z = gsap.utils.interpolate(14, 1, self.progress)
            cameraZRef.current = z
            setCameraProgress(self.progress)
          },
        },
      })

      // ── Message 1: "Hey." ──────────────────────────────────────────
      tl.fromTo(msg1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      )
      tl.to(msg1Ref.current,
        { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" },
        "+=0.15"
      )

      // ── Message 2: "I need you to hear this." ──────────────────────
      tl.fromTo(msg2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      )
      tl.to(msg2Ref.current,
        { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" },
        "+=0.15"
      )

      // ── Message 3: "Please, read until the end." — stays ──────────
      tl.fromTo(msg3Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      )

      // ── Scroll indicator button fades in after msg3 ───────────────
      tl.fromTo(btnRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        "-=0.05"
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* ── Galaxy background placeholder ─────────────────────────── */}
      {/* Replace this div with <GalaxyBackground cameraProgress={cameraProgress} /> */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "#000000" }}
      >
        {/* <GalaxyBackground cameraProgress={cameraProgress} /> */}
      </div>

      {/* ── Vignette ──────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* ── Narrative text ────────────────────────────────────────── */}
      <div
        ref={textRef}
        className="absolute inset-0 z-20 flex items-center justify-center"
      >
        {/* Message 1 */}
        <div
          ref={msg1Ref}
          className="absolute text-center opacity-0"
          style={{ willChange: "opacity, transform" }}
        >
          <p className="font-serif text-[clamp(28px,4vw,56px)] font-light tracking-widest text-white/90"
            style={{ textShadow: "0 0 40px rgba(120,80,200,0.5), 0 2px 20px rgba(0,0,0,0.9)" }}
          >
            Hey.
          </p>
        </div>

        {/* Message 2 */}
        <div
          ref={msg2Ref}
          className="absolute text-center opacity-0"
          style={{ willChange: "opacity, transform" }}
        >
          <p className="font-serif text-[clamp(22px,3.5vw,48px)] font-light tracking-widest text-white/90"
            style={{ textShadow: "0 0 40px rgba(120,80,200,0.5), 0 2px 20px rgba(0,0,0,0.9)" }}
          >
            I need you to hear this.
          </p>
        </div>

        {/* Message 3 */}
        <div
          ref={msg3Ref}
          className="absolute text-center opacity-0"
          style={{ willChange: "opacity, transform" }}
        >
          <p className="font-serif text-[clamp(20px,3vw,44px)] font-light tracking-widest text-white/90"
            style={{ textShadow: "0 0 40px rgba(120,80,200,0.5), 0 2px 20px rgba(0,0,0,0.9)" }}
          >
            Please, read until the end.
          </p>
        </div>
      </div>

      {/* ── Skip / scroll indicator button ───────────────────────── */}
      <button
        ref={btnRef}
        onClick={handleSkip}
        className="
          absolute bottom-10 left-1/2 -translate-x-1/2
          z-30 opacity-0
          flex flex-col items-center gap-2
          text-white/40 hover:text-white/80
          transition-colors duration-500
          cursor-pointer
        "
        style={{ willChange: "opacity, transform" }}
        aria-label="Skip intro"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-light">
          Continue
        </span>
        {/* Animated chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="animate-bounce"
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}