import { Card } from "@/components/ui/card";
import { Code, Palette, Zap, Users } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Full-Stack Engineer",
      description: "Ship production-grade web, mobile, and platform experiences.",
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "AI & Data Systems",
      description: "Build reinforcement-learning simulations and ML pipelines.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "System Designer",
      description:
        "Architect scalable, reliable infrastructures for aviation and enterprise teams.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaborative Builder",
      description:
        "Partner with cross-functional teams, open-source communities, and clients.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Computer Science undergraduate and Software Engineer delivering production-grade full-stack and AI-driven systems across aviation and enterprise platforms.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Short Bio */}
          <div className="text-center lg:text-left space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              I build reinforcement-learning simulations, ML pipelines, and secure cloud-native products that achieve 98%+ detection accuracy and measurable business outcomes. My foundation in data structures, algorithms, and scalable system design helps me translate ambiguous requirements into robust, production-ready experiences.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <Card key={index} className="p-6 shadow-card rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start space-x-4">
                  {highlight.icon}
                  <div>
                    <h4 className="font-semibold mb-2">{highlight.title}</h4>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
