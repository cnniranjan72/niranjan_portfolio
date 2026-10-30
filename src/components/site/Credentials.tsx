import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, Languages } from "lucide-react";
import { CREDENTIALS, LANGUAGES } from "./data";
import { RevealLines, SectionLabel } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Card with a holographic foil sheen and tilt that follow the pointer. */
function HoloCard({ children, className = "", index }: { children: React.ReactNode; className?: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    el.style.setProperty("--hue", `${Math.round(px * 140 + py * 80)}deg`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.div
      className="[perspective:1200px]"
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`holo-card group ${className}`}>
        <span className="holo-foil" aria-hidden />
        <span className="holo-shine" aria-hidden />
        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}

export function Credentials() {
  return (
    <section id="credentials" className="relative mx-auto max-w-[1600px] px-4 pb-28 md:px-10 md:pb-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index="—">Credentials</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-white">
            <RevealLines lines={["Certified", <span className="text-outline">& fluent</span>]} />
          </h2>
        </div>
        <p className="max-w-sm text-white/55">Certifications from Anthropic, AWS and MongoDB — and four languages for working with teams across India.</p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CREDENTIALS.map((c, i) => (
          <HoloCard key={c.title} index={i} className={c.tone === "lime" ? "holo-lime" : "holo-cobalt"}>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">{c.issuer}</span>
              <Award size={20} className={c.tone === "lime" ? "text-lime" : "text-cobalt-light"} />
            </div>
            <h3 className="mt-10 min-h-[3.5rem] font-display text-2xl leading-tight text-white md:text-[1.7rem]">{c.title}</h3>
            <div className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
              <span>Certificate</span>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>
          </HoloCard>
        ))}

        <HoloCard index={CREDENTIALS.length} className="holo-lime">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Speaks</span>
            <Languages size={20} className="text-lime" />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <span key={l} className="rounded-full bg-white/[0.06] px-4 py-2 font-display text-lg text-white transition-colors group-hover:bg-white/[0.1]">
                {l}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
            <span>Languages</span>
            <span>{String(LANGUAGES.length).padStart(2, "0")}</span>
          </div>
        </HoloCard>
      </div>
    </section>
  );
}
