export const PROFILE = {
  name: "Niranjan C N",
  first: "NIRANJAN",
  last: "C N",
  email: "cnniranjan72@gmail.com",
  github: "https://github.com/cnniranjan72",
  linkedin: "https://www.linkedin.com/in/niranjan-c-n",
  resume:
    "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/cnniranjan72/niranjan_portfolio/main/public/resume/NiranjanCN-Resume.pdf&embedded=true",
  resumePdf: "/resume/NiranjanCN-Resume.pdf",
  location: "Bangalore, India",
  timezone: "Asia/Kolkata",
  roles: ["AI Engineer", "Full-Stack Developer", "RAG Systems Architect", "RL Researcher"],
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "portfolio", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const STATS = [
  { value: 4, suffix: "", label: "Engineering roles" },
  { value: 12, suffix: "+", label: "Projects shipped" },
  { value: 98.2, suffix: "%", label: "Mine detection rate", decimals: 1 },
  { value: 8.5, suffix: "", label: "CGPA", decimals: 1 },
];

export const FOCUS = [
  { title: "Full-Stack Engineering", text: "Production web, mobile and platform experiences — React, Flutter, FastAPI." },
  { title: "RAG & Vector Systems", text: "Enterprise query engines, ingestion pipelines, pgvector and streaming answers." },
  { title: "Reinforcement Learning", text: "PPO multi-agent simulations and policy optimisation for digital twins." },
  { title: "System Design", text: "Scalable, observable infrastructure for aviation and enterprise teams." },
];

export const EXPERIENCE = [
  {
    role: "AI Developer",
    company: "Tribeca Softech",
    period: "Jan 2026 — Present",
    location: "Remote",
    current: true,
    highlights: [
      "Architected production-grade AI backend services with FastAPI, PostgreSQL (Neon) and async processing for enterprise knowledge systems.",
      "Designed distributed ingestion and vectorization pipelines using AWS S3, Redis, BullMQ and pgvector for semantic retrieval.",
      "Built retrieval, evaluation, telemetry and observability pipelines for enterprise RAG systems.",
      "Implemented GraphQL APIs, JWT auth, RBAC, structured logging, Docker deployment and workflow orchestration.",
    ],
    stack: ["FastAPI", "pgvector", "Redis", "BullMQ", "AWS S3", "GraphQL"],
  },
  {
    role: "Software Development Engineer (Contract)",
    company: "AeroAspire",
    period: "Oct 2025 — Present",
    location: "Hybrid",
    current: true,
    highlights: [
      "Own development of AeroBriefs, a production aviation weather briefing platform centralizing pilot and ATC workflows.",
      "Architected real-time Flutter + Firebase + Firestore systems with aviation-grade reliability and scalability.",
    ],
    stack: ["Flutter", "Firebase", "Firestore"],
  },
  {
    role: "Software Development Engineer (Consultant)",
    company: "Tribeca Softech",
    period: "Jan 2026 — Feb 2026",
    location: "Remote",
    highlights: [
      "Developed enterprise IT risk governance components powered by React, RAG pipelines, FastAPI and DataGol.",
      "Engineered a LinkedIn trusted-network intelligence extension using DOM extraction, FastAPI, PostgreSQL (Neon) and JWT.",
    ],
    stack: ["React", "RAG", "FastAPI", "Chrome MV3"],
  },
  {
    role: "Software Development Engineer Intern",
    company: "AeroAspire",
    period: "Sep 2025 — Oct 2025",
    location: "Hybrid",
    highlights: [
      "Built and integrated full-stack modules spanning React, Flask, Docker and SQLite for production feature releases.",
      "Contributed to automated testing pipelines and deployment-ready container workflows.",
    ],
    stack: ["React", "Flask", "Docker", "SQLite"],
  },
];

export const SKILL_GROUPS = [
  { title: "Languages", skills: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C", "Dart", "HTML", "CSS"] },
  { title: "Frameworks", skills: ["React", "FastAPI", "Flask", "Node.js", "Express", "Flutter", "Three.js", "R3F", "Framer Motion", "Vite"] },
  { title: "AI / ML", skills: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenAI", "Claude", "Ollama", "Hugging Face", "RL", "W&B"] },
  { title: "Data", skills: ["PostgreSQL", "pgvector", "Redis", "MongoDB", "MySQL", "Firestore", "Pinecone", "Supabase", "Neon"] },
  { title: "Cloud & DevOps", skills: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "CI/CD", "Nginx", "Vercel", "Render"] },
  { title: "Tooling", skills: ["Git", "Linux", "Postman", "Playwright", "pytest", "Swagger", "GraphQL", "WebSocket"] },
];

export const SPHERE_SKILLS = [
  "React", "FastAPI", "Python", "TypeScript", "PyTorch", "pgvector", "Redis", "Docker",
  "Flutter", "Three.js", "PostgreSQL", "AWS", "Kubernetes", "OpenAI", "Claude", "RAG",
  "GraphQL", "Node.js", "MongoDB", "Firebase", "TensorFlow", "Kafka", "Linux", "Git",
  "PPO", "LLMs", "Flask", "Pinecone", "Vite", "R3F", "JWT", "CI/CD",
];

export type Project = {
  title: string;
  tagline: string;
  description: string;
  category: string[];
  tags: string[];
  demo?: string;
  code?: string;
  metric?: string;
  /** Screenshot of the live product, served from /public/projects. */
  shot?: string;
  /** Short demo video, previewed on hover and shown in the deep dive. */
  video?: string;
  accent: "cobalt" | "lime";
};

export const PROJECT_FILTERS = ["Featured", "All", "AI/ML", "Web", "Mobile", "PWA"];

export const PROJECTS: Project[] = [
  {
    title: "BASTION",
    shot: "/projects/bastion.jpg",
    video: "/videos/bastion-demo.mp4",
    tagline: "AI Agent Control Plane",
    description:
      "Intercepts every AI agent tool call, checks it against policy, blocks or escalates, and records immutable audit events — real-time prevention with full causal replay. Live in production.",
    category: ["Featured", "AI/ML"],
    tags: ["FastAPI", "React", "Kafka", "Redis", "OpenTelemetry", "R3F", "RBAC"],
    demo: "https://bastion-frontend.onrender.com",
    code: "https://github.com/cnniranjan72/BASTION",
    metric: "20/20 injections blocked",
    accent: "lime",
  },
  {
    title: "AIMirror",
    shot: "/projects/aimirror.jpg",
    video: "/videos/aimirror-demo.mp4",
    tagline: "Behavioral Digital Twin Engine",
    description:
      "Cognitive digital twin engine that constructs, evolves and explains a complete behavioral identity model from Instagram Reels and YouTube activity.",
    category: ["Featured", "AI/ML"],
    tags: ["FastAPI", "React", "pgvector", "Chrome Extension", "RAG", "RL", "LLM"],
    demo: "https://aimirror-dashboard.onrender.com",
    code: "https://github.com/cnniranjan72/AI-Mirror",
    metric: "Digital twin",
    accent: "cobalt",
  },
  {
    title: "CIVITAS",
    shot: "/projects/civitas.jpg",
    tagline: "AI Smart City Digital Twin",
    description:
      "Smart-city twin with adaptive RL, PPO multi-agent policies and agent-based citizen modeling that optimizes policy trade-offs.",
    category: ["Featured", "AI/ML"],
    tags: ["PPO Multi-Agent", "FastAPI", "Simulation", "LLM", "ABM"],
    demo: "https://civitas-frontend-jee0.onrender.com",
    code: "https://github.com/cnniranjan72/civitas",
    metric: "Multi-agent RL",
    accent: "lime",
  },
  {
    title: "IntelliMine",
    shot: "/projects/intellimine.jpg",
    tagline: "Autonomous Landmine Detection",
    description: "Random Forest + PCA pipelines with severity scoring and A* safe-path planning.",
    category: ["Featured", "AI/ML"],
    tags: ["Random Forest", "PCA", "React", "Flask", "FastAPI", "MongoDB"],
    demo: "https://intellimine.vercel.app",
    code: "https://github.com/cnniranjan72/Autonomous-Landmine-detector",
    metric: "98.2% detection rate",
    accent: "cobalt",
  },
  {
    title: "Cortex",
    tagline: "RAG-Based AI Assistant",
    description: "RAG assistant supporting attachment-based queries with real-time streaming responses.",
    category: ["AI/ML"],
    tags: ["React", "FastAPI", "OpenAI", "Function Calling", "Pinecone", "Streaming"],
    accent: "lime",
  },
  {
    title: "AgriMind",
    shot: "/projects/agrimind.jpg",
    tagline: "AI Crop & Yield Platform",
    description: "ML-driven crop recommendation and yield prediction across 30+ crop types at 93% accuracy.",
    category: ["AI/ML", "Web"],
    tags: ["React", "Flask", "PostgreSQL", "ML Pipelines"],
    demo: "https://agrimind-frontend.vercel.app/",
    code: "https://github.com/cnniranjan72/AgriMind",
    metric: "93% accuracy",
    accent: "cobalt",
  },
  {
    title: "VisioNarrate",
    tagline: "Image to Story Generator",
    description: "Generates human-like stories from images using ML and NLP storytelling models.",
    category: ["AI/ML"],
    tags: ["Python", "Flask", "React", "MongoDB"],
    code: "https://github.com/cnniranjan72/VisioNarrate",
    accent: "lime",
  },
  {
    title: "KisaanMitra",
    tagline: "Farmer Support Platform",
    description: "Financial guidance, crop insights and community support features for farmers.",
    category: ["Web"],
    tags: ["TypeScript", "Node.js", "Express", "MongoDB"],
    code: "https://github.com/cnniranjan72/Kisaanmitra-",
    accent: "cobalt",
  },
  {
    title: "KrishiLakshya",
    tagline: "Financial Tracker for Farmers",
    description: "PWA to track agricultural expenses, income and profit — with OCR bill scanning and interactive charts.",
    category: ["Web", "PWA"],
    tags: ["React", "Firebase", "Recharts", "PWA"],
    code: "https://github.com/cnniranjan72/KrishiLakshya",
    accent: "lime",
  },
  {
    title: "CampusConnect",
    tagline: "College Information Portal",
    description: "Notices, timetables and events for students, with a real-time faculty dashboard.",
    category: ["Web"],
    tags: ["React", "Firebase Auth", "Firestore"],
    code: "https://github.com/cnniranjan72/campus-connect",
    accent: "cobalt",
  },
  {
    title: "MyExpenseMate",
    tagline: "Personal Expense Tracker",
    description: "Cross-platform mobile app to log, categorize and visualize spending.",
    category: ["Mobile"],
    tags: ["Flutter", "Firebase"],
    code: "https://github.com/cnniranjan72/Expense-Tracker",
    accent: "lime",
  },
  {
    title: "QuickNotes",
    tagline: "Minimalist Notes PWA",
    description: "Offline-first notes app with IndexedDB storage and dark mode.",
    category: ["PWA"],
    tags: ["React", "Service Workers", "IndexedDB"],
    accent: "cobalt",
  },
  {
    title: "GameHive",
    tagline: "Gaming Community Platform",
    description: "Gaming hub frontend where players share updates, join discussions and explore trending games.",
    category: ["Web"],
    tags: ["React", "TailwindCSS"],
    code: "https://github.com/cnniranjan72/GameHive-Frontend-Project",
    accent: "lime",
  },
];

export const EDUCATION = {
  degree: "B.E. Computer Science & Engineering",
  institution: "AMC Engineering College, Bangalore",
  period: "2023 — 2027",
  cgpa: "8.5",
  coursework: [
    "Data Structures", "Operating Systems", "DBMS", "Theory of Computation",
    "Algorithms", "Computer Networks", "Artificial Intelligence", "Machine Learning",
    "Cloud Computing", "Compiler Design", "Software Engineering",
  ],
};

export const CREDENTIALS = [
  { issuer: "Anthropic", title: "Claude Code in Action", tone: "lime" as const },
  { issuer: "Anthropic", title: "AI Fluency", tone: "cobalt" as const },
  { issuer: "AWS", title: "Cloud Practitioner Essentials", tone: "lime" as const },
  { issuer: "MongoDB", title: "MongoDB for Students", tone: "cobalt" as const },
  { issuer: "Bootcamp", title: "The Complete Full-Stack Web Development Bootcamp", tone: "lime" as const },
];

export const LANGUAGES = ["English", "Kannada", "Hindi", "Telugu"];
