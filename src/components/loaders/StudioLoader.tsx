"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function StudioLoader() {
  const [progress, setProgress] = useState(0)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    let value = 0

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 6) + 2

      if (value >= 100) {
        value = 100

        clearInterval(interval)

        setTimeout(() => {
          setHide(true)

          document.body.style.overflow = "auto"
        }, 900)
      }

      setProgress(value)
    }, 90)

    return () => {
      clearInterval(interval)
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1.4,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-999999 bg-[#f3f1ec]"
        >
          <div className="flex h-screen items-center justify-center">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* TOP INFO */}
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-black">
                <p>BEFORE YOU LEAVE</p>
                <p>{progress}</p>
              </div>

              {/* IMAGE */}
              <div className="overflow-hidden bg-black">
                <motion.img
                  initial={{
                    scale: 1.2,
                    filter: "blur(12px)",
                  }}
                  animate={{
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  src="/textures/loader/loader.jpg"
                  alt="loader"
                  className="h-[340px] w-[240px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}