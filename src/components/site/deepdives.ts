// Long-form project pages, distilled from each repository's README.
// Every number and claim below comes from the README of the linked repo.

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  x: number; // 0-100, percent of diagram width
  y: number; // 0-100, percent of diagram height
  tone?: "lime" | "cobalt" | "store" | "muted";
  detail: string;
};

export type Block =
  | { type: "intro"; id: string; kicker: string; heading: string; body: string[]; bullets?: string[] }
  | { type: "stats"; id: string; kicker: string; heading: string; items: { value: string; label: string; note?: string }[] }
  | {
      type: "diagram";
      id: string;
      kicker: string;
      heading: string;
      caption: string;
      height: number;
      nodes: DiagramNode[];
      edges: { from: string; to: string; label?: string; dashed?: boolean }[];
    }
  | {
      type: "stepper";
      id: string;
      kicker: string;
      heading: string;
      intro?: string;
      steps: { label: string; title: string; body: string; io?: { input: string; output: string } }[];
    }
  | { type: "simulator"; id: string; kicker: string; heading: string; intro: string }
  | {
      type: "bars";
      id: string;
      kicker: string;
      heading: string;
      intro?: string;
      unit: string;
      max: number;
      scale?: "absolute" | "budget";
      target?: { value: number; label: string };
      rows: { label: string; value: number; display: string; secondary?: { value: number; display: string } }[];
      legend?: [string, string];
      note: string;
    }
  | { type: "table"; id: string; kicker: string; heading: string; intro?: string; columns: string[]; rows: string[][] }
  | { type: "grid"; id: string; kicker: string; heading: string; intro?: string; columns?: 2 | 3 | 4; items: { title: string; body: string; tag?: string }[] }
  | { type: "chips"; id: string; kicker: string; heading: string; intro?: string; groups: { label: string; items: string[] }[] }
  | { type: "honest"; id: string; kicker: string; heading: string; intro: string; items: { title: string; body: string }[] }
  | { type: "severity"; id: string; kicker: string; heading: string; intro: string; types: { label: string; weight: number }[] }
  | { type: "pathfinder"; id: string; kicker: string; heading: string; intro: string }
  | {
      type: "video";
      id: string;
      kicker: string;
      heading: string;
      intro: string;
      src: string;
      poster: string;
      chapters: { t: number; label: string }[];
    };

export type DeepDive = { slug: string; readme: string; blocks: Block[] };

/* =========================================================
   BASTION
   ========================================================= */

