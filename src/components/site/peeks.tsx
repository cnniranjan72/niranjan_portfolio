import { ReactNode, useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS, SKILL_GROUPS } from "./data";
import { openCase } from "./caseRoute";
import { Peek, PeekLabel } from "./Peek";
import { usageFor } from "./skillIndex";

/* ---------- Skill: where it was used ---------- */

function SkillPeekBody({ skill }: { skill: string }) {
  const { projects, roles } = useMemo(() => usageFor(skill), [skill]);
  const empty = !projects.length && !roles.length;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="font-display text-lg text-white">{skill}</div>
        {!empty && (
          <span className="rounded-full bg-lime/15 px-2 py-0.5 font-mono text-[10px] text-lime">
            {projects.length + roles.length} {projects.length + roles.length === 1 ? "place" : "places"}
          </span>
        )}
      </div>
      {empty && <p className="mt-2 text-sm text-white/60">Part of the everyday toolkit across coursework and side builds.</p>}
      {!!roles.length && (
        <div className="mt-3">
          <PeekLabel>In production at</PeekLabel>
          <ul className="mt-1.5 space-y-1">
            {roles.map((r) => (
              <li key={r.role + r.company} className="flex items-center gap-2 text-sm text-white/80">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.current ? "bg-lime" : "bg-white/40"}`} />
                <span className="truncate">
                  {r.company} <span className="text-white/50">· {r.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!projects.length && (
        <div className="mt-3">
          <PeekLabel>Built with it</PeekLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {projects.map((p) =>
              p.slug ? (
                <button key={p.title} onClick={() => openCase(p.slug!)} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-white transition-colors hover:bg-lime hover:text-black">
                  {p.title} →
                </button>
              ) : p.link ? (
                <a key={p.title} href={p.link} target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-white/85 transition-colors hover:bg-white/15">
                  {p.title}
                </a>
              ) : (
                <span key={p.title} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-white/70">
                  {p.title}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SkillPeek({ skill, children }: { skill: string; children: ReactNode }) {
  return (
    <Peek content={<SkillPeekBody skill={skill} />} width={290}>
      {children}
    </Peek>
  );
}

/* ---------- Nav: preview of each section ---------- */

function NavPeekBody({ id }: { id: string }) {
  if (id === "about")
    return (
      <div>
        <PeekLabel>About</PeekLabel>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          CS undergraduate engineering production full-stack and AI systems — RAG, vector search and RL — for aviation and enterprise teams.
        </p>
        <div className="mt-3 flex gap-4 font-mono text-[11px] text-white/60">
          <span>
            <span className="text-white">{EXPERIENCE.length}</span> roles
          </span>
          <span>
            <span className="text-white">{PROJECTS.length}</span> projects
          </span>
          <span>
            <span className="text-white">{EDUCATION.cgpa}</span> CGPA
          </span>
        </div>
      </div>
    );
  if (id === "experience")
    return (
      <div>
        <PeekLabel>Where I've shipped</PeekLabel>
        <ul className="mt-2 space-y-2">
          {EXPERIENCE.map((x) => (
            <li key={x.role + x.period} className="flex gap-2.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${x.current ? "bg-lime shadow-[0_0_8px_rgba(212,255,36,0.8)]" : "bg-white/30"}`} />
              <span className="min-w-0">
                <span className="block truncate text-sm text-white">{x.role}</span>
                <span className="block font-mono text-[10px] text-white/50">
                  {x.company} · {x.period}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  if (id === "skills") {
    const total = new Set(SKILL_GROUPS.flatMap((g) => g.skills)).size;
    return (
      <div>
        <PeekLabel>{total} technologies · 6 areas</PeekLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Python", "TypeScript", "React", "FastAPI", "pgvector", "Redis", "Kafka", "Docker", "PyTorch", "Three.js"].map((s) => (
            <span key={s} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-white/85">
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (id === "portfolio") {
    const featured = PROJECTS.filter((p) => p.category.includes("Featured"));
    return (
      <div>
        <PeekLabel>Featured · {PROJECTS.length} total</PeekLabel>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {featured.map((p) => (
            <li key={p.title}>
              <button
                onClick={() => openCase(p.title.toLowerCase())}
                className="group/p block w-full overflow-hidden rounded-xl border border-white/10 text-left transition-colors hover:border-lime/60"
              >
                {p.shot && <img src={p.shot} alt="" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover/p:scale-105" loading="lazy" />}
                <span className="block px-2.5 py-2">
                  <span className="block font-display text-sm text-white">{p.title}</span>
                  <span className="block truncate text-[11px] text-white/55">{p.tagline}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (id === "contact") return <ContactPeekBody />;
  return null;
}

function ContactPeekBody() {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <PeekLabel>Open to freelance & full-time</PeekLabel>
      </div>
      <button
        onClick={() => {
          void navigator.clipboard?.writeText(PROFILE.email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
      >
        <span className="truncate">{PROFILE.email}</span>
        {copied ? <Check size={14} className="shrink-0 text-lime" /> : <Copy size={14} className="shrink-0 text-white/50" />}
      </button>
      <p className="mt-2 font-mono text-[10px] text-white/50">{PROFILE.location} · IST (UTC+5:30)</p>
    </div>
  );
}

export function NavPeek({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Peek content={<NavPeekBody id={id} />} side="bottom" width={id === "portfolio" ? 360 : 300} openDelay={220}>
      {children}
    </Peek>
  );
}

/* ---------- About stats: what each number is made of ---------- */

const STAT_DETAILS: Record<string, { title: string; lines: string[] }> = {
  "Engineering roles": {
    title: "Across two companies",
    lines: EXPERIENCE.map((x) => `${x.role} — ${x.company}`),
  },
  "Projects shipped": {
    title: `${PROJECTS.length} projects in the archive`,
    lines: ["BASTION, AIMirror, CIVITAS and IntelliMine are live", "Web, mobile, PWA and AI/ML builds"],
  },
  "Mine detection rate": {
    title: "IntelliMine detection model",
    lines: ["Random Forest + PCA over 8 sensor features", "As reported on the live IntelliMine app"],
  },
  CGPA: {
    title: EDUCATION.degree,
    lines: [EDUCATION.institution, EDUCATION.period],
  },
};

export function StatPeek({ label, children }: { label: string; children: ReactNode }) {
  const d = STAT_DETAILS[label];
  if (!d) return <>{children}</>;
  return (
    <Peek
      side="top"
      width={300}
      content={
        <div>
          <PeekLabel>{label}</PeekLabel>
          <div className="mt-1.5 font-display text-base text-white">{d.title}</div>
          <ul className="mt-2 space-y-1">
            {d.lines.map((l) => (
              <li key={l} className="flex gap-2 text-sm text-white/70">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lime" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {children}
    </Peek>
  );
}

/* ---------- Social links ---------- */

function cachedRepoCount(): number | null {
  try {
    const cached = JSON.parse(sessionStorage.getItem("gh-live-v1") ?? "null");
    return cached?.user?.public_repos ?? null;
  } catch {
    return null;
  }
}

export function SocialPeek({ kind, children }: { kind: "GitHub" | "LinkedIn" | "Email"; children: ReactNode }) {
  const repos = kind === "GitHub" ? cachedRepoCount() : null;
  const body =
    kind === "GitHub" ? (
      <>
        <PeekLabel>GitHub</PeekLabel>
        <div className="mt-1.5 font-display text-base text-white">@{PROFILE.github.split("/").pop()}</div>
        <p className="mt-1 text-sm text-white/65">{repos ? `${repos} public repositories` : "Source for BASTION, AIMirror, CIVITAS and more"}</p>
      </>
    ) : kind === "LinkedIn" ? (
      <>
        <PeekLabel>LinkedIn</PeekLabel>
        <div className="mt-1.5 font-display text-base text-white">/in/{PROFILE.linkedin.split("/").filter(Boolean).pop()}</div>
        <p className="mt-1 text-sm text-white/65">Professional profile</p>
      </>
    ) : (
      <>
        <PeekLabel>Email</PeekLabel>
        <div className="mt-1.5 text-sm text-white">{PROFILE.email}</div>
        <p className="mt-1 text-sm text-white/65">Opens your mail app</p>
      </>
    );
  return (
    <Peek side="top" width={240} content={<div>{body}<ArrowUpRight size={14} className="mt-2 text-lime" /></div>}>
      {children}
    </Peek>
  );
}
