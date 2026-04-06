import "@/index.css";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import VerySimpleNeonScene from "@/components/3d/VerySimpleNeonScene";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App: React.FC = () => {
  const trailLength = 4; // Reduced trail length for better responsiveness
  const [trail, setTrail] = useState<{ x: number; y: number }[]>(
    Array(trailLength).fill({ x: 0, y: 0 })
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  // Optimized mouse trail with immediate response
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Immediate update without throttling for zero lag
      setTrail((prev) => {
        const newTrail = [{ x: e.clientX, y: e.clientY }, ...prev];
        newTrail.length = trailLength;
        return newTrail;
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* 3D components disabled - React reconciliation error persists */}
        {/* <VerySimpleNeonScene /> */}

        {/* Enhanced Neon Cursor with Blue Glow */}
        {trail.map((pos, index) => {
          const size = 120 - index * 12;
          const opacity = 0.4 - index * 0.03;
          const blur = 25 + index * 6;
          return (
            <div
              key={index}
              className="neon-cursor-trail pointer-events-none"
              style={{
                position: 'fixed',
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                filter: `blur(${blur}px)`,
                background: `radial-gradient(circle, rgba(0, 150, 255, ${opacity * 0.8}) 0%, rgba(0, 255, 255, ${opacity * 0.4}) 30%, transparent 70%)`,
                boxShadow: `0 0 ${20 + index * 5}px rgba(0, 150, 255, ${opacity * 0.6}), 0 0 ${40 + index * 10}px rgba(0, 255, 255, ${opacity * 0.3})`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
          );
        })}

        {/* Neon Scroll Bar */}
        <div
          className="fixed right-4 top-1/2 transform -translate-y-1/2 h-64 w-2 bg-muted/20 rounded-full border border-cyan-500/30 cursor-pointer neon-border-cyan"
          onClick={handleScrollClick}
        >
          <div
            className="w-full rounded-full bg-gradient-to-b from-cyan-400 to-pink-400"
            style={{
              height: `${scrollProgress}%`,
              transition: "none",
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
