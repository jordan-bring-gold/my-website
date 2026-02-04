"use client";

import React from "react";

interface ScrollingBannerProps {
  children: React.ReactNode;
  speed?: number; // Duration in seconds for one complete loop
  pauseOnHover?: boolean;
  className?: string;
}

export default function ScrollingBanner({
  children,
  speed = 25,
  pauseOnHover = false,
  className = "",
}: ScrollingBannerProps) {
  // Convert children to array to properly duplicate
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
        {/* First set */}
        <div className="flex gap-3 shrink-0 mr-3">{childArray}</div>
        {/* Duplicate set for seamless loop */}
        <div className="flex gap-3 shrink-0 mr-3">{childArray}</div>
      </div>
      {/* Fade overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