const bastion: DeepDive = {
  slug: "bastion",
  readme: "https://github.com/cnniranjan72/BASTION#readme",
  blocks: [
    {
      type: "intro",
      id: "problem",
      kicker: "The problem",
      heading: "Agents can act. Nothing stops them before they do.",
      body: [
        "Agents moved from demo to production in the last 12–18 months. The tooling for building them matured fast — the tooling for governing them didn't. Observability tools log what an agent did after it happened; nobody stops a prompt-injected or hallucinating agent from calling DELETE /users or moving money before it executes.",
        "There's no equivalent of IAM for agent actions — \"this agent may call payment APIs up to $50 without approval, above that needs a human\" doesn't exist as infrastructure. Teams hand-roll guardrails inside prompts, which fail exactly when it matters: under adversarial input.",
      ],
      bullets: [
        "A real policy gate in front of the call itself — allow, block, or route to a human.",
        "Decided in milliseconds, before anything real happens.",
        "Every attempt recorded as an immutable event, with full causal replay.",
      ],
    },
    {
      type: "video",
      id: "pitch",
      kicker: "Watch",
      heading: "The 41-second pitch",
      intro: "A prompt-injected $500 transfer that never executes — then the gate, the policy builder, the live call graph, the audit trail and an AI buyer transacting inside its limits.",
      src: "/videos/bastion-demo.mp4",
      poster: "/videos/bastion-poster.jpg",
      chapters: [
        { t: 0, label: "The call never executed" },
        { t: 4, label: "AI agents can spend money now" },
        { t: 8, label: "Stop the call, not the agent" },
        { t: 12, label: "A gate, not a log" },
        { t: 16, label: "Guardrails written as policy" },
        { t: 22, label: "Watch every call get decided" },
        { t: 27, label: "Every decision on the record" },
        { t: 32, label: "An AI buyer inside its limits" },
        { t: 36, label: "332 tests · <50ms · 0 dangerous calls" },
      ],
    },
    {
      type: "stats",
      id: "evidence",
      kicker: "Evidence, not adjectives",
      heading: "Reproducible numbers",
      items: [
        { value: "332/332", label: "Tests passing", note: "266 backend + 66 frontend, against real Postgres / Redis / Kafka — no mocks" },
        { value: "20/20", label: "Injected transfers blocked", note: "Prompt-injection attack re-run on demand" },
        { value: "45.4ms", label: "p99 /intercept (v1)", note: "50 req/s constant arrival, single unscaled instance" },
        { value: "15", label: "Product pages", note: "Each backed by real endpoints, plus a ⌘K palette" },
        { value: "4", label: "RBAC roles", note: "Owner · Admin · Approver · Viewer, enforced server-side" },
        { value: "Live", label: "In production", note: "Interceptor, aggregator and catalog on Render" },
      ],
    },
    {
      type: "simulator",
      id: "simulator",
      kicker: "Try it",
      heading: "Policy decision simulator",
      intro:
        "Replays the repository's documented demo policy in your browser: transfers over $100 are blocked, purchases above ₹18,000 need a human, and razorpay.purchase is rate-limited to 3 calls a minute. Pick a call and watch it walk the hot path.",
    },
    {
      type: "diagram",
      id: "architecture",
      kicker: "Architecture",
      heading: "The live path, end to end",
      caption:
        "Postgres stays the source of truth; Kafka is distribution only. Event write and outbox row commit in one transaction, and an outbox row is marked published only after the producer acks — at-least-once delivery, made effectively exactly-once by an idempotent fold.",
      height: 440,
      nodes: [
        { id: "agent", label: "Agent", sub: "LLM / reference agent", x: 7, y: 20, tone: "muted", detail: "Any agent — the reference demo-agent, or a real LLM via BYOK keys (OpenAI / Anthropic / Gemini / local Ollama)." },
        { id: "sdk", label: "BASTION SDK", sub: "BastionClient.call()", x: 7, y: 62, tone: "cobalt", detail: "Every tool call routes through call(). The SDK only runs the real execute() after an `allowed` response — that is the mechanism that stops blocked calls." },
        { id: "int", label: "Interceptor", sub: "FastAPI · POST /intercept", x: 33, y: 41, tone: "lime", detail: "The latency-critical hot path. Policy decisions come from an in-memory PolicyCache with no DB round-trip; limits and circuit-breaker checks fail open." },
        { id: "pg", label: "Postgres", sub: "events + outbox_events", x: 33, y: 86, tone: "store", detail: "Append-only event store enforced by a DB trigger, monthly partitions, 90-day hot retention, row-level security. Current state is always a fold over events." },
        { id: "redis1", label: "Redis", sub: "policy hot-reload", x: 33, y: 8, tone: "store", detail: "Pub/sub fast path for policy hot reload plus limits counters and circuit-breaker state; a ~30s reconciler heals any missed message." },
        { id: "op", label: "Outbox publisher", sub: "separate process", x: 56, y: 86, tone: "cobalt", detail: "Polls unpublished outbox rows every 0.2s in batches of 100, publishes keyed by trace_id, marks published only after the producer confirms." },
        { id: "kafka", label: "Kafka", sub: "tool-events · by trace_id", x: 56, y: 41, tone: "store", detail: "Partitioned by trace_id so one causal execution is strictly ordered. Distribution only — never the source of truth." },
        { id: "agg", label: "Aggregator", sub: "fold_events_to_graph", x: 78, y: 41, tone: "lime", detail: "Consumes tool-events, folds them into a causal graph with one shared idempotent function used by live, replay and projection paths." },
        { id: "redis2", label: "Redis bus", sub: "WS fan-out", x: 78, y: 86, tone: "store", detail: "Live messages fan out to any gateway instance's WebSocket clients." },
        { id: "fe", label: "3D graph", sub: "React Three Fiber", x: 94, y: 14, tone: "cobalt", detail: "Force-directed 3D execution graph, live or replayed, with a 2D inspector for payloads, timing and policy reasoning. WS /live/{agent_id}, reconnect with backoff." },
      ],
      edges: [
        { from: "agent", to: "sdk", label: "call()" },
        { from: "sdk", to: "int", label: "/intercept" },
        { from: "redis1", to: "int", label: "reload", dashed: true },
        { from: "int", to: "pg", label: "one txn" },
        { from: "pg", to: "op" },
        { from: "op", to: "kafka", label: "after ack" },
        { from: "kafka", to: "agg" },
        { from: "agg", to: "redis2" },
        { from: "redis2", to: "fe", label: "WebSocket" },
        { from: "agg", to: "fe", dashed: true, label: "GET /traces" },
      ],
    },
    {
      type: "stepper",
      id: "hot-path",
      kicker: "Deep dive",
      heading: "What /intercept actually does",
      intro: "The policy decision is the only in-process decision step. Every Redis-dependent check and object-storage offload fails open, so non-essential work never blocks the decision.",
      steps: [
        { label: "Auth", title: "Bearer agent key", body: "Missing or invalid key → 401. The body's agent_id must match the authenticated agent, or the call is rejected with 403 AGENT_MISMATCH." },
        { label: "Idempotency", title: "Reserve the key", body: "A repeated idempotency_key returns the cached decision. First-timers reserve it with INSERT … ON CONFLICT DO NOTHING; a lost race waits for the winner (2s) or returns 503." },
        { label: "Record", title: "Append CallAttempted", body: "Written to events and outbox_events in one Postgres transaction. /intercept responds only after commit — durability over latency, deliberately." },
        { label: "Evaluate", title: "Policy from cache", body: "policy_engine.evaluate runs against the in-memory PolicyCache — no DB round-trip, wrapped in an OTel span. A policy set with nothing cached evaluates to allow (fail-open on cache miss)." },
        { label: "Limits", title: "Budgets, in fixed order", body: "max_transaction_amount → calls_per_minute → org_spend_per_day → agent_llm_budget_per_hour. A call rejected by one limit is never charged against a lower-priority budget." },
        { label: "Breaker", title: "Circuit breaker", body: "Per (agent, tool): opens after 5 consecutive failures observed via /spans/{id}/complete, and retries after 30s. An open breaker blocks the call." },
        { label: "Decide", title: "Allow · Block · Escalate", body: "CallAllowed returns a span_id; CallBlocked returns the policy and reason; require_approval writes CallPendingApproval and an approval request the SDK long-polls — a timeout fails closed." },
      ],
    },
    {
      type: "grid",
      id: "durability",
      kicker: "Guarantees",
      heading: "The durability contract",
      columns: 2,
      items: [
        { tag: "01", title: "One transaction", body: "The event write and its outbox row commit together; the API answers only after that commit." },
        { tag: "02", title: "Publish after ack", body: "Outbox rows are marked published only after Kafka confirms — a crash can redeliver, never lose." },
        { tag: "03", title: "Ordered per trace", body: "Partitioning by trace_id keeps each causal execution strictly ordered within its partition." },
        { tag: "04", title: "Idempotent fold", body: "Re-delivered events fold to the same graph, so at-least-once becomes effectively exactly-once." },
      ],
    },
    {
      type: "bars",
      id: "latency",
      kicker: "Measured",
      heading: "/intercept p99 under load (v1)",
      intro: "k6, 50 req/s constant arrival rate, single unscaled instance. Target: < 50ms p99.",
      unit: "ms",
      max: 70,
      target: { value: 50, label: "50ms SLO" },
      rows: [
        { label: "Run 1", value: 45.41, display: "45.41ms", secondary: { value: 20.55, display: "avg 20.55" } },
        { label: "Run 2", value: 46.94, display: "46.94ms", secondary: { value: 21.35, display: "avg 21.35" } },
        { label: "Run 3", value: 53.06, display: "53.06ms", secondary: { value: 22.43, display: "avg 22.43" } },
      ],
      legend: ["p99", "average"],
      note: "Two of three runs clear the target; the third misses by ~3ms. Every call synchronously writes an audit event before responding — a documented durability-over-latency trade-off.",
    },
    {
      type: "table",
      id: "rbac",
      kicker: "Access control",
      heading: "RBAC, enforced on every endpoint",
      intro: "Not just hidden buttons — every dashboard endpoint checks the role server-side.",
      columns: ["Action", "Owner", "Admin", "Approver", "Viewer"],
      rows: [
        ["View graph, traces, agents, policies, approvals, team", "✓", "✓", "✓", "✓"],
        ["Create / manage agents, create / activate policies", "✓", "✓", "—", "—"],
        ["Approve or deny a pending call", "✓", "✓", "✓", "—"],
        ["Provision teammates, change roles", "✓", "✓", "—", "—"],
        ["Demote the organization's last owner", "—", "—", "—", "—"],
      ],
    },
    {
      type: "grid",
      id: "product",
      kicker: "Product surface",
      heading: "Fifteen pages, all real",
      columns: 3,
      items: [
        { title: "Live Execution Graph", body: "Live or replayed 3D graph with a timeline strip and a 2D inspector, over WebSocket fan-out that resyncs after a drop." },
        { title: "Policy Studio", body: "WHEN / IF / THEN rule builder, a simulator that runs hypothetical calls through the real engine, and version diffs." },
        { title: "Incident Replay", body: "A TypeScript port of the backend fold re-folds the real event log at every scrub step — no parallel replay storage." },
        { title: "Approval Center", body: "Escalated calls framed as an incident queue, with the real prior calls in that trace for context." },
        { title: "Trace Explorer", body: "Server-side search by agent, status, tool, policy and time range, one click into full replay." },
        { title: "Threat Center", body: "Blocked-call counts, top violated policies and a daily timeline from real aggregates." },
        { title: "Agent Health", body: "Composite 0–100 score from reliability, compliance, tool error rate and approval rate, with anomaly flags." },
        { title: "Cost Center", body: "Spend by agent and tool, plus an estimate of what enforcement stopped from being spent." },
        { title: "Command Center", body: "Live snapshot strip, activity feed, and a first-run checklist instead of a wall of zeroes." },
      ],
    },
    {
      type: "grid",
      id: "observability",
      kicker: "Observability",
      heading: "One trace, SDK to aggregator",
      columns: 4,
      items: [
        { title: "Jaeger", body: "W3C traceparent carried through the outbox into Kafka headers — one OTel trace spans SDK → interceptor → Kafka → aggregator." },
        { title: "Prometheus", body: "intercept_latency_seconds, policy_decisions_total, outbox backlog, pool saturation and RED metrics per route." },
        { title: "SLO alerts", body: "InterceptLatencyP99High, InterceptorAvailabilityLow, OutboxBacklogGrowing, DbPoolNearSaturation." },
        { title: "Grafana", body: "A provisioned bastion-overview dashboard on first boot." },
      ],
    },
    {
      type: "honest",
      id: "honest",
      kicker: "Stated honestly",
      heading: "What's not perfect — and why",
      intro: "The README discloses limitations in the same detail as what went right. So does this page.",
      items: [
        { title: "Production latency is cross-region", body: "Deployed /intercept costs 1.4s+ per request (p99 8.73s at 15 RPS) because free-tier compute, Postgres and Redis/Kafka sit in Oregon, Ohio and Mumbai. The fix is co-location, not code." },
        { title: "v2 regressed under load", body: "After v2 added OTel export, limits, breaker and RLS to the hot path, it no longer meets the p99 < 50ms SLO at sustained concurrency — reported in full rather than hidden behind v1's numbers." },
        { title: "Profiled, two causes fixed", body: "py-spy at 100Hz under load found OTel export batching overhead and asyncpg pool release/reset contention (~21% of samples). Both fixed at the CPU-profile level; a clean end-to-end number still needs a quiet machine." },
        { title: "Payment capture is simulated", body: "Razorpay payments can only originate through hosted Checkout, so capture is simulated; every receipt carries \"simulated\": true inline so the disclosure survives into traces." },
      ],
    },
    {
      type: "chips",
      id: "stack",
      kicker: "Built with",
      heading: "Stack",
      groups: [
        { label: "Services", items: ["Python", "FastAPI", "uv workspace", "Pydantic", "asyncpg"] },
        { label: "Data", items: ["PostgreSQL 16", "Redis 7", "Kafka (KRaft)", "MinIO"] },
        { label: "Frontend", items: ["React 19", "React Three Fiber", "d3-force-3d", "Vitest"] },
        { label: "Ops", items: ["Docker Compose", "Kubernetes (kind)", "k6", "OpenTelemetry", "Jaeger", "Prometheus", "Grafana", "Render"] },
      ],
    },
  ],
};

