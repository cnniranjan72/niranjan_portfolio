import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { caseForTitle } from "./cases";
import { openCase } from "./caseRoute";
import { BrowserFrame } from "./BrowserFrame";
import { SkillPeek } from "./peeks";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { PROJECT_FILTERS, PROJECTS, Project, SKILL_GROUPS, SPHERE_SKILLS } from "./data";
import { RevealLines, SectionLabel, prefersReducedMotion } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Skill sphere (CSS 3D, drag to spin) ---------- */

function SkillSphere() {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);

  const points = useMemo(() => {
    const n = SPHERE_SKILLS.length;
    return SPHERE_SKILLS.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * Math.sin(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(phi) };
    });
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let ax = 0.4;
    let ay = 0;
    let vx = 0.0012;
    let vy = 0.004;
    let dragging = false;
    let last = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    const reduced = prefersReducedMotion();

    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      vy = (e.clientX - last.x) * 0.0009;
      vx = -(e.clientY - last.y) * 0.0009;
      last = { x: e.clientX, y: e.clientY };
    };
    const up = () => (dragging = false);

    const render = () => {
      const R = el.clientWidth * 0.4;
      if (!reduced) {
        ax += vx;
        ay += vy;
      }
      if (!dragging) {
        vx += (0.0012 - vx) * 0.02;
        vy += (0.004 - vy) * 0.02;
      }
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      points.forEach((p, i) => {
        const node = items.current[i];
        if (!node) return;
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        const scale = 0.55 + depth * 0.75;
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${scale})`;
        node.style.opacity = String(0.15 + depth * 0.85);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 6}px)` : "none";
      });
      if (visible) raf = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(render);
    });
    io.observe(el);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [points]);

  return (
    <div
      ref={wrap}
      data-cursor="Drag"
      className="relative mx-auto aspect-square w-full max-w-[560px] cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div className="absolute inset-[12%] rounded-full bg-cobalt/20 blur-[80px]" />
      <div className="absolute inset-[8%] rounded-full border border-white/5" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-white/10 sphere-spin" />
      <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime font-display text-sm uppercase text-black shadow-[0_0_80px_rgba(212,255,36,0.45)]">
        Stack
      </div>
      {SPHERE_SKILLS.map((s, i) => (
        <span
          key={s}
          ref={(el) => (items.current[i] = el)}
          className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs will-change-transform md:text-sm ${
            i % 5 === 0 ? "border-lime/50 bg-lime/10 text-lime" : "border-white/15 bg-black/60 text-white"
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-4 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel index="03">Stack</SectionLabel>
            <h2 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] uppercase leading-[0.88] tracking-[-0.03em] text-white">
              <RevealLines lines={["Tools of", <span className="text-outline">the craft</span>]} />
            </h2>
            <p className="mt-8 max-w-md text-white/55">
              A stack tuned for shipping — from typed frontends and async Python backends to vector stores, RL and cloud infra.
            </p>

            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {SKILL_GROUPS.map((g, i) => (
                <motion.div
                  key={g.title}
                  className="group bg-[#05070d] p-6 transition-colors hover:bg-[#081022]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.8 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-xl text-white">{g.title}</h3>
                    <span className="font-mono text-[10px] text-white/55 group-hover:text-lime">{String(g.skills.length).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.skills.map((s) => (
                      <SkillPeek key={s} skill={s}>
                        <span
                          tabIndex={0}
                          className="cursor-default rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/65 outline-none transition-colors hover:bg-lime hover:text-black focus-visible:bg-lime focus-visible:text-black data-[state=open]:bg-lime data-[state=open]:text-black"
                        >
                          {s}
                        </span>
                      </SkillPeek>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <SkillSphere />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */

function ProjectArt({ p, index }: { p: Project; index: number }) {
  const lime = p.accent === "lime";
  return (
    <div className="project-art absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: lime
            ? "radial-gradient(120% 90% at 85% 10%, rgba(212,255,36,.55), transparent 55%), radial-gradient(90% 80% at 10% 100%, rgba(21,88,201,.7), transparent 60%), #05070d"
            : "radial-gradient(120% 90% at 15% 0%, rgba(77,138,240,.75), transparent 55%), radial-gradient(80% 70% at 100% 100%, rgba(212,255,36,.28), transparent 60%), #05070d",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className={`project-orb ${lime ? "bg-lime/60" : "bg-cobalt-light/70"}`} />
      <span className="absolute -bottom-[0.18em] -right-[0.04em] font-display text-[11rem] leading-none text-white/[0.07] md:text-[15rem]">
        {String(index + 1).padStart(2, "0")}
      </span>
      {p.shot && (
        <div className="project-shot absolute left-[9%] right-[-8%] top-[30%] bottom-[-14%]">
          <BrowserFrame src={p.shot} url={p.demo} video={p.video} className="h-full" />
        </div>
      )}
      <span
        className={`absolute left-6 top-6 font-display uppercase leading-none tracking-[-0.03em] text-white md:left-8 md:top-8 ${
          p.shot ? "text-4xl md:text-6xl" : "text-5xl md:text-7xl"
        }`}
      >
        {p.title}
      </span>
    </div>
  );
}

function FeaturedCard({ p, index, rail = false }: { p: Project; index: number; rail?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const cs = caseForTitle(p.title);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const art = (
    <>
      <ProjectArt p={p} index={index} />
      <span className="tilt-glare" />
      {p.metric && (
        <span className="absolute bottom-6 left-6 rounded-full bg-black/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-lime backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0 md:bottom-8 md:left-8">
          {p.metric}
        </span>
      )}
      {cs && (
        <span className="absolute bottom-6 right-6 hidden rounded-full border border-white/20 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0 md:bottom-8 md:right-8 md:block">
          Deep dive
        </span>
      )}
      {/* Hover reveal: the stack slides up over the screenshot */}
      <span className="peek-panel pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full p-6 transition-transform duration-500 ease-expo group-hover:translate-y-0 md:block md:p-8">
        <span className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
          <span>{p.metric ?? p.tagline}</span>
          <span className="text-lime">{cs ? "Click to explore →" : p.demo ? "Open live demo →" : "View source →"}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {p.tags.slice(0, 7).map((t, k) => (
            <span
              key={t}
              className="peek-tag rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md"
              style={{ transitionDelay: `${120 + k * 35}ms` }}
            >
              {t}
            </span>
          ))}
        </span>
      </span>
      <span className="absolute right-6 top-6 grid h-14 w-14 scale-0 place-items-center rounded-full bg-white text-black transition-transform duration-500 ease-expo group-hover:scale-100 md:right-8 md:top-8">
        <ArrowUpRight size={22} />
      </span>
    </>
  );
  const artClass = `relative block w-full overflow-hidden rounded-[1.75rem] border border-white/10 text-left ${rail ? "aspect-[1.35]" : "aspect-[4/3.2]"}`;
  const link = p.demo ?? p.code;

  return (
    <motion.div
      className={`[perspective:1400px] ${rail ? "w-[min(80vw,calc(54vh*1.35))] shrink-0" : ""}`}
      initial={rail ? false : { opacity: 0, y: 100 }}
      whileInView={rail ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") void ref.current?.querySelector<HTMLVideoElement>(".frame-video")?.play().catch(() => undefined);
        }}
        onPointerLeave={() => {
          onLeave();
          ref.current?.querySelector<HTMLVideoElement>(".frame-video")?.pause();
        }}
        className="tilt-card group"
      >
        {cs ? (
          <button onClick={() => openCase(cs.slug)} data-cursor="Case study" className={artClass}>
            {art}
          </button>
        ) : (
          <a href={link ?? "#"} target={link ? "_blank" : undefined} rel="noreferrer" data-cursor={p.demo ? "Live" : "Code"} className={artClass}>
            {art}
          </a>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="font-display text-2xl text-white md:text-3xl">
            {p.title} <span className="text-white/55">— {p.tagline}</span>
          </h3>
          <p className={`mt-2 max-w-xl text-white/55 ${rail ? "line-clamp-2" : ""}`}>{p.description}</p>
          {cs && (
            <button
              onClick={() => openCase(cs.slug)}
              className="group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-lime"
            >
              Explore the deep dive
              <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          )}
          {!rail && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/55">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-3 text-white/50">
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`} className="hover:text-lime">
              <ArrowUpRight size={22} />
            </a>
          )}
          {p.code && (
            <a href={p.code} target="_blank" rel="noreferrer" aria-label={`${p.title} source`} className="hover:text-lime">
              <Github size={22} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function useIsWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/** Pinned section: vertical scroll drives the featured cards sideways. */
function FeaturedRail({ featured }: { featured: Project[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dist = useMotionValue(0);
  const [height, setHeight] = useState("300vh");
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, dist], ([v, d]: number[]) => -v * d);
  const smoothX = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Coalesce resize notifications into one layout read per frame.
    let frame = 0;
    const measure = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const d = Math.max(el.scrollWidth - window.innerWidth, 0);
        if (d === dist.get()) return;
        dist.set(d);
        setHeight(`${window.innerHeight + d}px`);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dist]);

  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(featured.length - 1, Math.round(v * (featured.length - 1)))));

  return (
    <div ref={outer} style={{ height }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x: smoothX }} className="flex w-max items-center gap-10 pl-10 pr-[12vw] will-change-transform">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} p={p} index={i} rail />
          ))}
          <div className="flex w-[34vw] shrink-0 flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/55">Those are the highlights</span>
            <span className="mt-4 font-display text-6xl uppercase leading-[0.9] text-white">
              More in the <span className="text-lime">archive</span>
            </span>
            <span className="mt-6 text-white/50">Scroll on for {PROJECTS.length - featured.length} more builds ↓</span>
          </div>
        </motion.div>

        <div className="absolute inset-x-10 bottom-8 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          <span className="tabular-nums text-white">
            {String(active + 1).padStart(2, "0")} <span className="text-white/55">/ {String(featured.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-white/10">
            <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-lime" />
          </span>
          <span>{featured[active]?.title}</span>
        </div>
      </div>
    </div>
  );
}

const ArchiveRow = forwardRef<HTMLLIElement, { p: Project; onHover: (p: Project | null) => void }>(function ArchiveRow({ p, onHover }, ref) {
  const link = p.demo ?? p.code;
  const Tag = link ? "a" : "div";
  return (
    <motion.li
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(p)}
      onPointerLeave={() => onHover(null)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-b border-white/10"
    >
      <Tag
        {...(link ? { href: link, target: "_blank", rel: "noreferrer" } : {})}
        className="group relative grid grid-cols-[1fr_auto] items-center gap-4 overflow-hidden py-6 md:grid-cols-[1.2fr_1.6fr_1fr_auto] md:py-8"
      >
        <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-white/[0.04] transition-transform duration-700 ease-expo group-hover:scale-x-100" />
        <span className="relative font-display text-2xl text-white transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">{p.title}</span>
        <span className="relative hidden text-white/55 md:block">{p.tagline}</span>
        <span className="relative hidden font-mono text-[11px] text-white/55 md:block">{p.tags.slice(0, 3).join(" · ")}</span>
        <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-black">
          <ArrowUpRight size={18} />
        </span>
      </Tag>
    </motion.li>
  );
});

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<Project | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const py = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const vx = useVelocity(px);
  const tilt = useTransform(vx, [-1500, 0, 1500], [-14, 0, 14], { clamp: true });
  const wide = useIsWide();
  const featured = PROJECTS.filter((p) => p.category.includes("Featured"));
  const archive = PROJECTS.filter((p) => !p.category.includes("Featured")).filter(
    (p) => filter === "All" || p.category.includes(filter)
  );

  return (
    <section id="portfolio" className="relative py-28 md:py-40">
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-8 px-4 md:flex-row md:items-end md:px-10">
        <div>
          <SectionLabel index="04">Selected work</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(3.2rem,10vw,10rem)] uppercase leading-[0.85] tracking-[-0.04em] text-white">
            <RevealLines lines={["Featured", <span className="text-lime">projects</span>]} />
          </h2>
        </div>
        <p className="max-w-sm text-white/55">
          Digital twins, agent control planes and ML platforms — systems built end-to-end, several of them live.
        </p>
      </div>

      {wide ? (
        <div className="mt-10">
          <FeaturedRail featured={featured} />
        </div>
      ) : (
        <div className="mx-auto mt-20 grid max-w-[1600px] gap-y-20 px-4">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} p={p} index={i} />
          ))}
        </div>
      )}

      <div className="mx-auto mt-36 max-w-[1600px] px-4 md:mt-24 md:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <h3 className="font-display text-4xl uppercase text-white md:text-6xl">Archive</h3>
          <div className="flex flex-wrap gap-2">
            {PROJECT_FILTERS.filter((f) => f !== "Featured").map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === f ? "border-lime text-black" : "border-white/15 text-white/70 hover:text-white"
                }`}
              >
                {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </div>
        <ul
          onPointerMove={(e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
          }}
        >
          <AnimatePresence mode="popLayout">
            {archive.map((p) => (
              <ArchiveRow key={p.title} p={p} onHover={setHovered} />
            ))}
          </AnimatePresence>
          {archive.length === 0 && <li className="py-10 text-white/55">More coming soon.</li>}
        </ul>
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[240px] w-[320px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:block"
        style={{ x: px, y: py, rotate: tilt, translateX: "-50%", translateY: "-115%" }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              key={hovered.title}
              className="absolute inset-0 [&_.font-display]:!text-4xl"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ProjectArt p={hovered} index={PROJECTS.indexOf(hovered)} />
              <span className="absolute bottom-4 left-4 right-4 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {hovered.tags.join(" · ")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
