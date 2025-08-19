import { Button } from "@/components/ui/button";
import { Heart, ArrowUp, Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    navigation: [
      { label: "Home", href: "#hero" },
      { label: "About", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Services", href: "#services" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" }
    ],
    services: [
      { label: "Web Development", href: "#services" },
      { label: "Mobile Apps", href: "#services" },
      { label: "UI/UX Design", href: "#services" },
      { label: "Consulting", href: "#services" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: <Github size={20} />, href: "#", label: "GitHub" },
    { label: "LinkedIn", href: "#", icon: <Linkedin size={20} /> },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Mail size={20} />, href: "mailto:hello@alexjohnson.dev", label: "Email" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-background to-muted/20 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Alex Johnson
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Creative developer & designer crafting beautiful digital experiences. 
              Let's bring your next project to life.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary hover:text-white transition-smooth"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-smooth text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-smooth text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get In Touch</h4>
            <div className="space-y-3 mb-6">
              <p className="text-muted-foreground">
                <strong>Email:</strong> hello@alexjohnson.dev
              </p>
              <p className="text-muted-foreground">
                <strong>Location:</strong> San Francisco, CA
              </p>
              <p className="text-muted-foreground">
                <strong>Response:</strong> Within 24 hours
              </p>
            </div>
            
            <div>
              <h5 className="font-medium mb-3">Legal</h5>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              © {currentYear} Alex Johnson. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Made with <Heart size={16} className="inline text-red-500 mx-1" /> using React & TypeScript
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="hover:bg-primary hover:text-white transition-smooth"
          >
            <ArrowUp size={16} className="mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;