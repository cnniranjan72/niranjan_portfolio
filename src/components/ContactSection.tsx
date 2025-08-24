import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      content: "cnniranjan72@gmail.com",
      description: "Send me an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone",
      content: "+91 9108269436",
      description: "",
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
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
    <section id="contact" className="relative py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Let's discuss how we can work together to bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">{info.icon}</div>
                <div>
                  <h4 className="font-semibold text-lg">{info.title}</h4>
                  <p className="text-foreground">{info.content}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Connect & Availability */}
          <div className="space-y-8">
            {/* Social Links */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-lg mb-4">Connect With Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-white transition-smooth"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                      {social.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Availability */}
            <Card className="p-6 shadow-card gradient-surface">
              <h4 className="font-semibold text-lg mb-3">Current Availability</h4>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Available for internships & projects</span>
              </div>
              <p className="text-sm text-muted-foreground">
                I'm currently open for internships and freelance projects. 
                Let’s connect and discuss how I can contribute to your team or idea.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
