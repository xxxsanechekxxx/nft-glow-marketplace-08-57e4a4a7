
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        exchange: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
        circular: "rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-600/20 border border-purple-500/50 transition-transform",
        circularSmall: "rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-600/20 border border-purple-500/50 transition-transform hover:rotate-180",
        gradient: "bg-gradient-to-r from-purple-600/20 to-primary/20 border border-primary/10 text-primary hover:from-purple-600/30 hover:to-primary/30 transition-colors relative overflow-hidden group",
        gradientDestructive: "bg-gradient-to-r from-destructive/20 to-red-500/20 border border-destructive/10 text-destructive hover:from-destructive/30 hover:to-red-500/30 transition-colors relative overflow-hidden group",
        // Новые варианты для кнопок транзакций
        depositButton: "bg-gradient-to-br from-green-600 to-emerald-700 text-white border border-green-500/30 shadow-lg shadow-green-800/20 hover:shadow-green-800/30 hover:from-green-700 hover:to-emerald-800 transition-all duration-300",
        withdrawButton: "bg-gradient-to-br from-orange-600 to-red-700 text-white border border-red-500/30 shadow-lg shadow-red-800/20 hover:shadow-red-800/30 hover:from-orange-700 hover:to-red-800 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        circle: "h-12 w-12",
        circleSmall: "h-8 w-8",
        settings: "h-12 w-full",
        // Новый размер для кнопок транзакций
        transaction: "h-auto py-5 px-6 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
