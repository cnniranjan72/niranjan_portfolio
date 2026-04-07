import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you explore Niranjan's portfolio. Choose an option below:",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const presetOptions = [
    { 
      id: 'about', 
      text: 'Tell me about Niranjan', 
      response: 'Niranjan is a Computer Science undergraduate and Software Engineer passionate about building production-grade full-stack and AI systems across aviation and enterprise platforms. He has experience in RAG pipelines, vector databases, and reinforcement learning systems with strong foundations in scalable system design. Currently pursuing B.E. in Computer Science and Engineering from AMC Engineering College, Bangalore with a CGPA of 8.5.'
    },
    { 
      id: 'projects', 
      text: 'What projects has he worked on?', 
      response: 'Featured Projects:\n\n🚀 IntelliMine - AI-powered landmine detection with 98.2% accuracy using Random Forest + PCA pipelines with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crops with 96.8% model accuracy\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend'
    },
    { 
      id: 'experience', 
      text: 'What is his experience?', 
      response: 'Work Experience:\n\n🔧 Software Development Engineer (Contract) at AeroAspire (Oct 2025 – Present)\n• Own development of AeroBriefs, production aviation weather briefing platform\n• Architected real-time Flutter + Firebase + Firestore systems\n\n💻 Software Development Engineer Intern at AeroAspire (Sep 2025 – Oct 2025)\n• Developed AI-powered aviation weather briefing platform\n• Implemented real-time data processing and visualization\n\n🚀 Software Development Engineer (Consultant) at Tribeca Softech (Jan 2026 – Present)\n• Developed enterprise IT risk governance components\n• Built LinkedIn trusted-network intelligence extension\n• Implemented secure authentication system with OTP and MFA\n\n🤖 AI Developer at Tribeca Softech (Feb 2026 – Present)\n• Built enterprise-grade RAG query engine with streaming responses\n• Developed modular vectorization engine for multi-source ingestion\n• Implemented retrieval optimization and LLM-based reasoning layers\n• Built AI research agents for LinkedIn profile enrichment'
    },
    { 
      id: 'skills', 
      text: 'What are his technical skills?', 
      response: 'Technical Skills:\n\n💻 Frontend: React.js, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3, JavaScript\n\n🔧 Backend: Node.js, FastAPI, Flask, Express, REST APIs\n\n🗄️ Database: PostgreSQL, MongoDB, Firestore, Pinecone, SQL, NoSQL\n\n🤖 AI/ML: OpenAI APIs, Reinforcement Learning, RAG Systems, Machine Learning, NLP, Computer Vision\n\n📱 Mobile: Flutter, React Native, PWA Development\n\n☁️ Cloud: Firebase, Google Cloud Platform, AWS\n\n🔧 Tools: Git, GitHub, Docker, VS Code, Postman\n\n📊 Data Science: Python, Data Analysis, Visualization, Scikit-learn\n\n🎯 Other: JWT Authentication, OAuth, WebSockets, Microservices, Agile/Scrum'
    },
    { 
      id: 'contact', 
      text: 'How can I contact him?', 
      response: 'Contact Information:\n\n📧 Email: cnniranjan72@gmail.com (Always available via email)\n\n📱 Phone: +91 9108269436 (Available for calls)\n\n📍 Location: Bengaluru, India (Available for remote work)\n\n💼 LinkedIn: https://www.linkedin.com/in/niranjan-c-n/\n\n🐙 GitHub: https://github.com/cnniranjan72\n\n📄 Resume: Available for download in the portfolio\n\nFeel free to reach out for collaborations, project opportunities, or just a friendly hello!'
    },
    { 
      id: 'education', 
      text: 'What is his educational background?', 
      response: 'Education:\n\n🎓 B.E. in Computer Science and Engineering\n🏛️ AMC Engineering College, Bangalore\n📅 2023 – 2027\n📊 CGPA: 8.5\n\n📚 Key Coursework:\n• Data Structures and Applications\n• Operating Systems\n• Database Management Systems\n• Theory of Computation\n• Analysis and Design of Algorithms\n• Computer Networks\n• Artificial Intelligence\n• Software Engineering & Project Management\n• Machine Learning\n• Cloud Computing\n• Compiler Design\n\n🎯 Academic Focus: Building strong foundations in computer science with practical applications in AI/ML and full-stack development.'
    }
  ];

  const handleOptionClick = (option: typeof presetOptions[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: option.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const userInput = inputValue.toLowerCase();
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        let botResponse = "Thank you for your message! For specific inquiries, please use the preset options or contact Niranjan directly through the Contact section.";

        // Keyword matching logic
        if (userInput.includes('about') || userInput.includes('who') || userInput.includes('niranjan') || userInput.includes('intro')) {
          botResponse = 'Niranjan is a Computer Science undergraduate and Software Engineer passionate about building production-grade full-stack and AI systems across aviation and enterprise platforms. He has experience in RAG pipelines, vector databases, and reinforcement learning systems with strong foundations in scalable system design. Currently pursuing B.E. in Computer Science and Engineering from AMC Engineering College, Bangalore with a CGPA of 8.5.';
        }
        else if (userInput.includes('project') || userInput.includes('work') || userInput.includes('portfolio') || userInput.includes('intellimine') || userInput.includes('agrimind') || userInput.includes('civitas') || userInput.includes('cortex')) {
          botResponse = 'Featured Projects:\n\n🚀 IntelliMine - AI-powered landmine detection with 98.2% accuracy using Random Forest + PCA pipelines with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crops with 96.8% model accuracy\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend';
        }
        else if (userInput.includes('experience') || userInput.includes('job') || userInput.includes('work') || userInput.includes('career') || userInput.includes('aeroaspire') || userInput.includes('tribeca')) {
          botResponse = 'Work Experience:\n\n🔧 Software Development Engineer (Contract) at AeroAspire (Oct 2025 – Present)\n• Own development of AeroBriefs, production aviation weather briefing platform\n• Architected real-time Flutter + Firebase + Firestore systems\n\n💻 Software Development Engineer Intern at AeroAspire (Sep 2025 – Oct 2025)\n• Developed AI-powered aviation weather briefing platform\n• Implemented real-time data processing and visualization\n\n🚀 Software Development Engineer (Consultant) at Tribeca Softech (Jan 2026 – Present)\n• Developed enterprise IT risk governance components\n• Built LinkedIn trusted-network intelligence extension\n• Implemented secure authentication system with OTP and MFA\n\n🤖 AI Developer at Tribeca Softech (Feb 2026 – Present)\n• Built enterprise-grade RAG query engine with streaming responses\n• Developed modular vectorization engine for multi-source ingestion\n• Implemented retrieval optimization and LLM-based reasoning layers\n• Built AI research agents for LinkedIn profile enrichment';
        }
        else if (userInput.includes('skill') || userInput.includes('tech') || userInput.includes('technology') || userInput.includes('react') || userInput.includes('node') || userInput.includes('python') || userInput.includes('database')) {
          botResponse = 'Technical Skills:\n\n💻 Frontend: React.js, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3, JavaScript\n\n🔧 Backend: Node.js, FastAPI, Flask, Express, REST APIs\n\n🗄️ Database: PostgreSQL, MongoDB, Firestore, Pinecone, SQL, NoSQL\n\n🤖 AI/ML: OpenAI APIs, Reinforcement Learning, RAG Systems, Machine Learning, NLP, Computer Vision\n\n📱 Mobile: Flutter, React Native, PWA Development\n\n☁️ Cloud: Firebase, Google Cloud Platform, AWS\n\n🔧 Tools: Git, GitHub, Docker, VS Code, Postman\n\n📊 Data Science: Python, Data Analysis, Visualization, Scikit-learn\n\n🎯 Other: JWT Authentication, OAuth, WebSockets, Microservices, Agile/Scrum';
        }
        else if (userInput.includes('contact') || userInput.includes('email') || userInput.includes('phone') || userInput.includes('reach') || userInput.includes('linkedin') || userInput.includes('github')) {
          botResponse = 'Contact Information:\n\n📧 Email: cnniranjan72@gmail.com (Always available via email)\n\n📱 Phone: +91 9108269436 (Available for calls)\n\n📍 Location: Bengaluru, India (Available for remote work)\n\n💼 LinkedIn: https://www.linkedin.com/in/niranjan-c-n/\n\n🐙 GitHub: https://github.com/cnniranjan72\n\n📄 Resume: Available for download in the portfolio\n\nFeel free to reach out for collaborations, project opportunities, or just a friendly hello!';
        }
        else if (userInput.includes('education') || userInput.includes('college') || userInput.includes('university') || userInput.includes('degree') || userInput.includes('cgpa') || userInput.includes('amc')) {
          botResponse = 'Education:\n\n🎓 B.E. in Computer Science and Engineering\n🏛️ AMC Engineering College, Bangalore\n📅 2023 – 2027\n📊 CGPA: 8.5\n\n📚 Key Coursework:\n• Data Structures and Applications\n• Operating Systems\n• Database Management Systems\n• Theory of Computation\n• Analysis and Design of Algorithms\n• Computer Networks\n• Artificial Intelligence\n• Software Engineering & Project Management\n• Machine Learning\n• Cloud Computing\n• Compiler Design\n\n🎯 Academic Focus: Building strong foundations in computer science with practical applications in AI/ML and full-stack development.';
        }
        else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey') || userInput.includes('help')) {
          botResponse = "Hello! I'm here to help you explore Niranjan's portfolio. You can ask me about:\n\n• About Niranjan\n• Projects\n• Experience\n• Skills\n• Contact Information\n• Education\n\nOr click the preset options below for quick information!";
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center neon-glow-cyan hover:neon-glow-pink transition-all duration-300 border border-cyan-500/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-96 h-[600px] neon-card border border-cyan-500/30 rounded-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border-b border-cyan-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 neon-text-cyan" />
                <h3 className="font-semibold neon-text-cyan">Portfolio Assistant</h3>
              </div>
              <button
                onClick={toggleChat}
                className="w-6 h-6 rounded-full hover:bg-cyan-500/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 neon-text-pink" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/30 border border-cyan-500/30'
                        : 'bg-gradient-to-r from-pink-500/20 to-pink-500/30 border border-pink-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-3 h-3 neon-text-cyan" />
                      ) : (
                        <Bot className="w-3 h-3 neon-text-pink" />
                      )}
                      <span className={`text-xs ${message.sender === 'user' ? 'neon-text-cyan' : 'neon-text-pink'}`}>
                        {message.sender === 'user' ? 'You' : 'Bot'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-line">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-pink-500/20 to-pink-500/30 border border-pink-500/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3 h-3 neon-text-pink" />
                      <span className="text-xs neon-text-pink">Bot</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Options */}
            <div className="border-t border-cyan-500/30 p-3">
              <div className="grid grid-cols-2 gap-2">
                {presetOptions.slice(0, 4).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="text-xs p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20 hover:border-pink-500/30 transition-all duration-300 text-foreground hover:text-cyan-400"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-cyan-500/30 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Niranjan..."
                  className="flex-1 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm focus:outline-none focus:border-cyan-500/40 transition-colors placeholder-muted-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
