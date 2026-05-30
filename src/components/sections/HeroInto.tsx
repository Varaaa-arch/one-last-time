"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { gsap } from "gsap"
import { useLenis } from "lenis/react"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PARTICLE DATA
// ─────────────────────────────────────────────────────────────

const GALAXY_COUNT = 120000
const galaxyPositions = new Float32Array(GALAXY_COUNT * 3)
const galaxyColors = new Float32Array(GALAXY_COUNT * 3)

const colorInner = new THREE.Color("#6b3fa0")
const colorMid = new THREE.Color("#1a3a8f")
const colorOuter = new THREE.Color("#0a0a1a")

for (let i = 0; i < GALAXY_COUNT; i++) {
  const i3 = i * 3
  const arm = Math.floor(Math.random() * 3)
  const armAngle = (arm / 3) * Math.PI * 2
  const radius = Math.pow(Math.random(), 0.5) * 18
  const branch = armAngle + radius * 0.4
  const sx = Math.pow(Math.random(), 3) * 2.5
  const sy = Math.pow(Math.random(), 3) * 0.8
  const sz = Math.pow(Math.random(), 3) * 2.5
  galaxyPositions[i3]     = Math.cos(branch) * radius + (Math.random() > 0.5 ? sx : -sx)
  galaxyPositions[i3 + 1] = Math.random() > 0.5 ? sy : -sy
  galaxyPositions[i3 + 2] = Math.sin(branch) * radius + (Math.random() > 0.5 ? sz : -sz)
  const t = Math.min(radius / 18, 1)
  const c = new THREE.Color()
  if (t < 0.4) c.lerpColors(colorInner, colorMid, t / 0.4)
  else         c.lerpColors(colorMid, colorOuter, (t - 0.4) / 0.6)
  galaxyColors[i3] = c.r; galaxyColors[i3+1] = c.g; galaxyColors[i3+2] = c.b
}

const DUST_COUNT = 30000
const dustPositions = new Float32Array(DUST_COUNT * 3)
const dustColors = new Float32Array(DUST_COUNT * 3)

for (let i = 0; i < DUST_COUNT; i++) {
  const i3 = i * 3
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  const r = 4 + Math.random() * 10
  dustPositions[i3]     = r * Math.sin(phi) * Math.cos(theta)
  dustPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3
  dustPositions[i3 + 2] = r * Math.cos(phi)
  const c = new THREE.Color().setHSL(0.65 + Math.random() * 0.15, 0.4 + Math.random() * 0.4, 0.15 + Math.random() * 0.25)
  dustColors[i3] = c.r; dustColors[i3+1] = c.g; dustColors[i3+2] = c.b
}

// ─────────────────────────────────────────────────────────────
// THREE COMPONENTS
// ─────────────────────────────────────────────────────────────

function Galaxy() {
  const mesh = useRef<THREE.Points>(null)
  useFrame((_, delta) => { if (mesh.current) mesh.current.rotation.y += delta * 0.018 })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[galaxyPositions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[galaxyColors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.022} sizeAttenuation vertexColors transparent alphaTest={0.001} depthWrite={false} />
    </points>
  )
}

function NebulaDust() {
  const mesh = useRef<THREE.Points>(null)
  useFrame((_, delta) => { if (mesh.current) mesh.current.rotation.y -= delta * 0.008 })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[dustColors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.06} sizeAttenuation vertexColors transparent opacity={0.35} depthWrite={false} />
    </points>
  )
}

