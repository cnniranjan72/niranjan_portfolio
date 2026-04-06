import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Wrench,
  FolderOpen,
  Mail,
  Cpu,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingToolbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Reordered items as requested:

  const navItems = [
    { icon: <Home size={22} />, id: "hero", label: "Home" },    
    { icon: <User size={22} />, id: "about", label: "About" },
    { icon: <Briefcase size={22} />, id: "experience", label: "Experience" },
    { icon: <BookOpen size={22} />, id: "education", label: "Education" },
    { icon: <Wrench size={22} />, id: "skills", label: "Skills" },
    { icon: <Cpu size={22} />, id: "portfolio", label: "Projects" },
    { icon: <Mail size={22} />, id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Neon Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-50"
        style={{ 
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Animated Floating Toolbar */}
      <motion.div
        className="fixed bottom-8 left-0 right-0 flex justify-center z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="neon-card border border-cyan-500/30 backdrop-blur-md rounded-full px-4 sm:px-6 py-3 flex items-center space-x-4 sm:space-x-6 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          whileHover={{ 
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)',
            borderColor: 'rgba(0, 255, 255, 0.5)'
          }}
        >
          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            {navItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => scrollToSection(item.id)}
                    className="
                      p-2 sm:p-2.5 rounded-full text-muted-foreground 
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                      relative
                    "
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 * index,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      y: -3,
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                      borderColor: 'rgba(0, 255, 255, 0.3)'
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span 
                      className="hover:neon-text-cyan transition-colors duration-300"
                      whileHover={{ 
                        rotate: [0, 5, -5, 0],
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.span>
                  </motion.button>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="
                    bg-gray-900 border border-cyan-500/50 text-cyan-400 text-sm rounded-md px-3 py-2 shadow-lg
                    neon-text-cyan
                  "
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FloatingToolbar;
