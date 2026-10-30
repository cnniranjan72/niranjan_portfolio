import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE } from "./data";
import { openResume } from "./Resume";
import { Magnetic, RevealLines, SectionLabel, scrollToId } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Giant footer wordmark whose letters spring away from the cursor. */
function Wordmark({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = text.split("").map(() => ({ y: 0, r: 0, vy: 0, vr: 0 }));
    const ptr = { x: -1e4, y: -1e4 };
    let raf = 0;

    const tick = () => {
      let moving = false;
      const radius = el.clientWidth * 0.22;
      letters.current.forEach((l, i) => {
        if (!l) return;
        const cx = l.offsetLeft + l.offsetWidth / 2;
        const cy = l.offsetTop + l.offsetHeight / 2;
        const dx = cx - ptr.x;
        const force = Math.max(0, 1 - Math.hypot(dx, cy - ptr.y) / radius);
        const s = state[i];
        s.vy += (-force * l.offsetHeight * 0.32 - s.y) * 0.14;
        s.vr += ((dx < 0 ? -1 : 1) * force * 14 - s.r) * 0.14;
        s.vy *= 0.74;
        s.vr *= 0.74;
        s.y += s.vy;
        s.r += s.vr;
        if (Math.abs(s.vy) > 0.05 || Math.abs(s.y) > 0.3 || force > 0) moving = true;
        l.style.transform = `translate3d(0, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(2)}deg)`;
        l.style.color = force > 0.02 ? `rgba(212, 255, 36, ${(0.08 + force * 0.85).toFixed(3)})` : "";
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      wake();
    };
    const leave = () => {
      ptr.x = ptr.y = -1e4;
      wake();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [text]);

  return (
    <div aria-hidden className="select-none overflow-hidden" data-cursor="Hi">
      <div
        ref={wrap}
        className="relative translate-y-[18%] whitespace-nowrap text-center font-display text-[22vw] uppercase leading-none tracking-[-0.05em] text-white/[0.06]"
      >
        {text.split("").map((ch, i) => (
          <span key={i} ref={(n) => (letters.current[i] = n)} className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const socials = [
    { label: "GitHub", href: PROFILE.github, onClick: undefined as (() => void) | undefined },
    { label: "LinkedIn", href: PROFILE.linkedin },
    { label: "Resume", href: PROFILE.resumePdf, onClick: openResume },
    { label: "Email", href: `mailto:${PROFILE.email}` },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10">
      <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-28 md:px-10 md:pt-40">
        <SectionLabel index="05">Contact</SectionLabel>
        <h2 className="mt-10 font-display text-[clamp(3.5rem,13vw,14rem)] uppercase leading-[0.82] tracking-[-0.05em] text-white">
          <RevealLines lines={["Let's build", <span className="text-lime">something</span>, <span className="text-outline">insane.</span>]} />
        </h2>

        <motion.div
          className="mt-16 flex flex-col gap-6 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${PROFILE.email}`}
              data-cursor="Say hi"
              className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-lime px-8 py-6 font-display text-xl text-black md:px-12 md:py-8 md:text-3xl"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-white transition-transform duration-700 ease-expo group-hover:translate-y-0" />
              <span className="relative break-all">{PROFILE.email}</span>
              <ArrowUpRight className="relative shrink-0 transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </Magnetic>
          <button
            onClick={copy}
            className="flex w-fit items-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm text-white/80 backdrop-blur-md hover:border-white/40"
          >
            {copied ? <Check size={16} className="text-lime" /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy email"}
          </button>
        </motion.div>

        <div className="mt-28 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[1fr_auto]">
          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!s.onClick) return;
                    e.preventDefault();
                    s.onClick();
                  }}
                  className="link-roll font-display text-2xl text-white md:text-3xl"
                >
                  <span data-text={s.label}>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <Magnetic>
            <button
              onClick={() => scrollToId("hero")}
              aria-label="Back to top"
              className="grid h-16 w-16 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-black"
            >
              <ArrowUp size={20} />
            </button>
          </Magnetic>
        </div>

        <footer className="mt-16 flex flex-col justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 md:flex-row">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Built with React · Three.js · Framer Motion</span>
          <span>{PROFILE.location}</span>
        </footer>
      </div>

      <Wordmark text="Niranjan" />
    </section>
  );
}
