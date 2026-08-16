import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const RESPONSES: Record<string, string> = {
  greeting:
    "Hello! 👋 I'm the Portfolio Assistant for Niranjan. I can tell you about his projects, experience, skills, education, and contact info. Try one of the preset options below or type a question!",
  about:
    'Niranjan is a Computer Science undergraduate and Software Engineer passionate about building production-grade full-stack and AI systems across aviation and enterprise platforms. He has experience in RAG pipelines, vector databases, and reinforcement learning systems with strong foundations in scalable system design. Currently pursuing B.E. in Computer Science and Engineering from AMC Engineering College, Bangalore with a CGPA of 8.5.',
  projects:
    'Featured Projects:\n\n🪞 AIMirror - Behavioral digital twin engine that constructs, evolves, and explains a complete cognitive identity model from Instagram Reels and YouTube activity\n   🔗 Demo: https://aimirror-dashboard.onrender.com\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n   🔗 Demo: https://civitas-frontend-jee0.onrender.com\n\n🛡️ BASTION - AI agent control plane that intercepts every tool call, enforces policy, and records immutable audit events with causal replay\n   🔗 Demo: https://bastion-frontend.onrender.com\n\n🚀 IntelliMine - AI-powered landmine detection with 98.2% accuracy using Random Forest + PCA pipelines with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crops with 96.8% model accuracy\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend\n\nType a project name to see details and live demo links!',
  aimirror:
    '🪞 AIMirror — Behavioral Digital Twin Engine\n\nA production-grade cognitive digital twin engine that constructs, evolves, and explains a complete behavioral identity model from Instagram Reels and YouTube activity.\n\n• 9-sub-profile behavioral identity (behavior, interest graph, creator graph, learning style, attention, exploration, consistency, habit, motivation)\n• Full explainability — every inference traces back to its source evidence\n• Chrome Extension (MV3) ingestion + FastAPI + React + PostgreSQL (pgvector)\n• Multi-provider LLM (OpenAI, Anthropic, Ollama) verbalizes only — never reasons or decides\n• Online RL layer (contextual bandit) for personalized wellbeing interventions\n\n🔗 Demo: https://aimirror-dashboard.onrender.com\n🐙 Code: https://github.com/cnniranjan72/AI-Mirror',
  civitas:
    '🏙️ CIVITAS — AI Smart City Digital Twin\n\nAI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling that optimizes policy trade-offs.\n\n• PPO multi-agent reinforcement learning for policy optimization\n• Real-time urban simulations with agent-based citizen modeling\n• LLM-powered decision explainability\n\n🔗 Demo: https://civitas-frontend-jee0.onrender.com\n🐙 Code: https://github.com/cnniranjan72/civitas',
  bastion:
    '🛡️ BASTION — AI Agent Control Plane\n\nA control plane that sits between AI agents and the outside world. Every tool call an agent attempts — an HTTP request, a database mutation, a payment — is intercepted, checked against policy, allowed/blocked/escalated, and recorded as an immutable event.\n\n• Real-time prevention — a blocked call never reaches the real API (policy checked before execute())\n• Full causal replay of what an agent actually did\n• Append-only event store (Postgres) + Kafka fan-out + live 3D execution graph\n• Versioned policies with hot reload, plus RBAC (owner/admin/approver/viewer)\n• Running in production, with real load-test targets on the /intercept hot path\n\n🔗 Demo: https://bastion-frontend.onrender.com',
  intellimine:
    '🚀 IntelliMine — Autonomous Landmine Detection\n\nRandom Forest + PCA pipelines with severity scoring, 98.2% detection rate, and A* safe path planning.\n\n🔗 Demo: https://intellimine.vercel.app\n🐙 Code: https://github.com/cnniranjan72/Autonomous-Landmine-detector',
  cortex:
    '🤖 Cortex — RAG-Based AI Assistant\n\nRAG-based AI assistant supporting attachment-based queries with real-time streaming responses. Uses OpenAI APIs, function calling, structured outputs, and vector search (Pinecone).',
  agrimind:
    '🌾 AgriMind — AI Crop & Yield Platform\n\nML-driven crop recommendation + yield prediction across 30+ crops with 96.8% model accuracy.\n\n🔗 Demo: https://agrimind-frontend.vercel.app/\n🐙 Code: https://github.com/cnniranjan72/AgriMind',
  visionarrate:
    '📸 VisioNarrate — Image to Story Generator\n\nGenerates human-like stories from images using machine learning and NLP-based storytelling models.\n\n🐙 Code: https://github.com/cnniranjan72/VisioNarrate',
  kisaanmitra:
    '👨‍🌾 KisaanMitra — Farmer Support Platform\n\nA platform providing farmers with financial guidance, crop insights, and community support features.\n\n🐙 Code: https://github.com/cnniranjan72/Kisaanmitra-',
  krishilakshya:
    '💰 KrishiLakshya — Financial Tracker for Farmers\n\nA Progressive Web App helping farmers track agricultural expenses, income, and profits. Includes OCR bill scanning and interactive charts.\n\n🐙 Code: https://github.com/cnniranjan72/KrishiLakshya',
  campusconnect:
    '🎓 CampusConnect — College Information Portal\n\nPortal for students to view notices, timetables, and events. Faculty dashboard allows posting updates in real-time.\n\n🐙 Code: https://github.com/cnniranjan72/campus-connect',
  expensemate:
    '📱 MyExpenseMate — Personal Expense Tracker\n\nCross-platform mobile app to log expenses, categorize spending, and visualize trends with charts.\n\n🐙 Code: https://github.com/cnniranjan72/Expense-Tracker',
  quicknotes:
    '📝 QuickNotes — Minimalist Notes PWA\n\nOffline-first notes app with IndexedDB storage and dark mode, works seamlessly without internet.',
  gamehive:
    '🎮 GameHive — Gaming Community Platform\n\nFrontend project for a gaming hub where players can share updates, join discussions, and explore trending games.\n\n🐙 Code: https://github.com/cnniranjan72/GameHive-Frontend-Project',
  experience:
    'Work Experience:\n\n🤖 AI Developer at Tribeca Softech (Jan 2026 – Present)\n• Architected production-grade AI backend services using FastAPI, PostgreSQL (Neon), and async processing\n• Designed distributed ingestion/vectorization pipelines using AWS S3, Redis, BullMQ, and pgvector\n• Built retrieval, evaluation, telemetry, and observability pipelines for enterprise RAG systems\n• Implemented GraphQL APIs, JWT auth, RBAC, structured logging, Docker, and health monitoring\n• Led architecture of multiple AI platform components for production readiness\n\n🔧 Software Development Engineer (Contract) at AeroAspire (Oct 2025 – Present)\n• Own development of AeroBriefs, production aviation weather briefing platform\n• Architected real-time Flutter + Firebase + Firestore systems\n\n💻 Software Development Engineer Intern at AeroAspire (Sep 2025 – Oct 2025)\n• Built full-stack modules spanning React, Flask, Docker, and SQLite\n\n🚀 Software Development Engineer (Consultant) at Tribeca Softech (Jan 2026 – Feb 2026)\n• Developed enterprise IT risk governance components\n• Built LinkedIn trusted-network intelligence extension\n\nAsk about "tribeca" or "aeroaspire" for more details.',
  tribeca:
    '🤖 Tribeca Softech — AI Developer (Jan 2026 – Present)\n\n• Architected production-grade AI backend services using FastAPI, PostgreSQL (Neon), and asynchronous processing for scalable enterprise knowledge systems.\n• Designed distributed ingestion and vectorization pipelines using AWS S3, Redis, BullMQ, and pgvector for scalable semantic retrieval.\n• Built retrieval, evaluation, telemetry, and observability pipelines for enterprise RAG systems.\n• Implemented GraphQL APIs, JWT authentication, RBAC, structured logging, Docker deployment, health monitoring, and workflow orchestration.\n• Led architecture and implementation of multiple AI platform components emphasizing scalability, reliability, maintainability, and production readiness.',
  aeroaspire:
    '🔧 AeroAspire — Software Development Engineer (Sep 2025 – Present)\n\n• Developing AeroBriefs, a cross-platform aviation weather briefing application using Flutter, Firebase Authentication, Firestore, and REST APIs.\n• Built reliable synchronization pipelines for real-time aviation operations following industry best practices.',
  skills:
    'Technical Skills:\n\n💻 Frontend: React.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, Vite\n\n🔧 Backend: FastAPI, Node.js, Flask, Express, GraphQL, REST APIs\n\n🗄️ Database: PostgreSQL, MongoDB, Redis, Firestore, Pinecone, MySQL, pgvector\n\n🤖 AI/ML: LLMs, RAG Systems, Agentic AI, Vector Databases, Embeddings, Semantic Search, Reinforcement Learning, OpenAI, Anthropic Claude, Ollama\n\n📱 Mobile: Flutter, React Native, PWA\n\n☁️ Cloud & DevOps: AWS, GCP, Docker, Linux, BullMQ, Neon\n\n🔧 Tools: Git, GitHub, Postman, Swagger, Playwright, Chrome Extension MV3',
  education:
    'Education:\n\n🎓 B.E. in Computer Science and Engineering\n🏛️ AMC Engineering College, Bangalore\n📅 2023 – 2027\n📊 CGPA: 8.5\n\n📚 Key Coursework:\n• Data Structures and Applications\n• Operating Systems\n• Database Management Systems\n• Theory of Computation\n• Analysis and Design of Algorithms\n• Computer Networks\n• Artificial Intelligence\n• Software Engineering & Project Management\n• Machine Learning\n• Cloud Computing\n• Compiler Design\n\n🎯 Academic Focus: Building strong foundations in computer science with practical applications in AI/ML and full-stack development.',
  contact:
    'Contact Information:\n\n📧 Email: cnniranjan72@gmail.com\n📱 Phone: +91 9108269436\n📍 Location: Bengaluru, India (available for remote work)\n💼 LinkedIn: https://www.linkedin.com/in/niranjan-c-n/\n🐙 GitHub: https://github.com/cnniranjan72\n📄 Resume: Downloadable from the portfolio\n\nFeel free to reach out for collaborations, project opportunities, or just a friendly hello!',
  resume:
    '📄 You can download Niranjan\'s resume here:\nhttps://niranjancn.vercel.app/resume/NiranjanCN-Resume.pdf\n\nIt\'s also available in the Resume section of this portfolio. Want his LinkedIn or GitHub instead?',
  demos:
    '🔗 Live Demos:\n\n🪞 AIMirror: https://aimirror-dashboard.onrender.com\n🏙️ Civitas: https://civitas-frontend-jee0.onrender.com\n🚀 IntelliMine: https://intellimine.vercel.app\n🌾 AgriMind: https://agrimind-frontend.vercel.app/\n\nPortfolio: https://niranjancn.vercel.app',
  thanks:
    "You're welcome! 😊 Happy to help. If you have any more questions about Niranjan's work, just ask.",
  farewell:
    "Goodbye! 👋 Thanks for visiting Niranjan's portfolio. Feel free to come back anytime — and don't forget to check out his latest projects!",
  help:
    "I can help you learn about Niranjan! Here's what I know about:\n\n• About — who he is and his background\n• Projects — AIMirror, Civitas, IntelliMine, and more\n• Experience — roles at Tribeca Softech and AeroAspire\n• Skills — tech stack and tools\n• Education — B.E. CSE at AMC Engineering College\n• Contact — email, phone, LinkedIn, GitHub\n• Resume — download a copy\n• Demos — live links to deployed projects\n\nTry asking things like \"tell me about AIMirror\" or \"what is his experience?\"",
  empty:
    "I didn't catch that. 🤔 Could you rephrase? Try asking about his projects, experience, skills, education, or contact info.",
  fallback:
    "Sorry, I didn't quite understand that. 🤔 I can tell you about Niranjan's projects, experience, skills, education, contact info, or resume.\n\nTry one of the preset options, or ask something like:\n• \"Tell me about AIMirror\"\n• \"What is his experience?\"\n• \"How can I contact him?\"\n• \"Show me live demos\"",
};

