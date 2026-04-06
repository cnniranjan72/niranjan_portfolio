import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced rotating cube with better materials
function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff"
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

// Simple tech boxes
function TechBox({ position, color, delay = 0 }: { 
  position: [number, number, number]; 
  color: string; 
  delay?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay
      meshRef.current.rotation.x = time * 0.5
      meshRef.current.rotation.y = time * 0.8
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// Enhanced particles
function SimpleParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  const positions = new Float32Array(600) // 200 particles
  for (let i = 0; i < 200; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff00ff" size={0.03} />
    </points>
  )
}

// Enhanced ground with glow
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial 
        color="#0a0a0a" 
        roughness={0.8}
        emissive="#00ffff"
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

export default function MinimalNeonScene() {
  return (
    <div className="neon-scene">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff00ff" />
        <pointLight position={[0, 10, -10]} intensity={0.6} color="#00ff00" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
          <AnimatedCube />
          <SimpleParticles />
          <Ground />
          
          {/* Floating tech boxes */}
          <TechBox position={[3, 2, -2]} color="#00ffff" delay={0} />
          <TechBox position={[-3, 1.5, -1]} color="#ff00ff" delay={0.5} />
          <TechBox position={[2, -1, 2]} color="#00ff00" delay={1} />
          <TechBox position={[-2, 3, 1]} color="#ffff00" delay={1.5} />
          <TechBox position={[0, 4, -3]} color="#ff0080" delay={2} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}
