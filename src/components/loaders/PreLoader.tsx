"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { startAmbience } from "../audio/AudioManager"

export default function PreLoader() {
  const [entered, setEntered] = useState(false)
  const [time, setTime] = useState("")

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

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1.4,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="
            fixed
            inset-0
            z-99999
            flex
            flex-col
            overflow-hidden
            bg-[#f3f1ec]
          "
        >
          {/* TOP BAR */}
          <div className="absolute left-0 top-0 flex w-full items-center justify-between p-8">
            {/* LOGO */}
            <motion.h1
              initial={{
                    opacity: 0,
                    y: -20,
              }}
              animate={{
                    opacity: 1,
                    y: 0,
              }}
              transition={{
                    duration: 1,
                    delay: 0.2,
              }}
              className="
                text-[15px]
                font-medium
                uppercase
                tracking-[-0.03em]
                text-black
              "
            >
                  One Last Time
                </motion.h1>
            {/* CLOCK */}
            <motion.div
              initial={{
                    opacity: 0,
                    y: -20,
              }}
              animate={{
                    opacity: 1,
                    y: 0,
              }}
              transition={{
                    duration: 1,
                    delay: 0.4,
              }}
              className="
                rounded-full
                border
                border-black/10
                px-4
                py-2
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-black/55
                backdrop-blur-xl
              "
            >
              {time}
            </motion.div>
            </div>

          {/* CENTER CONTENT */}
          <div className="flex h-screen flex-col items-center justify-center px-6">
            
            {/* BIG TITLE */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 60,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                max-w-[1200px]
                text-center
                text-[72px]
                font-medium
                leading-[0.95]
                tracking-[-0.06em]
                text-black
                md:text-[120px]
              "
            >
              One Last Time.
            </motion.h1>

            {/* SUBTEXT */}
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 1,
              }}
              className="
                mt-6
                text-center
                text-sm
                text-black/55
                md:text-base
              "
            >
              Put your headphones on for the best emotional experience.
            </motion.p>

            {/* LINE */}
            <motion.div
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-10
                h-px
                w-[260px]
                origin-center
                bg-black/10
              "
            />

            {/* ENTER BUTTON */}
            <motion.button
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 1,
              }}
              onClick={() => {
                startAmbience()
                setEntered(true)
              }}
              className="
                group
                mt-10
                rounded-full
                border
                border-black
                px-8
                py-4
                text-xs
                uppercase
                tracking-[0.2em]
                text-black
                transition-all
                duration-500
                hover:bg-black
                hover:text-white
              "
            >
              <span className="flex items-center gap-2">
                Enter
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </motion.button>
          </div>

          {/* BOTTOM TEXT */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 1,
            }}
            className="
              absolute
              bottom-8
              left-1/2
              -translate-x-1/2
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-black/35
            "
          >
            Cinematic Interactive Experience
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}