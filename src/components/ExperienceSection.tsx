import { Briefcase, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
// import SectionHeading from "./3d/AnimatedHeading";

const experiences = [
  {
    role: "Software Development Engineer (Contract)",
    company: "AeroAspire ",
    period: "Oct 2025 – Present",
    location: "Hybrid",
    highlights: [
      "Own development of AeroBriefs, a production aviation weather briefing platform centralizing pilot and ATC workflows.",
      "Architected real-time Flutter + Firebase + Firestore systems with aviation-grade reliability and scalability.",
    ],
  },
  {
    role: "Software Development Engineer Intern",
    company: "AeroAspire",
    period: "Sep 2025 – Oct 2025",
    location: "Hybrid",
    highlights: [
      "Built and integrated full-stack modules spanning React, Flask, Docker, and SQLite for production feature releases.",
      "Contributed to automated testing pipelines and deployment-ready container workflows.",
    ],
  },
  {
    role: "Software Development Engineer (Consultant)",
    company: "Tribeca Softech",
    period: "Jan 2026 – Feb 2026",
    location: "Remote",
    highlights: [
      "Develop enterprise IT risk governance components powered by React, RAG pipelines, FastAPI, and DataGol.",
      "Engineered a LinkedIn trusted-network intelligence extension using JavaScript DOM extraction, FastAPI, PostgreSQL (Neon), and JWT.",
    ],
  },
  {
    role: "AI Developer",
    company: "Tribeca Softech",
    period: "Feb 2026 – Present",
    location: "Remote",
    highlights: [
      "Built an enterprise-grade RAG query engine supporting attachment-based queries, streaming responses, and conversational context management. Designed multi-mode interaction system including focus mode, global mode, and temporary sessions with dynamic context handling.",
      "Developed a modular vectorization engine for multi-source ingestion (S3, databases) with components like input manager, embedding pipeline, optimizer, observer, and profiling layers.",
      "Implemented retrieval optimization, reranking, and LLM-based reasoning layers to improve response relevance and handling of conflicting information.",
      "Built scalable backend using FastAPI, PostgreSQL (Neon), async workflows enabling real-time processing and extensible AI system design.",
      "Developed AI research agents for LinkedIn profile enrichment using Playwright, Firecrawl, and LLM-driven structured data extraction pipelines.",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="py-16 px-4 md:px-8 lg:px-20 bg-muted/20"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-cyan">
          Experience
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          My professional journey through software development and AI engineering
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.role + index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 neon-card hover:neon-glow-cyan transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="p-3 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Briefcase className="w-5 h-5 text-primary neon-text-cyan" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold neon-text-cyan">
                      {experience.role}
                    </h3>
                    <p className="text-sm text-muted-foreground neon-text-pink">
                      {experience.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 neon-text-cyan">
                    <Calendar className="w-4 h-4" />
                    {experience.period}
                  </span>
                  <span className="flex items-center gap-2 neon-text-pink">
                    <MapPin className="w-4 h-4" />
                    {experience.location}
                  </span>
                </div>

                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {experience.highlights.map((highlight, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="hover:neon-text-cyan transition-colors"
                    >
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
