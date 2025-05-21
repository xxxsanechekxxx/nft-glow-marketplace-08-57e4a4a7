
import * as React from "react"
import { cn } from "@/lib/utils"

interface TextEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  effect: "gradient" | "shadow" | "glow" | "highlight" | "typewriter" | "sparkle" | "none"
  as?: React.ElementType
  children: React.ReactNode
}

const TextEffect = React.forwardRef<HTMLDivElement, TextEffectProps>(
  ({ className, effect = "none", as: Component = "div", children, ...props }, ref) => {
    const getEffectClasses = () => {
      switch (effect) {
        case "gradient":
          return "bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-400 animate-gradient bg-300%"
        case "shadow":
          return "text-shadow"
        case "glow":
          return "text-white drop-shadow-[0_0_8px_rgba(155,135,245,0.8)]"
        case "highlight":
          return "relative inline-block"
        case "typewriter":
          return "font-mono border-r-2 border-primary animate-cursor pr-1"
        case "sparkle":
          return "relative"
        case "none":
        default:
          return ""
      }
    }
    
    const effectClasses = getEffectClasses()
    
    if (effect === "highlight") {
      return (
        <Component
          ref={ref}
          className={cn("relative inline-block", className)}
          {...props}
        >
          {children}
          <span className="absolute inset-x-0 bottom-1 h-2 bg-primary/20 -z-10"></span>
        </Component>
      )
    }
    
    if (effect === "sparkle") {
      return (
        <Component
          ref={ref}
          className={cn("inline-block relative", className)}
          {...props}
        >
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-70 animate-pulse"></span>
          {children}
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-pulse delay-700"></span>
        </Component>
      )
    }
    
    return (
      <Component
        ref={ref}
        className={cn(effectClasses, className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

TextEffect.displayName = "TextEffect"

export { TextEffect }
