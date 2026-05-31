"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Memory {
  id: number
  imageUrl: string
  caption: string
  rotate: number
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MEMORIES: Memory[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?w=400&q=80",
    caption: "Malam hujan di bulan Mei.",
    rotate: -2,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    caption: "Pemandangan dari balkon kita.",
    rotate: 1.5,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    caption: "Pertama kali kita tertawa sampai nangis.",
    rotate: -1.5,
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
    caption: "Sore itu yang tidak pernah kita rencanakan.",
    rotate: 2,
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    caption: "Jam 3 pagi, kamu masih terjaga.",
    rotate: -1,
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&q=80",
    caption: "Kenangan terakhir yang masih terasa nyata.",
    rotate: 1,
  },
]

// ─── POLAROID CARD ────────────────────────────────────────────────────────────

function PolaroidCard({ memory, index }: { memory: Memory; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: memory.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: memory.rotate }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        rotate: 0,
        scale: 1.04,
        y: -12,
        zIndex: 10,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative shrink-0 cursor-pointer"
      style={{
        filter: `drop-shadow(0 ${hovered ? "30px 40px" : "8px 24px"} rgba(0,0,0,${hovered ? "0.7" : "0.5"}))`,
        transition: "filter 0.4s ease",
      }}
    >
      {/* POLAROID FRAME */}
      <div
        className="flex flex-col bg-white"
        style={{
          width: "240px",
          padding: "12px 12px 40px 12px",
        }}
      >
        {/* PHOTO */}
        <div className="relative overflow-hidden" style={{ height: "280px" }}>
          <motion.img
            src={memory.imageUrl}
            alt={memory.caption}
            className="h-full w-full object-cover"
            animate={{
              filter: hovered
                ? "grayscale(0%) blur(0px) brightness(1)"
                : "grayscale(100%) blur(1px) brightness(0.85)",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* PHOTO OVERLAY — vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
              opacity: hovered ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />
        </div>

        {/* CAPTION */}
        <div className="mt-3 flex items-center justify-center px-2">
          <p
            className="text-center text-[12px] text-zinc-500 leading-snug"
            style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontStyle: "italic" }}
          >
            {memory.caption}
          </p>
        </div>
      </div>

      {/* TAPE — decorative */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-14 opacity-40"
        style={{
          background: "rgba(255,240,180,0.7)",
          backdropFilter: "blur(2px)",
          transform: `translateX(-50%) rotate(${memory.rotate * -0.5}deg)`,
        }}
      />
    </motion.div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function MemoryUniverse() {
  const containerRef    = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const isDragging      = useRef(false)
  const startX          = useRef(0)
  const scrollLeft      = useRef(0)

  // Wheel → horizontal scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return
    e.preventDefault()
    containerRef.current.scrollLeft += e.deltaY * 1.2
  }

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (containerRef.current?.offsetLeft ?? 0)
    scrollLeft.current = containerRef.current?.scrollLeft ?? 0
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const x    = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    containerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = "grab"
  }

  return (
    <section
      id="memory-universe"
      className="relative w-full bg-zinc-950 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* AMBIENT GLOW */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{
          width: "800px", height: "400px",
          background: "radial-gradient(ellipse, rgba(60,30,100,0.2) 0%, transparent 70%)",
        }}
      />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pt-20 pb-12 text-center"
      >
        <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-white/20">
          Semesta Kenangan
        </p>
        <h2
          className="text-[clamp(28px,4vw,52px)] font-semibold tracking-[-0.04em] text-white"
          style={{ textShadow: "0 0 60px rgba(120,80,200,0.25)" }}
        >
          Memory Universe
        </h2>
        <div
          className="mt-5 mx-auto h-px w-12"
          style={{ background: "linear-gradient(to right, transparent, rgba(123,79,207,0.7), transparent)" }}
        />
        <p className="mt-4 text-[11px] text-white/20 tracking-widest uppercase">
          drag atau scroll untuk menjelajahi
        </p>
      </motion.div>

      {/* HORIZONTAL SCROLL TRACK */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative z-10 overflow-x-auto pb-20 pt-8"
        style={{
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* hide scrollbar */}
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        <div
          ref={trackRef}
          className="flex items-center gap-10 px-[15vw]"
          style={{ width: "max-content" }}
        >
          {MEMORIES.map((memory, i) => (
            <PolaroidCard key={memory.id} memory={memory} index={i} />
          ))}
        </div>
      </div>

      {/* EDGE FADE LEFT */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-32 z-20"
        style={{ background: "linear-gradient(to right, rgb(9,9,11), transparent)" }}
      />

      {/* EDGE FADE RIGHT */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-32 z-20"
        style={{ background: "linear-gradient(to left, rgb(9,9,11), transparent)" }}
      />

      {/* BOTTOM NOTE */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="relative z-10 pb-16 text-center text-[10px] italic text-white/15 tracking-wide"
        style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
      >
        "beberapa momen tidak perlu diingat,mereka sudah terasa."
      </motion.p>
    </section>
  )
}