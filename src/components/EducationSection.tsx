import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  const education = [
    {
      degree: "B.E. in Computer Science and Engineering",
      institution: "AMC Engineering College, Bangalore",
      duration: "2023 – 2027",
      cgpa: "CGPA: 8.5",
      coursework: [
        "Data Structures",
        "Operating Systems",
        "Database Management Systems",
        "Theory of Computation",
        "Analysis and Design of Algorithms",
        "Computer Networks",
        "Artificial Intelligence",
        "Software Engineering & Project Management",
      ],
    },
  ];

  return (
    <section id="education" className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Education</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My academic journey and relevant coursework
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {education.map((edu, index) => (
            <Card
              key={index}
              className="p-8 shadow-card hover:shadow-elevated transition-smooth"
            >
              <div className="flex items-start gap-4 mb-6">
                <GraduationCap className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.duration}</p>
                  <p className="text-sm font-medium text-primary">{edu.cgpa}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Relevant Coursework:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {edu.coursework.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
