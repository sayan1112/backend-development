"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus, Box } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function FloatingSphere({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1 * scale, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function FloatingTorus({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <Torus ref={meshRef} args={[1, 0.3, 16, 100]} position={position}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Torus>
    </Float>
  )
}

function FloatingBox({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2}>
      <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={position}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </Box>
    </Float>
  )
}

export function FloatingElements() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
        
        {/* Floating objects */}
        <FloatingSphere position={[-4, 3, -2]} color="#00d9ff" scale={0.8} />
        <FloatingSphere position={[5, -2, -3]} color="#ff00d9" scale={0.6} />
        <FloatingSphere position={[3, 4, -4]} color="#d9ff00" scale={0.5} />
        
        <FloatingTorus position={[-3, -3, -2]} color="#00ffd9" />
        <FloatingTorus position={[4, 2, -5]} color="#ff6b00" />
        
        <FloatingBox position={[6, -4, -3]} color="#6b00ff" />
        <FloatingBox position={[-5, 2, -4]} color="#00ff6b" />
      </Canvas>
    </div>
  )
}
