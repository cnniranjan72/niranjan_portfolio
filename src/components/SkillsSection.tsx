import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Boxes, Database, Wrench } from "lucide-react";

const SkillsSection = () => {
  const skillCategories = [
    {
      icon: <Code2 className="w-10 h-10 text-primary" />,
      title: "Programming Languages",
      skills: ["C", "C++", "Java", "Python", "Dart", "JavaScript", "TypeScript"],
    },
    {
      icon: <Boxes className="w-10 h-10 text-primary" />,
      title: "Frameworks & Libraries",
      skills: ["React.js", "Flutter", "Tailwind CSS", "NumPy", "Matplotlib", "shadcn/ui"],
    },
    {
      icon: <Database className="w-10 h-10 text-primary" />,
      title: "Databases",
      skills: ["MySQL", "MongoDB", "Firestore"],
    },
    {
      icon: <Wrench className="w-10 h-10 text-primary" />,
      title: "Tools & Platforms",
      skills: ["Git/GitHub", "Linux", "VS Code", "Android Studio", "Jupyter Notebook"],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A mix of programming languages, frameworks, databases, and tools I use to build impactful solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className="p-6 shadow-card hover-block rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="hover-block cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
