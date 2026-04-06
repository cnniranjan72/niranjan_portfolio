import { Card } from "@/components/ui/card";
import { GraduationCap, BookOpen, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const EducationSection = () => {
  const education = [
    {
      degree: "B.E. in Computer Science and Engineering",
      institution: "AMC Engineering College, Bangalore",
      duration: "2023 – 2027",
      cgpa: "CGPA: 8.5",
      coursework: [
        "Data Structures and Applications",
        "Operating Systems",
        "Database Management Systems",
        "Theory of Computation",
        "Analysis and Design of Algorithms",
        "Computer Networks",
        "Artificial Intelligence",
        "Software Engineering & Project Management",
        "Machine Learning",
        "Cloud Computing",
        "Compilor Design",
      ],
    },
  ];

  return (
    <section id="education" className="py-20 bg-gradient-to-br from-background via-muted/10 to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] top-10 right-10"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[90px] bottom-10 left-10"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 25, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-cyan">
            Education
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My academic journey and relevant coursework
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-8 neon-card hover:neon-glow-cyan transition-all duration-300 rounded-xl">
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    className="p-3 rounded-lg bg-primary/10"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      backgroundColor: "rgba(0, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <GraduationCap className="w-10 h-10 neon-text-cyan flex-shrink-0" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold neon-text-cyan mb-2">{edu.degree}</h3>
                    <p className="text-muted-foreground hover:text-cyan-400 transition-colors">{edu.institution}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground neon-text-pink">
                        <Calendar className="w-4 h-4" />
                        {edu.duration}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-medium neon-text-green">
                        <Award className="w-4 h-4" />
                        {edu.cgpa}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold mb-3 flex items-center gap-2 neon-text-cyan">
                    <BookOpen className="w-5 h-5" />
                    Relevant Coursework:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {edu.coursework.map((course, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.05,
                          x: 5,
                          color: "#00ffff"
                        }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors cursor-default"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        {course}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
