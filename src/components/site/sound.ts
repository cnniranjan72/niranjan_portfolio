// Tiny synthesized sound system (Web Audio, no asset files).
// Off by default; the toggle in the nav turns it on and the choice is remembered.

import { useEffect, useState } from "react";

const STORAGE_KEY = "nc-sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

function ensureContext() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, { type = "sine" as OscillatorType, gain = 0.04, slideTo = 0, delay = 0 } = {}) {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  hover: () => tone(1900, 0.05, { gain: 0.018, type: "triangle" }),
  click: () => {
    tone(620, 0.08, { gain: 0.05, type: "triangle", slideTo: 920 });
    tone(1240, 0.06, { gain: 0.02, delay: 0.04 });
  },
  open: () => whoosh(true),
  close: () => whoosh(false),
};

function whoosh(up: boolean) {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime;
  const len = 0.7;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(up ? 300 : 2400, t);
  filter.frequency.exponentialRampToValueAtTime(up ? 2400 : 300, t + len);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(filter).connect(g).connect(master);
  src.start(t);
}

function startAmbient() {
  if (!ctx || !master || ambient) return;
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.022, t + 3);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain).connect(filter.frequency);
  const oscs = [55, 82.4, 110.3, 164.8].map((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 2 ? "sawtooth" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 7;
    o.connect(filter);
    o.start();
    return o;
  });
  filter.connect(out).connect(master);
  lfo.start();
  ambient = {
    stop: () => {
      const now = ctx!.currentTime;
      out.gain.cancelScheduledValues(now);
      out.gain.setValueAtTime(out.gain.value, now);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      [...oscs, lfo].forEach((o) => o.stop(now + 0.9));
    },
  };
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
  if (on) {
    if (!ensureContext()) {
      enabled = false;
      return;
    }
    startAmbient();
    sfx.click();
  } else {
    ambient?.stop();
    ambient = null;
  }
  listeners.forEach((l) => l(enabled));
}

export function useSound() {
  const [on, setOn] = useState(enabled);
  useEffect(() => {
    listeners.add(setOn);
    return () => {
      listeners.delete(setOn);
    };
  }, []);
  return [on, () => setSound(!enabled)] as const;
}

/** Wire hover/click blips to every interactive element. Call once. */
export function useSoundEvents() {
  useEffect(() => {
    let lastHover: Element | null = null;
    let lastTime = 0;
    const over = (e: PointerEvent) => {
      if (!enabled || e.pointerType !== "mouse") return;
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      const now = performance.now();
      if (el && el !== lastHover && now - lastTime > 70) {
        sfx.hover();
        lastTime = now;
      }
      lastHover = el;
    };
    const click = (e: MouseEvent) => {
      if (!enabled) return;
      if ((e.target as HTMLElement).closest("a, button, [cmdk-item]") && !(e.target as HTMLElement).closest("[data-sound-toggle]")) sfx.click();
    };
    // Browsers need a gesture before audio — restore a remembered "on" at the first interaction.
    let remembered = false;
    try {
      remembered = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    const firstGesture = () => {
      if (remembered && !enabled) setSound(true);
      window.removeEventListener("pointerdown", firstGesture);
      window.removeEventListener("keydown", firstGesture);
    };
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("click", click, true);
    if (remembered) {
      window.addEventListener("pointerdown", firstGesture);
      window.addEventListener("keydown", firstGesture);
    }
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("click", click, true);
      window.removeEventListener("pointerdown", firstGesture);
      window.removeEventListener("keydown", firstGesture);
    };
  }, []);
}
