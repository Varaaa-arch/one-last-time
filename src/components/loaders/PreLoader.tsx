"use client"

import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { startAmbience } from "../audio/AudioManager"

export default function PreLoader() {
  const [entered, setEntered] = useState(false)
  const [time, setTime] = useState("")
  const container = useRef<HTMLDivElement>(null)

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
      gsap.to(".hero-title", {
        x,
        y,
        duration: 1.8,
        ease: "power3.out",
      })
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  // GSAP ENTRANCE ANIMATION (FADE IN UP)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      const cinematicEase = "power4.out"

      tl.fromTo(
        ".hero-title",
        { opacity: 0, y: 140, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: cinematicEase }
      )

      tl.fromTo(
        ".hero-subtext",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: cinematicEase },
        "-=1.2"
      )

      tl.fromTo(
        ".hero-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: cinematicEase },
        "-=1"
      )

      tl.fromTo(
        ".hero-btn",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, ease: cinematicEase },
        "-=0.9"
      )

      tl.fromTo(
        ".bottom-text",
        { opacity: 0, y: 30 },
        { opacity: 0.3, y: 0, duration: 1.5, ease: "power2.out" },
        "-=0.5"
      ).to(".bottom-text", {
        opacity: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.fromTo(".logo", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 })
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
      },
    })
  }

  if (entered) return null

  return (
    <div
      ref={container}
      className="fixed inset-0 z-99999 overflow-hidden bg-[#f3f1ec]"
    >
      {/* GRAIN OVERLAY */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* FLOATING AMBIENT BLUR */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/3 blur-3xl" />

      {/* TOP BAR */}
      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-8">
        <h1 className="logo text-[15px] font-medium uppercase tracking-[-0.03em] text-black">
          One Last Time
        </h1>
        <div className="clock rounded-full border border-black/10 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-black/55 backdrop-blur-xl">
          {time}
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <h1 className="hero-title max-w-[1200px] text-center text-[72px] font-semibold leading-[0.9] tracking-[-0.07em] text-black md:text-[140px]">
          One Last Time.
        </h1>

        <p className="hero-subtext mt-6 text-center text-sm text-black/55 md:text-base">
          Put your headphones on for the best emotional experience.
        </p>

        <div className="hero-line mt-10 h-px w-[260px] origin-center bg-black/10" />

        <button
          onClick={handleEnterClick}
          className="hero-btn group mt-10 rounded-full border border-black px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition-all duration-500 hover:bg-black hover:text-white"
        >
          <span className="flex items-center gap-2">
            Enter
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        </button>
      </div>

      {/* BOTTOM TEXT */}
      <div className="bottom-text absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-black/30">
        Cinematic Interactive Experience
      </div>
    </div>
  )
}