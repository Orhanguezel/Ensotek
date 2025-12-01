// src/components/ui/skeleton.tsx

import { cn } from "./utils";

/**
 * Basit Bootstrap uyumlu skeleton / placeholder.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("placeholder-glow bg-secondary bg-opacity-25 rounded", className)}
      {...props}
    />
  );
}

export { Skeleton };
