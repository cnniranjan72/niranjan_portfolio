// "Where did I use this?" — maps a skill name to the projects and roles that list it.
import { CASES } from "./cases";
import { EXPERIENCE, PROJECTS } from "./data";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]/g, "");

// Different spellings that should count as the same skill.
const ALIASES: Record<string, string[]> = {
  react: ["react", "reactjs", "reactthreefiber", "r3f"],
  r3f: ["r3f", "reactthreefiber"],
  postgresql: ["postgresql", "postgres", "neon"],
  pgvector: ["pgvector"],
  node: ["nodejs", "node"],
  nodejs: ["nodejs", "node"],
  openai: ["openai", "openaiapis"],
  claude: ["claude", "anthropic"],
  rl: ["rl", "reinforcementlearning", "ppo", "ppomultiagent"],
  ppo: ["ppo", "ppomultiagent"],
  llms: ["llm", "llms"],
  rag: ["rag"],
  chromemv3: ["chromemv3", "chromeextension", "chromeextensionmv3"],
  firebase: ["firebase", "firebaseauth"],
  threejs: ["threejs", "r3f", "reactthreefiber"],
  cicd: ["cicd"],
};

export type Usage = { projects: { title: string; slug?: string; link?: string }[]; roles: { role: string; company: string; current?: boolean }[] };

export function usageFor(skill: string): Usage {
  const key = norm(skill);
  const names = new Set(ALIASES[key] ?? [key]);
  const match = (list: string[]) => list.some((t) => names.has(norm(t)));

  const projects = PROJECTS.filter((p) => {
    const caseStack = CASES.find((c) => c.title === p.title)?.stack ?? [];
    return match([...p.tags, ...caseStack]);
  }).map((p) => ({ title: p.title, slug: CASES.find((c) => c.title === p.title)?.slug, link: p.demo ?? p.code }));

  const roles = EXPERIENCE.filter((x) => match(x.stack) || x.highlights.some((h) => [...names].some((n) => norm(h).includes(n) && n.length > 3))).map((x) => ({
    role: x.role,
    company: x.company,
    current: x.current,
  }));

  return { projects, roles };
}
