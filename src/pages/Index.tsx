import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Hero, Marquee, Nav } from "@/components/site/Hero";
import { About, Education, Experience } from "@/components/site/Story";
import { Projects, Skills } from "@/components/site/Work";
import { Contact } from "@/components/site/Contact";
import { CommandPalette, GitHubLive } from "@/components/site/Extras";
import { ResumeViewer } from "@/components/site/Resume";
import { Credentials } from "@/components/site/Credentials";
import { SectionRail } from "@/components/site/SectionRail";
import { useCaseRoute } from "@/components/site/caseRoute";
import { Cursor, Grain, Preloader, useSmoothScroll } from "@/components/site/primitives";
import { useSoundEvents } from "@/components/site/sound";

const WorldScene = lazy(() => import("@/components/site/WorldScene"));
const CaseStudyOverlay = lazy(() => import("@/components/site/CaseStudy"));

const MARQUEE_A = ["Full-Stack", "RAG Pipelines", "Digital Twins", "Reinforcement Learning", "Vector Search", "Production Systems"];
const MARQUEE_B = ["React", "FastAPI", "pgvector", "Three.js", "PyTorch", "Flutter", "Redis", "Docker", "Kafka"];

const EASE = [0.16, 1, 0.3, 1] as const;

const Index = () => {
  const [ready, setReady] = useState(false);
  const caseSlug = useCaseRoute();
  useSmoothScroll(ready);
  useSoundEvents();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    document.title = "Niranjan C N — AI & Full-Stack Engineer";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "Portfolio of Niranjan C N — Computer Science engineer building production-grade full-stack and AI systems: RAG pipelines, digital twins and reinforcement learning."
    );
  }, []);

  return (
    <div className="site relative min-h-screen overflow-x-clip bg-[#030407] text-white">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <Cursor />
      <CommandPalette />
      <ResumeViewer />
      <Grain />
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-cobalt via-cobalt-light to-lime" />

      {/* The 3D world: fixed behind everything, the camera flies through it on scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 2, ease: EASE, delay: 0.2 }}
      >
        <Suspense fallback={null}>
          <WorldScene active={!caseSlug} revealed={ready} />
        </Suspense>
      </motion.div>

      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Nav ready={ready} />
      <SectionRail ready={ready} />

      <main id="main" className="relative z-10">
        <Hero ready={ready} />
        <div className="relative z-10 -rotate-2 scale-[1.04]">
          <Marquee items={MARQUEE_A} />
        </div>
        <div className="veil">
          <About />
        </div>
        <div className="veil veil-light">
          <Experience />
          <Education />
          <Credentials />
        </div>
        <div className="relative z-10 rotate-1 scale-[1.04]">
          <Marquee items={MARQUEE_B} reverse tone="cobalt" />
        </div>
        <div className="veil veil-light">
          <Skills />
        </div>
        <Projects />
        <div className="veil veil-light">
          <GitHubLive />
        </div>
        <Contact />
      </main>

      {ready && (
        <Suspense fallback={null}>
          <CaseStudyOverlay slug={caseSlug} />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
