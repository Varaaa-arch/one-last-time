"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// ─── PARTICLE DATA (module level) ────────────────────────────────────────────

const GALAXY_COUNT = 120000
const galaxyPositions = new Float32Array(GALAXY_COUNT * 3)
const galaxyColors    = new Float32Array(GALAXY_COUNT * 3)

const colorInner = new THREE.Color("#6b3fa0")
const colorMid   = new THREE.Color("#1a3a8f")
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
const dustColors    = new Float32Array(DUST_COUNT * 3)

for (let i = 0; i < DUST_COUNT; i++) {
  const i3 = i * 3
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  const r = 4 + Math.random() * 10
  dustPositions[i3]     = r * Math.sin(phi) * Math.cos(theta)
  dustPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3
  dustPositions[i3 + 2] = r * Math.cos(phi)
  const c = new THREE.Color().setHSL(
    0.65 + Math.random() * 0.15,
    0.4  + Math.random() * 0.4,
    0.15 + Math.random() * 0.25
  )
  dustColors[i3] = c.r; dustColors[i3+1] = c.g; dustColors[i3+2] = c.b
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

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

function CameraController({ progress }: { progress: number }) {
  "use no memo"
  const get = useThree((s) => s.get)
  useFrame(() => {
    const camera = get().camera
    const targetZ = THREE.MathUtils.lerp(14, 1, progress)
    const targetY = THREE.MathUtils.lerp(2, 0.2, progress)
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default function GalaxyBackground({ cameraProgress = 0 }: { cameraProgress?: number }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: false }}
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 2, 14] }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 18, 40]} />
      <Galaxy />
      <NebulaDust />
      <CameraController progress={cameraProgress} />
    </Canvas>
  )
}