import { Mail, Linkedin, Github, FileText, Heart } from "lucide-react";
import { motion } from "framer-motion";
import NeonGridBackground from "@/components/NeonGridBackground";

const Footer = () => {
  const socialLinks = [
    { icon: <Mail size={24} />, href: "mailto:cnniranjan72@gmail.com", label: "Email", color: "neon-text-pink" },
    { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/niranjan-c-n", label: "LinkedIn", color: "neon-text-blue" },
    { icon: <Github size={24} />, href: "https://github.com/cnniranjan72", label: "GitHub", color: "neon-text-cyan" },
    { icon: <FileText size={24} />, href: "/public/resume/NiranjanCN-Resume.pdf", label: "Resume", color: "neon-text-green" },
  ];

  return (
    <NeonGridBackground>
      <footer className="relative py-16 pb-32 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Footer Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text-cyan">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex justify-center flex-wrap gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center justify-center p-6 rounded-xl neon-card hover:neon-glow-cyan transition-all duration-300 border border-cyan-500/20 group-hover:border-pink-500/30">
                  <motion.div
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 group-hover:border-pink-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={social.color}>
                      {social.icon}
                    </div>
                  </motion.div>
                  <span className={`mt-3 text-sm font-medium ${social.color} group-hover:scale-110 transition-transform duration-300`}>
                    {social.label}
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            
            <p className="text-sm text-muted-foreground mt-2">
              © 2026 All rights reserved
            </p>
          </motion.div>
        </div>
      </footer>
    </NeonGridBackground>
  );
};

export default Footer;
