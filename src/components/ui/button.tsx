import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center uppercase rounded-2xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-[rgb(148_53_21)] text-white hover:opacity-90",
        secondary: "border-2 border-white text-white hover:bg-white/20",
        outline: "border border-[rgb(203_213_225)] text-[rgb(47_46_46)] hover:bg-[rgb(250_248_242)]",
        ghost: "text-[rgb(47_46_46)] hover:bg-[rgb(250_248_242)]/50",
        destructive: "bg-[rgb(255_64_64)] text-white hover:opacity-90",
        link: "text-[rgb(148_53_21)] underline-offset-4 hover:underline",
      },
      size: {
        xs: "px-3 py-1 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-base",
        xl: "px-10 py-4 text-lg",
        icon: "p-2",
        "icon-sm": "p-1.5",
        "icon-lg": "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
