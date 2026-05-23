"use client"

import { motion } from "framer-motion"
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

    const handleMove = (e: MouseEvent) => {
      const newTrail: TrailImage = {
        id: id++,
        x: e.clientX,
        y: e.clientY,
        src: images[Math.floor(Math.random() * images.length)],
      }

      setTrails((prev) => [...prev, newTrail])

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
      {trails.map((trail) => (
        <motion.img
          key={trail.id}
          src={trail.src}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            pointer-events-none
            fixed
            z-9998
            h-[180px]
            w-[140px]
            object-cover
          "
          style={{
            left: trail.x - 70,
            top: trail.y - 90,
          }}
        />
      ))}
    </>
  )
}