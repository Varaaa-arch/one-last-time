"use client"

import { motion, type Variants } from "framer-motion"

const reflections = [
  "Aku terlalu sibuk dengan egoku sendiri.",
  "Aku lupa kalau kamu juga lelah.",
  "Aku gagal melihat hal-hal kecil yang kamu lakukan.",
  "Aku memilih diam saat kamu membutuhkan suaraku.",
]

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeCurve,
    },
  },
}

const titleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: easeCurve,
    },
  },
}

export default function WhatIRealized() {
  return (
    <section
      id="what-i-realized"
      className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-6 py-24"
    >
      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* AMBIENT GLOW */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(90,40,180,0.12) 0%, rgba(30,60,180,0.06) 50%, transparent 70%)",
        }}
      />

      {/* VIGNETTE */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* TITLE */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-white/25">
            Momen Kejujuran
          </p>

          <h2
            className="text-[clamp(32px,5vw,64px)] font-semibold tracking-[-0.04em] text-white leading-tight"
            style={{
              textShadow: "0 0 60px rgba(120,80,200,0.25)",
            }}
          >
            Hal yang ku sadari
          </h2>

          <div
            className="mt-6 mx-auto h-px w-16"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(123,79,207,0.6), transparent)",
            }}
          />
        </motion.div>

        {/* CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-4"
        >
          {reflections.map((text, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative rounded-2xl border border-white/10 bg-white/5 px-8 py-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/8"
              style={{
                boxShadow: "0 0 0 0 rgba(123,79,207,0)",
              }}
              whileHover={{
                boxShadow: "0 0 30px rgba(123,79,207,0.08)",
                y: -2,
              }}
            >
              {/* NUMBER */}
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[11px] font-light tracking-[0.2em] text-white/15 transition-colors duration-500 group-hover:text-white/25">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* TEXT */}
              <p className="pl-10 text-[clamp(15px,2vw,18px)] font-light leading-relaxed tracking-wide text-white/60 transition-colors duration-500 group-hover:text-white/80">
                {text}
              </p>

              {/* LEFT ACCENT LINE */}
              <div
                className="absolute left-0 top-1/2 h-[40%] w-px -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(123,79,207,0.6), transparent)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM NOTE */}
        <motion.p
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center text-[12px] font-light italic tracking-wide text-white/20"
        >
          {"Aku nyesel butuh waktu selama ini untuk menyadarinya."}
        </motion.p>
      </div>
    </section>
  )
}