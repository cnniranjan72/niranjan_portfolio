import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Lost in space — Niranjan C N";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="site relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030407] px-6 text-center text-white">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/30 blur-[120px]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-lime shadow-[0_0_20px_rgba(212,255,36,0.8)]" />
      </motion.div>

      <div className="relative">
        <div className="font-mono text-xs uppercase tracking-[0.35em] text-lime">Error · signal lost</div>
        <h1 className="mt-6 overflow-hidden font-display text-[clamp(7rem,30vw,22rem)] leading-[0.8] tracking-[-0.06em]">
          <motion.span className="block" initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease: EASE }}>
            4<span className="text-outline">0</span>4
          </motion.span>
        </h1>
        <motion.p
          className="mx-auto mt-6 max-w-md text-lg text-white/65"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          <span className="font-mono text-white/80">{location.pathname}</span> drifted out of orbit. The rest of the portfolio is right where you left it.
        </motion.p>
        <motion.a
          href="/"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 font-medium text-black transition-transform hover:-translate-y-0.5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          <ArrowLeft size={18} /> Back to the portfolio
        </motion.a>
      </div>
    </main>
  );
};

export default NotFound;
