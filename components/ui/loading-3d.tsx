"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function SpinningRing() {
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 2
      ringRef.current.rotation.y = state.clock.elapsedTime * 1.5
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#00d9ff" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function PulsingCore() {
  const sphereRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (sphereRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      sphereRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ff00d9" emissive="#ff00d9" emissiveIntensity={0.5} />
    </mesh>
  )
}

export function Loading3D() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="w-64 h-64">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
          <SpinningRing />
          <PulsingCore />
        </Canvas>
      </div>
      <div className="absolute bottom-1/3 text-center">
        <p className="text-lg font-medium text-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
