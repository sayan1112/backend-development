"use client"

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMotionValue, useSpring } from 'framer-motion'

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 })

  // Generate particle positions
  const particleCount = 2000
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  useFrame((state) => {
    if (ref.current) {
      // Rotate particles
      ref.current.rotation.x += 0.0002
      ref.current.rotation.y += 0.0003
      
      // Mouse interaction
      const mx = smoothMouseX.get()
      const my = smoothMouseY.get()
      ref.current.rotation.x += my * 0.0005
      ref.current.rotation.y += mx * 0.0005

      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      ref.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d9ff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function WaveGrid() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime
      const geometry = ref.current.geometry as THREE.PlaneGeometry
      const positions = geometry.attributes.position

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const wave = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.3
        positions.setZ(i, wave)
      }

      positions.needsUpdate = true
      ref.current.rotation.x = Math.sin(time * 0.2) * 0.1
      ref.current.rotation.y = Math.cos(time * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 4, 0, 0]} position={[0, -5, -10]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color="#0a0a0a"
        wireframe
        transparent
        opacity={0.1}
      />
    </mesh>
  )
}

export function EnhancedParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField />
        <WaveGrid />
      </Canvas>
    </div>
  )
}
