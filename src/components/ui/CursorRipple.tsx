import { useEffect, useState } from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

let rippleId = 0;

const CursorRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newRipple: Ripple = { x: e.clientX, y: e.clientY, id: rippleId++ };
      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="fixed pointer-events-none w-6 h-6 rounded-full bg-cyan-400/40 animate-ripple z-[9999]"
          style={{
            left: r.x - 12,
            top: r.y - 12,
          }}
        />
      ))}
    </>
  );
};

export default CursorRipple;
