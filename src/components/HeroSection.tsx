import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"

import { Github, Linkedin, Mail, FileDown, Code2, Zap, Rocket, Database, Cpu, Cloud, GitBranch, Terminal, Brain } from "lucide-react"

import NeonGridBackground from "@/components/NeonGridBackground"



const HeroSection = () => {

  const scrollToSection = (sectionId: string) => {

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });

  };



  return (

    <NeonGridBackground>

      <section

        id="hero"

        className="min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"

      >

      {/* Animated background elements */}

      <motion.div

        className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]"

        animate={{

          scale: [1, 1.2, 1],

          x: [0, 50, 0],

          y: [0, -50, 0],

        }}

        transition={{

          duration: 10,

          repeat: Infinity,

          ease: "easeInOut"

        }}

      />

      

      <motion.div

        className="absolute w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[120px] right-10 top-20"

        animate={{

          scale: [1.2, 1, 1.2],

          x: [0, -30, 0],

          y: [0, 30, 0],

        }}

        transition={{

          duration: 8,

          repeat: Infinity,

          ease: "easeInOut",

          delay: 2

        }}

      />



      <div className="relative z-10 px-6 max-w-6xl mx-auto">

        {/* Floating tech icons */}

        <motion.div

          className="absolute top-10 left-10 text-cyan-400"

          animate={{

            rotate: [0, 360],

            y: [0, -20, 0]

          }}

          transition={{

            duration: 4,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Code2 size={32} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute top-20 right-10 text-pink-400"

          animate={{

            rotate: [0, -360],

            y: [0, -15, 0]

          }}

          transition={{

            duration: 5,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Zap size={28} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute bottom-20 left-20 text-green-400"

          animate={{

            rotate: [0, 360],

            x: [0, 20, 0]

          }}

          transition={{

            duration: 6,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Rocket size={30} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute top-32 left-32 text-yellow-400"

          animate={{

            rotate: [0, -360],

            y: [0, 10, 0]

          }}

          transition={{

            duration: 7,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Database size={26} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute top-40 right-32 text-purple-400"

          animate={{

            rotate: [0, 360],

            x: [0, -15, 0]

          }}

          transition={{

            duration: 8,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Cpu size={24} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute bottom-32 right-20 text-blue-400"

          animate={{

            rotate: [0, -360],

            y: [0, -10, 0]

          }}

          transition={{

            duration: 5,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Cloud size={28} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute top-60 left-16 text-orange-400"

          animate={{

            rotate: [0, 360],

            x: [0, 25, 0]

          }}

          transition={{

            duration: 9,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <GitBranch size={22} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute bottom-40 left-40 text-cyan-300"

          animate={{

            rotate: [0, -360],

            y: [0, 15, 0]

          }}

          transition={{

            duration: 6,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Terminal size={26} className="animate-pulse-neon" />

        </motion.div>



        <motion.div

          className="absolute top-80 right-40 text-pink-300"

          animate={{

            rotate: [0, 360],

            x: [0, -20, 0]

          }}

          transition={{

            duration: 7,

            repeat: Infinity,

            ease: "linear"

          }}

        >

          <Brain size={24} className="animate-pulse-neon" />

        </motion.div>



        {/* Main hero content */}

        <motion.div

          initial={{ opacity: 0, y: 50 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 1, delay: 0.2 }}

        >

          {/* Greeting */}

          <motion.div

            className="mb-4"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 0.5, duration: 0.8 }}

          >

            <span className="text-cyan-400 text-lg md:text-xl font-medium neon-text-cyan">

              👋 Hello, I'm

            </span>

          </motion.div>



          {/* Name with animated text */}

          <div className="mb-6">

            <motion.h1 

              className="text-6xl md:text-8xl font-bold neon-text-cyan"

              initial={{ opacity: 0, y: 50 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.8 }}

            >

              {["N", "I", "R", "A", "N", "J", "A", "N", " ", "C", " ", "N"].map((letter, i) => (

                <motion.span

                  key={i}

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}

                  className="inline-block"

                  whileHover={{ 

                    scale: 1.2, 

                    color: "#ff00ff",

                    textShadow: "0 0 20px rgba(255, 0, 255, 0.8)"

                  }}

                >

                  {letter === " " ? "\u00A0" : letter}

                </motion.span>

              ))}

            </motion.h1>

          </div>



          {/* Subtitle with typing effect */}

          <motion.div

            className="mb-10"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 1.5, duration: 0.8 }}

          >

            <p className="text-xl md:text-2xl text-muted-foreground px-6 py-3 rounded-xl inline-block neon-card">

              <span className="neon-text-pink font-medium">

                CS undergraduate building production-grade

              </span>

              <br />

              <span className="neon-text-cyan font-medium">

                full-stack & AI-driven systems

              </span>

            </p>

          </motion.div>



          {/* Action buttons with staggered animation */}

          <motion.div

            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12"

            initial={{ opacity: 0, y: 30 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 2, duration: 0.8 }}

          >

            <motion.div

              whileHover={{ scale: 1.05, y: -3 }}

              whileTap={{ scale: 0.95 }}

              className="w-full sm:w-auto"

            >

              <Button
                size="lg"
                variant="outline"
                className="neon-border-cyan text-lg px-6 sm:px-8 py-6 neon-text-cyan hover:neon-glow-cyan w-full sm:w-auto border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
                onClick={() => scrollToSection("portfolio")}
              >

                <Rocket className="mr-2" size={20} />

                View Projects

              </Button>

            </motion.div>



            <motion.div

              whileHover={{ scale: 1.05, y: -3 }}

              whileTap={{ scale: 0.95 }}

              className="w-full sm:w-auto"

            >

              <Button

                size="lg"

                variant="outline"

                className="neon-border-pink text-lg px-6 sm:px-8 py-6 neon-text-pink hover:neon-text-cyan w-full sm:w-auto border border-pink-500/30 hover:bg-pink-500/10"

                onClick={() => scrollToSection("contact")}

              >

                <Mail className="mr-2" size={20} />

                Contact Me

              </Button>

            </motion.div>



            <motion.div

              whileHover={{ scale: 1.05, y: -3 }}

              whileTap={{ scale: 0.95 }}

              className="w-full sm:w-auto"

            >

              <Button

                size="lg"

                variant="secondary"

                className="neon-card text-lg px-6 sm:px-8 py-6 neon-text-cyan hover:neon-text-pink w-full sm:w-auto border border-cyan-500/20 hover:bg-cyan-500/10"

                asChild

              >

                <a href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/cnniranjan72/niranjan_portfolio/main/public/resume/NiranjanCN-Resume.pdf&embedded=true" target="_blank">

                  <FileDown className="mr-2" size={20} />

                  Resume

                </a>

              </Button>

            </motion.div>

          </motion.div>



          {/* Social icons with enhanced animations */}

          <motion.div

            className="flex justify-center space-x-8"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 2.5, duration: 0.8 }}

          >

            {

            [

              { icon: <Github size={28} />, link: "https://github.com/cnniranjan72", color: "text-cyan-400" },

              { icon: <Linkedin size={28} />, link: "https://www.linkedin.com/in/niranjan-c-n", color: "text-blue-400" },

              { icon: <Mail size={28} />, link: "mailto:cnniranjan72@gmail.com", color: "text-pink-400" },

            ].map((item, i) => (

              <motion.div

                key={i}

                whileHover={{ 

                  scale: 1.2, 

                  textShadow: "0 0 20px currentColor"

                }}

                whileTap={{ scale: 0.9 }}

                transition={{ duration: 0.3 }}

              >

                <Button

                  asChild

                  variant="ghost"

                  size="icon"

                  className={`w-14 h-14 rounded-full neon-card hover:neon-border-cyan transition-all ${item.color}`}

                >

                  <a href={item.link} target="_blank" rel="noopener noreferrer">

                    {item.icon}

                  </a>

                </Button>

              </motion.div>

            ))}

          </motion.div>



          {/* Scroll indicator positioned after social icons */}

          <motion.div

            className="flex justify-center mt-8"

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 3.2, duration: 0.8 }}

          >

            <motion.div

              className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center"

              animate={{ opacity: [0.5, 1, 0.5] }}

              transition={{ duration: 2, repeat: Infinity }}

            >

              <motion.div

                className="w-1 h-3 bg-cyan-400 rounded-full mt-2"

                animate={{ y: [0, 12, 0] }}

                transition={{ duration: 2, repeat: Infinity }}

              />

            </motion.div>

          </motion.div>

        </motion.div>

        </div>

      </section>

    </NeonGridBackground>

  );

};



export default HeroSection;

