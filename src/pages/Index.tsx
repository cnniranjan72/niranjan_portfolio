import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioSection from "@/components/PortfolioSection";
import SkillsSection from "@/components/SkillsSection";       // ✅ renamed
import EducationSection from "@/components/EducationSection"; // ✅ renamed
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingToolbar from "@/components/FloatingToolBar";   // ✅ add this new component

const Index = () => {
  // SEO and Meta Tags
  useEffect(() => {
    document.title = "Niranjan C N - Computer Science Engineer | Portfolio";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Portfolio of Niranjan C N - Computer Science Engineer specializing in web, app, and full-stack development. Available for internships and projects."
      );
    }

    const existingKeywords = document.querySelector('meta[name="keywords"]');
    if (!existingKeywords) {
      const keywordsMeta = document.createElement("meta");
      keywordsMeta.name = "keywords";
      keywordsMeta.content =
        "Niranjan C N, computer science engineer, web developer, app developer, React developer, portfolio, full-stack developer, internships, projects";
      document.head.appendChild(keywordsMeta);
    }

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (!existingCanonical) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = window.location.href;
      document.head.appendChild(canonical);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        "content",
        "Niranjan C N - Computer Science Engineer Portfolio"
      );
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription) {
      ogDescription.setAttribute(
        "content",
        "Portfolio showcasing projects in web development, app development, and full-stack engineering. Available for internships and collaborations."
      );
    }

    // Scroll animations
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <HeroSection />

        <div className="animate-on-scroll">
          <AboutSection />
        </div>

        <div className="animate-on-scroll">
          <PortfolioSection />
        </div>

        <div className="animate-on-scroll">
          <SkillsSection />
        </div>

        <div className="animate-on-scroll">
          <EducationSection />
        </div>

        <div className="animate-on-scroll">
          <ContactSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Toolbar */}
      <FloatingToolbar />
    </div>
  );
};

export default Index;
