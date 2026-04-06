import { Card } from "@/components/ui/card";
import { Code, Palette, Zap, Users, Rocket, Brain, Target, Sparkles, Database, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import NeonGridBackground from "@/components/NeonGridBackground";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Full-Stack Engineer",
      description: "Ship production-grade web, mobile, and platform experiences.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "AI & Data Systems",
      description: "Build reinforcement-learning simulations and ML pipelines.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "System Designer",
      description:
        "Architect scalable, reliable infrastructures for aviation and enterprise teams.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Builder",
      description:
        "Partner with cross-functional teams, open-source communities, and clients.",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "RAG Systems",
      description: "Build enterprise-grade RAG query engines with streaming responses.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Research",
      description: "Develop AI agents for profile enrichment and data extraction.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Vectorization",
      description: "Create modular vectorization engines for multi-source ingestion.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Neural Networks",
      description: "Implement deep learning models for complex problem solving.",
    },
  ];

  return (
    <NeonGridBackground>
      <section id="about" className="py-20 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text-cyan">
            Computer Science undergraduate and Software Engineer
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            building production-grade full-stack and AI systems across aviation and enterprise platforms. 
            Experienced in RAG pipelines, vector databases, and reinforcement learning systems with strong 
            foundations in scalable system design.
          </p>
        </motion.div>

        {/* Stats badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="px-4 py-2 rounded-full border border-pink-500/30 text-pink-400 text-sm font-medium bg-pink-500/5">
            <Target className="w-4 h-4 inline mr-2" />
            Enterprise Products
          </span>
          <span className="px-4 py-2 rounded-full border border-green-500/30 text-green-400 text-sm font-medium bg-green-500/5">
            <Brain className="w-4 h-4 inline mr-2" />
            RAG AI Solutions
          </span>
          <span className="px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-sm font-medium bg-cyan-500/5">
            <Zap className="w-4 h-4 inline mr-2" />
            Reinforcement Learning
          </span>
          <span className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-400 text-sm font-medium bg-purple-500/5">
            <Database className="w-4 h-4 inline mr-2" />
            Vector Databases
          </span>
          <span className="px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 text-sm font-medium bg-yellow-500/5">
            <Rocket className="w-4 h-4 inline mr-2" />
            Production Systems
          </span>
          <span className="px-4 py-2 rounded-full border border-blue-500/30 text-blue-400 text-sm font-medium bg-blue-500/5">
            <Cpu className="w-4 h-4 inline mr-2" />
            ML Pipelines
          </span>
        </motion.div>

        {/* Enhanced Highlights Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.03, 
                y: -3,
                rotateZ: index % 2 === 0 ? 2 : -2 
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Card className="p-6 sm:p-8 neon-card hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl border border-cyan-500/20">
                <div className="flex items-start space-x-4">
                  <motion.div
                    className="p-3 sm:p-4 rounded-lg bg-primary/10 flex-shrink-0"
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 3,
                      backgroundColor: "rgba(0, 255, 255, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="neon-text-cyan w-8 h-8 sm:w-10 sm:h-10">{highlight.icon}</div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-3 neon-text-cyan text-base sm:text-lg">{highlight.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground hover:text-cyan-400 transition-colors leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </NeonGridBackground>
  );
};

export default AboutSection;
