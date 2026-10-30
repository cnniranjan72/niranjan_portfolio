import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "cmdk";
import { ArrowUpRight, Copy, FileText, GitFork, Github, Hash, Linkedin, Mail, Star } from "lucide-react";
import { NAV, PROFILE, PROJECTS } from "./data";
import { RevealLines, SectionLabel, scrollToId } from "./primitives";
import { CASES } from "./cases";
import { openCase } from "./caseRoute";
import { openResume } from "./Resume";

const EASE = [0.16, 1, 0.3, 1] as const;
const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/* ---------- Scramble text ---------- */

export function useScramble(text: string) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const duration = 380 + text.length * 22;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(p * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < revealed ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return [out, run] as const;
}

export function Scramble({ text, className = "", onView = false }: { text: string; className?: string; onView?: boolean }) {
  const [out, run] = useScramble(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!onView || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run();
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [onView, run]);

  return (
    <span ref={ref} className={className} onPointerEnter={run} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/* ---------- Command palette (⌘K / Ctrl+K) ---------- */

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1600);
  };

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 60);
  };

  const external = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const item =
    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/75 data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#070a12]/95 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command label="Command menu" loop>
                <div className="flex items-center gap-3 border-b border-white/10 px-5">
                  <Hash size={16} className="text-lime" />
                  <Command.Input
                    autoFocus
                    placeholder="Jump to a section, project or link…"
                    className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/55"
                  />
                  <kbd className="rounded-md border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/55">ESC</kbd>
                </div>
                <Command.List className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
                  <Command.Empty className="px-3 py-6 text-center text-sm text-white/55">No results.</Command.Empty>

                  <Command.Group heading="Navigate" className="cmdk-group">
                    {[{ id: "hero", label: "Home" }, ...NAV, { id: "github", label: "GitHub activity" }].map((n) => (
                      <Command.Item key={n.id} value={`go ${n.label}`} onSelect={() => run(() => scrollToId(n.id))} className={item}>
                        <ArrowUpRight size={15} className="rotate-90 text-white/55" />
                        {n.label}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading="Case studies" className="cmdk-group">
                    {CASES.map((c) => (
                      <Command.Item key={c.slug} value={`case study ${c.title} ${c.tagline}`} onSelect={() => run(() => openCase(c.slug))} className={item}>
                        <FileText size={15} className="text-lime" />
                        <span className="text-white">{c.title}</span>
                        <span className="truncate text-white/55">{c.tagline}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading="Projects" className="cmdk-group">
                    {PROJECTS.filter((p) => p.demo || p.code).map((p) => (
                      <Command.Item
                        key={p.title}
                        value={`project ${p.title} ${p.tagline}`}
                        onSelect={() => run(() => external((p.demo ?? p.code)!))}
                        className={item}
                      >
                        <span className={`h-2 w-2 rounded-full ${p.accent === "lime" ? "bg-lime" : "bg-cobalt-light"}`} />
                        <span className="text-white">{p.title}</span>
                        <span className="truncate text-white/55">{p.tagline}</span>
                        <span className="ml-auto font-mono text-[10px] uppercase text-white/55">{p.demo ? "Live" : "Code"}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading="Connect" className="cmdk-group">
                    <Command.Item
                      value="copy email"
                      onSelect={() =>
                        run(() => navigator.clipboard?.writeText(PROFILE.email).then(() => flash("Email copied"), () => undefined))
                      }
                      className={item}
                    >
                      <Copy size={15} className="text-white/55" /> Copy email
                    </Command.Item>
                    <Command.Item value="send email" onSelect={() => run(() => (window.location.href = `mailto:${PROFILE.email}`))} className={item}>
                      <Mail size={15} className="text-white/55" /> Send an email
                    </Command.Item>
                    <Command.Item value="github" onSelect={() => run(() => external(PROFILE.github))} className={item}>
                      <Github size={15} className="text-white/55" /> GitHub
                    </Command.Item>
                    <Command.Item value="linkedin" onSelect={() => run(() => external(PROFILE.linkedin))} className={item}>
                      <Linkedin size={15} className="text-white/55" /> LinkedIn
                    </Command.Item>
                    <Command.Item value="resume cv" onSelect={() => run(openResume)} className={item}>
                      <FileText size={15} className="text-white/55" /> Resume
                    </Command.Item>
                  </Command.Group>
                </Command.List>
                <div className="flex justify-between border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  <span>↑↓ navigate · ↵ select</span>
                  <span>Niranjan.dev</span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-8 left-1/2 z-[9001] -translate-x-1/2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Live GitHub activity ---------- */

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
};

type GhUser = { public_repos: number; followers: number; created_at: string };

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Java: "#b07219",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
};

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [n, u] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
}

const GH_USER = PROFILE.github.split("/").pop()!;
const CACHE_KEY = "gh-live-v1";

export function GitHubLive() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [user, setUser] = useState<GhUser | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
      if (cached && Date.now() - cached.t < 10 * 60 * 1000) {
        setRepos(cached.repos);
        setUser(cached.user);
        return;
      }
    } catch {
      /* storage unavailable */
    }
    const ctrl = new AbortController();
    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { signal: ctrl.signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=12`, { signal: ctrl.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
    ])
      .then(([u, r]: [GhUser, Repo[]]) => {
        const list = r.filter((x) => !x.fork).slice(0, 6);
        setUser(u);
        setRepos(list);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), user: u, repos: list }));
        } catch {
          /* storage unavailable */
        }
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  if (failed) return null;

  const langs = repos
    ? Object.entries(
        repos.reduce<Record<string, number>>((acc, r) => {
          if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])
    : [];
  const total = langs.reduce((n, [, c]) => n + c, 0) || 1;

  return (
    <section id="github" className="relative mx-auto max-w-[1600px] px-4 pb-28 md:px-10 md:pb-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index="LIVE">GitHub activity</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-white">
            <RevealLines lines={["Currently", <span className="text-outline">pushing</span>]} />
          </h2>
        </div>
        <div className="flex gap-10">
          {[
            { v: user?.public_repos, l: "Public repos" },
            { v: user?.followers, l: "Followers" },
            { v: user ? new Date(user.created_at).getFullYear() : undefined, l: "Coding since" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl text-white md:text-5xl">{s.v ?? "—"}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {langs.length > 0 && (
        <div className="mt-12">
          <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
            {langs.map(([l, c], i) => (
              <motion.span
                key={l}
                style={{ background: LANG_COLORS[l] ?? "#888", width: `${(c / total) * 100}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
                className="origin-left"
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-white/50">
            {langs.map(([l, c]) => (
              <span key={l} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[l] ?? "#888" }} />
                {l} {Math.round((c / total) * 100)}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(repos ?? Array.from({ length: 6 }, () => null)).map((r, i) => (
          <motion.a
            key={r?.id ?? i}
            href={r?.html_url ?? PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/25"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
            onPointerMove={(e) => {
              const b = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - b.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - b.top}px`);
            }}
          >
            <span className="spotlight" />
            {r ? (
              <>
                <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      {i === 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />}
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                    </span>
                    pushed {timeAgo(r.pushed_at)}
                  </span>
                  <ArrowUpRight size={16} className="text-white/55 transition-all duration-500 group-hover:rotate-45 group-hover:text-lime" />
                </div>
                <h3 className="relative mt-5 break-words font-display text-xl text-white">{r.name}</h3>
                <p className="relative mt-2 line-clamp-2 text-sm text-white/50">{r.description ?? "No description yet."}</p>
                <div className="relative mt-auto flex items-center gap-4 pt-5 font-mono text-[11px] text-white/50">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[r.language] ?? "#888" }} />
                      {r.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Star size={12} /> {r.stargazers_count}</span>
                  <span className="flex items-center gap-1"><GitFork size={12} /> {r.forks_count}</span>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
              </div>
            )}
          </motion.a>
        ))}
      </div>
    </section>
  );
}
