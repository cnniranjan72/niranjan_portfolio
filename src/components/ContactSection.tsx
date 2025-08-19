import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Send,
  Clock,
  MessageSquare
} from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      content: "cnniranjan72@gmail.com",
      description: "Send me an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone",
      content: "+91 9108269436",
      description: ""
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Location",
      content: "Bengaluru, India",
      description: "Available for remote work"
    }
    
  ];

  const socialLinks = [
    { icon: <Github size={24} />, href: "https://github.com/cnniranjan72", label: "GitHub" },
    { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/niranjan-c-n/", label: "LinkedIn" },
    { icon: <Mail size={24} />, href: "mailto:cnniranjan72@gmail.com", label: "Email" }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Let's discuss how we can work together to bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-elevated">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-2xl font-semibold">Send a Message</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="transition-smooth focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="transition-smooth focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Project inquiry, collaboration, etc."
                  required
                  className="transition-smooth focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, timeline, and any specific requirements..."
                  rows={6}
                  required
                  className="transition-smooth focus:border-primary resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full gradient-primary text-white hover:scale-105 transition-spring"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{info.title}</h4>
                    <p className="text-foreground">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

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
