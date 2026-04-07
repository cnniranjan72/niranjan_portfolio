import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Rocket, Brain, Zap, Target, Building, Shield, Camera, DollarSign, Users, Calendar, Gamepad2, FileText, Database, Cpu, Smartphone, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import NeonGridBackground from "@/components/NeonGridBackground";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("Featured");

  const categories = [
    "All",
    "Featured",
    "Web Development",
    "Mobile Apps",
    "PWA",
    "AI/ML",
  ];

  const projects = [
    {
      id: 1,
      title: "CIVITAS — AI Smart City Digital Twin",
      description:
        "AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling that optimizes policy trade-offs.",
      category: ["Featured", "AI/ML"],
      tags: ["Reinforcement Learning", "FastAPI", "Simulation", "LLM","PPO Multi-Agent","Agent-Based Modeling","Policy Optimization"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/civitas",
      icon: <Building className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "IntelliMine — Autonomous Landmine Detection",
      description:
        "Random Forest + PCA pipelines with severity scoring, 98.2% detection rate, and A* safe path planning.",
      category: ["Featured", "AI/ML"],
      tags: ["Random Forest", "React.js", "Flask", "MongoDB", "JWT","FastAPI","PCA","Firestore"],
      demoLink: "https://intellimine.vercel.app",
      codeLink: "https://github.com/cnniranjan72/Autonomous-Landmine-detector",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Cortex — RAG-Based AI Assistant",
      description:
        "Built RAG-based AI assistant supporting attachment-based queries with real-time streaming responses.",
      category: ["Featured", "AI/ML"],
      tags: [
        "React.js",
        "FastAPI",
        "OpenAI APIs",
        "Function Calling",
        "Structured Outputs",
        "Pinecone",
        "Embeddings",
        "Vector Search",
        "Streaming Responses"
      ],
      demoLink: "#",
      codeLink: "#",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "AgriMind — AI Crop & Yield Platform",
      description:
        "ML-driven crop recommendation + yield prediction across 30+ crops with 96.8% model accuracy.",
      category: ["Featured", "Web Development", "AI/ML"],
      tags: [
        "React.js",
        "Flask",
        "PostgreSQL",
        "ML Pipelines",
        "Authentication",
      ],
      demoLink: "https://agrimind-frontend.vercel.app/",
      codeLink: "https://github.com/cnniranjan72/AgriMind",
      icon: <Camera className="w-6 h-6" />,
    },
    {
      id: 5,
      title: "VisioNarrate – Image to Story Generator",
      description:
        "Generates human-like stories from images using machine learning and NLP-based storytelling models.",
      category: ["AI/ML"],
      tags: ["Python", "MongoDB", "Google Collab", "React.js", "Flask"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/VisioNarrate",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 6,
      title: "KisaanMitra – Farmer Support Platform",
      description:
        "A platform providing farmers with financial guidance, crop insights, and community support features.",
      category: ["Web Development"],
      tags: ["TypeScript", "Node.js", "MongoDB", "Express"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/Kisaanmitra-",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: 7,
      title: "KrishiLakshya – Financial Tracker for Farmers",
      description:
        "A Progressive Web App helping farmers track agricultural expenses, income, and profits. Includes OCR bill scanning and interactive charts.",
      category: ["Web Development"],
      tags: ["React.js", "Firebase", "Recharts", "PWA"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/KrishiLakshya",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: 8,
      title: "CampusConnect – College Information Portal",
      description:
        "Portal for students to view notices, timetables, and events. Faculty dashboard allows posting updates in real-time.",
      category: ["Web Development"],
      tags: ["React.js", "Firebase Auth", "Firestore"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/campus-connect",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      id: 9,
      title: "MyExpenseMate – Personal Expense Tracker",
      description:
        "Cross-platform mobile app to log expenses, categorize spending, and visualize trends with charts.",
      category: ["Mobile Apps"],
      tags: ["Flutter", "Firebase"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/Expense-Tracker",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: 10,
      title: "QuickNotes – Minimalist Notes PWA",
      description:
        "Offline-first notes app with IndexedDB storage and dark mode, works seamlessly without internet.",
      category: ["PWA"],
      tags: ["React.js", "Service Workers", "IndexedDB"],
      demoLink: "#",
      codeLink: "#",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 11,
      title: "GameHive – Gaming Community Platform",
      description:
        "Frontend project for a gaming hub where players can share updates, join discussions, and explore trending games.",
      category: ["Web Development"],
      tags: ["React.js", "TailwindCSS"],
      demoLink: "#",
      codeLink: "https://github.com/cnniranjan72/GameHive-Frontend-Project",
      icon: <Gamepad2 className="w-6 h-6" />,
    },
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) =>
          project.category.includes(activeFilter)
        );

  return (
    <NeonGridBackground>
      <section id="portfolio" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] top-10 left-10"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] bottom-10 right-10"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
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
            Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my projects in web, mobile, AI/ML, and progressive apps
          </p>
        </motion.div>

        {/* Enhanced Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: activeFilter === category ? [1, 1.08, 1] : 1,
                boxShadow: activeFilter === category 
                  ? ["0 0 20px rgba(236, 72, 153, 0.4)", "0 0 35px rgba(236, 72, 153, 0.8)", "0 0 20px rgba(236, 72, 153, 0.4)"]
                  : "0 0 0px transparent"
              }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.3,
                scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => setActiveFilter(category)}
                className={`transition-all duration-300 ${
                  activeFilter === category 
                    ? "neon-border-pink neon-text-pink hover:neon-glow-pink border border-pink-500/50 bg-pink-500/10" 
                    : "neon-border-cyan neon-text-cyan hover:neon-glow-cyan border border-cyan-500/30 hover:bg-cyan-500/10"
                }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="group overflow-hidden neon-card hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl p-4 sm:p-6 border border-cyan-500/20">
                {/* Project Icon */}
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-pink-500/20 flex items-center justify-center border border-cyan-500/20">
                    <div className="neon-text-cyan">
                      {project.icon}
                    </div>
                  </div>
                </motion.div>

                <h3 className="text-lg sm:text-xl font-semibold mb-2 neon-text-cyan group-hover:neon-text-pink transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed hover:text-cyan-400 transition-colors text-sm sm:text-base">
                  {project.description}
                </p>

                {/* Enhanced Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <motion.div
                      key={tagIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tagIndex * 0.05, duration: 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -1,
                        backgroundColor: "rgba(255, 0, 255, 0.08)"
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 border border-pink-500/20 text-pink-400 cursor-default transition-all duration-200 bg-pink-500/5"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {/* Only show Demo button for IntelliMine and AgriMind */}
                  {(project.title.includes("IntelliMine") || project.title.includes("AgriMind")) && (
                    <motion.div
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button 
                        asChild 
                        size="sm" 
                        variant="secondary" 
                        className="w-full border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                      >
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={14} className="mr-1 sm:mr-2" />
                          Demo
                        </a>
                      </Button>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={project.title.includes("IntelliMine") || project.title.includes("AgriMind") ? "flex-1" : "w-full"}
                  >
                    <Button 
                      asChild 
                      size="sm" 
                      variant="secondary" 
                      className="w-full border border-pink-500/20 text-pink-400 hover:bg-pink-500/10 transition-all duration-300"
                    >
                      <a
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={14} className="mr-1 sm:mr-2" />
                        Code
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project stats removed */}
      </div>
    </section>
    </NeonGridBackground>
  );
};

export default PortfolioSection;
