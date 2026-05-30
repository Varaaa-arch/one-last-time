"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// ─── SHARD DATA ───────────────────────────────────────────────────────────────

const SHARD_COUNT = 28

interface Shard {
  position: THREE.Vector3
  targetPosition: THREE.Vector3
  rotation: THREE.Euler
  scale: number
  color: THREE.Color
}

function generateShards(): Shard[] {
  const colors = [
    new THREE.Color("#9b3fbf"),
    new THREE.Color("#7b2fa0"),
    new THREE.Color("#c060e0"),
    new THREE.Color("#5a1a8a"),
    new THREE.Color("#d080f0"),
  ]

  return Array.from({ length: SHARD_COUNT }, (_, i) => {
    const angle  = (i / SHARD_COUNT) * Math.PI * 2
    const radius = 1.2 + Math.random() * 2.5
    const height = (Math.random() - 0.5) * 3

    return {
      position: new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius * 0.5
      ),
      targetPosition: new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.3
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      scale: 0.15 + Math.random() * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })
}

const SHARDS = generateShards()

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function HeartShard({
  shard,
  progress,
  index,
}: {
  shard: Shard
  progress: React.MutableRefObject<number>
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const delay   = index * 0.015

  useFrame(() => {
    if (!meshRef.current) return
    const p = Math.max(0, Math.min(1, (progress.current - delay) / (1 - delay)))
    const t = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p

    meshRef.current.position.lerpVectors(shard.position, shard.targetPosition, t)
    meshRef.current.rotation.x = shard.rotation.x * (1 - t)
    meshRef.current.rotation.y = shard.rotation.y * (1 - t) + t * 0.2
    meshRef.current.rotation.z = shard.rotation.z * (1 - t)

    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.2 + t * 1.2
    mat.opacity = 0.5 + t * 0.5
  })

  return (
    <mesh ref={meshRef} position={shard.position} rotation={shard.rotation} scale={shard.scale}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={shard.color}
        emissive={shard.color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.5}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  )
}

function HeartCore({ progress }: { progress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const t = progress.current
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    meshRef.current.scale.setScalar(0.01 + t * 0.9)
    mat.emissiveIntensity = t * 2.5
    mat.opacity = t * 0.85
    meshRef.current.rotation.y += 0.005
  })

  return (
    <mesh ref={meshRef} scale={0.01}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#c060e0"
        emissive="#9b3fbf"
        emissiveIntensity={0}
        transparent
        opacity={0}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function SceneLight({ progress }: { progress: React.MutableRefObject<number> }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    lightRef.current.intensity = 0.5 + progress.current * 3
    lightRef.current.color.setHSL(0.75 - progress.current * 0.1, 0.8, 0.5)
  })

  return <pointLight ref={lightRef} position={[0, 2, 3]} intensity={0.5} />
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default function ShatteredHeart({
  progress,
}: {
  progress: React.MutableRefObject<number>
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SceneLight progress={progress} />
      <HeartCore progress={progress} />
      {SHARDS.map((shard, i) => (
        <HeartShard key={i} shard={shard} progress={progress} index={i} />
      ))}
    </>
  )
}