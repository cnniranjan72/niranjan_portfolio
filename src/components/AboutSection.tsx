import { Card } from "@/components/ui/card";
import { Code, Palette, Zap, Users } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Developer",
      description: "Skilled in full-stack development for web applications.",
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "Creator",
      description: "Built apps and platforms that solve real-world problems.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Learner",
      description: "Exploring AI, ML, and modern software engineering practices.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaborator",
      description: "Thrives in team environments, hackathons, and open projects.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I’m Niranjan, a Computer Science student passionate about building smart, scalable, and meaningful digital solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Short Bio */}
          <div className="text-center lg:text-left space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              I enjoy creating impactful products — intelligent web platforms. <br></br><br></br>
              My focus lies in combining code, creativity, and problem-solving to make technology useful and accessible.
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
