import { motion } from 'framer-motion'

const NeonGridBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
              'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
              'linear-gradient(225deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
              'linear-gradient(315deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
              'linear-gradient(45deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default NeonGridBackground
