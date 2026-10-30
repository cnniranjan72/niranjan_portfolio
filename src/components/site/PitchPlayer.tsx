import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

export type Chapter = { t: number; label: string };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Ask the pitch player on the current page to play from the start with sound. */
export const playPitch = () => window.dispatchEvent(new CustomEvent("play-pitch"));

export function PitchPlayer({
  src,
  poster,
  title,
  chapters,
  root,
}: {
  src: string;
  poster: string;
  title: string;
  chapters: Chapter[];
  root: RefObject<HTMLDivElement>;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false); // user chose to watch with sound
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverT, setHoverT] = useState<number | null>(null);

  const total = duration || chapters[chapters.length - 1]?.t || 1;
  const active = chapters.reduce((acc, c, i) => (time >= c.t ? i : acc), 0);

  const playWithSound = useCallback((from = 0) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = from;
    v.muted = false;
    setMuted(false);
    setStarted(true);
    void v.play().catch(() => undefined);
  }, []);

  // Muted preview while on screen (until the viewer opts into sound); pause when scrolled away.
  useEffect(() => {
    const v = video.current;
    const el = wrap.current;
    if (!v || !el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!started && !reduced) {
            v.muted = true;
            void v.play().catch(() => undefined);
          }
        } else if (!v.paused) v.pause();
      },
      { root: root.current, threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, started]);

  useEffect(() => {
    const onPlay = () => {
      wrap.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => playWithSound(0), 450);
    };
    window.addEventListener("play-pitch", onPlay);
    return () => window.removeEventListener("play-pitch", onPlay);
  }, [playWithSound]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (!started) return playWithSound(0);
    if (v.paused) void v.play();
    else v.pause();
  };

  const seekFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * total;
  };

  const fullscreen = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.75fr_0.75fr] [&>*]:min-w-0">
      <div className="relative">
        {/* ambient glow */}
        <img src={poster} alt="" aria-hidden className="pointer-events-none absolute inset-x-0 -inset-y-[6%] h-[112%] w-full rounded-[2rem] object-cover opacity-50 blur-3xl" />
        <div
          ref={wrap}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "k") {
              e.preventDefault();
              toggle();
            }
          }}
          className="pitch-player group relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          <video
            ref={video}
            src={src}
            poster={poster}
            playsInline
            muted={muted}
            loop={!started}
            preload="metadata"
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            className="block aspect-video w-full cursor-pointer bg-black"
            aria-label={`${title} demo video`}
          />

          {/* Opt-in overlay over the muted preview */}
          <AnimatePresence>
            {!started && (
              <motion.button
                onClick={() => playWithSound(0)}
                data-cursor="Play"
                className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="flex flex-col items-center gap-4">
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-lime text-black shadow-[0_0_60px_rgba(212,255,36,0.5)] md:h-24 md:w-24">
                    <span className="absolute inset-0 animate-ping rounded-full bg-lime/40 [animation-duration:2s]" />
                    <Play size={30} className="relative ml-1" fill="currentColor" />
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    Play with sound · {fmt(total)}
                  </span>
                </span>
                <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                  <VolumeX size={12} /> Muted preview
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Controls */}
          {started && (
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${
                playing ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-100"
              }`}
            >
              <div
                className="relative h-5 cursor-pointer"
                onPointerMove={(e) => setHoverT(seekFromEvent(e))}
                onPointerLeave={() => setHoverT(null)}
                onPointerDown={(e) => {
                  const v = video.current;
                  if (v) v.currentTime = seekFromEvent(e);
                }}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(total)}
                aria-valuenow={Math.round(time)}
              >
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/20" />
                <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-lime" style={{ width: `${(time / total) * 100}%` }} />
                {chapters.slice(1).map((c) => (
                  <span key={c.t} className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 bg-black/70" style={{ left: `${(c.t / total) * 100}%` }} />
                ))}
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_12px_rgba(212,255,36,0.8)]" style={{ left: `${(time / total) * 100}%` }} />
                {hoverT !== null && (
                  <span
                    className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 font-mono text-[10px] text-white"
                    style={{ left: `${(hoverT / total) * 100}%` }}
                  >
                    {fmt(hoverT)} · {chapters.reduce((acc, c) => (hoverT >= c.t ? c.label : acc), chapters[0].label)}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-white">
                <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
                  {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <span className="font-mono text-xs tabular-nums text-white/80">
                  {fmt(time)} / {fmt(total)}
                </span>
                <span className="hidden truncate text-sm text-white/60 sm:block">· {chapters[active]?.label}</span>
                <button
                  onClick={() => {
                    const v = video.current;
                    if (!v) return;
                    v.muted = !v.muted;
                    setMuted(v.muted);
                  }}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="ml-auto grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={fullscreen} aria-label="Fullscreen" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div className="rounded-[1.5rem] border border-white/10 bg-[#05070d] p-4">
        <div className="mb-3 flex items-center justify-between px-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
          <span>Chapters</span>
          <span>{chapters.length}</span>
        </div>
        <ol className="flex gap-2 overflow-x-auto pb-1 xl:max-h-[440px] xl:flex-col xl:overflow-y-auto" data-lenis-prevent>
          {chapters.map((c, i) => {
            const on = started && i === active;
            return (
              <li key={c.t} className="shrink-0">
                <button
                  onClick={() => playWithSound(c.t)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${on ? "bg-lime/10 text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white"}`}
                >
                  <span className={`font-mono text-[11px] tabular-nums ${on ? "text-lime" : "text-white/55"}`}>{fmt(c.t)}</span>
                  <span className="whitespace-nowrap text-sm xl:whitespace-normal">{c.label}</span>
                  {on && playing && (
                    <span className="ml-auto flex h-3 items-end gap-[2px]">
                      {[0, 1, 2].map((k) => (
                        <span key={k} className="sound-bar w-[2px] rounded-full bg-lime" style={{ animationDelay: `${k * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