interface IntentPattern {
  id: string;
  keywords: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  { id: 'aimirror', keywords: ['aimirror', 'ai mirror', 'behavioral twin', 'digital twin', 'mirror'] },
  { id: 'civitas', keywords: ['civitas', 'smart city', 'city twin', 'urban'] },
  { id: 'bastion', keywords: ['bastion', 'control plane', 'agent control'] },
  { id: 'intellimine', keywords: ['intellimine', 'landmine', 'mine detection'] },
  { id: 'cortex', keywords: ['cortex', 'rag assistant'] },
  { id: 'agrimind', keywords: ['agrimind', 'crop recommendation', 'yield'] },
  { id: 'visionarrate', keywords: ['visionarrate', 'story generator', 'image to story'] },
  { id: 'kisaanmitra', keywords: ['kisaanmitra', 'kisaan', 'farmer support'] },
  { id: 'krishilakshya', keywords: ['krishilakshya', 'krishi', 'ocr bill'] },
  { id: 'campusconnect', keywords: ['campusconnect', 'campus connect', 'college portal'] },
  { id: 'expensemate', keywords: ['expensemate', 'expense tracker', 'expense'] },
  { id: 'quicknotes', keywords: ['quicknotes', 'notes app', 'notes'] },
  { id: 'gamehive', keywords: ['gamehive', 'gaming'] },
  { id: 'tribeca', keywords: ['tribeca'] },
  { id: 'aeroaspire', keywords: ['aeroaspire', 'aerobriefs', 'aviation'] },
  { id: 'resume', keywords: ['resume', 'cv', 'download pdf'] },
  { id: 'contact', keywords: ['contact', 'email', 'phone', 'phone number', 'call', 'reach', 'linkedin', 'github', 'address', 'message', 'location', 'located', 'based in'] },
  { id: 'demos', keywords: ['demos', 'demo', 'live demo', 'deploy', 'hosted', 'website', 'launch'] },
  { id: 'experience', keywords: ['experience', 'job', 'career', 'roles', 'internship', 'positions', 'where has he worked'] },
  { id: 'projects', keywords: ['projects', 'project', 'portfolio', 'apps', 'showcase', 'builds', 'built', 'works', 'created'] },
  { id: 'education', keywords: ['education', 'college', 'university', 'degree', 'cgpa', 'coursework', 'classes', 'amc', 'academics'] },
  { id: 'skills', keywords: ['skill', 'technolog', 'tech stack', 'stack', 'frontend', 'backend', 'language', 'python', 'react', 'node', 'database', 'tools', 'framework', 'stacks'] },
  { id: 'thanks', keywords: ['thank', 'thanks', 'appreciate', 'grateful'] },
  { id: 'help', keywords: ['help', 'option', 'menu', 'what can you', 'how do i', 'start over', 'reset'] },
  { id: 'farewell', keywords: ['bye', 'goodbye', 'see you', 'good night', 'goodnight', 'see ya', 'later'] },
  { id: 'greeting', keywords: ['hello', 'hi', 'hey', 'yo', 'hola', 'namaste', 'good morning', 'good afternoon', 'good evening', 'whats up', 'howdy'] },
  { id: 'about', keywords: ['about', 'who is', 'who are', 'niranjan', 'intro', 'introduction', 'yourself', 'bio', 'summary'] },
];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesKeyword = (input: string, keyword: string) => {
  if (keyword.includes(' ')) return input.includes(keyword);
  if (keyword.length <= 4) {
    return new RegExp(`\\b${escapeRegex(keyword)}\\b`).test(input);
  }
  return input.includes(keyword);
};