/* =========================================================
   AIMirror
   ========================================================= */

const aimirror: DeepDive = {
  slug: "aimirror",
  readme: "https://github.com/cnniranjan72/AI-Mirror#readme",
  blocks: [
    {
      type: "intro",
      id: "overview",
      kicker: "Overview",
      heading: "A digital twin of how you actually behave online.",
      body: [
        "AIMirror transforms raw Instagram Reels and YouTube activity into a structured, explainable cognitive identity model. It goes beyond analytics — building a multi-dimensional identity spanning interests, creators, attention patterns, learning styles and engagement habits, and evolving it over time through a deterministic cognitive pipeline.",
        "Language models are only allowed to verbalize. They never reason, infer or decide — so the same inputs always produce the same outputs, and every trait can be traced back to the events behind it.",
      ],
      bullets: [
        "Deterministic reasoning, not magic — explicit rules, no statistical black boxes.",
        "Explainability by construction — a traversable reasoning chain for every output.",
        "Privacy-first — your data, your model, with full export and deletion.",
        "Transparency over optimization — built to help you understand behavior, not to maximize engagement.",
      ],
    },
    {
      type: "video",
      id: "pitch",
      kicker: "Watch",
      heading: "The 36-second pitch",
      intro: "Your feed already has a model of you. AIMirror shows you yours — with the evidence behind every claim, and honesty about what it doesn't know.",
      src: "/videos/aimirror-demo.mp4",
      poster: "/videos/aimirror-poster.jpg",
      chapters: [
        { t: 0, label: "Your feed has a model of you" },
        { t: 3, label: "AIMirror, your cognitive twin" },
        { t: 6, label: "What the platforms say about you" },
        { t: 10, label: "Searched 3 times, served 144" },
        { t: 14, label: "Confident and unaccountable" },
        { t: 17, label: "Evidence that argues the other way" },
        { t: 21, label: "Where the model is thin" },
        { t: 24, label: "What you quietly stopped doing" },
        { t: 28, label: "No claims it hasn't earned" },
        { t: 32, label: "Answers that show their reasoning" },
        { t: 34, label: "Evidence, not guesses" },
      ],
    },
    {
      type: "stats",
      id: "scale",
      kicker: "By the numbers",
      heading: "System at a glance",
      items: [
        { value: "8", label: "Pipeline stages", note: "Gateway → … → self-model" },
        { value: "9", label: "Identity sub-profiles", note: "Behavior to motivation" },
        { value: "5", label: "Evidence dimensions", note: "Topical, creator, temporal, interaction, engagement" },
        { value: "23", label: "Database tables", note: "PostgreSQL 16 + pgvector" },
        { value: "30+", label: "API endpoints", note: "Ingest, query, identity, explainability, RL…" },
        { value: "25", label: "Dashboard pages", note: "Including a 3D character view" },
      ],
    },
    {
      type: "diagram",
      id: "architecture",
      kicker: "Architecture",
      heading: "From a scroll to a self-model",
      caption:
        "The extension buffers events (10 per batch / 30s) and posts them to the gateway; the cognitive pipeline writes behavior objects, evidence, inferences and identity into Postgres, which the query pipeline and the RL layer read back.",
      height: 440,
      nodes: [
        { id: "ig", label: "Instagram Reels", sub: "content.js", x: 7, y: 14, tone: "muted", detail: "Content script that extracts watch time, engagement and metadata from Reels." },
        { id: "yt", label: "YouTube", sub: "Watch + Shorts", x: 7, y: 44, tone: "muted", detail: "A second content script covering YouTube Watch and Shorts." },
        { id: "buf", label: "Extension worker", sub: "MV3 · 10 events / 30s", x: 7, y: 80, tone: "cobalt", detail: "Background worker buffers events and posts batches to /ingest, re-queueing failed sends. Ingestion is idempotent by (reel_id, session_id, timestamp)." },
        { id: "gw", label: "Behavior Gateway", sub: "POST /ingest", x: 31, y: 44, tone: "lime", detail: "Normalizes events from any source into one BehaviorEvent schema with dedup keys." },
        { id: "pipe", label: "Cognitive pipeline", sub: "8 deterministic stages", x: 53, y: 18, tone: "lime", detail: "Consolidation → evidence → inference → reflection → identity → snapshot → self-model. Every stage is rule-driven and traced." },
        { id: "pg", label: "PostgreSQL", sub: "pgvector · 384-dim", x: 53, y: 70, tone: "store", detail: "23 tables: events, embeddings, behavior objects, evidence, inferences, identities, snapshots, self-models, pipeline traces, RL policy…" },
        { id: "rl", label: "RL layer", sub: "contextual bandit", x: 31, y: 88, tone: "cobalt", detail: "ε-greedy Q-learning over 4 alignment dimensions picks a wellbeing intervention; the next ingest rewards it by the change in alignment." },
        { id: "query", label: "Query pipeline", sub: "plan → retrieve → decide", x: 76, y: 44, tone: "cobalt", detail: "Planner, retriever, memory ranker, fusion and decision engines build grounded context; an LLM verbalizes it, with a deterministic fallback." },
        { id: "llm", label: "LLM verbalizer", sub: "OpenAI · Claude · Ollama", x: 94, y: 14, tone: "muted", detail: "Provider-agnostic: formats pre-computed context into language. Never reasons, infers or decides." },
        { id: "dash", label: "Dashboard", sub: "React · R3F", x: 94, y: 76, tone: "cobalt", detail: "25 pages with an ExplainabilityPanel, IdentityInspector, EvidenceDrawer, DecisionTree and a 3D character." },
      ],
      edges: [
        { from: "ig", to: "buf" },
        { from: "yt", to: "buf" },
        { from: "buf", to: "gw", label: "/ingest" },
        { from: "gw", to: "pipe" },
        { from: "pipe", to: "pg" },
        { from: "pg", to: "rl", dashed: true },
        { from: "pg", to: "query" },
        { from: "query", to: "llm", label: "verbalize" },
        { from: "query", to: "dash" },
      ],
    },
    {
      type: "stepper",
      id: "pipeline",
      kicker: "Deep dive",
      heading: "The eight-stage cognitive pipeline",
      intro: "Each stage has an explicit input, process and output — which is what lets the dashboard reconstruct the full reasoning chain for any trait.",
      steps: [
        { label: "01", title: "Behavior Gateway", body: "Field mapping, type coercion and dedup-key generation normalize raw payloads from the extension, API or seed data.", io: { input: "Raw event payloads", output: "BehaviorEvent[] with content_id, creator, caption, hashtags, watch_time" } },
        { label: "02", title: "Knowledge Consolidation", body: "Topic extraction, creator aggregation, temporal clustering and importance scoring group events into behavior objects. A cluster needs three events sharing a topic or creator — and consolidation was reworked to see beyond one request's batch so creators spread across batches still form.", io: { input: "BehaviorEvent[]", output: "BehaviorObject[] with topics, creators, importance, confidence, lifecycle, trends" } },
        { label: "03", title: "Evidence Collection", body: "Scores every behavior object across five dimensions, weights confidence, and partitions counter-evidence so conflicting observations stay visible.", io: { input: "BehaviorObject[]", output: "Evidence[] with confidence, weight, net_confidence, conflicting observations" } },
        { label: "04", title: "Inference Generation", body: "Five rule families — high-confidence, low-confidence, temporal, engagement and diversity — e.g. consistent evening usage → \"Evening browsing pattern\".", io: { input: "Evidence[] + BehaviorObject[]", output: "Inference[] with label, confidence, importance, strength, rule_name" } },
        { label: "05", title: "Reflection", body: "Periodic summaries that detect patterns and changes across the whole cognitive state, scoped to the span of behaviour they summarise.", io: { input: "Inferences + evidence + behavior objects", output: "Reflection[] with insights, patterns, recommendations" } },
        { label: "06", title: "Identity Construction", body: "Builds or evolves the nine sub-profiles from inferences, evidence, behavior objects and the existing identity.", io: { input: "Inferences, evidence, existing identity", output: "Identity with 9 sub-profiles" } },
        { label: "07", title: "Snapshot", body: "Persists a snapshot only when behavioral shift crosses a configurable threshold — and any snapshot can be restored as the active identity.", io: { input: "Identity", output: "IdentitySnapshot with dominant & emerging topics, confidence, completeness" } },
        { label: "08", title: "Self-Model", body: "Explicit beliefs with supporting and contradicting observations. Strong beliefs need strength ≥ 0.7 and no contest from their own evidence; an uncertainty map separates 'unsure' from 'never addressed'.", io: { input: "Inferences + evidence", output: "Beliefs, strong beliefs, uncertain beliefs, uncertainty map" } },
      ],
    },
    {
      type: "grid",
      id: "identity",
      kicker: "The model",
      heading: "Nine sub-profiles of identity",
      columns: 3,
      items: [
        { tag: "01", title: "Behavior", body: "Watch-time distributions, session patterns, engagement ratios." },
        { tag: "02", title: "Interest graph", body: "Topic hierarchy with affinity scores, discovery and decay rates." },
        { tag: "03", title: "Creator graph", body: "Creator relationships, loyalty and discovery." },
        { tag: "04", title: "Learning style", body: "Tutorial vs. entertainment consumption." },
        { tag: "05", title: "Attention", body: "Session length and focus score." },
        { tag: "06", title: "Exploration", body: "Discovery rate and topic switching." },
        { tag: "07", title: "Consistency", body: "Routine strength and recurring patterns." },
        { tag: "08", title: "Habit", body: "Automatic vs. intentional behaviour." },
        { tag: "09", title: "Motivation", body: "Curiosity vs. habit vs. social signals." },
      ],
    },
    {
      type: "stepper",
      id: "rl",
      kicker: "Online learning",
      heading: "The wellbeing loop closes itself",
      intro: "A contextual bandit with ε-greedy Q-learning. Each ingest rewards the previous action by how much alignment improved; the Q-table persists in Postgres across restarts.",
      steps: [
        { label: "State", title: "Four alignment dimensions", body: "Intentionality, diversity, depth and wellbeing — scored from features engineered on each newly ingested batch." },
        { label: "Policy", title: "Explore or exploit", body: "ε-greedy: occasionally a random action to keep learning, otherwise the action with the best Q-value for the current state." },
        { label: "Action", title: "One of four interventions", body: "reduce_session · diversify · increase_engagement · maintain_balance." },
        { label: "Reward", title: "Δ alignment", body: "On the next ingest cycle, the change in overall alignment becomes the reward and updates the Q-value." },
      ],
    },
    {
      type: "bars",
      id: "performance",
      kicker: "Measured",
      heading: "Performance vs. target",
      intro: "As reported in the repository's performance table. Each bar shows how much of its target budget the measured time uses.",
      unit: "ms",
      max: 3000,
      scale: "budget",
      rows: [
        { label: "Query pipeline (cold)", value: 1800, display: "≈1.8s", secondary: { value: 3000, display: "target < 3s" } },
        { label: "Dashboard initial load", value: 1200, display: "≈1.2s", secondary: { value: 2000, display: "target < 2s" } },
        { label: "Ingest batch of 10", value: 320, display: "≈320ms", secondary: { value: 500, display: "target < 500ms" } },
        { label: "Query pipeline (cached)", value: 280, display: "≈280ms", secondary: { value: 500, display: "target < 500ms" } },
        { label: "Embedding (single)", value: 85, display: "≈85ms", secondary: { value: 200, display: "target < 200ms" } },
        { label: "Vector similarity search", value: 15, display: "≈15ms", secondary: { value: 50, display: "target < 50ms" } },
      ],
      legend: ["measured", "target"],
      note: "Also reported: the full V3 pipeline over 800 events in ~18s (target < 30s) and ~850 req/s on a single API instance.",
    },
    {
      type: "grid",
      id: "decisions",
      kicker: "Design decisions",
      heading: "Why it's built this way",
      columns: 2,
      items: [
        { tag: "01", title: "Deterministic over stochastic", body: "Inference, evidence, identity and decisions are algorithmic. Reproducible, explainable, auditable." },
        { tag: "02", title: "Identity over persona", body: "A 9-sub-profile identity replaced v2's persona archetypes, enabling cross-dimension patterns like high exploration + low consistency." },
        { tag: "03", title: "Pipeline tracing first", body: "Every query records per-stage timing, intermediate state and full I/O snapshots." },
        { tag: "04", title: "Online contextual bandit", body: "Personalized interventions learned from real alignment change, not hand-tuned rules." },
        { tag: "05", title: "Multi-provider LLM", body: "OpenAI, Anthropic or Ollama behind one interface — no lock-in, offline-capable." },
        { tag: "06", title: "Idempotent ingestion", body: "Deduped by (reel_id, session_id, timestamp) to survive retries and concurrent batches." },
        { tag: "07", title: "Snapshot on shift", body: "Snapshots persist only past a threshold — genuine shifts, not noise." },
        { tag: "08", title: "Two-schema coexistence", body: "The v1 SQLAlchemy schema and v3 asyncpg schema share one database on separate table sets." },
      ],
    },
    {
      type: "honest",
      id: "notes",
      kicker: "Engineering notes",
      heading: "Production hardening",
      intro: "What changed when the twin went from a demo to something people actually run.",
      items: [
        { title: "Consolidation saw one batch", body: "Clustering ran per ingest request, and the extension sends ten events at a time — so a creator spread across batches never reached the three-event bar. Consolidation now considers more than a single request's events." },
        { title: "Failures are visible", body: "Unhandled exceptions and extension extraction failures land in an error_events table surfaced at GET /admin/errors instead of dying silently in the console." },
        { title: "Organizations without data leaks", body: "Org rosters group seats but are never joined against cognitive-data tables; tests assert the roster response carries no cognitive fields." },
        { title: "Free-tier cold starts", body: "The live demo runs on Render's free tier, so the first request after ~15 minutes idle takes 30–60s to wake. A one-click demo dataset skips the extension entirely." },
      ],
    },
    {
      type: "chips",
      id: "stack",
      kicker: "Built with",
      heading: "Stack",
      groups: [
        { label: "Backend", items: ["Python 3.11", "FastAPI", "asyncpg", "PostgreSQL 16", "pgvector", "all-MiniLM-L6-v2", "ScrapeGraphAI", "Playwright", "pytest"] },
        { label: "LLM", items: ["OpenAI GPT-4o-mini", "Anthropic Claude", "Ollama"] },
        { label: "Dashboard", items: ["React 18", "Vite 5", "Recharts", "Three.js", "React Three Fiber"] },
        { label: "Extension", items: ["Chrome MV3", "Dual content scripts", "Background worker"] },
      ],
    },
  ],
};

