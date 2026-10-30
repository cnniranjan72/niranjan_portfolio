import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react';
import { openCase } from '@/components/site/caseRoute';

// Detailed project answers get a button that opens the matching deep-dive page.
const DEEP_LINKS: [RegExp, string, string][] = [
  [/BASTION —/, 'bastion', 'BASTION'],
  [/AIMirror —/, 'aimirror', 'AIMirror'],
  [/CIVITAS —/, 'civitas', 'CIVITAS'],
  [/IntelliMine —/, 'intellimine', 'IntelliMine'],
];

const LINK_RE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

/** Turn URLs and email addresses in a reply into real links. */
const renderRich = (text: string, mine: boolean) =>
  text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part;
    return (
      <a
        key={i}
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer"
        className={`break-all underline decoration-1 underline-offset-2 ${mine ? 'text-black' : 'text-lime hover:text-white'}`}
      >
        {part.replace(/^https?:\/\//, '')}
      </a>
    );
  });

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  /** Written by Claude (streamed from /api/chat) rather than the built-in keyword answers. */
  ai?: boolean;
}

const RESPONSES: Record<string, string> = {
  greeting:
    "Hello! 👋 I'm the Portfolio Assistant for Niranjan. I can tell you about his projects, experience, skills, education, and contact info. Try one of the preset options below or type a question!",
  about:
    'Niranjan is a Computer Science undergraduate and Software Engineer passionate about building production-grade full-stack and AI systems across aviation and enterprise platforms. He has experience in RAG pipelines, vector databases, and reinforcement learning systems with strong foundations in scalable system design. Currently pursuing B.E. in Computer Science and Engineering from AMC Engineering College, Bangalore with a CGPA of 8.5.',
  botIntro:
    "I'm Niranjan's portfolio assistant! 🤖 I can answer questions about his projects, experience, skills, education, and how to reach him. Ask me anything, or try one of the preset options below!",
  hire:
    "Niranjan is open to opportunities! 💼\n\nHe's currently working as an AI Developer at Tribeca Softech and an SDE (Contract) at AeroAspire, and is available for freelance, full-time, or collaboration work.\n\n📧 cnniranjan72@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/niranjan-c-n/\n🐙 GitHub: https://github.com/cnniranjan72",
  current:
    "Here's what Niranjan is up to right now:\n\n🤖 AI Developer at Tribeca Softech (Jan 2026 – Present)\n🔧 SDE (Contract) at AeroAspire (Oct 2025 – Present)\n🎓 B.E. CSE at AMC Engineering College, Bangalore (2023–2027)\n\nAsk about \"tribeca\", \"aeroaspire\", or \"projects\" for more details!",
  stats:
    "Niranjan has built 13 projects so far! 🚀 Highlights include AIMirror, Civitas, BASTION, IntelliMine, AgriMind, and Cortex.\n\nAsk for \"projects\" to see the full list, or type any project name for details and live demo links.",
  ack:
    "Great! 😊 What else would you like to know — projects, experience, skills, education, or how to reach him?",
  negative:
    "No problem! 👍 I'm here anytime you want to know more about Niranjan's work.",
  personal:
    "Niranjan keeps personal details like his age and birthday private 🙂 — but professionally: he's a B.E. CSE student (2023–2027) at AMC Engineering College, currently an AI Developer at Tribeca Softech. Anything else you'd like to know?",
  projects:
    'Featured Projects:\n\n🪞 AIMirror - Behavioral digital twin engine that constructs, evolves, and explains a complete cognitive identity model from Instagram Reels and YouTube activity\n   🔗 Demo: https://aimirror-dashboard.onrender.com\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n   🔗 Demo: https://civitas-frontend-jee0.onrender.com\n\n🛡️ BASTION - AI agent control plane that intercepts every tool call, enforces policy, and records immutable audit events with causal replay\n   🔗 Demo: https://bastion-frontend.onrender.com\n\n🚀 IntelliMine - AI-powered landmine detection (98.2% detection rate, 93.8% CV accuracy, <5% false positives) using Random Forest + PCA with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crop types with 93% accuracy\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend\n\nType a project name to see details and live demo links!',
  aimirror:
    '🪞 AIMirror — Behavioral Digital Twin Engine\n\nA production-grade cognitive digital twin engine that constructs, evolves, and explains a complete behavioral identity model from Instagram Reels and YouTube activity.\n\n• 9-sub-profile behavioral identity (behavior, interest graph, creator graph, learning style, attention, exploration, consistency, habit, motivation)\n• Full explainability — every inference traces back to its source evidence\n• Chrome Extension (MV3) ingestion + FastAPI + React + PostgreSQL (pgvector)\n• Multi-provider LLM (OpenAI, Anthropic, Ollama) verbalizes only — never reasons or decides\n• Online RL layer (contextual bandit) for personalized wellbeing interventions\n\n🔗 Demo: https://aimirror-dashboard.onrender.com\n🐙 Code: https://github.com/cnniranjan72/AI-Mirror',
  civitas:
    '🏙️ CIVITAS — AI Smart City Digital Twin\n\nAI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling that optimizes policy trade-offs.\n\n• PPO multi-agent reinforcement learning for policy optimization\n• Real-time urban simulations with agent-based citizen modeling\n• LLM-powered decision explainability\n\n🔗 Demo: https://civitas-frontend-jee0.onrender.com\n🐙 Code: https://github.com/cnniranjan72/civitas',
  bastion:
    '🛡️ BASTION — AI Agent Control Plane\n\nA control plane that sits between AI agents and the outside world. Every tool call an agent attempts — an HTTP request, a database mutation, a payment — is intercepted, checked against policy, allowed/blocked/escalated, and recorded as an immutable event.\n\n• Real-time prevention — a blocked call never reaches the real API (policy checked before execute())\n• Full causal replay of what an agent actually did\n• Append-only event store (Postgres) + Kafka fan-out + live 3D execution graph\n• Versioned policies with hot reload, plus RBAC (owner/admin/approver/viewer)\n• Running in production, with real load-test targets on the /intercept hot path\n\n🔗 Demo: https://bastion-frontend.onrender.com',
  intellimine:
    '🚀 IntelliMine — Autonomous Landmine Detection\n\nRandom Forest + PCA detection with a 98.2% detection rate, 93.8% cross-validated accuracy and under 5% false positives, plus threat-severity scoring and A* safe path planning.\n\n🔗 Demo: https://intellimine.vercel.app\n🐙 Code: https://github.com/cnniranjan72/Autonomous-Landmine-detector',
  cortex:
    '🤖 Cortex — RAG-Based AI Assistant\n\nRAG-based AI assistant supporting attachment-based queries with real-time streaming responses. Uses OpenAI APIs, function calling, structured outputs, and vector search (Pinecone).',
  agrimind:
    '🌾 AgriMind — AI Crop & Yield Platform\n\nML-driven crop recommendation + yield prediction across 30+ crop types with 93% accuracy.\n\n🔗 Demo: https://agrimind-frontend.vercel.app/\n🐙 Code: https://github.com/cnniranjan72/AgriMind',
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
    '🔗 Live Demos:\n\n🪞 AIMirror: https://aimirror-dashboard.onrender.com\n🛡️ BASTION: https://bastion-frontend.onrender.com\n🏙️ Civitas: https://civitas-frontend-jee0.onrender.com\n🚀 IntelliMine: https://intellimine.vercel.app\n🌾 AgriMind: https://agrimind-frontend.vercel.app/\n\nPortfolio: https://niranjancn.vercel.app',
  thanks:
    "You're welcome! 😊 Happy to help. If you have any more questions about Niranjan's work, just ask.",
  farewell:
    "Goodbye! 👋 Thanks for visiting Niranjan's portfolio. Feel free to come back anytime — and don't forget to check out his latest projects!",
  help:
    "I can help you learn about Niranjan! Here's what I know about:\n\n• About — who he is and his background\n• Projects — AIMirror, Civitas, BASTION, IntelliMine, and more\n• Experience — roles at Tribeca Softech and AeroAspire\n• Availability — is he open to freelance or full-time work?\n• Skills — tech stack and tools\n• Education — B.E. CSE at AMC Engineering College\n• Contact — email, phone, LinkedIn, GitHub\n• Resume — download a copy\n• Demos — live links to deployed projects\n\nTry asking things like \"tell me about AIMirror\" or \"what is his experience?\"",
  empty:
    "I didn't catch that. 🤔 Could you rephrase? Try asking about his projects, experience, skills, education, availability, or contact info.",
  fallback:
    "Sorry, I didn't quite catch that. 🤔 I can tell you about Niranjan's projects, experience, skills, education, availability, contact info, or resume.\n\nTry one of the preset options, or ask things like:\n• \"Tell me about AIMirror\"\n• \"What is his experience?\"\n• \"Is he available for hire?\"\n• \"How can I contact him?\"",
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
  { id: 'hire', keywords: ['hire', 'hiring', 'freelance', 'freelancer', 'opportunit', 'available', 'availability', 'open to work', 'open to opportunities', 'recruit', 'job offer', 'openings'] },
  { id: 'contact', keywords: ['contact', 'email', 'mail', 'gmail', 'phone', 'phone number', 'call', 'reach', 'linkedin', 'github', 'address', 'message', 'location', 'located', 'based in', 'social', 'socials', 'social media', 'get in touch', 'touch with'] },
  { id: 'demos', keywords: ['demos', 'demo', 'live demo', 'deploy', 'deployed', 'hosted', 'website', 'launch', 'live links', 'links', 'urls'] },
  { id: 'current', keywords: ['currently', 'current role', 'right now', 'these days', 'nowadays', 'doing now', 'working on now', 'up to'] },
  { id: 'stats', keywords: ['how many'] },
  { id: 'experience', keywords: ['experience', 'job', 'career', 'roles', 'internship', 'positions', 'work', 'worked', 'working', 'employment', 'employers', 'work history', 'where has he worked'] },
  { id: 'projects', keywords: ['projects', 'project', 'portfolio', 'apps', 'showcase', 'builds', 'built', 'works', 'created', 'made', 'developed', 'code', 'source'] },
  { id: 'education', keywords: ['education', 'college', 'university', 'degree', 'cgpa', 'gpa', 'coursework', 'classes', 'amc', 'academics', 'study', 'studies', 'studying', 'school', 'semester'] },
  { id: 'skills', keywords: ['skill', 'skills', 'skillset', 'technolog', 'tech stack', 'stack', 'frontend', 'backend', 'language', 'python', 'react', 'node', 'database', 'tools', 'framework', 'stacks', 'proficient', 'programming'] },
  { id: 'personal', keywords: ['age', 'old', 'birthday', 'born'] },
  { id: 'botIntro', keywords: ['who are you', 'what are you', 'are you a bot', 'are you an ai', 'are you real', 'your name', 'who made you'] },
  { id: 'about', keywords: ['about', 'who is', 'who are', 'niranjan', 'intro', 'introduction', 'yourself', 'bio', 'summary'] },
  { id: 'thanks', keywords: ['thank', 'thanks', 'appreciate', 'grateful'] },
  { id: 'ack', keywords: ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'cool', 'great', 'nice', 'awesome', 'sounds good', 'alright'] },
  { id: 'help', keywords: ['help', 'option', 'menu', 'what can you', 'how do i', 'start over', 'reset'] },
  { id: 'negative', keywords: ['no', 'nope', 'nah', 'not really'] },
  { id: 'farewell', keywords: ['bye', 'goodbye', 'see you', 'good night', 'goodnight', 'see ya', 'later'] },
  { id: 'greeting', keywords: ['hello', 'hi', 'hey', 'yo', 'hola', 'namaste', 'good morning', 'good afternoon', 'good evening', 'whats up', 'howdy', 'hii', 'hiii', 'heyy', 'helloo', 'sup'] },
];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesKeyword = (input: string, keyword: string) => {
  if (keyword.includes(' ')) return input.includes(keyword);
  if (keyword.length <= 4) {
    return new RegExp(`\\b${escapeRegex(keyword)}\\b`).test(input);
  }
  return input.includes(keyword);
};

