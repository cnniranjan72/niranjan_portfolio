import { motion } from 'framer-motion'
import { 
  ReactLogo, 
  NodejsLogo, 
  PythonLogo, 
  GitLogo, 
  DockerLogo, 
  DatabaseLogo,
  FastAPILogo,
  FlutterLogo,
  MongoDBLogo,
  RedisLogo,
  TypeScriptLogo,
  PostgresLogo,
  ViteLogo
} from '@/components/3d/TechIcons'

const techLogos = [
  { name: 'React', Icon: ReactLogo, color: '#61DAFB', delay: 0 },
  { name: 'Node.js', Icon: NodejsLogo, color: '#339933', delay: 0.2 },
  { name: 'Python', Icon: PythonLogo, color: '#3776AB', delay: 0.4 },
  { name: 'TypeScript', Icon: TypeScriptLogo, color: '#3178C6', delay: 0.6 },
  { name: 'FastAPI', Icon: FastAPILogo, color: '#009688', delay: 0.8 },
  { name: 'Flutter', Icon: FlutterLogo, color: '#02569B', delay: 1.0 },
  { name: 'Git', Icon: GitLogo, color: '#F05032', delay: 1.2 },
  { name: 'Docker', Icon: DockerLogo, color: '#2496ED', delay: 1.4 },
  { name: 'MongoDB', Icon: MongoDBLogo, color: '#47A248', delay: 1.6 },
  { name: 'PostgreSQL', Icon: PostgresLogo, color: '#336791', delay: 1.8 },
  { name: 'Redis', Icon: RedisLogo, color: '#DC382D', delay: 2.0 },
  { name: 'Vite', Icon: ViteLogo, color: '#646CFF', delay: 2.2 },
]

export default function FloatingTechLogos() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {techLogos.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="absolute tech-logo"
          style={{
            top: `${20 + (index * 15) % 60}%`,
            left: `${10 + (index * 25) % 80}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0.8, 1], 
            scale: [0, 1, 0.9, 1],
            rotate: [0, 5, -5, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 4,
            delay: tech.delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${tech.color}22, ${tech.color}44)`,
              border: `1px solid ${tech.color}66`,
              boxShadow: `0 0 20px ${tech.color}66`
            }}
          >
            <tech.Icon className="w-8 h-8" color={tech.color} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
