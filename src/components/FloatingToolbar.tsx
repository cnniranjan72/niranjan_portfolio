import { Home, User, FolderOpen, BookOpen, Mail } from "lucide-react";

const FloatingToolbar = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 flex items-center space-x-6 shadow-lg">
        {[
          { icon: <Home size={22} />, id: "hero" },
          { icon: <User size={22} />, id: "about" },
          { icon: <FolderOpen size={22} />, id: "portfolio" },
          { icon: <BookOpen size={22} />, id: "education" },
          { icon: <Mail size={22} />, id: "contact" },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(item.id)}
            className="
              p-2 rounded-full text-muted-foreground 
              hover:text-primary hover:bg-primary/10 
              transition-transform duration-300 ease-in-out 
              transform hover:-translate-y-2 hover:scale-110 
              active:translate-y-1 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-primary/40
            "
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingToolbar;
