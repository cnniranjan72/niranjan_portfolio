import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Flag, Play, RotateCcw, Shuffle } from "lucide-react";

/* ---------- Threat severity calculator ---------- */

const severityColor = (v: number) => {
  // Lime → amber → red as severity climbs.
  const hue = 75 - v * 75;
  return `hsl(${hue}, 95%, ${55 - v * 5}%)`;
};

export function SeverityCalculator({ types }: { types: { label: string; weight: number }[] }) {
  const [p, setP] = useState(0.82);
  const [t, setT] = useState(2);
  const w = types[t].weight;
  const score = 0.7 * p + 0.3 * w;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
      <div className="space-y-8 rounded-[2rem] border border-white/10 bg-[#05070d] p-6 md:p-10">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="sev-p" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              Model probability
            </label>
            <span className="font-display text-2xl text-white tabular-nums">{p.toFixed(2)}</span>
          </div>
          <input
            id="sev-p"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="range-lime mt-4 w-full"
          />
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Mine type · danger weight</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setT(i)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${i === t ? "border-lime bg-lime text-black" : "border-white/15 text-white/70 hover:border-white/40"}`}
              >
                {m.label} <span className="font-mono text-[11px] opacity-60">{m.weight.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white/70">
          severity = 0.7 × <span className="text-white">{p.toFixed(2)}</span> + 0.3 × <span className="text-white">{w.toFixed(2)}</span> ={" "}
          <span className="text-lime">{score.toFixed(3)}</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#05070d] p-8">
        <div className="absolute inset-0 opacity-40 blur-3xl transition-colors duration-500" style={{ background: `radial-gradient(circle at 50% 55%, ${severityColor(score)}, transparent 60%)` }} />
        <svg viewBox="0 0 200 120" className="relative w-full max-w-[320px]" aria-hidden>
          <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
          <motion.path
            d="M20 110 A80 80 0 0 1 180 110"
            fill="none"
            stroke={severityColor(score)}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            animate={{ pathLength: Math.max(score, 0.001) }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </svg>
        <div className="relative -mt-10 text-center">
          <div className="font-display text-6xl tabular-nums text-white">{score.toFixed(2)}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">severity score · 0 – 1</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- A* minefield ---------- */

const COLS = 24;
const ROWS = 14;
const RADIUS = 2.0;
const MINE_WEIGHTS = [0.7, 0.8, 0.95, 1.0];

type Cell = { r: number; c: number };
type Mine = Cell & { w: number };
const key = (r: number, c: number) => r * COLS + c;

function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function randomField(density: number, seed: number, start: Cell, goal: Cell): Mine[] {
  const rnd = seeded(seed);
  const mines: Mine[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const nearEnds = Math.hypot(r - start.r, c - start.c) < 2.2 || Math.hypot(r - goal.r, c - goal.c) < 2.2;
      if (!nearEnds && rnd() < density) mines.push({ r, c, w: MINE_WEIGHTS[Math.floor(rnd() * MINE_WEIGHTS.length)] });
    }
  return mines;
}

function dangerMap(mines: Mine[]) {
  const d = new Float32Array(ROWS * COLS);
  for (const m of mines)
    for (let r = Math.max(0, Math.floor(m.r - RADIUS)); r <= Math.min(ROWS - 1, Math.ceil(m.r + RADIUS)); r++)
      for (let c = Math.max(0, Math.floor(m.c - RADIUS)); c <= Math.min(COLS - 1, Math.ceil(m.c + RADIUS)); c++) {
        const dist = Math.hypot(r - m.r, c - m.c);
        if (dist <= RADIUS) d[key(r, c)] = Math.max(d[key(r, c)], m.w * (1 - dist / (RADIUS + 0.4)));
      }
  return d;
}

/** A* over an 8-connected grid; mine cells are impassable, danger raises step cost. */
function astar(start: Cell, goal: Cell, blocked: Set<number>, danger: Float32Array) {
  const g = new Float64Array(ROWS * COLS).fill(Infinity);
  const came = new Int32Array(ROWS * COLS).fill(-1);
  const closed = new Uint8Array(ROWS * COLS);
  const h = (r: number, c: number) => Math.hypot(r - goal.r, c - goal.c);
  const open: { k: number; f: number }[] = [{ k: key(start.r, start.c), f: h(start.r, start.c) }];
  g[key(start.r, start.c)] = 0;
  let expanded = 0;

  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const { k } = open.splice(bi, 1)[0];
    if (closed[k]) continue;
    closed[k] = 1;
    expanded++;
    const r = Math.floor(k / COLS);
    const c = k % COLS;
    if (r === goal.r && c === goal.c) {
      const path: Cell[] = [];
      for (let n = k; n !== -1; n = came[n]) path.unshift({ r: Math.floor(n / COLS), c: n % COLS });
      return { path, expanded, cost: g[k] };
    }
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS) continue;
        const nk = key(nr, nc);
        if (blocked.has(nk) || closed[nk]) continue;
        // No corner-cutting past a mine.
        if (dr && dc && (blocked.has(key(r, nc)) || blocked.has(key(nr, c)))) continue;
        const step = (dr && dc ? Math.SQRT2 : 1) * (1 + danger[nk] * 14);
        const ng = g[k] + step;
        if (ng < g[nk]) {
          g[nk] = ng;
          came[nk] = k;
          open.push({ k: nk, f: ng + h(nr, nc) });
        }
      }
  }
  return { path: [] as Cell[], expanded, cost: Infinity };
}

export function MinefieldPlanner() {
  const start = useMemo(() => ({ r: Math.floor(ROWS / 2), c: 1 }), []);
  const goal = useMemo(() => ({ r: Math.floor(ROWS / 2), c: COLS - 2 }), []);
  const [density, setDensity] = useState(0.14);
  const [seed, setSeed] = useState(7);
  const [mines, setMines] = useState<Mine[]>(() => randomField(0.14, 7, { r: 7, c: 1 }, { r: 7, c: 22 }));
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const blocked = useMemo(() => new Set(mines.map((m) => key(m.r, m.c))), [mines]);
  const danger = useMemo(() => dangerMap(mines), [mines]);
  const result = useMemo(() => astar(start, goal, blocked, danger), [start, goal, blocked, danger]);
  const onPath = useMemo(() => new Map(result.path.map((p, i) => [key(p.r, p.c), i])), [result.path]);
  const risk = useMemo(() => result.path.reduce((s, p) => s + danger[key(p.r, p.c)], 0), [result.path, danger]);

  const stop = useCallback(() => {
    clearInterval(timer.current);
    setRunning(false);
  }, []);

  const run = useCallback(() => {
    stop();
    if (!result.path.length) return;
    setStep(0);
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setStep(i);
      if (i >= result.path.length - 1) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 90);
  }, [result.path, stop]);

  useEffect(() => () => clearInterval(timer.current), []);

  const regenerate = (d = density, s = seed + 1) => {
    stop();
    setSeed(s);
    setMines(randomField(d, s, start, goal));
    setStep(0);
  };

  const toggle = (r: number, c: number) => {
    if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) return;
    stop();
    setStep(0);
    setMines((ms) => (ms.some((m) => m.r === r && m.c === c) ? ms.filter((m) => !(m.r === r && m.c === c)) : [...ms, { r, c, w: 0.95 }]));
  };

  const robot = result.path[Math.min(step, Math.max(result.path.length - 1, 0))];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={run} className="flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-black">
          {running ? <RotateCcw size={15} /> : <Play size={15} />} {running ? "Restart" : "Deploy robot"}
        </button>
        <button onClick={() => regenerate()} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/40">
          <Shuffle size={15} /> New minefield
        </button>
        <label className="ml-auto flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          Density {Math.round(density * 100)}%
          <input
            type="range"
            min={0.04}
            max={0.26}
            step={0.01}
            value={density}
            onChange={(e) => {
              const d = Number(e.target.value);
              setDensity(d);
              regenerate(d, seed);
            }}
            className="range-lime w-32"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-[#05070d] p-3 md:p-5" data-lenis-prevent>
        <div className="mx-auto grid min-w-[640px] max-w-[920px] gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} role="grid" aria-label="Minefield">
          {Array.from({ length: ROWS * COLS }, (_, k) => {
            const r = Math.floor(k / COLS);
            const c = k % COLS;
            const mine = blocked.has(k);
            const dz = danger[k];
            const pi = onPath.get(k);
            const walked = pi !== undefined && pi <= step;
            const isStart = r === start.r && c === start.c;
            const isGoal = r === goal.r && c === goal.c;
            const isRobot = robot && robot.r === r && robot.c === c;
            return (
              <button
                key={k}
                onClick={() => toggle(r, c)}
                aria-label={mine ? `Mine at row ${r + 1}, column ${c + 1}` : `Cell row ${r + 1}, column ${c + 1}`}
                className="relative aspect-square rounded-[4px] transition-colors duration-200"
                style={{
                  background: mine
                    ? "#ef4444"
                    : walked
                      ? "#D4FF24"
                      : pi !== undefined
                        ? "rgba(212,255,36,0.28)"
                        : dz > 0
                          ? `rgba(239, ${Math.round(160 - dz * 120)}, 40, ${0.12 + dz * 0.55})`
                          : "rgba(255,255,255,0.04)",
                  boxShadow: mine ? "0 0 12px rgba(239,68,68,0.7)" : walked ? "0 0 10px rgba(212,255,36,0.6)" : undefined,
                }}
              >
                {isStart && <span className="absolute inset-0 grid place-items-center rounded-[4px] bg-cobalt-light text-[9px] font-bold text-white">S</span>}
                {isGoal && <Flag size={12} className="absolute inset-0 m-auto text-white" />}
                {isRobot && step > 0 && (
                  <span className="absolute inset-[-3px] z-10 grid place-items-center rounded-md bg-white text-black shadow-[0_0_16px_white]">
                    <Bot size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
        {[
          { v: String(mines.length), l: "Mines" },
          { v: result.path.length ? String(result.path.length - 1) : "—", l: "Path steps" },
          { v: result.path.length ? risk.toFixed(2) : "—", l: "Danger along path" },
          { v: String(result.expanded), l: "Nodes expanded" },
        ].map((s) => (
          <div key={s.l} className="bg-[#05070d] p-4">
            <div className="font-display text-2xl text-white tabular-nums">{s.v}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{s.l}</div>
          </div>
        ))}
      </div>
      {!result.path.length && <p className="mt-4 text-sm text-red-300">No safe route exists — clear a mine or lower the density.</p>}
      <div className="mt-4 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-500" /> Mine</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-500/50" /> Danger zone</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-lime/30" /> Planned path</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-lime" /> Walked</span>
        <span className="text-white/25">· Browser re-implementation of the documented planner</span>
      </div>
    </div>
  );
}
