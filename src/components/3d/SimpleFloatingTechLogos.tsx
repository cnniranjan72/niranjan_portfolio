import { motion } from 'framer-motion'
import { Code, Database, Terminal, GitBranch, Package, Cpu } from 'lucide-react'

const SimpleFloatingTechLogos = () => {
  const techLogos = [
    { icon: <Code size={24} />, delay: 0, color: "text-cyan-400" },
    { icon: <Database size={24} />, delay: 0.5, color: "text-green-400" },
    { icon: <Terminal size={24} />, delay: 1, color: "text-blue-400" },
    { icon: <GitBranch size={24} />, delay: 1.5, color: "text-orange-400" },
    { icon: <Package size={24} />, delay: 2, color: "text-purple-400" },
    { icon: <Cpu size={24} />, delay: 2.5, color: "text-pink-400" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {techLogos.map((tech, index) => (
        <motion.div
          key={index}
          className={`absolute ${tech.color}`}
          style={{
            top: `${20 + (index * 12)}%`,
            left: index % 2 === 0 ? '8%' : '88%',
          }}
          animate={{
            rotate: [0, 360],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "linear",
            delay: tech.delay,
          }}
        >
          {tech.icon}
        </motion.div>
      ))}
    </div>
  )
}

export default SimpleFloatingTechLogos
