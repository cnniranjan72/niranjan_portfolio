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
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const trailLength = 8; // number of tail segments
  const [trail, setTrail] = useState<{ x: number; y: number }[]>(
    Array(trailLength).fill({ x: 0, y: 0 })
  );

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
          const size = 120 - index * 12; // main glow largest
          const opacity = 0.25 - index * 0.03;
          const blur = 30 + index * 8;
          return (
            <div
              key={index}
              className="cursor-glow"
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
