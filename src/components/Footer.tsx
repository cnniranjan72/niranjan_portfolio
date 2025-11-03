import { Mail, Linkedin, Github, FileText } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: <Mail size={24} />, href: "mailto:cnniranjan72@gmail.com", label: "Email" },
    { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/niranjan-c-n", label: "LinkedIn" },
    { icon: <Github size={24} />, href: "https://github.com/cnniranjan72", label: "GitHub" },
    { icon: <FileText size={24} />, href: "../public/resume/NiranjanCN-Resume.pdf", label: "Resume" },
  ];

  return (
    <footer className="bg-background py-16 pb-32">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center flex-wrap gap-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex flex-col items-center justify-center
                p-4 rounded-full
                transition-smooth
                hover:text-primary
                relative
              "
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full hover:shadow-glow transition-smooth">
                {social.icon}
              </div>
              <span className="mt-2 text-sm">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
