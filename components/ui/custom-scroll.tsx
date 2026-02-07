import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CustomScroll = React.forwardRef<HTMLDivElement, CustomScrollProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-y-auto",
          // Custom scrollbar styling
          "scrollbar-thin",
          "scrollbar-track-transparent",
          "scrollbar-thumb-muted-foreground/30",
          "hover:scrollbar-thumb-muted-foreground/50",
          // Webkit browsers (Chrome, Safari, Edge)
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-track]:mt-3",
          "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CustomScroll.displayName = "CustomScroll";

export { CustomScroll };
