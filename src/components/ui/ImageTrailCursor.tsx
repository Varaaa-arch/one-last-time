"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const images = [
  "/textures/trail/1.jpg",
  "/textures/trail/2.jpg",
  "/textures/trail/3.jpg",
  "/textures/trail/4.jpg",
]

type TrailImage = {
  id: number
  x: number
  y: number
  src: string
}

export default function ImageTrailCursor() {
  const [trails, setTrails] = useState<TrailImage[]>([])

  useEffect(() => {
    let id = 0

    let lastX = 0
    let lastY = 0

    // SEMAKIN BESAR = SEMAKIN SEDIKIT IMAGE
    const MIN_DISTANCE = 100

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY

      const distance = Math.sqrt(dx * dx + dy * dy)

      // JANGAN SPAWN TERLALU SERING
      if (distance < MIN_DISTANCE) return

      lastX = e.clientX
      lastY = e.clientY

      const newTrail: TrailImage = {
        id: id++,
        x: e.clientX,
        y: e.clientY,
        src: images[Math.floor(Math.random() * images.length)],
      }

      setTrails((prev) => [...prev, newTrail])

      // AUTO REMOVE
      setTimeout(() => {
        setTrails((prev) =>
          prev.filter((trail) => trail.id !== newTrail.id)
        )
      }, 900)
    }

    window.addEventListener("mousemove", handleMove)

    return () => {
      window.removeEventListener("mousemove", handleMove)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.img
            key={trail.id}
            src={trail.src}
            initial={{
              opacity: 0,
              scale: 0.8,
              rotate: -8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              pointer-events-none
              fixed
              z-999998
              h-[180px]
              w-[140px]
              object-cover
              rounded-sm
              shadow-2xl
            "
            style={{
              left: trail.x - 70,
              top: trail.y - 90,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}