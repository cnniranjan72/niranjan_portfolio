import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import Lenis from "lenis";

/* ---------- Smooth scroll ---------- */

let lenisInstance: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -20 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/* ---------- Focus trap for overlays ---------- */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * While `active`, keep Tab/Shift+Tab inside `ref` and move focus into it; on close, return
 * focus to whatever opened the overlay.
 */
export function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const opener = document.activeElement as HTMLElement | null;
    const items = () => [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.getClientRects().length > 0);
    if (!el.contains(document.activeElement)) (items()[0] ?? el).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const inside = el.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      // Defer: the page under a full-screen overlay is briefly visibility:hidden, and hidden
      // elements cannot take focus.
      if (opener && document.contains(opener)) setTimeout(() => opener.focus({ preventScroll: true }), 150);
    };
  }, [active, ref]);
}

/* ---------- Magnetic wrapper ---------- */

export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Text reveals ---------- */

const EASE = [0.16, 1, 0.3, 1] as const;

export function RevealLines({ lines, className = "", delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <motion.div
      className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <span className="text-lime">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{children}</span>
    </motion.div>
  );
}

export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: EASE, onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Custom cursor ---------- */

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;
    let hovering = false;
    let text = "";

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      const nextText = target?.dataset.cursor ?? "";
      hovering = !!target;
      if (nextText !== text && label.current) {
        text = nextText;
        label.current.textContent = text;
      }
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) {
        const scale = text ? 2.6 : hovering ? 1.8 : 1;
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ring.current.dataset.state = text ? "label" : hovering ? "hover" : "idle";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}

/* ---------- Preloader ---------- */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    // Returning visitors (same browser session) get a brief flash instead of the full count.
    let returning = false;
    try {
      returning = sessionStorage.getItem("nc-seen") === "1";
      sessionStorage.setItem("nc-seen", "1");
    } catch {
      /* storage unavailable */
    }
    const controls = animate(0, 100, {
      duration: prefersReducedMotion() ? 0.2 : returning ? 0.5 : 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setLeaving(true),
    });
    return () => {
      controls.stop();
      root.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-label={`Loading portfolio, ${count}%`}
      className="fixed inset-0 z-[10000] flex flex-col justify-between bg-[#030407] px-6 py-8 md:px-12 md:py-10"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={leaving ? { clipPath: "inset(0 0 100% 0)" } : undefined}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) {
          document.documentElement.style.overflow = "";
          onDone();
        }
      }}
    >
      <div className="flex justify-between font-mono text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Niranjan C N</span>
        <span>Portfolio — 2026</span>
      </div>
      <div className="overflow-hidden">
        <motion.div
          className="font-display text-[clamp(3rem,12vw,11rem)] leading-[0.85] text-white"
          initial={{ y: "100%" }}
          animate={{ y: leaving ? "-100%" : "0%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Loading<span className="text-lime">.</span>
        </motion.div>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="h-px flex-1 bg-white/10">
          <div className="h-px bg-lime" style={{ width: `${count}%` }} />
        </div>
        <span className="font-display text-6xl tabular-nums text-white md:text-8xl">
          {count.toString().padStart(3, "0")}
        </span>
      </div>
    </motion.div>
  );
}

/* ---------- Grain + scroll progress ---------- */

export function Grain() {
  return <div className="grain" aria-hidden />;
}
