import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-cyan-600 active:scale-[0.97]",
        secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-[0.97]",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.97]",
        outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = "Button"

export { Button, buttonVariants }
