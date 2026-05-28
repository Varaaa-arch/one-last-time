"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function CustomCursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 280, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 280, mass: 0.5 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 5)
      mouseY.set(e.clientY - 5)
    }
    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [mouseX, mouseY])

  return (
    <>
      {/* MAIN DOT */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="pointer-events-none fixed left-0 top-0 z-999999 h-[10px] w-[10px] rounded-full bg-white"
      />

      {/* SOFT GLOW */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="pointer-events-none fixed left-0 top-0 z-999999 h-[34px] w-[34px] translate-x-[12px] translate-y-[12px] rounded-full bg-white/10 blur-xl"
      />
    </>
  )
}