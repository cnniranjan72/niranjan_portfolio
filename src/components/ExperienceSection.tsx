import { Briefcase, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const experiences = [
  {
    role: "Software Development Engineer (Contract)",
    company: "AeroAspire ",
    period: "Oct 2025 – Present",
    location: "Remote",
    highlights: [
      "Own development of AeroBriefs, a production aviation weather briefing platform centralizing pilot and ATC workflows.",
      "Architected real-time Flutter + Firebase + Firestore systems with aviation-grade reliability and scalability.",
    ],
  },
  {
    role: "Software Development Engineer Intern",
    company: "AeroAspire",
    period: "Sep 2025 – Oct 2025",
    location: "Remote",
    highlights: [
      "Built and integrated full-stack modules spanning React, Flask, Docker, and SQLite for production feature releases.",
      "Contributed to automated testing pipelines and deployment-ready container workflows.",
    ],
  },
  {
    role: "Software Development Engineer (Consultant)",
    company: "Tribeca Softech",
    period: "Jan 2026 – Present",
    location: "Remote",
    highlights: [
      "Develop enterprise IT risk governance components powered by React, RAG pipelines, FastAPI, and DataGol.",
      "Engineered a LinkedIn trusted-network intelligence extension using JavaScript DOM extraction, FastAPI, PostgreSQL (Neon), and JWT.",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="py-16 px-4 md:px-8 lg:px-20 bg-muted/40"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Experience
      </h2>

      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((experience, index) => (
          <Card
            key={experience.role + index}
            className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {experience.role}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {experience.period}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {experience.location}
                </span>
              </div>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
