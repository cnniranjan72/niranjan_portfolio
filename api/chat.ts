// POST /api/chat — portfolio assistant backed by Claude, grounded in the site's own data.
// Streams plain text. Returns 503 when the API is not configured, so the widget can fall back
// to its built-in keyword answers.
import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledge } from "./_knowledge";

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 12; // messages of history sent to the model
const MAX_CHARS = 1200; // per message
const RATE = { windowMs: 10 * 60 * 1000, max: 20 }; // per IP, per warm instance

const RULES = `You are the portfolio assistant on Niranjan C N's personal website. Visitors are mostly recruiters, hiring managers and engineers.

How to answer:
- Use only the facts in the knowledge base below. If something isn't covered, say you don't know and suggest emailing ${"cnniranjan72@gmail.com"}. Never invent numbers, employers, dates, links or opinions.
- Refer to Niranjan in the third person. Be warm, direct and specific — cite the concrete project, role or metric that answers the question.
- Keep answers short: 2–5 sentences, or a few "•" bullets when listing. Plain text only — no markdown headings, tables or bold.
- When a featured project is relevant (BASTION, AIMirror, CIVITAS, IntelliMine), name it so the visitor can open its deep dive.
- Stay on topic: questions about Niranjan's work, skills, experience, education, availability and how to reach him. Politely decline anything else (general coding help, other people, writing tasks) and steer back.
- Some metrics are self-reported by the projects themselves (for example IntelliMine's live-site figures); present them as reported, not as independent benchmarks.`;

const KNOWLEDGE = buildKnowledge();

let client: Anthropic | null = null;
function getClient(): Anthropic {
  // Credentials resolve from the environment (ANTHROPIC_API_KEY on Vercel).
  client ??= new Anthropic();
  return client;
}

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE.max;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw)) return null;
  const messages: Anthropic.Beta.BetaMessageParam[] = raw
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, { error: "invalid_messages" });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) return json(429, { error: "rate_limited" });

  let anthropic: Anthropic;
  try {
    anthropic = getClient();
  } catch {
    return json(503, { error: "not_configured" });
  }

  const stream = anthropic.beta.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default", // re-run a classifier decline on Anthropic's recommended model
    output_config: { effort: "low" }, // chat route: low effort keeps answers fast and cheap
    system: [
      { type: "text", text: RULES },
      { type: "text", text: `<knowledge_base>\n${KNOWLEDGE}\n</knowledge_base>`, cache_control: { type: "ephemeral" } },
    ],
    messages,
  });

  // Wait for the first event so configuration/auth errors become a clean status code
  // (the widget falls back) instead of a broken stream.
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return json(503, { error: "not_configured" });
    if (err instanceof Anthropic.RateLimitError) return json(429, { error: "upstream_busy" });
    if (err instanceof Anthropic.APIError) return json(502, { error: "upstream_error" });
    return json(503, { error: "not_configured" });
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: Anthropic.Beta.BetaRawMessageStreamEvent) => {
        if (e.type === "content_block_delta" && e.delta.type === "text_delta") controller.enqueue(encoder.encode(e.delta.text));
      };
      try {
        if (!first.done) emit(first.value);
        for (let r = await events.next(); !r.done; r = await events.next()) emit(r.value);
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nI can't help with that one — ask me about Niranjan's projects, experience or skills instead."));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("…"));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n(The connection dropped — please ask again.)"));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-assistant": "claude" },
  });
}
