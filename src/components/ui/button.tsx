
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all duration-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg transition-all duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-300",
        exchange: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300",
        circular: "rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 border border-purple-500/50 transition-transform hover:scale-105",
        circularSmall: "rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 border border-purple-500/50 transition-transform hover:rotate-180",
        gradient: "bg-gradient-to-r from-purple-600/20 to-primary/20 border border-primary/10 text-primary hover:from-purple-600/30 hover:to-primary/30 transition-colors relative overflow-hidden group shadow-md hover:shadow-lg shadow-primary/5 hover:shadow-primary/20",
        gradientDestructive: "bg-gradient-to-r from-destructive/20 to-red-500/20 border border-destructive/10 text-destructive hover:from-destructive/30 hover:to-red-500/30 transition-colors relative overflow-hidden group shadow-md hover:shadow-lg shadow-destructive/5 hover:shadow-destructive/20",
        // Transaction button styles
        glassDeposit: "bg-gradient-to-br from-emerald-600/90 to-green-700/90 text-white border border-green-500/20 hover:from-emerald-500/90 hover:to-green-600/90 shadow-lg shadow-green-900/20 hover:shadow-green-900/30 transition-all duration-300 backdrop-blur-sm rounded-xl overflow-hidden relative hover:scale-[1.02]",
        glassWithdraw: "bg-gradient-to-br from-orange-600/90 to-red-600/90 text-white border border-orange-500/20 hover:from-orange-500/90 hover:to-red-500/90 shadow-lg shadow-red-900/20 hover:shadow-red-900/30 transition-all duration-300 backdrop-blur-sm rounded-xl overflow-hidden relative hover:scale-[1.02]",
        depositButton: "bg-gradient-to-br from-green-600 to-emerald-700 text-white border border-green-500/30 shadow-lg shadow-green-800/20 hover:shadow-green-800/30 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 hover:scale-[1.02]",
        withdrawButton: "bg-gradient-to-br from-orange-600 to-red-700 text-white border border-red-500/30 shadow-lg shadow-red-800/20 hover:shadow-red-800/30 hover:from-orange-700 hover:to-red-800 transition-all duration-300 hover:scale-[1.02]",
        // NFT action buttons
        nftAction: "bg-[#65539E]/30 border border-[#65539E]/30 text-white hover:bg-[#65539E]/50 transition-all duration-300 shadow hover:shadow-[#65539E]/30",
        nftSell: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 shadow hover:shadow-emerald-500/20",
        nftCancel: "bg-gradient-to-r from-red-500/20 to-destructive/20 border border-red-500/20 text-red-400 hover:from-red-500/30 hover:to-destructive/30 transition-all duration-300 shadow hover:shadow-red-500/20",
        // New glass button
        glass: "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-white shadow-lg shadow-black/5 hover:shadow-black/10",
        // New gradient glow button
        glow: "relative overflow-hidden bg-gradient-to-r from-primary/80 via-purple-600/80 to-primary/80 text-white hover:from-primary hover:via-purple-600 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300",
        // New 3D button
        '3d': "relative bg-primary text-white font-medium shadow-[0_5px_0_rgb(147,39,143)] hover:shadow-[0_2px_0_rgb(147,39,143)] hover:translate-y-[3px] transition-all duration-150 active:shadow-none active:translate-y-[5px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 text-lg rounded-md px-10",
        icon: "h-10 w-10",
        circle: "h-12 w-12",
        circleSmall: "h-8 w-8",
        settings: "h-12 w-full",
        transaction: "h-auto py-5 px-6 rounded-xl",
        // New size for the redesigned transaction buttons
        actionCard: "h-auto py-6 px-6 rounded-xl w-full",
        // New size for NFT action buttons
        nftAction: "h-8 px-3 py-1 text-xs rounded-md",
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
