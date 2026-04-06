import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Github, Linkedin, Send, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "cnniranjan72@gmail.com",
      description: "Send me an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+91 9108269436",
      description: "Available for calls",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      content: "Bengaluru, India",
      description: "Available for remote work",
    },
  ];

  const socialLinks = [
    { icon: <Github size={24} />, href: "https://github.com/cnniranjan72", label: "GitHub" },
    { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/niranjan-c-n/", label: "LinkedIn" },
    { icon: <Mail size={24} />, href: "mailto:cnniranjan72@gmail.com", label: "Email" },
  ];

  return (
    <section id="contact" className="relative py-20 bg-gradient-to-br from-background via-muted/10 to-muted/20 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] top-20 left-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] bottom-20 right-20"
        animate={{
          scale: [1.1, 1, 1.1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
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
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Let's discuss how we can work together to bring your vision to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Enhanced Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 10 }}
              >
                <div className="flex items-start space-x-4 neon-card p-6 rounded-xl hover:neon-glow-cyan transition-all duration-300">
                  <motion.div
                    className="p-3 rounded-lg bg-primary/10"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      backgroundColor: "rgba(0, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="neon-text-cyan">{info.icon}</div>
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg neon-text-cyan mb-1">{info.title}</h4>
                    <p className="text-foreground hover:text-cyan-400 transition-colors">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Enhanced Connect & Availability */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Enhanced Social Links */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 neon-card hover:neon-glow-pink transition-all duration-300 rounded-xl">
                <h4 className="font-semibold text-lg mb-4 neon-text-pink flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Connect With Me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ 
                        scale: 1.2,
                        backgroundColor: "rgba(255, 0, 255, 0.2)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="neon-border-pink neon-text-pink hover:neon-glow-pink transition-all duration-300"
                        asChild
                      >
                        <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                          {social.icon}
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Availability */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 neon-card hover:neon-glow-green transition-all duration-300 rounded-xl">
                <h4 className="font-semibold text-lg mb-3 neon-text-green flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Current Availability
                </h4>
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="neon-text-green font-medium">Available for internships & projects</span>
                </div>
                <p className="text-sm text-muted-foreground hover:text-green-400 transition-colors">
                  I'm currently open for internships and freelance projects. 
                  Let's connect and discuss how I can contribute to your team or idea.
                </p>
              </Card>
            </motion.div>

            {/* Quick Contact Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full neon-button text-lg py-6"
                asChild
              >
                <a href="mailto:cnniranjan72@gmail.com">
                  <Send className="mr-2" size={20} />
                  Send Message
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Contact stats removed */}
      </div>
    </section>
  );
};

export default ContactSection;
