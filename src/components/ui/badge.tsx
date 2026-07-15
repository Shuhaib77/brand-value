import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-purple-100 text-purple-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
        accent: "bg-cyan-100 text-cyan-700",
        secondary: "bg-amber-100 text-amber-700",
        slate: "bg-slate-100 text-slate-700",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, size, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
))
Badge.displayName = "Badge"

export { Badge, badgeVariants }