/* =========================================================
   CIVITAS
   ========================================================= */

const civitas: DeepDive = {
  slug: "civitas",
  readme: "https://github.com/cnniranjan72/civitas#readme",
  blocks: [
    {
      type: "intro",
      id: "overview",
      kicker: "What it actually does",
      heading: "A city that governs itself — and explains every decision.",
      body: [
        "CIVITAS is a live, explainable digital twin of a city's energy governance: a real 1,000-citizen population with individual financial and emotional state, a reinforcement-learning \"Federal Brain\" that governs energy, traffic and crisis response, and a transparency layer built for how a government body actually needs to inspect and question automated decisions.",
        "Not a mockup with placeholder numbers — every confidence percentage, citizen voice line and decision-source label in the UI comes from the same live pipeline.",
      ],
      bullets: [
        "Simulates 1,000 citizens across 6 income groups and 6 zones, each with anger, trust, stress and a real monthly electricity bill from a tariff-slab engine.",
        "Governs three domains with 27 policy actions via a trained PPO checkpoint, falling back to transparent rule-based scoring.",
        "Explains every decision with real confidence, trade-offs and a decision-source label.",
        "Reacts believably — bills settle once per simulated day, driving multi-day trust and stress drift.",
      ],
    },
    {
      type: "stats",
      id: "scale",
      kicker: "By the numbers",
      heading: "The simulation",
      items: [
        { value: "1,000", label: "Citizens", note: "Individually tracked, seeded and reproducible" },
        { value: "27", label: "Policy actions", note: "Across energy, traffic and crisis" },
        { value: "6 × 6", label: "Income groups × zones", note: "EWS, LIG, MIG, HIG, Business, Industry" },
        { value: "≈3s", label: "Per governance tick", note: "Runs whether or not a browser is connected" },
        { value: "15", label: "Frontend pages", note: "Dashboard to 3D city" },
        { value: "80+", label: "Tests", note: "Real FastAPI app, real CityState, real DB" },
      ],
    },
    {
      type: "diagram",
      id: "architecture",
      kicker: "Architecture",
      heading: "One city, one process",
      caption:
        "CityState is a single in-process object — a deliberate simplicity trade-off, which is why the backend must run as exactly one instance.",
      height: 420,
      nodes: [
        { id: "fe", label: "Control room", sub: "React 18 + TS · 15 pages", x: 8, y: 50, tone: "cobalt", detail: "Dashboard (story / technical / comprehensive), citizens, governance, insights, 3D city and chat — over REST and a live WebSocket." },
        { id: "api", label: "REST API", sub: "/api/v1 · /control", x: 32, y: 20, tone: "lime", detail: "Policies, citizens, reports, chat and sandbox, behind a per-IP sliding-window rate limiter." },
        { id: "ws", label: "WebSocket", sub: "/control/live", x: 32, y: 80, tone: "lime", detail: "Pushes live metrics, explanation bundles and citizen voices every tick." },
        { id: "cs", label: "CityState", sub: "in-memory singleton", x: 56, y: 50, tone: "store", detail: "1,000 citizens, tick counter, energy policy and discom state — the live simulation." },
        { id: "loop", label: "Governance loop", sub: "asyncio · every ~3s", x: 56, y: 12, tone: "cobalt", detail: "Background task that steps the simulation and broadcasts each tick's explanation bundle." },
        { id: "fb", label: "Federal Brain", sub: "PPO + rule fallback", x: 80, y: 12, tone: "lime", detail: "Predicts actions from a trained PPO checkpoint (clamped to valid ranges) or falls back to rule-based scoring." },
        { id: "ollama", label: "Ollama", sub: "optional local LLM", x: 82, y: 58, tone: "muted", detail: "Live reasoning grounded in real metrics when reachable; otherwise a rule-based analyst summary from the same data." },
        { id: "pg", label: "PostgreSQL", sub: "history · accounts", x: 82, y: 90, tone: "store", detail: "Optional: tick / reward / policy history plus accounts and encrypted BYOK keys." },
      ],
      edges: [
        { from: "fe", to: "api", label: "REST" },
        { from: "fe", to: "ws", label: "live" },
        { from: "api", to: "cs" },
        { from: "loop", to: "cs", label: "step" },
        { from: "loop", to: "fb" },
        { from: "loop", to: "ws", label: "bundle" },
        { from: "api", to: "ollama", dashed: true },
        { from: "cs", to: "pg", dashed: true, label: "persist" },
      ],
    },
    {
      type: "stepper",
      id: "tick",
      kicker: "Deep dive",
      heading: "How a governance decision happens",
      intro: "Every ~3 seconds, independent of any connected browser. There is no separate mock data path for the demo.",
      steps: [
        { label: "Schedule", title: "Which domain needs attention?", body: "A curriculum scheduler picks energy, traffic or crisis — with an anti-staleness penalty so one domain can't lock forever." },
        { label: "Predict", title: "Federal Brain chooses", body: "With a PPO checkpoint loaded, the trained policy predicts an action clamped to the valid range; otherwise rule-based scoring decides." },
        { label: "Apply", title: "Domain effects", body: "The domain router applies the action's effects to CityState." },
        { label: "Settle", title: "Citizens react", body: "Bills settle once per simulated day; anger updates from real blackout hours; stability, protest risk and trust are recomputed." },
        { label: "Explain", title: "Explanation bundle", body: "Confidence from real urgency — supply/demand gap, protest risk, trust deviation — plus trade-offs and sampled citizen voices, narrated by Ollama or the rule-based fallback." },
        { label: "Broadcast", title: "Live to every client", body: "The bundle goes out over WebSocket and into the searchable audit log, rendered on the dashboard and Live City Chatter." },
      ],
    },
    {
      type: "grid",
      id: "citizens",
      kicker: "Citizen model",
      heading: "Emotion, money and memory",
      columns: 3,
      items: [
        { tag: "Daily", title: "Real bills", body: "A 24h load profile projects monthly kWh, run through the actual tariff-slab policy." },
        { tag: "Daily", title: "Financial stress", body: "Income-group-aware thresholds, smoothed with an EMA." },
        { tag: "Daily", title: "Trust", body: "Subsidy relief weighed against perceived unfairness." },
        { tag: "Every tick", title: "Anger", body: "Real blackout hours from the supply/demand gap, tolerance-weighted and stress-amplified." },
        { tag: "Mood", title: "Five states", body: "furious · frustrated · anxious · content · calm — one classification drives both the badge and the voice, so they can't disagree." },
        { tag: "Voice", title: "Grounded lines", body: "Three phrasings per mood that reference actual bill, blackout and subsidy figures." },
      ],
    },
    {
      type: "stepper",
      id: "chat",
      kicker: "Multi-user · BYOK",
      heading: "Three-tier chat fallback",
      intro: "One shared city for a team of analysts: separate accounts, encrypted personal keys and per-user attribution — not N separate simulations.",
      steps: [
        { label: "Tier 1", title: "Your own key", body: "Gemini, OpenAI or Anthropic. Encrypted with Fernet, write-only — only the last 4 characters are ever returned — and used only for your own chat." },
        { label: "Tier 2", title: "Shared Ollama", body: "No key, or it fails? The system's local model answers instead." },
        { label: "Tier 3", title: "Rule-based reply", body: "Ollama down too? A rule-based answer built from the same live, grounded data — never an apology." },
      ],
    },
    {
      type: "table",
      id: "data",
      kicker: "Data model",
      heading: "What each citizen carries",
      columns: ["Field", "Meaning"],
      rows: [
        ["income_group · zone", "One of six income groups and six zones"],
        ["income · monthly_bill", "Earnings and a bill computed from the tariff slabs"],
        ["anger · trust · stress", "Evolving emotional and financial state"],
        ["blackout_hours_month", "Real outage exposure from the supply/demand gap"],
        ["subsidy_received", "Relief applied by the current energy policy"],
      ],
    },
    {
      type: "honest",
      id: "limits",
      kicker: "Stated honestly",
      heading: "Known limitations",
      intro: "Straight from the README — constraints, not configuration options.",
      items: [
        { title: "Single instance only", body: "CityState is an in-process singleton; a second backend instance would run a diverging simulation with no reconciliation." },
        { title: "Live state resets on restart", body: "Postgres persists historical tick, reward and policy records, but doesn't restore the live simulation on boot." },
        { title: "No invented metrics", body: "Healthcare, education, employment and renewable mix aren't simulated, so the UI omits them. Carbon, air quality and GDP are real, derived from live state." },
        { title: "In-memory rate limiting", body: "Fine for the single instance this app requires; not sufficient for a genuinely multi-instance setup." },
      ],
    },
    {
      type: "chips",
      id: "stack",
      kicker: "Built with",
      heading: "Stack",
      groups: [
        { label: "Backend", items: ["Python", "FastAPI", "asyncio", "WebSockets", "PPO (RL)", "pytest"] },
        { label: "AI", items: ["Ollama", "Gemini / OpenAI / Anthropic (BYOK)"] },
        { label: "Frontend", items: ["React 18", "TypeScript", "Vite", "3D city view"] },
        { label: "Data & Ops", items: ["PostgreSQL", "JWT + bcrypt", "Fernet encryption", "Render Blueprint"] },
      ],
    },
  ],
};

