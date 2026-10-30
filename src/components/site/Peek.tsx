import { ReactNode } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";

/**
 * Hover "peek" card: richer context on hover/focus without a click.
 * Touch devices never open it, so the trigger must stay useful on its own.
 */
export function Peek({
  children,
  content,
  side = "top",
  align = "center",
  width = 300,
  openDelay = 140,
}: {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  width?: number;
  openDelay?: number;
}) {
  return (
    <HoverCard.Root openDelay={openDelay} closeDelay={90}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content side={side} align={align} sideOffset={12} collisionPadding={16} className="z-[260] outline-none" data-lenis-prevent>
          <div className="peek-card peek-root rounded-2xl border border-white/12 bg-[#0a0d16]/95 p-4 text-left text-white shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl" style={{ width }}>
            {content}
          </div>
          <HoverCard.Arrow className="fill-[#0a0d16]" width={14} height={7} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export function PeekLabel({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{children}</div>;
}
