import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2, Play } from "lucide-react";
import { CASES, CaseStudy as Case, caseBySlug } from "./cases";
import { closeCase, openCase } from "./caseRoute";
import { Magnetic, setScrollLocked, useFocusTrap } from "./primitives";
import { Peek, PeekLabel } from "./Peek";
import { sfx } from "./sound";
import { DEEP_DIVES } from "./deepdives";
import { PROJECTS } from "./data";
import { BrowserFrame } from "./BrowserFrame";
import { playPitch } from "./PitchPlayer";
import { DeepDiveBlocks, DeepDiveToc } from "./DeepDive";

const EASE = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;

/* ---------- Pipeline diagram ---------- */

function Pipeline({ c, root }: { c: Case; root: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="relative [container-type:inline-size]">
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/10 md:left-0 md:right-0 md:top-[19px] md:bottom-auto md:h-px md:w-auto" />
      <motion.div
        className="absolute left-[19px] top-4 bottom-4 w-px origin-top bg-gradient-to-b from-lime to-cobalt-light md:hidden"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, root }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <motion.div
        className="absolute left-0 right-0 top-[19px] hidden h-px origin-left bg-gradient-to-r from-lime via-cobalt-light to-lime md:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, root }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <span className="pipeline-packet hidden md:block" />
      <ol
        className="relative grid gap-6 md:gap-4"
        style={{ "--cols": c.pipeline.length } as React.CSSProperties}
        data-pipeline
      >
        {c.pipeline.map((step, i) => (
          <motion.li
            key={step.label}
            className="flex gap-4 md:flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, root }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.1 }}
          >
            <span
              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                i === 0 || i === c.pipeline.length - 1 ? "border-lime bg-lime text-black" : "border-white/20 bg-[#05070d] text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="font-display text-lg leading-tight text-white">{step.label}</div>
              <div className="mt-1 text-sm text-white/50">{step.detail}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Page ---------- */

function CasePage({ c, scroller }: { c: Case; scroller: React.RefObject<HTMLDivElement> }) {
  const idx = CASES.findIndex((x) => x.slug === c.slug);
  const next = CASES[(idx + 1) % CASES.length];
  const { scrollYProgress } = useScroll({ container: scroller });
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const lime = c.accent === "lime";
  const root = scroller;
  const deep = DEEP_DIVES[c.slug];
  const shot = PROJECTS.find((p) => p.title === c.title)?.shot;
  const pitch = deep?.blocks.find((b) => b.type === "video");

  return (
    <article>
      <motion.div style={{ scaleX: scrollYProgress }} className="sticky top-0 z-30 h-[2px] origin-left bg-lime" />
      {/* Hero */}
      <header className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden px-4 pb-12 pt-28 md:px-10 md:pb-16">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <div
            className="absolute inset-0"
            style={{
              background: lime
                ? "radial-gradient(90% 70% at 80% 10%, rgba(212,255,36,.45), transparent 60%), radial-gradient(80% 80% at 0% 100%, rgba(21,88,201,.75), transparent 60%), #030407"
                : "radial-gradient(90% 70% at 20% 0%, rgba(77,138,240,.75), transparent 60%), radial-gradient(70% 70% at 100% 100%, rgba(212,255,36,.25), transparent 60%), #030407",
            }}
          />
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className={`project-orb ${lime ? "bg-lime/50" : "bg-cobalt-light/60"}`} />
          {shot && (
            <motion.div
              className="case-hero-shot absolute left-[6%] right-[-30%] top-[13%] opacity-60 md:left-auto md:right-[-4%] md:top-[12%] md:w-[54vw] md:max-w-[920px] md:opacity-90"
              initial={{ opacity: 0, y: 60, rotateY: -30 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            >
              <BrowserFrame src={shot} url={c.demo} eager />
            </motion.div>
          )}
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030407] to-transparent" />

        <div className="relative mx-auto w-full max-w-[1600px]">
          <motion.div
            className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          >
            Case study {String(idx + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}
            {deep && <span className="ml-3 rounded-full bg-lime px-2.5 py-1 text-black">Deep dive</span>}
          </motion.div>
          <h1 className="overflow-hidden font-display text-[clamp(3.5rem,16vw,15rem)] uppercase leading-[0.82] tracking-[-0.05em] text-white">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
            >
              {c.title}
            </motion.span>
          </h1>
          <motion.div
            className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          >
            <p className="max-w-xl text-2xl text-white md:text-3xl">{c.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {pitch && (
                <Magnetic>
                  <button
                    onClick={playPitch}
                    data-cursor="Watch"
                    className="group flex items-center gap-3 rounded-full bg-white px-6 py-4 font-medium text-black transition-colors hover:bg-lime"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-white">
                      <Play size={11} className="ml-0.5" fill="currentColor" />
                    </span>
                    Watch the pitch
                  </button>
                </Magnetic>
              )}
              {c.demo && (
                <Magnetic>
                  <a href={c.demo} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-full bg-lime px-6 py-4 font-medium text-black">
                    Live demo <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
                  </a>
                </Magnetic>
              )}
              {c.code && (
                <Magnetic>
                  <a
                    href={c.code}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-4 font-medium text-white backdrop-blur-md hover:border-white/40"
                  >
                    <Github size={18} /> Source
                  </a>
                </Magnetic>
              )}
              {deep && (
                <Magnetic>
                  <a
                    href={deep.readme}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-4 font-medium text-white backdrop-blur-md hover:border-white/40"
                  >
                    README <ArrowUpRight size={18} />
                  </a>
                </Magnetic>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {deep ? (
        <div className="mx-auto grid max-w-[1600px] gap-12 px-4 md:px-10 xl:grid-cols-[220px_minmax(0,1fr)]">
          <DeepDiveToc blocks={deep.blocks} root={root} />
          <div className="min-w-0">
            <DeepDiveBlocks blocks={deep.blocks} root={root} />
            <a
              href={deep.readme}
              target="_blank"
              rel="noreferrer"
              className="group mb-24 flex items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-lime md:p-12"
            >
              <span>
                <span className="block font-mono text-xs uppercase tracking-[0.3em] text-white/55">Go deeper</span>
                <span className="mt-3 block font-display text-3xl text-white md:text-5xl">Read the full README on GitHub</span>
              </span>
              <ArrowUpRight size={40} className="shrink-0 text-white transition-transform duration-500 group-hover:rotate-45 group-hover:text-lime" />
            </a>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1600px] px-4 md:px-10">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
            {c.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="bg-[#05070d] p-6 md:p-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, root }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
              >
                <div className={`font-display text-4xl md:text-6xl ${i === 0 ? "text-lime" : "text-white"}`}>{m.value}</div>
                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{m.label}</div>
              </motion.div>
            ))}
          </div>
  
          {/* Overview */}
          <section className="grid gap-10 py-24 md:grid-cols-[0.6fr_1.4fr] md:py-32">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-lime">Overview</div>
            <motion.p
              className="font-display text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.15] text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root }}
              transition={{ duration: 1, ease: EASE }}
            >
              {c.summary}
            </motion.p>
          </section>
  
          {/* Pipeline */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 md:p-12">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display text-3xl text-white md:text-5xl">{c.pipelineTitle}</h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">{c.pipeline.length} stages</span>
            </div>
            <Pipeline c={c} root={scroller} />
          </section>
  
          {/* Deep dives */}
          <section className="py-24 md:py-32">
            {c.sections.map((s, i) => (
              <motion.div
                key={s.heading}
                className="grid gap-6 border-t border-white/10 py-12 md:grid-cols-[0.6fr_1.4fr] md:gap-10"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, root, margin: "-10% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div>
                  <span className="font-mono text-xs text-lime">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">{s.heading}</h3>
                </div>
                <ul className="space-y-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-4 text-lg text-white/70">
                      <ArrowUpRight size={18} className="mt-1.5 shrink-0 text-cobalt-light" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </section>
  
          {/* Stack */}
          <section className="pb-24">
            <div className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/50">Built with</div>
            <div className="flex flex-wrap gap-3">
              {c.stack.map((s, i) => (
                <motion.span
                  key={s}
                  className="rounded-full border border-white/15 px-5 py-2.5 font-display text-lg text-white transition-colors hover:border-lime hover:bg-lime hover:text-black md:text-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, root }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Next */}
      <button
        onClick={() => openCase(next.slug)}
        data-cursor="Next"
        className="group relative block w-full overflow-hidden border-t border-white/10 px-4 py-20 text-left md:px-10 md:py-32"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-lime transition-transform duration-700 ease-expo group-hover:scale-y-100" />
        <span className="relative mx-auto block max-w-[1600px]">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 transition-colors group-hover:text-black/60">Next case</span>
          <span className="mt-4 flex items-center justify-between gap-6">
            <span className="font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-none tracking-[-0.04em] text-white transition-colors group-hover:text-black">
              {next.title}
            </span>
            <ArrowRight className="shrink-0 text-white transition-all duration-700 group-hover:translate-x-4 group-hover:text-black" size={64} />
          </span>
        </span>
      </button>
    </article>
  );
}

/** Top-bar controls: copy a shareable link, and step to the previous / next case study. */
function CaseNav({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const i = CASES.findIndex((x) => x.slug === slug);
  const n = CASES.length;
  const prev = CASES[(i + n - 1) % n];
  const next = CASES[(i + 1) % n];
  const pill = "rounded-full border border-white/15 bg-black/50 backdrop-blur-xl";

  const copy = () => {
    void navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const step = (target: (typeof CASES)[number], dirLabel: string, icon: React.ReactNode) => (
    <Peek
      side="bottom"
      width={220}
      content={
        <div>
          <PeekLabel>{dirLabel} · ← → keys</PeekLabel>
          <div className="mt-1 font-display text-base text-white">{target.title}</div>
          <div className="text-xs text-white/60">{target.tagline}</div>
        </div>
      }
    >
      <button
        onClick={() => openCase(target.slug)}
        aria-label={`${dirLabel} case study: ${target.title}`}
        className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        {icon}
      </button>
    </Peek>
  );

  return (
    <div className="flex items-center gap-2">
      <button onClick={copy} className={`${pill} flex h-12 items-center gap-2 px-4 text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white`}>
        {copied ? <Check size={15} className="text-lime" /> : <Link2 size={15} />}
        <span className="hidden sm:inline">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      <div className={`${pill} flex h-12 items-center px-1`}>
        {step(prev, "Previous", <ArrowLeft size={16} />)}
        <span className="hidden px-2 font-mono text-[11px] tabular-nums text-white/60 md:block">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        {step(next, "Next", <ArrowRight size={16} />)}
      </div>
    </div>
  );
}

export function CaseStudyOverlay({ slug }: { slug: string | null }) {
  const scroller = useRef<HTMLDivElement>(null);
  const c = slug ? caseBySlug(slug) : undefined;

  useEffect(() => {
    if (!c) return;
    setScrollLocked(true);
    document.documentElement.classList.add("case-open");
    sfx.open();
    scroller.current?.scrollTo({ top: 0 });
    return undefined;
  }, [c]);

  // Esc closes; ← / → flip between case studies (unless typing or using the video player).
  useEffect(() => {
    if (!c) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeCase();
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable], .pitch-player, [role=slider]")) return;
      const i = CASES.findIndex((x) => x.slug === c.slug);
      const n = CASES.length;
      openCase(CASES[(i + (e.key === "ArrowRight" ? 1 : n - 1)) % n].slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [c]);

  useFocusTrap(!!c, scroller);

  useEffect(() => {
    if (!slug) {
      setScrollLocked(false);
      // Let the closing curtain finish before the page underneath paints again.
      const id = setTimeout(() => document.documentElement.classList.remove("case-open"), 50);
      return () => clearTimeout(id);
    }
  }, [slug]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => sfx.close()}>
      {c && (
        <motion.div key={c.slug} className="fixed inset-0 z-[200]" initial="hidden" animate="shown" exit="hidden">
          {/* curtain layers */}
          <motion.div
            className="absolute inset-0 bg-lime"
            variants={{
              hidden: { clipPath: "inset(100% 0 0 0)" },
              shown: { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0 0 100% 0)"], transition: { duration: 1.3, ease: CURTAIN, times: [0, 0.45, 1] } },
            }}
          />
          <motion.div
            ref={scroller}
            data-lenis-prevent
            className="absolute inset-0 overflow-y-auto overscroll-contain bg-[#030407]"
            variants={{
              hidden: { clipPath: "inset(100% 0 0 0)", transition: { duration: 0.8, ease: CURTAIN } },
              shown: { clipPath: "inset(0% 0 0 0)", transition: { duration: 0.9, ease: CURTAIN, delay: 0.25 } },
            }}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 md:px-10">
              <Magnetic>
                <button
                  onClick={closeCase}
                  data-cursor="Back"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-5 py-3 text-sm text-white backdrop-blur-xl hover:border-white/40"
                >
                  <ArrowLeft size={16} /> Back to work
                </button>
              </Magnetic>
              <CaseNav slug={c.slug} />
            </div>
            <div className="-mt-[72px]">
              <CasePage c={c} scroller={scroller} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CaseStudyOverlay;