/* =========================================================
   IntelliMine
   ========================================================= */

const intellimine: DeepDive = {
  slug: "intellimine",
  readme: "https://github.com/cnniranjan72/Autonomous-Landmine-detector#readme",
  blocks: [
    {
      type: "intro",
      id: "overview",
      kicker: "Overview",
      heading: "Find the mine. Score the threat. Walk out safely.",
      body: [
        "IntelliMine is a full-stack autonomous landmine detection system powered by multiple ML models. It predicts whether a mine is present from onboard sensor readings, classifies what kind of mine it is, scores how dangerous it is, and plans a safe route through the field.",
        "The goal is the one that matters in real demining: more speed and accuracy, and above all, more safety.",
      ],
      bullets: [
        "Mine detection with Random Forest + PCA over 8 sensor features.",
        "Mine-type classification across 5 classes from GPR-derived features.",
        "A hybrid threat-severity score fusing model probability with mine danger.",
        "A* safe-path planning over a danger-weighted grid, with an interactive minefield simulator.",
      ],
    },
    {
      type: "stats",
      id: "metrics",
      kicker: "Detection model",
      heading: "Model performance",
      items: [
        { value: "98.2%", label: "Detection rate", note: "Mines correctly flagged — missed mines are the costly error" },
        { value: "93.8%", label: "CV accuracy", note: "Cross-validated accuracy of the detection model" },
        { value: "<5%", label: "False positives", note: "Safe ground wrongly flagged as a mine" },
        { value: "8", label: "Sensor features", note: "Metal, magnetic, density, thermal and derived signals" },
        { value: "A*", label: "Safe-path planner", note: "Euclidean heuristic over a danger-weighted grid" },
        { value: "5", label: "Mine classes", note: "Null, anti-tank, AP, booby-trapped AP, M14 AP" },
      ],
    },
    {
      type: "diagram",
      id: "architecture",
      kicker: "Architecture",
      heading: "From sensor reading to safe route",
      caption: "The React UI calls the Flask API over Axios; predictions are fused into a severity score, returned for visualization, and optionally logged to MongoDB Atlas.",
      height: 380,
      nodes: [
        { id: "ui", label: "React dashboard", sub: "Vite · TS · Tailwind", x: 8, y: 50, tone: "cobalt", detail: "Detection, classification, path-planning and simulation panels with Framer Motion animations and ShadCN components." },
        { id: "api", label: "Flask REST API", sub: "JWT · Flasgger docs", x: 32, y: 50, tone: "lime", detail: "Flask with Flask-JWT-Extended, Flask-CORS and Flasgger API docs; protected endpoints require a Bearer token." },
        { id: "det", label: "Detection model", sub: "Random Forest + PCA", x: 58, y: 14, tone: "lime", detail: "8 onboard sensor features in; mine present (0/1) plus probability out." },
        { id: "cls", label: "Type classifier", sub: "RF / XGBoost", x: 58, y: 50, tone: "lime", detail: "V, H, S GPR-derived features in; one of five mine classes plus confidence out." },
        { id: "sev", label: "Severity engine", sub: "0.7·p + 0.3·w", x: 82, y: 32, tone: "cobalt", detail: "Fuses model probability with a per-type danger weight into a severity score, colour and label." },
        { id: "astar", label: "A* planner", sub: "danger-weighted grid", x: 82, y: 76, tone: "cobalt", detail: "Euclidean-heuristic A* over a grid whose costs grow with nearby mine severity, with radius-based danger zones." },
        { id: "db", label: "MongoDB Atlas", sub: "logs · history", x: 32, y: 88, tone: "store", detail: "Optional detection logs, metrics and history, plus user accounts for JWT auth." },
      ],
      edges: [
        { from: "ui", to: "api", label: "Axios" },
        { from: "api", to: "det" },
        { from: "api", to: "cls" },
        { from: "det", to: "sev" },
        { from: "cls", to: "sev" },
        { from: "sev", to: "astar", label: "cost map" },
        { from: "api", to: "db", dashed: true, label: "log" },
      ],
    },
    {
      type: "table",
      id: "features",
      kicker: "Inputs",
      heading: "Eight onboard sensor features",
      intro: "What the detection model sees for every scanned cell.",
      columns: ["Feature", "Description"],
      rows: [
        ["Metal_Level", "Strength of metal detection"],
        ["Magnetic_Field", "Microtesla field strength"],
        ["Ground_Density", "Soil density"],
        ["Thermal_Signature", "Heat signature"],
        ["Metal_Mag_Ratio", "Combined metal / magnetic ratio"],
        ["Metal_Diff", "Signal difference"],
        ["Metal_Mag_Energy", "Combined energy"],
        ["Metal_Mag_Avg", "Average metal-magnetic signal"],
      ],
    },
    {
      type: "severity",
      id: "severity",
      kicker: "Try it",
      heading: "Threat severity engine",
      intro: "The repository's hybrid formula: severity = 0.7 × model probability + 0.3 × mine weight. Drag the probability and pick a mine type.",
      types: [
        { label: "Null / no mine", weight: 0.1 },
        { label: "M14 AP", weight: 0.7 },
        { label: "Anti-personnel", weight: 0.8 },
        { label: "Booby-trapped AP", weight: 0.95 },
        { label: "Anti-tank", weight: 1.0 },
      ],
    },
    {
      type: "pathfinder",
      id: "pathfinder",
      kicker: "Try it",
      heading: "Safe path through a minefield",
      intro: "Mines radiate danger into nearby cells, raising their traversal cost; A* with a Euclidean heuristic finds the cheapest route and the robot walks it cell by cell. Click cells to place or clear mines.",
    },
    {
      type: "chips",
      id: "stack",
      kicker: "Built with",
      heading: "Stack",
      groups: [
        { label: "Frontend", items: ["React", "Vite", "TypeScript", "TailwindCSS", "Framer Motion", "ShadCN UI", "Axios"] },
        { label: "Backend", items: ["Flask", "Flask-JWT-Extended", "Flask-PyMongo", "Flasgger", "NumPy", "joblib"] },
        { label: "ML", items: ["scikit-learn", "Random Forest", "XGBoost", "PCA", "Logistic Regression (baseline)", "A*"] },
        { label: "Infra", items: ["Vercel", "Render", "MongoDB Atlas"] },
      ],
    },
    {
      type: "honest",
      id: "next",
      kicker: "Roadmap",
      heading: "What's next",
      intro: "Listed in the README as coming soon, not shipped yet.",
      items: [
        { title: "GPR Scan Analyzer", body: "Upload a 2D GPR B-scan CSV for heatmap rendering, frequency spectrum, depth-vs-intensity plots, anomaly detection and buried-object classification." },
        { title: "Demos here are re-implementations", body: "The severity calculator and minefield on this page re-implement the documented formula and planner in your browser; the real models run behind the live app's API." },
      ],
    },
  ],
};

export const DEEP_DIVES: Record<string, DeepDive> = { bastion, aimirror, civitas, intellimine };
