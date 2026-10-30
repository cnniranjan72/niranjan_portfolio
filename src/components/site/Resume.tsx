import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { PROFILE } from "./data";
import { setScrollLocked } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Open the résumé: an in-site viewer on desktop, the PDF itself on phones (embedded PDFs render poorly there). */
export function openResume() {
  const coarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  if (coarse) window.open(PROFILE.resumePdf, "_blank", "noopener,noreferrer");
  else window.dispatchEvent(new CustomEvent("open-resume"));
}

export function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-resume", onOpen);
    return () => window.removeEventListener("open-resume", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [open]);

  return (
    <AnimatePresence onExitComplete={() => setLoaded(false)}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
        >
          <motion.div
            className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070a12] shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-black">
                <FileText size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg text-white">Résumé — {PROFILE.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">PDF · one page</div>
              </div>
              <a
                href={PROFILE.resumePdf}
                download="NiranjanCN-Resume.pdf"
                className="flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-medium text-black"
              >
                <Download size={15} /> Download
              </a>
              <a
                href={PROFILE.resumePdf}
                target="_blank"
                rel="noreferrer"
                aria-label="Open in new tab"
                className="hidden h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 hover:border-white/40 hover:text-white sm:grid"
              >
                <ExternalLink size={15} />
              </a>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close résumé"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 hover:border-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative flex-1 bg-[#1a1d24]">
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime" />
                </div>
              )}
              <iframe
                title="Résumé PDF"
                src={`${PROFILE.resumePdf}#view=FitH&toolbar=0`}
                className="h-full w-full"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
