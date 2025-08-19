import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Web Development", "Mobile Apps", "PWA"];

  const projects = [
    {
      id: 1,
      title: "KrishiLakshya – Financial Tracker for Farmers",
      description:
        "A Progressive Web App helping farmers track agricultural expenses, income, and profits. Includes OCR bill scanning and interactive charts.",
      category: "Web Development",
      tags: ["React.js", "Firebase", "Recharts", "Tesseract.js"],
      image:
        "https://images.unsplash.com/photo-1581090700227-4c4f50b1d1f5?auto=format&fit=crop&q=80&w=800&h=600scsrc",
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 2,
      title: "CampusConnect – College Information Portal",
      description:
        "Portal for students to view notices, timetables, and events. Faculty dashboard allows posting updates in real-time.",
      category: "Web Development",
      tags: ["React.js", "Firebase Auth", "Firestore"],
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800&h=600",
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 3,
      title: "MyExpenseMate – Personal Expense Tracker",
      description:
        "Cross-platform mobile app to log expenses, categorize spending, and visualize trends with charts.",
      category: "Mobile Apps",
      tags: ["Flutter", "Firebase"],
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&q=80&w=800&h=600",
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 4,
      title: "QuickNotes – Minimalist Notes PWA",
      description:
        "Offline-first notes app with IndexedDB storage and dark mode, works seamlessly without internet.",
      category: "PWA",
      tags: ["React.js", "Service Workers", "IndexedDB"],
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800&h=600",
      demoLink: "#",
      codeLink: "#",
    },
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">My Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my projects in web, mobile, and progressive apps
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className="transition-smooth hover-block"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden shadow-card hover-block rounded-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-spring"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center space-x-4">
                  <Button asChild size="sm" variant="secondary" className="hover-block">
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-2" />
                      Demo
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="secondary" className="hover-block">
                    <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                      <Github size={16} className="mr-2" />
                      Code
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs hover-block">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
