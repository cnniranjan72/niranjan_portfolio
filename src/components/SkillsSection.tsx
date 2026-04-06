import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Boxes, Database, Wrench, Terminal, Cpu, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

const SkillsSection = () => {
  const skillCategories = [
    {
      icon: <Code2 className="w-10 h-10 text-primary" />,
      title: "Programming Languages",
      skills: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Dart", "HTML", "CSS"],
    },
    {
      icon: <Boxes className="w-10 h-10 text-primary" />,
      title: "Frameworks & Libraries",
      skills: [
        "React.js",
        "Flutter",
        "FastAPI",
        "Flask",
        "Node.js",
        "Express.js",
        "RAG Pipelines",
        "Scikit-learn",
        "Framer Motion",
      ],
    },
    {
      icon: <Database className="w-10 h-10 text-primary" />,
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "MySQL", "Firestore", "SQLite", "Pinecone","Redis","PGVector","Supabase","Firebase"],
    },
    {
      icon: <Wrench className="w-10 h-10 text-primary" />,
      title: "Tools & Platforms",
      skills: [
        "Git",
        "Docker",
        "Linux",
        "Postman",
        "Swagger",
        "Playwright",
        "Vercel",
        "Render",
        "Railway",
        "Firecrawl",
        "VS Code",
        "GitHub",
      ],
    },
    {
      icon: <Terminal className="w-10 h-10 text-primary" />,
      title: "DevOps & Cloud",
      skills: ["AWS", "GCP", "Azure", "Kubernetes", "CI/CD", "Nginx"],
    },
    {
      icon: <Cpu className="w-10 h-10 text-primary" />,
      title: "AI/ML Tools",
      skills: ["TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "Weights & Biases"],
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Web Technologies",
      skills: ["REST APIs", "GraphQL", "WebSocket", "WebRTC", "PWA"],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-background via-muted/10 to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] top-20 right-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[80px] bottom-20 left-20"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-cyan">
            Skills
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A mix of programming languages, frameworks, databases, and tools I use to build impactful solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
            >
              <Card className="p-4 sm:p-6 neon-card hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="p-2 sm:p-3 rounded-lg bg-primary/10"
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 3,
                      backgroundColor: "rgba(0, 255, 255, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="neon-text-cyan w-6 h-6 sm:w-10 sm:h-10">{category.icon}</div>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold neon-text-cyan">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: skillIndex * 0.05,
                        duration: 0.3
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -1,
                        backgroundColor: "rgba(0, 255, 255, 0.08)",
                        borderColor: "rgba(0, 255, 255, 0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 border border-cyan-500/20 text-cyan-400 cursor-default transition-all duration-200 bg-cyan-500/5"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Floating tech badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            { name: "React", color: "#61DAFB", delay: 0 },
            { name: "Node.js", color: "#339933", delay: 0.1 },
            { name: "Python", color: "#3776AB", delay: 0.2 },
            { name: "TypeScript", color: "#3178C6", delay: 0.3 },
            { name: "FastAPI", color: "#009688", delay: 0.4 },
            { name: "Docker", color: "#2496ED", delay: 0.5 },
          ].map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: tech.delay,
                duration: 0.5
              }}
              whileHover={{ 
                scale: 1.1,
                y: -3
              }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{
                  backgroundColor: tech.color,
                  boxShadow: `0 0 10px ${tech.color}66`,
                  border: `1px solid ${tech.color}99`,
                }}
              >
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
