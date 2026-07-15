import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: "text" | "circle" | "rect" | "card" }>(
  ({ className, variant = "text", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        variant === "text" && "h-4 rounded",
        variant === "circle" && "h-10 w-10 rounded-full",
        variant === "rect" && "h-32 w-full rounded-xl",
        variant === "card" && "h-48 w-full rounded-xl",
        className
      )}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
