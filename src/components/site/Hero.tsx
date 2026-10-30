import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Command as CommandIcon, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { Scramble, openCommandPalette } from "./Extras";
import { useSound } from "./sound";
import { openResume } from "./Resume";
import { NavPeek, SocialPeek } from "./peeks";
import { NAV, PROFILE } from "./data";
import { Magnetic, scrollToId } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Nav ---------- */

// Sections without their own nav item highlight their parent.
const SECTION_TO_NAV: Record<string, string> = { hero: "", education: "experience", github: "portfolio" };

function SoundToggle() {
  const [on, toggle] = useSound();
  return (
    <button
      onClick={toggle}
      data-sound-toggle
      aria-label={on ? "Mute sound" : "Enable sound"}
      aria-pressed={on}
      className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? "sound-bar" : ""}`}
            style={{ height: on ? undefined : "3px", animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? "On" : "Sound"}</span>
    </button>
  );
}

export function Nav({ ready }: { ready: boolean }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Read scroll position at most once per frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(SECTION_TO_NAV[e.target.id] ?? e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    [...NAV.map((n) => n.id), ...Object.keys(SECTION_TO_NAV)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [ready]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-4 py-4 md:px-10"
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
      >
        <button onClick={() => go("hero")} className="group flex items-center gap-2" aria-label="Back to top">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 font-display text-sm text-white backdrop-blur-md transition-colors group-hover:bg-lime group-hover:text-black">
            NC
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-white/60 sm:block">
            Niranjan<span className="text-lime">.</span>dev
          </span>
        </button>

        <nav
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-all duration-500 md:flex ${
            scrolled ? "border-white/10 bg-black/50" : "border-transparent bg-transparent"
          }`}
        >
          {NAV.map((n) => (
            <NavPeek key={n.id} id={n.id}>
            <button
              onClick={() => go(n.id)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                active === n.id ? "text-black" : "text-white/70 hover:text-white"
              }`}
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-lime"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Scramble text={n.label} className="relative" />
            </button>
            </NavPeek>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <button
            onClick={openCommandPalette}
            aria-label="Open command menu"
            className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2.5 font-mono text-[11px] text-white/60 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white lg:flex"
          >
            <CommandIcon size={13} /> K
          </button>
          <Magnetic>
            <a
              href={`mailto:${PROFILE.email}`}
              className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-lime sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col justify-end bg-[#030407]/95 px-6 pb-12 backdrop-blur-2xl md:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                onClick={() => go(n.id)}
                className="flex items-baseline gap-4 border-b border-white/10 py-4 text-left font-display text-5xl text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <span className="font-mono text-xs text-lime">0{i + 1}</span>
                {n.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Local clock ---------- */

function useLocalTime() {
  const fmt = () =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: PROFILE.timezone });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ---------- Hero ---------- */

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % PROFILE.roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={PROFILE.roles[i]}
          className="inline-block whitespace-nowrap text-lime"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {PROFILE.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function BigName({ text, ready, delay, className = "" }: { text: string; ready: boolean; delay: number; className?: string }) {
  return (
    <span className={`flex overflow-hidden ${className}`}>
      <span className="sr-only">{text}</span>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform hover:text-lime"
          initial={{ y: "115%", rotateX: -80 }}
          animate={ready ? { y: "0%", rotateX: 0 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.045 }}
          style={{ transformOrigin: "50% 100%", transition: "color .3s" }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay: d },
  });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
    >
      {/* 3D */}
      <div className="absolute inset-0">
        <div className="hero-glow pointer-events-none" />
        <div className="hero-spot pointer-events-none" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030407]/80 to-transparent" />
      </div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-4 pb-10 pt-28 md:px-10 md:pb-14"
      >
        <motion.div {...fade(0.9)} className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          <span>[ {PROFILE.location} ]</span>
          <span className="tabular-nums">{time} IST</span>
          <span className="hidden sm:inline">Portfolio ©2026</span>
        </motion.div>

        <h1 className="font-display text-[clamp(3.4rem,15.5vw,16rem)] uppercase leading-[0.82] tracking-[-0.04em] text-white [perspective:800px]">
          <BigName text={PROFILE.first} ready={ready} delay={0.3} className="pointer-events-auto" />
          <span className="flex items-end gap-4 md:gap-8">
            <BigName text={PROFILE.last} ready={ready} delay={0.65} className="pointer-events-auto text-outline" />
            <motion.span
              {...fade(1.3)}
              className="mb-[0.18em] hidden max-w-sm font-sans text-base normal-case leading-snug tracking-normal text-white/75 [text-shadow:0_2px_18px_rgba(3,4,7,0.95)] md:block lg:text-lg"
            >
              CS undergraduate building production-grade full-stack & AI-driven systems for aviation and enterprise.
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <motion.p {...fade(1.4)} className="text-2xl text-white md:text-4xl">
            <span className="text-white/55">I'm an </span>
            <RoleRotator />
          </motion.p>

          <motion.div {...fade(1.55)} className="pointer-events-auto flex flex-wrap items-center gap-3 md:pr-20">
            <Magnetic>
              <button
                onClick={() => scrollToId("portfolio")}
                data-cursor="View"
                className="group flex items-center gap-3 rounded-full bg-lime px-7 py-4 font-medium text-black"
              >
                View projects
                <ArrowDownRight className="transition-transform duration-500 group-hover:rotate-[-45deg]" size={18} />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={openResume}
                data-cursor="Read"
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-medium text-white backdrop-blur-md hover:border-white/40"
              >
                Resume
                <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" size={18} />
              </button>
            </Magnetic>
            <div className="flex gap-2">
              {[
                { icon: Github, href: PROFILE.github, label: "GitHub" },
                { icon: Linkedin, href: PROFILE.linkedin, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${PROFILE.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Magnetic key={label} strength={0.5}>
                  <SocialPeek kind={label as "GitHub" | "LinkedIn" | "Email"}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                  >
                    <Icon size={18} />
                  </a>
                  </SocialPeek>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        {...fade(1.9)}
        className="absolute bottom-6 right-4 z-10 hidden flex-col items-center gap-3 md:right-10 lg:flex"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/55">Scroll</span>
        <span className="relative h-16 w-px overflow-hidden bg-white/10">
          <span className="scroll-line absolute inset-x-0 top-0 h-1/2 bg-lime" />
        </span>
      </motion.div>
    </section>
  );
}

/* ---------- Marquee (scroll-velocity driven) ---------- */

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export function Marquee({ items, reverse = false, tone = "lime" }: { items: string[]; reverse?: boolean; tone?: "lime" | "cobalt" }) {
  const base = reverse ? 2.2 : -2.2;
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(smooth, [-2500, 0, 2500], [-8, 0, 8]);
  const dir = useRef(1);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const move = base * dir.current * (delta / 1000) * (1 + Math.abs(f));
    x.set(x.get() + move);
  });

  const row = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden py-5 ${tone === "lime" ? "bg-lime text-black" : "bg-cobalt text-white"}`}>
      <motion.div className="flex shrink-0 items-center will-change-transform" style={{ x: tx, skewX: skew }}>
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-10 pr-10">
            {row.map((it, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-3xl uppercase md:text-5xl">
                {it}
                <span className="text-2xl md:text-3xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