const getBotResponse = (rawInput: string): string => {
  const input = (rawInput || '').toLowerCase().trim();

  if (!input) return RESPONSES.empty;

  const textOnly = input.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!textOnly) return RESPONSES.empty;

  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some((kw) => matchesKeyword(textOnly, kw))) {
      return RESPONSES[pattern.id];
    }
  }
  return RESPONSES.fallback;
};

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
      response: 'Featured Projects:\n\n🪞 AIMirror - Behavioral digital twin engine that constructs, evolves, and explains a complete cognitive identity model from Instagram Reels and YouTube activity\n   🔗 Demo: https://aimirror-dashboard.onrender.com\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n   🔗 Demo: https://civitas-frontend-jee0.onrender.com\n\n🛡️ BASTION - AI agent control plane that intercepts every tool call, enforces policy, and records immutable audit events with causal replay\n   🔗 Demo: https://bastion-frontend.onrender.com\n\n🚀 IntelliMine - AI-powered landmine detection with 98.2% accuracy using Random Forest + PCA pipelines with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crops with 96.8% model accuracy\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend\n\nType a project name to see details and live demo links!'
    },
    { 
      id: 'experience', 
      text: 'What is his experience?', 
      response: 'Work Experience:\n\n🤖 AI Developer at Tribeca Softech (Jan 2026 – Present)\n• Architected production-grade AI backend services using FastAPI, PostgreSQL (Neon), and async processing\n• Designed distributed ingestion/vectorization pipelines using AWS S3, Redis, BullMQ, and pgvector\n• Built retrieval, evaluation, telemetry, and observability pipelines for enterprise RAG systems\n• Implemented GraphQL APIs, JWT auth, RBAC, structured logging, Docker, and health monitoring\n• Led architecture of multiple AI platform components for production readiness\n\n🔧 Software Development Engineer (Contract) at AeroAspire (Oct 2025 – Present)\n• Own development of AeroBriefs, production aviation weather briefing platform\n• Architected real-time Flutter + Firebase + Firestore systems\n\n💻 Software Development Engineer Intern at AeroAspire (Sep 2025 – Oct 2025)\n• Built full-stack modules spanning React, Flask, Docker, and SQLite\n\n🚀 Software Development Engineer (Consultant) at Tribeca Softech (Jan 2026 – Feb 2026)\n• Developed enterprise IT risk governance components\n• Built LinkedIn trusted-network intelligence extension'
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
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
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
