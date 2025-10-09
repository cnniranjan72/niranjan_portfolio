import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioSection from "@/components/Projects";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection"; // ✅ Added new import
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingToolbar from "@/components/FloatingToolbar";

const Index = () => {
  useEffect(() => {
    document.title = "Niranjan C N - Computer Science Engineer | Portfolio";

    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta(
      "description",
      "Portfolio of Niranjan C N - Computer Science Engineer specializing in web, app, and full-stack development."
    );

    updateMeta(
      "keywords",
      "Niranjan C N, computer science engineer, web developer, app developer, React developer, portfolio, full-stack developer, internships, projects"
    );

    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = window.location.href;
      document.head.appendChild(canonical);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">


      <main>
        <HeroSection />

        <div className="animate-on-scroll">
          <AboutSection />
        </div>
        {/* ✅ Added Experience section here */}
        <div className="animate-on-scroll">
          <ExperienceSection />
        </div>

        <div className="animate-on-scroll">
          <EducationSection />
        </div>
        <div className="animate-on-scroll">
          <SkillsSection />
        </div>
        
        <div className="animate-on-scroll">
          <PortfolioSection />
        </div>

        
        <div className="animate-on-scroll">
          <ContactSection />
        </div>
        
      </main>

      <Footer />
      <FloatingToolbar />
    </div>
  );
};

export default Index;
