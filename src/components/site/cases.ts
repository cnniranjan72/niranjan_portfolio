// Case-study content. Every fact here comes from the resume / project descriptions —
// edit freely, but keep claims verifiable.

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  accent: "cobalt" | "lime";
  summary: string;
  metrics: { value: string; label: string }[];
  pipelineTitle: string;
  pipeline: { label: string; detail: string }[];
  sections: { heading: string; points: string[] }[];
  stack: string[];
  demo?: string;
  code?: string;
};

export const CASES: CaseStudy[] = [
  {
    slug: "bastion",
    title: "BASTION",
    tagline: "AI Agent Governance & Runtime Control Plane",
    accent: "lime",
    summary:
      "A control plane that sits between AI agents and the outside world. Every tool call an agent attempts — an HTTP request, a database mutation, a payment — is intercepted, checked against policy, then allowed, blocked or escalated to a human, and recorded as an immutable event. A blocked call never reaches the real API.",
    metrics: [
      { value: "332/332", label: "Tests vs live infra, no mocks" },
      { value: "20/20", label: "Prompt-injection attempts blocked" },
      { value: "4", label: "RBAC roles" },
      { value: "Live", label: "Running in production" },
    ],
    pipelineTitle: "Request path",
    pipeline: [
      { label: "Agent tool call", detail: "HTTP request, DB mutation or payment" },
      { label: "/intercept", detail: "Hot path, policy checked before execute()" },
      { label: "Policy engine", detail: "Versioned policies, hot reload via Redis pub/sub" },
      { label: "Allow · Block · Escalate", detail: "Human approval for escalations" },
      { label: "Event store", detail: "Append-only Postgres + transactional outbox" },
      { label: "Kafka → WebSocket", detail: "Idempotent, at-least-once fan-out" },
      { label: "3D execution graph", detail: "React Three Fiber, full causal replay" },
    ],
    sections: [
      {
        heading: "Prevention, not logging",
        points: [
          "Evaluates every agent tool call pre-execution — blocking, allowing or escalating to human approval in real time.",
          "Governs a real transacting agent (Razorpay integration) with policy-enforced spend limits and rate-based anomaly blocking.",
          "100% prevention across 20/20 live prompt-injection attempts.",
        ],
      },
      {
        heading: "Event-sourced core",
        points: [
          "Transactional outbox and Kafka-based distribution for durable, idempotent, at-least-once event delivery.",
          "Live 3D execution-graph frontend fed over WebSockets, with full causal replay of what an agent actually did.",
          "Policy hot-reload across running instances via Redis pub/sub; RBAC across owner, admin, approver and viewer.",
        ],
      },
      {
        heading: "Performance work",
        points: [
          "Profiled production bottlenecks with py-spy and resolved them — OpenTelemetry export batching and DB connection-pool sizing.",
          "Validated by 332/332 tests against live infrastructure, with real load-test targets on the /intercept hot path.",
        ],
      },
    ],
    stack: ["FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "OpenTelemetry", "React", "React Three Fiber", "WebSockets"],
    demo: "https://bastion-frontend.onrender.com",
    code: "https://github.com/cnniranjan72/BASTION",
  },
  {
    slug: "aimirror",
    title: "AIMirror",
    tagline: "Behavioral AI Digital Twin Platform",
    accent: "cobalt",
    summary:
      "A behavioral digital twin that transforms Instagram Reels and YouTube activity into an explainable cognitive identity model. The pipeline is deterministic — LLMs only verbalize, they never reason or decide — so every inference traces back to its source evidence.",
    metrics: [
      { value: "9", label: "Identity sub-profiles" },
      { value: "5-D", label: "Evidence scoring" },
      { value: "384-D", label: "Vector retrieval" },
      { value: "3", label: "LLM providers" },
    ],
    pipelineTitle: "Cognitive pipeline",
    pipeline: [
      { label: "Behavioral ingestion", detail: "Chrome Extension (MV3) on Reels & YouTube" },
      { label: "Knowledge consolidation", detail: "Normalised activity into evidence" },
      { label: "Evidence scoring", detail: "5-dimensional scoring" },
      { label: "Rule-based inference", detail: "Deterministic, fully explainable" },
      { label: "9-profile identity", detail: "Behavior, interests, attention, habits…" },
      { label: "Temporal snapshots", detail: "Identity that evolves over time" },
      { label: "Contextual bandit", detail: "Online RL for wellbeing interventions" },
    ],
    sections: [
      {
        heading: "Identity model",
        points: [
          "Nine sub-profiles: behavior, interest graph, creator graph, learning style, attention, exploration, consistency, habit and motivation.",
          "Temporal snapshots let the twin evolve rather than overwrite itself.",
        ],
      },
      {
        heading: "Explainability first",
        points: [
          "Every inference traces back to its source evidence.",
          "Multi-provider LLM verbalization (OpenAI, Anthropic, Ollama) — language models describe conclusions, they never make them.",
        ],
      },
      {
        heading: "Personalisation",
        points: [
          "An online reinforcement-learning layer (contextual bandit) selects personalised wellbeing interventions.",
          "384-dimensional vector retrieval over pgvector.",
        ],
      },
    ],
    stack: ["Chrome Extension MV3", "FastAPI", "React", "PostgreSQL", "pgvector", "Docker", "OpenAI", "Anthropic", "Ollama"],
    demo: "https://aimirror-dashboard.onrender.com",
    code: "https://github.com/cnniranjan72/AI-Mirror",
  },
  {
    slug: "civitas",
    title: "CIVITAS",
    tagline: "AI Smart City Digital Twin",
    accent: "lime",
    summary:
      "An AI-driven smart-city digital twin. Agent-based citizen models live inside a real-time urban simulation, while PPO multi-agent reinforcement learning searches for policies that balance competing trade-offs — and an LLM layer explains the decisions.",
    metrics: [
      { value: "PPO", label: "Multi-agent RL" },
      { value: "ABM", label: "Agent-based citizens" },
      { value: "LLM", label: "Decision explainability" },
      { value: "Live", label: "Deployed demo" },
    ],
    pipelineTitle: "Simulation loop",
    pipeline: [
      { label: "Urban simulation", detail: "Real-time city state" },
      { label: "Citizen agents", detail: "Agent-based modeling" },
      { label: "PPO policies", detail: "Multi-agent reinforcement learning" },
      { label: "Trade-off optimisation", detail: "Adaptive policy search" },
      { label: "LLM explanation", detail: "Why a policy was chosen" },
    ],
    sections: [
      {
        heading: "What it does",
        points: [
          "PPO multi-agent reinforcement learning for policy optimisation.",
          "Real-time urban simulations with agent-based citizen modeling.",
          "LLM-powered decision explainability.",
        ],
      },
    ],
    stack: ["Python", "FastAPI", "Reinforcement Learning", "PPO", "Agent-Based Modeling", "LLM", "React"],
    demo: "https://civitas-frontend-jee0.onrender.com",
    code: "https://github.com/cnniranjan72/civitas",
  },
  {
    slug: "intellimine",
    title: "IntelliMine",
    tagline: "Autonomous Landmine Detection",
    accent: "cobalt",
    summary:
      "An ML pipeline for landmine detection: dimensionality reduction with PCA feeds a Random Forest classifier, detections receive severity scores, and A* search plans a safe path through the field.",
    metrics: [
      { value: "98.2%", label: "Detection rate" },
      { value: "93.8%", label: "CV accuracy" },
      { value: "<5%", label: "False positives" },
      { value: "A*", label: "Safe path planning" },
    ],
    pipelineTitle: "Detection pipeline",
    pipeline: [
      { label: "Field readings", detail: "Input features" },
      { label: "PCA", detail: "Dimensionality reduction" },
      { label: "Random Forest", detail: "Mine classification" },
      { label: "Severity scoring", detail: "Risk per detection" },
      { label: "A* planner", detail: "Safe route through the field" },
    ],
    sections: [
      {
        heading: "What it does",
        points: [
          "Random Forest + PCA detection with a 98.2% detection rate, 93.8% cross-validated accuracy and under 5% false positives.",
          "A* safe-path planning around detected threats.",
          "React frontend with Flask / FastAPI services, MongoDB and JWT auth.",
        ],
      },
    ],
    stack: ["Random Forest", "PCA", "Python", "React", "Flask", "FastAPI", "MongoDB", "JWT"],
    demo: "https://intellimine.vercel.app",
    code: "https://github.com/cnniranjan72/Autonomous-Landmine-detector",
  },
];

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
export const caseForTitle = (title: string) => CASES.find((c) => c.title === title);
