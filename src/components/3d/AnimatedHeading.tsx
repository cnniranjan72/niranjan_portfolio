import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface AnimatedHeadingProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedHeading = ({ children, className = "", delay = 0 }: AnimatedHeadingProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut" as const,
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`neon-text-cyan ${className}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// Section heading with animated character
export default function SectionHeading({ 
  title, 
  subtitle, 
  className = "" 
}: { 
  title: string
  subtitle?: string
  className?: string 
}) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <AnimatedHeading delay={0} className="text-4xl md:text-5xl font-bold mb-4">
        <motion.span
          className="inline-block"
          whileHover={{ 
            scale: 1.05,
            textShadow: "0 0 30px rgba(0, 255, 255, 1)"
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {title}
        </motion.span>
      </AnimatedHeading>
      
      {subtitle && (
        <AnimatedHeading delay={0.2} className="text-xl text-muted-foreground max-w-2xl mx-auto">
          <motion.span
            className="inline-block"
            whileHover={{ 
              scale: 1.02,
              color: "#00ffff"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {subtitle}
          </motion.span>
        </AnimatedHeading>
      )}
      
      {/* Animated decorative elements */}
      <motion.div
        className="flex justify-center items-center gap-4 mt-6"
        initial={{ opacity: 0, width: 0 }}
        animate={{ 
          opacity: 1, 
          width: "auto",
          transition: { delay: 0.4, duration: 0.8 }
        }}
      >
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "60px" }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
        <motion.div
          className="w-2 h-2 bg-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "60px" }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
      </motion.div>
    </div>
  )
}

// Individual character animation for text
export function AnimatedText({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string
  className?: string
  delay?: number
}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const letters = text.split('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.05
      }
    }
  }

  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateZ: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateZ: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`neon-text-cyan ${className}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          whileHover={{
            scale: 1.2,
            color: "#ff00ff",
            textShadow: "0 0 20px rgba(255, 0, 255, 0.8)"
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
