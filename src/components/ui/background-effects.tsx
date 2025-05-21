
import React from "react"
import { cn } from "@/lib/utils"

interface BackgroundEffectsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "gradient" | "particles" | "mesh" | "noise" | "glow" | "grid"
  intensity?: "subtle" | "medium" | "strong"
  interactive?: boolean
}

export function BackgroundEffects({
  className,
  variant = "gradient",
  intensity = "medium",
  interactive = false,
  ...props
}: BackgroundEffectsProps) {
  // Intensity values mapping
  const intensityValues = {
    subtle: {
      opacity: "opacity-[0.03]",
      blur: "blur-[100px]",
    },
    medium: {
      opacity: "opacity-[0.07]",
      blur: "blur-[120px]",
    },
    strong: {
      opacity: "opacity-[0.12]",
      blur: "blur-[150px]",
    },
  }

  // Common classes for all variants
  const baseClasses = "fixed inset-0 -z-10 pointer-events-none overflow-hidden"
  
  // Specific classes for each variant
  const variantClasses = {
    gradient: cn(
      baseClasses,
      "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
      "from-primary/20 via-purple-500/10 to-transparent"
    ),
    particles: cn(
      baseClasses,
      "card-noise"
    ),
    mesh: cn(
      baseClasses,
      "bg-[url('/img/mesh-gradient.png')] bg-cover opacity-30"
    ),
    noise: cn(
      baseClasses,
      "card-noise",
      intensityValues[intensity].opacity
    ),
    glow: cn(
      baseClasses,
      "flex items-center justify-center"
    ),
    grid: cn(
      baseClasses,
      "bg-[radial-gradient(rgba(155,135,245,0.07)_1px,transparent_1px)]",
      "bg-[size:40px_40px]"
    ),
  }

  // For glow variant, render orbs
  if (variant === "glow") {
    return (
      <div className={cn(variantClasses.glow, className)} {...props}>
        <div className={cn(
          "absolute top-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full",
          intensityValues[intensity].blur,
          "animate-[pulse_10s_ease-in-out_infinite]"
        )}></div>
        <div className={cn(
          "absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-purple-500/10 rounded-full",
          intensityValues[intensity].blur,
          "animate-[pulse_15s_ease-in-out_infinite] delay-1000"
        )}></div>
        <div className={cn(
          "absolute left-1/4 top-2/3 w-[600px] h-[600px] bg-pink-500/5 rounded-full",
          intensityValues[intensity].blur,
          "animate-[pulse_20s_ease-in-out_infinite] delay-500"
        )}></div>
      </div>
    )
  }

  return <div className={cn(variantClasses[variant], className)} {...props} />
}

export default BackgroundEffects
