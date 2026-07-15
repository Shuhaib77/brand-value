import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "elevated" }>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border transition-all duration-200",
        variant === "default" && "bg-white border-gray-100 shadow-sm",
        variant === "glass" && "bg-white/80 backdrop-blur-md border-white/20 shadow-lg",
        variant === "elevated" && "bg-white border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { gradient?: boolean }>(
  ({ className, gradient = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-5 py-3 border-b",
        gradient && "bg-gradient-to-r from-purple-50 to-cyan-50 border-gray-100",
        !gradient && "border-gray-100",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }
