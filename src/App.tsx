import "@/index.css";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App: React.FC = () => {
  const trailLength = 8;
  const [trail, setTrail] = useState<{ x: number; y: number }[]>(
    Array(trailLength).fill({ x: 0, y: 0 })
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail((prev) => {
        const newTrail = [{ x: e.clientX, y: e.clientY }, ...prev];
        newTrail.length = trailLength;
        return newTrail;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll progress tracking (instant)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll bar click handler
  const handleScrollClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const barHeight = rect.height;
    const clickRatio = clickY / barHeight;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: docHeight * clickRatio,
      behavior: "smooth",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Cyan Kite-Tail Cursor */}
        {trail.map((pos, index) => {
          const size = 120 - index * 12;
          const opacity = 0.25 - index * 0.03;
          const blur = 30 + index * 8;
          return (
            <div
              key={index}
              className="cursor-glow pointer-events-none"
              style={{
                left: pos.x,
                top: pos.y,
                width: size,
                height: size,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, rgba(0,255,255,${opacity}) 0%, rgba(0,255,255,0.05) 50%, transparent 100%)`,
                filter: `blur(${blur}px)`,
              }}
            />
          );
        })}

        {/* Thin Candlestick Scroll Bar (instant update) */}
        <div
          className="fixed right-4 top-1/2 transform -translate-y-1/2 h-64 w-1.5 bg-muted/20 rounded-full border border-white cursor-pointer"
          onClick={handleScrollClick}
        >
          <div
            className="w-full rounded-full"
            style={{
              height: `${scrollProgress}%`,
              background: "linear-gradient(to bottom, rgba(0,255,255,0.9), rgba(0,255,255,0.3))",
              transition: "none", // No delay, real-time update
            }}
          />
        </div>

        {/* Hide default browser scrollbar */}
        <style>{`
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          html {
            scrollbar-width: none;
          }
        `}</style>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
