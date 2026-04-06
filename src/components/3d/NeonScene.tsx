import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Box, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced animated tech logos with more variety
function TechLogo({ position, color, rotation, shape = 'torus' }: { 
  position: [number, number, number]; 
  color: string; 
  rotation: [number, number, number];
  shape?: 'torus' | 'box' | 'sphere'
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.rotation.y = rotation[1] + Math.cos(state.clock.elapsedTime) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })

  const geometry = useMemo(() => {
    switch(shape) {
      case 'box': return <boxGeometry args={[0.4, 0.4, 0.4]} />
      case 'sphere': return <sphereGeometry args={[0.3, 32, 32]} />
      default: return <torusGeometry args={[0.3, 0.1, 16, 100]} />
    }
  }, [shape])

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {geometry}
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

// Enhanced working character with more details
function WorkingCharacter() {
  const groupRef = useRef<THREE.Group>(null)
  const laptopRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      
      // Typing animation on hands
      if (groupRef.current.children[3]) {
        groupRef.current.children[3].position.x = Math.sin(state.clock.elapsedTime * 4) * 0.03
      }
      if (groupRef.current.children[4]) {
        groupRef.current.children[4].position.x = Math.sin(state.clock.elapsedTime * 4 + Math.PI) * 0.03
      }
    }
    
    // Screen glow animation
    if (laptopRef.current) {
      const material = laptopRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Enhanced Desk */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4, 0.15, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Monitor/Laptop Base */}
      <mesh position={[0, -0.65, 0.2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.05, 1]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Laptop Screen with glow */}
      <mesh ref={laptopRef} position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.6, 0.05, 1]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={0.8}
          roughness={0}
          metalness={1}
        />
      </mesh>
      
      {/* Screen Content (code lines) */}
      <mesh position={[0, 0.1, 0.01]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive="#00ff00"
          emissiveIntensity={0.3}
          roughness={0.9}
        />
      </mesh>
      
      {/* Character Body */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.35, 1.2, 4, 8]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Left Hand */}
      <mesh position={[-0.6, 0.6, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} />
      </mesh>
      
      {/* Right Hand */}
      <mesh position={[0.6, 0.6, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#3a3a4e" roughness={0.6} />
      </mesh>
      
      {/* Coffee Mug */}
      <mesh position={[1.2, -0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Keyboard */}
      <mesh position={[0, -0.7, 0.3]}>
        <boxGeometry args={[1.5, 0.05, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}

// Enhanced floating particles with different sizes
function FloatingParticles() {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * 15
      const y = (Math.random() - 0.5) * 15
      const z = (Math.random() - 0.5) * 15
      const size = Math.random() * 0.03 + 0.01
      const color = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'][Math.floor(Math.random() * 4)]
      temp.push({ x, y, z, size, color })
    }
    return temp
  }, [])

  return (
    <>
      {particles.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[pos.size, 8, 8]} />
          <meshStandardMaterial 
            color={pos.color} 
            emissive={pos.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
  )
}

// Enhanced grid floor with glow
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#0a0a0a" 
        roughness={0.8}
        metalness={0.2}
        emissive="#00ffff"
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

// Floating code blocks
function CodeBlocks() {
  return (
    <>
      <mesh position={[-4, 2, -2]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[4, 1, -3]} rotation={[0, -Math.PI / 6, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[3, 3, 2]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
      </mesh>
    </>
  )
}

export default function NeonScene() {
  return (
    <div className="neon-scene">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff00ff" />
        <pointLight position={[0, 10, -10]} intensity={0.6} color="#00ff00" />
        <spotLight
          position={[0, 8, 5]}
          angle={0.4}
          penumbra={1}
          intensity={1.2}
          color="#00ffff"
        />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
          <GridFloor />
          <WorkingCharacter />
          <FloatingParticles />
          <CodeBlocks />
          
          {/* Enhanced floating tech logos */}
          <TechLogo position={[4, 3, -2]} color="#00ffff" rotation={[0, 0, 0]} shape="torus" />
          <TechLogo position={[-4, 2, -1]} color="#ff00ff" rotation={[0, Math.PI / 4, 0]} shape="box" />
          <TechLogo position={[3, -1, 2]} color="#00ff00" rotation={[Math.PI / 4, 0, 0]} shape="sphere" />
          <TechLogo position={[-3, 4, 1]} color="#ffff00" rotation={[0, Math.PI / 2, 0]} shape="torus" />
          <TechLogo position={[0, 5, -3]} color="#ff0080" rotation={[Math.PI / 6, Math.PI / 6, 0]} shape="box" />
          <TechLogo position={[5, -2, 1]} color="#8000ff" rotation={[0, Math.PI / 3, 0]} shape="sphere" />
          <TechLogo position={[-5, 1, 2]} color="#00ffff" rotation={[Math.PI / 8, 0, Math.PI / 8]} shape="torus" />
          <TechLogo position={[2, 6, -1]} color="#ff00ff" rotation={[0, Math.PI / 5, Math.PI / 5]} shape="box" />
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
