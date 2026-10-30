// Builds the assistant's knowledge base from the same data the site renders, so answers
// can never drift from what the portfolio shows. Files starting with "_" are not routes on Vercel.
import { CREDENTIALS, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE, PROJECTS, SKILL_GROUPS } from "../src/components/site/data";
import { CASES } from "../src/components/site/cases";
import { DEEP_DIVES, type Block } from "../src/components/site/deepdives";

function blockText(b: Block): string {
  const head = `### ${b.heading}`;
  switch (b.type) {
    case "intro":
      return [head, ...b.body, ...(b.bullets ?? []).map((t) => `- ${t}`)].join("\n");
    case "stats":
      return [head, ...b.items.map((i) => `- ${i.value} ${i.label}${i.note ? ` (${i.note})` : ""}`)].join("\n");
    case "diagram":
      return [head, b.caption, ...b.nodes.map((n) => `- ${n.label}${n.sub ? ` [${n.sub}]` : ""}: ${n.detail}`)].join("\n");
    case "stepper":
      return [head, b.intro ?? "", ...b.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`)].join("\n");
    case "simulator":
      return [head, b.intro].join("\n");
    case "bars":
      return [head, b.intro ?? "", ...b.rows.map((r) => `- ${r.label}: ${r.display}${r.secondary ? ` (${r.secondary.display})` : ""}`), b.note].join("\n");
    case "table":
      return [head, b.intro ?? "", b.columns.join(" | "), ...b.rows.map((r) => r.join(" | "))].join("\n");
    case "grid":
      return [head, b.intro ?? "", ...b.items.map((i) => `- ${i.title}: ${i.body}`)].join("\n");
    case "chips":
      return [head, ...b.groups.map((g) => `- ${g.label}: ${g.items.join(", ")}`)].join("\n");
    case "honest":
      return [head, b.intro, ...b.items.map((i) => `- ${i.title}: ${i.body}`)].join("\n");
    case "severity":
      return [head, b.intro, ...b.types.map((t) => `- ${t.label}: weight ${t.weight}`)].join("\n");
    case "pathfinder":
      return [head, b.intro].join("\n");
    case "video":
      return [head, b.intro, `Chapters: ${b.chapters.map((c) => c.label).join("; ")}`].join("\n");
  }
}

export function buildKnowledge(): string {
  const parts: string[] = [];

  parts.push(
    `# Profile
Name: ${PROFILE.name}
Roles: ${PROFILE.roles.join(", ")}
Location: ${PROFILE.location} (IST, UTC+5:30)
Email: ${PROFILE.email}
GitHub: ${PROFILE.github}
LinkedIn: ${PROFILE.linkedin}
Résumé: available on the site (Resume button)
Availability: open to freelance and full-time opportunities`
  );

  parts.push(
    `# Experience\n` +
      EXPERIENCE.map(
        (x) =>
          `## ${x.role} — ${x.company} (${x.period}, ${x.location}${x.current ? ", current" : ""})\n${x.highlights.map((h) => `- ${h}`).join("\n")}\nStack: ${x.stack.join(", ")}`
      ).join("\n\n")
  );

  parts.push(
    `# Education\n${EDUCATION.degree}, ${EDUCATION.institution}, ${EDUCATION.period}. CGPA ${EDUCATION.cgpa}.\nCoursework: ${EDUCATION.coursework.join(", ")}`
  );

  parts.push(`# Certifications\n${CREDENTIALS.map((c) => `- ${c.title} (${c.issuer})`).join("\n")}\nLanguages spoken: ${LANGUAGES.join(", ")}`);

  parts.push(`# Skills\n${SKILL_GROUPS.map((g) => `- ${g.title}: ${g.skills.join(", ")}`).join("\n")}`);

  parts.push(
    `# Projects\n` +
      PROJECTS.map((p) => {
        const links = [p.demo && `Live: ${p.demo}`, p.code && `Code: ${p.code}`].filter(Boolean).join(" · ");
        return `## ${p.title} — ${p.tagline}${p.category.includes("Featured") ? " (featured)" : ""}\n${p.description}\nTags: ${p.tags.join(", ")}${p.metric ? `\nHeadline: ${p.metric}` : ""}${links ? `\n${links}` : ""}`;
      }).join("\n\n")
  );

  for (const c of CASES) {
    const deep = DEEP_DIVES[c.slug];
    const body = deep ? deep.blocks.map(blockText).join("\n\n") : [c.summary, ...c.sections.map((s) => `### ${s.heading}\n${s.points.map((p) => `- ${p}`).join("\n")}`)].join("\n\n");
    parts.push(`# Deep dive: ${c.title} — ${c.tagline}\n${c.summary}\nMetrics: ${c.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}\n\n${body}`);
  }

  return parts.join("\n\n---\n\n");
}
