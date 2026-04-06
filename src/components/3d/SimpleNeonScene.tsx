import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Simple animated tech boxes
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
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

// Simple working character
function WorkingCharacter() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      
      // Typing animation
      if (groupRef.current.children[2]) {
        groupRef.current.children[2].position.x = Math.sin(state.clock.elapsedTime * 4) * 0.02
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Desk */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      
      {/* Laptop */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={0.8}
          roughness={0}
          metalness={1}
        />
      </mesh>
      
      {/* Character */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.6} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.4, 0.5, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} />
      </mesh>
      
      <mesh position={[0.4, 0.5, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Enhanced particles
function Particles() {
  const particles = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.elapsedTime * 0.05
      particles.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  const positions = new Float32Array(900) // 300 particles
  const colors = new Float32Array(900)
  
  for (let i = 0; i < 300; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    
    // Random colors
    const colorChoice = Math.floor(Math.random() * 4)
    const colorsArray = [
      [0, 1, 1], // cyan
      [1, 0, 1], // magenta  
      [0, 1, 0], // green
      [1, 1, 0]  // yellow
    ]
    colors[i * 3] = colorsArray[colorChoice][0]
    colors[i * 3 + 1] = colorsArray[colorChoice][1]
    colors[i * 3 + 2] = colorsArray[colorChoice][2]
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={300}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors />
    </points>
  )
}

export default function SimpleNeonScene() {
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
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          <WorkingCharacter />
          <Particles />
          
          {/* Floating tech boxes */}
          <TechBox position={[3, 2, -2]} color="#00ffff" delay={0} />
          <TechBox position={[-3, 1.5, -1]} color="#ff00ff" delay={0.5} />
          <TechBox position={[2, -1, 2]} color="#00ff00" delay={1} />
          <TechBox position={[-2, 3, 1]} color="#ffff00" delay={1.5} />
          <TechBox position={[0, 4, -3]} color="#ff0080" delay={2} />
          <TechBox position={[4, -2, 1]} color="#8000ff" delay={2.5} />
          
          {/* Ground plane with glow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[25, 25]} />
            <meshStandardMaterial 
              color="#0a0a0a" 
              roughness={0.8}
              emissive="#00ffff"
              emissiveIntensity={0.05}
            />
          </mesh>
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
