import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToId } from "./primitives";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "credentials", label: "Credentials" },
  { id: "skills", label: "Stack" },
  { id: "portfolio", label: "Projects" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];

/** Slim vertical index on the right edge: where you are, and a click to jump anywhere. */
export function SectionRail({ ready }: { ready: boolean }) {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-48% 0px -48% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ready]);

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-[58] hidden -translate-y-1/2 xl:block"
      initial={{ opacity: 0, x: 20 }}
      animate={ready ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <ul className="flex flex-col items-end gap-3">
        {SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <button
                onClick={() => scrollToId(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={`rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300 ${
                    on ? "translate-x-0 text-lime opacity-100" : "translate-x-2 text-white/70 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ease-expo ${
                    on ? "w-8 bg-lime shadow-[0_0_12px_rgba(212,255,36,0.7)]" : "w-3 bg-white/30 group-hover:w-5 group-hover:bg-white/70"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
