"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

// ─── PRE-GENERATE PARTICLE DATA (module level, never re-runs) ─────────────────

const GALAXY_COUNT = 120000
const galaxyPositions = new Float32Array(GALAXY_COUNT * 3)
const galaxyColors    = new Float32Array(GALAXY_COUNT * 3)

const colorInner = new THREE.Color("#6b3fa0")
const colorMid   = new THREE.Color("#1a3a8f")
const colorOuter = new THREE.Color("#0a0a1a")

for (let i = 0; i < GALAXY_COUNT; i++) {
  const i3       = i * 3
  const armCount = 3
  const arm      = Math.floor(Math.random() * armCount)
  const armAngle = (arm / armCount) * Math.PI * 2
  const radius   = Math.pow(Math.random(), 0.5) * 18
  const spin     = radius * 0.4
  const branch   = armAngle + spin

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

  galaxyColors[i3]     = c.r
  galaxyColors[i3 + 1] = c.g
  galaxyColors[i3 + 2] = c.b
}

const DUST_COUNT = 30000
const dustPositions = new Float32Array(DUST_COUNT * 3)
const dustColors    = new Float32Array(DUST_COUNT * 3)

for (let i = 0; i < DUST_COUNT; i++) {
  const i3    = i * 3
  const theta = Math.random() * Math.PI * 2
  const phi   = Math.acos(2 * Math.random() - 1)
  const r     = 4 + Math.random() * 10

  dustPositions[i3]     = r * Math.sin(phi) * Math.cos(theta)
  dustPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3
  dustPositions[i3 + 2] = r * Math.cos(phi)

  const hue = 0.65 + Math.random() * 0.15
  const sat = 0.4  + Math.random() * 0.4
  const lit = 0.15 + Math.random() * 0.25
  const c   = new THREE.Color().setHSL(hue, sat, lit)

  dustColors[i3]     = c.r
  dustColors[i3 + 1] = c.g
  dustColors[i3 + 2] = c.b
}

// ─── GALAXY ───────────────────────────────────────────────────────────────────

function Galaxy() {
  const mesh = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.018
  })

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

// ─── NEBULA DUST ──────────────────────────────────────────────────────────────

function NebulaDust() {
  const mesh = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y -= delta * 0.008
  })

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

// ─── CAMERA CONTROLLER ────────────────────────────────────────────────────────

function CameraController({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  "use no memo"

  const get = useThree((s) => s.get)

  useFrame(() => {
    const camera = get().camera
    const t       = scrollRef.current
    const targetZ = THREE.MathUtils.lerp(14, 1, t)
    const targetY = THREE.MathUtils.lerp(2, 0.2, t)

    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── NARRATIVE TEXT ───────────────────────────────────────────────────────────

const LINES = [
  { text: "Hey.",                        stay: false },
  { text: "I need you to hear this.",    stay: false },
  { text: "Please, read until the end.", stay: true  },
]

function NarrativeText() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.2 })

    LINES.forEach((line, i) => {
      const el = refs.current[i]
      if (!el) return

      tl.to(el, { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" })

      if (!line.stay) {
        tl.to(el, { opacity: 0, y: -20, duration: 1.2, ease: "power2.in" }, "+=1.4")
      }
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 10 }}>
      {LINES.map((line, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el }}
          style={{
            position: "absolute",
            opacity: 0,
            transform: "translateY(24px)",
            color: "rgba(255,255,255,0.88)",
            fontSize: "clamp(22px, 3.5vw, 42px)",
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontWeight: 400,
            letterSpacing: "0.01em",
            textAlign: "center",
            padding: "0 2rem",
            textShadow: "0 0 40px rgba(120,80,200,0.4), 0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  )
}

// ─── VIGNETTE ─────────────────────────────────────────────────────────────────

function Vignette() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)",
      }}
    />
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function HeroIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef(0)

  useEffect(() => {
    if (!sectionRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => { scrollRef.current = self.progress },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} style={{ position: "relative", width: "100%", height: "200vh", background: "#000000" }}>
      <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
        <Canvas
          style={{ position: "absolute", inset: 0 }}
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
        <NarrativeText />
      </div>
    </section>
  )
}