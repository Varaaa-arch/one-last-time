"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function CustomCursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // SMOOTH FOLLOW
  const smoothX = useSpring(mouseX, {
    damping: 20,
    stiffness: 120,
    mass: 0.5,
  })

  const smoothY = useSpring(mouseY, {
    damping: 20,
    stiffness: 120,
    mass: 0.5,
  })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12)
      mouseY.set(e.clientY - 12)
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* MAIN CURSOR */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[999999
          h-6
          w-6
          rounded-full
          bg-white
          mix-blend-difference
        "
      />

      {/* GLOW */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-999998
          h-16
          w-16
          rounded-full
          bg-white/10
          blur-2xl
        "
      />
    </>
  )
}