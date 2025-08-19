import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Palette, Zap, Users } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const AboutSection = () => {
  const skills = [
    "C", "C++", "Java", "Python", "Dart", "JavaScript", "TypeScript",
    "React.js", "Flutter", "Tailwind CSS", "Firebase", "Firestore",
    "MongoDB", "MySQL", "Git/GitHub", "Linux", "VS Code", "Android Studio"
  ];

  const highlights = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Problem Solver",
      description: "Strong in Data Structures & Algorithms with 3 hackathon experiences"
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "Project Builder",
      description: "Developed finance apps, college portals, and progressive web apps"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Continuous Learner",
      description: "Exploring AI/ML, improving OS & networking knowledge"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Player",
      description: "Collaborated in hackathons and group projects as a frontend developer"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate Computer Science undergraduate aiming to become a skilled Software Engineer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image & Story */}
          <div className="space-y-6">
            <div className="relative hover-block rounded-2xl inline-block">
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-elevated"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 gradient-primary rounded-full animate-pulse-glow"></div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-semibold mb-4">Hello, I'm Niranjan C N</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm a Computer Science undergraduate with strong problem-solving skills and 
                hands-on experience in full-stack web and mobile app development. Skilled in React.js, 
                Flutter, Firebase, and database systems, I enjoy building impactful, data-driven solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Currently exploring AI/ML while improving my foundation in OS and Networking. 
                I believe in continuous learning, teamwork, and applying technology to create 
                practical solutions that make a difference.
              </p>
            </div>
          </div>

          {/* Skills & Highlights */}
          <div className="space-y-8">
            {/* Highlights */}
            <div className="grid md:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <Card key={index} className="p-6 shadow-card hover-block rounded-xl">
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

            {/* Skills */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="hover-block cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
