import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { EDUCATION, EXPERIENCE, FOCUS, STATS } from "./data";
import { Counter, RevealLines, SectionLabel } from "./primitives";
import { SkillPeek, StatPeek } from "./peeks";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- About ---------- */

const STATEMENT =
  "I engineer production-grade full-stack and AI systems — RAG pipelines, vector search, and reinforcement-learning simulations — for aviation and enterprise teams that can't afford downtime.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const highlight = /RAG|vector|reinforcement-learning|aviation|enterprise/i.test(children);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${highlight ? "text-lime" : ""}`}>
      {children}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="about" className="relative mx-auto max-w-[1600px] px-4 py-28 md:px-10 md:py-40">
      <SectionLabel index="01">About</SectionLabel>

      <p ref={ref} className="relative mt-10 font-display text-[clamp(1.9rem,4.6vw,4.6rem)] leading-[1.05] tracking-[-0.02em] text-white">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
        {STATS.map((s, i) => (
          <StatPeek key={s.label} label={s.label}>
          <motion.div
            tabIndex={0}
            className="group relative cursor-default bg-[#05070d] p-6 outline-none transition-colors hover:bg-[#080c18] focus-visible:bg-[#080c18] md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
          >
            <div className="font-display text-5xl text-white md:text-7xl">
              <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">{s.label}</div>
            <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-700 group-hover:scale-x-100" />
          </motion.div>
          </StatPeek>
        ))}
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <h2 className="font-display text-4xl leading-none text-white md:text-6xl">
          <RevealLines lines={["What I", <span className="text-outline">focus on</span>]} />
        </h2>
        <ul className="border-t border-white/10">
          {FOCUS.map((f, i) => (
            <motion.li
              key={f.title}
              className="group relative grid cursor-default grid-cols-[3rem_1fr] gap-4 overflow-hidden border-b border-white/10 py-7 md:grid-cols-[4rem_1fr_1.3fr] md:items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-lime transition-transform duration-500 ease-expo group-hover:scale-y-100" />
              <span className="relative font-mono text-xs text-lime transition-colors group-hover:text-black">0{i + 1}</span>
              <span className="relative font-display text-2xl text-white transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-black md:text-3xl">
                {f.title}
              </span>
              <span className="relative col-start-2 text-white/55 transition-colors group-hover:text-black/70 md:col-start-auto">
                {f.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Experience ---------- */

/** Cards pin and stack as you scroll; earlier ones shrink and dim beneath the newest. */
function StackCard({ i, n, progress, stack, children }: { i: number; n: number; progress: MotionValue<number>; stack: boolean; children: React.ReactNode }) {
  const depth = n - 1 - i;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - depth * 0.05]);
  const filter = useTransform(progress, [i / n, 1], ["brightness(1)", `brightness(${1 - depth * 0.22})`]);
  if (!stack) return <div className="mb-6">{children}</div>;
  return (
    <div className="sticky mb-[14vh] last:mb-0" style={{ top: `calc(7rem + ${i * 28}px)` }}>
      <motion.div style={{ scale, filter, transformOrigin: "top center" }}>{children}</motion.div>
    </div>
  );
}

function useStacking() {
  const query = "(min-width: 1024px) and (min-height: 760px)";
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return on;
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const stack = useStacking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const { scrollYProgress: stackProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative mx-auto max-w-[1600px] px-4 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="02">Experience</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] uppercase leading-[0.88] tracking-[-0.03em] text-white">
            <RevealLines lines={["Where", "I've", <span className="text-lime">shipped</span>]} />
          </h2>
          <p className="mt-8 max-w-sm text-white/55">
            From aviation weather briefings used by pilots and ATC, to enterprise RAG platforms with full observability.
          </p>
        </div>

        <div ref={ref} className="relative pl-8 md:pl-14">
          <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
          <motion.div style={{ scaleY: lineScale }} className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-lime via-cobalt-light to-cobalt" />

          {EXPERIENCE.map((x, i) => (
            <StackCard key={x.role + x.period} i={i} n={EXPERIENCE.length} progress={stackProgress} stack={stack}>
              <motion.article
                className="group relative rounded-3xl border border-white/10 bg-[#080b14] p-6 transition-colors duration-500 hover:border-white/25 md:p-10"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1, ease: EASE }}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <span className="spotlight" />
                <span className="absolute -left-8 top-12 grid h-4 w-4 -translate-x-1/2 place-items-center md:-left-14">
                  <span className={`h-3 w-3 rounded-full ring-4 ring-[#030407] ${x.current ? "bg-lime" : "bg-cobalt-light"}`} />
                  {x.current && <span className="absolute h-3 w-3 animate-ping rounded-full bg-lime/60" />}
                </span>

                <div className="relative flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                  <span>{x.period}</span>
                  <span className="flex items-center gap-2">
                    {x.current && <span className="rounded-full bg-lime px-2 py-0.5 text-black">Now</span>}
                    {x.location}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-2xl text-white md:text-4xl">{x.role}</h3>
                <p className="relative mt-1 text-lg text-lime">{x.company}</p>
                <ul className="relative mt-6 space-y-3">
                  {x.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-white/65">
                      <ArrowUpRight size={16} className="mt-1 shrink-0 text-cobalt-light" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="relative mt-7 flex flex-wrap gap-2">
                  {x.stack.map((s) => (
                    <SkillPeek key={s} skill={s}>
                      <span
                        tabIndex={0}
                        className="cursor-default rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 outline-none transition-colors hover:border-lime hover:text-lime focus-visible:border-lime focus-visible:text-lime data-[state=open]:border-lime data-[state=open]:text-lime"
                      >
                        {s}
                      </span>
                    </SkillPeek>
                  ))}
                </div>
                <span className="pointer-events-none absolute right-6 top-6 font-display text-7xl text-white/[0.04] md:text-9xl">
                  0{EXPERIENCE.length - i}
                </span>
              </motion.article>
            </StackCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Education ---------- */

export function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-[1600px] px-4 pb-28 md:px-10 md:pb-40">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cobalt/30 via-[#060a16] to-[#030407] p-8 md:p-14"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cobalt/40 blur-[100px]" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <SectionLabel index="—">Education</SectionLabel>
            <div className="mt-8 flex items-start gap-5">
              <GraduationCap className="mt-2 shrink-0 text-lime" size={36} />
              <div>
                <h3 className="font-display text-3xl text-white md:text-5xl">{EDUCATION.degree}</h3>
                <p className="mt-2 text-lg text-white/60">{EDUCATION.institution}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 md:justify-end">
            <div>
              <div className="font-display text-6xl text-lime md:text-8xl">
                <Counter to={Number(EDUCATION.cgpa)} decimals={1} />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">CGPA</div>
            </div>
            <div>
              <div className="font-display text-6xl text-white md:text-8xl">'27</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">{EDUCATION.period}</div>
            </div>
          </div>
        </div>
        <div className="relative mt-12 flex flex-wrap gap-2">
          {EDUCATION.coursework.map((c, i) => (
            <motion.span
              key={c}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-colors hover:border-lime hover:text-lime"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