const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const curr: number[] = [i];
    for (let j = 1; j <= n; j++) {
      const substitution = prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, substitution);
    }
    prev = curr;
  }
  return prev[n];
};

const fuzzyThreshold = (len: number) => (len >= 5 ? 2 : 1);

const scorePattern = (textOnly: string, tokens: string[], keywords: string[]): number => {
  let score = 0;
  for (const kw of keywords) {
    if (kw.includes(' ')) {
      if (textOnly.includes(kw)) score += 4;
      continue;
    }
    if (matchesKeyword(textOnly, kw)) score += 2;
  }
  if (score > 0) return score;
  for (const kw of keywords) {
    if (kw.includes(' ') || kw.length < 4) continue;
    const max = fuzzyThreshold(kw.length);
    for (const token of tokens) {
      if (token.length < 4) continue;
      const d = levenshtein(kw, token);
      if (d > 0 && d <= max) {
        score += 1;
        break;
      }
    }
  }
  return score;
};

const getBotResponse = (rawInput: string): string => {
  const input = (rawInput || '').toLowerCase().trim();

  if (!input) return RESPONSES.empty;

  const textOnly = input.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!textOnly) return RESPONSES.empty;
  const tokens = textOnly.split(' ');

  let bestId = '';
  let bestScore = 0;
  let fuzzyId = '';
  let fuzzyKw = '';
  let fuzzyDistance = 0;

  for (const pattern of INTENT_PATTERNS) {
    const score = scorePattern(textOnly, tokens, pattern.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestId = pattern.id;
    }
    if (score === 0) {
      for (const kw of pattern.keywords) {
        if (kw.includes(' ') || kw.length < 4) continue;
        const max = fuzzyThreshold(kw.length);
        for (const token of tokens) {
          if (token.length < 4) continue;
          const d = levenshtein(kw, token);
          if (d > 0 && d <= max && (fuzzyDistance === 0 || d < fuzzyDistance)) {
            fuzzyDistance = d;
            fuzzyId = pattern.id;
            fuzzyKw = kw;
          }
        }
      }
    }
  }

  if (bestScore > 0 && RESPONSES[bestId]) return RESPONSES[bestId];
  if (fuzzyId && RESPONSES[fuzzyId]) {
    return `I may have misread that — I think you're asking about "${fuzzyKw}".\n\n` + RESPONSES[fuzzyId];
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
  // null = unknown until the first free-text question; false = use keyword answers only.
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll only the message list; scrollIntoView could also move the page behind the chat.
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
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
      response: 'Featured Projects:\n\n🪞 AIMirror - Behavioral digital twin engine that constructs, evolves, and explains a complete cognitive identity model from Instagram Reels and YouTube activity\n   🔗 Demo: https://aimirror-dashboard.onrender.com\n\n🏙️ Civitas - AI-driven smart-city twin with adaptive RL, PPO, and agent-based citizen modeling\n   🔗 Demo: https://civitas-frontend-jee0.onrender.com\n\n🛡️ BASTION - AI agent control plane that intercepts every tool call, enforces policy, and records immutable audit events with causal replay\n   🔗 Demo: https://bastion-frontend.onrender.com\n\n🚀 IntelliMine - AI-powered landmine detection (98.2% detection rate, 93.8% CV accuracy, <5% false positives) using Random Forest + PCA with A* safe path planning\n\n🌾 AgriMind - ML-driven crop recommendation platform across 30+ crop types with 93% accuracy\n\n🤖 Cortex - RAG-based AI assistant supporting attachment-based queries with real-time streaming responses\n\n📸 VisioNarrate - Image to story generator using ML and NLP\n\n👨‍🌾 KisaanMitra - Farmer support platform with financial guidance and crop insights\n\n💰 KrishiLakshya - PWA for farmers to track expenses, income, and profits with OCR bill scanning\n\n🎓 CampusConnect - College information portal with real-time updates\n\n📱 MyExpenseMate - Cross-platform mobile expense tracker app\n\n📝 QuickNotes - Offline-first notes PWA with IndexedDB storage\n\n🎮 GameHive - Gaming community platform frontend\n\nType a project name to see details and live demo links!'
    },
    { 
      id: 'experience', 
      text: 'What is his experience?', 
      response: 'Work Experience:\n\n🤖 AI Developer at Tribeca Softech (Jan 2026 – Present)\n• Architected production-grade AI backend services using FastAPI, PostgreSQL (Neon), and async processing\n• Designed distributed ingestion/vectorization pipelines using AWS S3, Redis, BullMQ, and pgvector\n• Built retrieval, evaluation, telemetry, and observability pipelines for enterprise RAG systems\n• Implemented GraphQL APIs, JWT auth, RBAC, structured logging, Docker, and health monitoring\n• Led architecture of multiple AI platform components for production readiness\n\n🔧 Software Development Engineer (Contract) at AeroAspire (Oct 2025 – Present)\n• Own development of AeroBriefs, production aviation weather briefing platform\n• Architected real-time Flutter + Firebase + Firestore systems\n\n💻 Software Development Engineer Intern at AeroAspire (Sep 2025 – Oct 2025)\n• Built full-stack modules spanning React, Flask, Docker, and SQLite\n\n🚀 Software Development Engineer (Consultant) at Tribeca Softech (Jan 2026 – Feb 2026)\n• Developed enterprise IT risk governance components\n• Built LinkedIn trusted-network intelligence extension'
    },
    { 
      id: 'skills', 
      text: 'What are his technical skills?', 
      response: 'Technical Skills:\n\n💻 Frontend: React.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, Vite\n\n🔧 Backend: FastAPI, Node.js, Flask, Express, GraphQL, REST APIs\n\n🗄️ Database: PostgreSQL, MongoDB, Redis, Firestore, Pinecone, MySQL, pgvector\n\n🤖 AI/ML: LLMs, RAG Systems, Agentic AI, Vector Databases, Embeddings, Semantic Search, Reinforcement Learning, OpenAI, Anthropic Claude, Ollama\n\n📱 Mobile: Flutter, React Native, PWA\n\n☁️ Cloud & DevOps: AWS, GCP, Docker, Linux, BullMQ, Neon\n\n🔧 Tools: Git, GitHub, Postman, Swagger, Playwright, Chrome Extension MV3'
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

  /**
   * Stream an answer from Claude (/api/chat). Resolves false when the assistant API is unavailable
   * (not deployed, no key, rate-limited, network error) so the caller can use the keyword answers.
   */
  const askClaude = async (history: Message[]): Promise<boolean> => {
    if (aiAvailable === false) return false;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: history.filter((m) => m.id !== '1').map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      });
      if (!res.ok || !res.body || res.headers.get('x-assistant') !== 'claude') {
        if (res.status === 404 || res.status === 405 || res.status === 503) setAiAvailable(false);
        return false;
      }
      setAiAvailable(true);
      const id = `ai-${Date.now()}`;
      setIsTyping(false);
      setMessages((prev) => [...prev, { id, text: '', sender: 'bot', timestamp: new Date(), ai: true }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      for (let r = await reader.read(); !r.done; r = await reader.read()) {
        text += decoder.decode(r.value, { stream: true });
        const current = text;
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: current } : m)));
      }
      if (!text.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInputValue('');
    setIsTyping(true);

    if (await askClaude(history)) {
      setIsTyping(false);
      return;
    }

    // Fallback: built-in keyword answers.
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(trimmed),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const toggleChat = () => {
    setIsOpen((o) => !o);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <div className="chatbot-root fixed bottom-4 right-4 z-[65] md:bottom-6 md:right-6">
      {/* Launcher */}
      <motion.button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant'}
        aria-expanded={isOpen}
        data-cursor={isOpen ? undefined : 'Ask'}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-lime text-black shadow-[0_10px_40px_rgba(212,255,36,0.35)]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {!isOpen && <span className="absolute inset-0 animate-ping rounded-full bg-lime/40 [animation-duration:2.4s]" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'x' : 'chat'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
        {!isOpen && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-white/15 bg-[#070a12]/90 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 md:block">
            Ask about Niranjan
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="absolute bottom-[4.5rem] right-0 flex h-[min(620px,calc(100svh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070a12]/95 shadow-[0_40px_120px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime font-display text-sm text-black">
                NC
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#070a12] bg-emerald-500" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base text-white">Ask about Niranjan</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{aiAvailable ? 'AI · grounded in this site' : 'Instant answers'}</p>
              </div>
              <button
                onClick={toggleChat}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5" data-lenis-prevent aria-live="polite">
              {messages.map((message) => {
                const mine = message.sender === 'user';
                const deeps = mine
                  ? []
                  : message.ai
                    ? DEEP_LINKS.filter(([, , name]) => new RegExp(`\\b${name}\\b`, 'i').test(message.text)).slice(0, 2)
                    : DEEP_LINKS.filter(([re]) => re.test(message.text)).slice(0, 1);
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        mine ? 'rounded-tr-md bg-lime text-black' : 'rounded-tl-md border border-white/10 bg-white/[0.04] text-white/85'
                      }`}
                    >
                      <p className="whitespace-pre-line break-words text-sm leading-relaxed">{renderRich(message.text, mine)}</p>
                      {deeps.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {deeps.map((deep) => (
                            <button
                              key={deep[1]}
                              onClick={() => {
                                setIsOpen(false);
                                openCase(deep[1]);
                              }}
                              className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-xs font-medium text-black transition-transform hover:translate-x-0.5"
                            >
                              Open the {deep[2]} deep dive <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          ))}
                        </div>
                      )}
                      <div className={`mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] ${mine ? 'text-black/50' : 'text-white/30'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.ai && <span className="ml-2 text-lime/80">✦ Claude</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3.5" aria-label="Assistant is typing">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-lime"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="border-t border-white/10 py-3">
              <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" data-lenis-prevent>
                {presetOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    disabled={isTyping}
                    className="shrink-0 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/75 transition-colors hover:border-lime hover:text-lime disabled:opacity-40"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              className="border-t border-white/10 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-lime/50">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about projects, skills, availability…"
                  aria-label="Message"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!inputValue.trim() || isTyping}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime text-black transition-opacity disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
