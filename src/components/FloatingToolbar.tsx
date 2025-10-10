import { useEffect, useState } from "react";
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
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 flex items-center space-x-6 shadow-lg">
          <TooltipProvider>
            {navItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="
                      p-2 rounded-full text-muted-foreground 
                      transition-all duration-300 ease-in-out
                      transform hover:-translate-y-1 hover:scale-110
                      focus:outline-none focus:ring-2 focus:ring-primary/40
                      relative
                    "
                  >
                    <span className="hover:text-primary hover:animate-pulse-glow">
                      {item.icon}
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="
                    bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg
                    data-[state=open]:animate-fade-in-up
                  "
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default FloatingToolbar;