function CameraController({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  "use no memo"
  const get = useThree((s) => s.get)
  useFrame(() => {
    const camera = get().camera
    const t = scrollRef.current
    camera.position.z += (THREE.MathUtils.lerp(14, 1, t) - camera.position.z) * 0.05
    camera.position.y += (THREE.MathUtils.lerp(2, 0.2, t) - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─────────────────────────────────────────────────────────────
// NARRATIVE TEXT
// ─────────────────────────────────────────────────────────────

const LINES = [
  { text: "Hey." },
  { text: "I need you to hear this." },
  { text: "Please, read until the end." },
]

const RANGES: [number, number, number | null, number | null][] = [
  [0.00, 0.15, 0.22, 0.30],
  [0.28, 0.42, 0.50, 0.58],
  [0.62, 0.75, null, null],
]

function NarrativeText({
  scrollRef,
  onMsg3Visible,
}: {
  scrollRef: React.MutableRefObject<number>
  onMsg3Visible: (visible: boolean) => void
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const msg3WasVisible = useRef(false)

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const p = scrollRef.current
      refs.current.forEach((el, i) => {
        if (!el) return
        const [inS, inE, outS, outE] = RANGES[i]
        let opacity = 0, y = 24

        if (p < inS) { opacity = 0; y = 24 }
        else if (p < inE) { const t = (p - inS) / (inE - inS); opacity = t; y = 24 * (1 - t) }
        else if (outS === null) { opacity = 1; y = 0 }
        else if (p < outS) { opacity = 1; y = 0 }
        else if (outE !== null && p < outE) { const t = (p - outS) / (outE - outS); opacity = 1 - t; y = -20 * t }
        else { opacity = 0; y = -20 }

        el.style.opacity = String(opacity)
        el.style.transform = `translateY(${y}px)`

        if (i === 2) {
          const isVisible = opacity > 0.5
          if (isVisible !== msg3WasVisible.current) {
            msg3WasVisible.current = isVisible
            onMsg3Visible(isVisible)
          }
        }
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [scrollRef, onMsg3Visible])

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 10 }}>
      {LINES.map((line, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el }}
          style={{
            position: "absolute", opacity: 0, transform: "translateY(24px)",
            color: "rgba(255,255,255,0.88)", fontSize: "clamp(22px, 3.5vw, 42px)",
            fontFamily: "var(--font-serif, Georgia, serif)", fontWeight: 400,
            letterSpacing: "0.01em", textAlign: "center", padding: "0 2rem",
            textShadow: "0 0 40px rgba(120,80,200,0.4), 0 2px 20px rgba(0,0,0,0.8)",
            willChange: "opacity, transform",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  )
}

function Vignette() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5,
      background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)",
    }} />
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

export default function HeroIntro() {
  const lenis = useLenis()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef(0)
  const canvasRef   = useRef<HTMLDivElement>(null)
  const [mounted, setMounted]   = useState(true)
  const [showBtn, setShowBtn]   = useState(false)

  const handleContinue = () => {
    if (!canvasRef.current) return

    // Fade out galaxy dulu
    gsap.to(canvasRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setMounted(false)
        // Scroll ke #what-i-realized setelah galaxy hilang
        lenis?.scrollTo("#what-i-realized", {
          duration: 1.8,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      },
    })
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => { scrollRef.current = self.progress },
      onEnterBack: () => {
        setMounted(true)
        if (canvasRef.current) canvasRef.current.style.opacity = "1"
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <>
      {mounted && (
        <div
          ref={canvasRef}
          style={{ position: "fixed", inset: 0, zIndex: 0, background: "#000000", pointerEvents: "none" }}
        >
          <Canvas
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            gl={{ antialias: true, alpha: false }}
            camera={{ fov: 60, near: 0.1, far: 100, position: [0, 2, 14] }}
          >
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 18, 40]} />
            <Galaxy />
            <NebulaDust />
            <CameraController scrollRef={scrollRef} />
          </Canvas>

          <Vignette />
          <NarrativeText scrollRef={scrollRef} onMsg3Visible={setShowBtn} />

        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleContinue}
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "999px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(255,255,255,0.7)",
          padding: "12px 28px",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.25em",
          fontFamily: "var(--font-sans, sans-serif)",
          fontWeight: 300,
          opacity: showBtn ? 1 : 0,
          pointerEvents: showBtn ? "auto" : "none",
          transition: "opacity 0.8s ease, color 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,1)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"
          e.currentTarget.style.background = "rgba(255,255,255,0.05)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.7)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
          e.currentTarget.style.background = "none"
        }}
      >
        Continue
        <span style={{ display: "inline-block", transition: "transform 0.3s ease" }}>→</span>
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: "relative", width: "100%", height: "500vh", background: "transparent", zIndex: 1 }}
      />
    </>
  )
}