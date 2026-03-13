"use client";

import React from "react";

interface ScrollingBannerProps {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  fadeColor?: string; // e.g. "hsl(var(--card))" or "#1a1a1a"
}

export default function ScrollingBanner({
  children,
  speed = 25,
  pauseOnHover = false,
  className = "",
  fadeColor = "hsl(var(--background))",
}: ScrollingBannerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="inline-flex"
        style={{
          animationName: "scroll",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: pauseOnHover ? undefined : "running",
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "running";
          }
        }}
      >
        <div className="flex gap-3 shrink-0 mr-3">{childArray}</div>
        <div className="flex gap-3 shrink-0 mr-3">{childArray}</div>
      </div>
      {/* Fade overlays */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${fadeColor}, transparent)`,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${fadeColor}, transparent)`,
        }}
      />
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}