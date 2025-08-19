import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileDown } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0a0a0f] via-[#0f1118] to-[#0a0a0f] overflow-hidden"
    >
      {/* glowing background accent */}
      <div className="absolute w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 px-6">
        {/* name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg hover-block">
          NIRANJAN C N
        </h1>

        {/* subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 hover-block px-3 py-1 rounded-lg inline-block">
          Computer Science Engineer
        </p>

        {/* action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="hover-block rounded-xl">
            <Button
              size="lg"
              className="bg-white text-black hover:scale-105 transition-spring shadow-md"
              onClick={() => scrollToSection("portfolio")}
            >
              View Projects
            </Button>
          </div>
          <div className="hover-block rounded-xl">
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-primary hover:text-white transition-spring"
              onClick={() => scrollToSection("contact")}
            >
              Contact Me
            </Button>
          </div>
          <div className="hover-block rounded-xl">
            <Button
              size="lg"
              variant="secondary"
              className="flex items-center gap-2 hover:scale-105 transition-spring"
              asChild
            >
              <a href="/Resume_NiranjanCN.pdf" target="_blank">
                <FileDown size={20} />
                Resume
              </a>
            </Button>
          </div>
        </div>

        {/* social icons */}
        <div className="flex justify-center space-x-6">
          {[ 
            { icon: <Github size={26} />, link: "https://github.com/cnniranjan72" },
            { icon: <Linkedin size={26} />, link: "https://www.linkedin.com/in/niranjan-c-n-26a403292" },
            { icon: <Mail size={26} />, link: "mailto:cnniranjan72@gmail.com" }
          ].map((item, i) => (
            <div key={i} className="hover-block rounded-full">
              <Button asChild variant="ghost" size="icon" className="hover:text-primary hover:scale-110 transition-all">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.icon}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
