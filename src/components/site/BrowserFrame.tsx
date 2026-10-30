/** A minimal browser window around a product screenshot. */
export function BrowserFrame({
  src,
  url,
  className = "",
  eager = false,
  video,
}: {
  src: string;
  url?: string;
  className?: string;
  eager?: boolean;
  /** Optional muted clip that fades in over the screenshot while it plays. */
  video?: string;
}) {
  const host = url?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className={`browser-frame flex flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0b0e16] shadow-[0_40px_100px_rgba(0,0,0,0.65)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#11151f] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {host && (
          <span className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/50">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            {host}
          </span>
        )}
      </div>
      <div className="browser-frame-view relative min-h-0 flex-1 overflow-hidden">
        <img
          src={src}
          alt={host ? `Screenshot of ${host}` : ""}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="block h-full w-full object-cover object-top"
          draggable={false}
        />
        {video && (
          <video
            src={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="frame-video absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
            onPlaying={(e) => (e.currentTarget.style.opacity = "1")}
            onPause={(e) => (e.currentTarget.style.opacity = "0")}
          />
        )}
      </div>
    </div>
  );
}
