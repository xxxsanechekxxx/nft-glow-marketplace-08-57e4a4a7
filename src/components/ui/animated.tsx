
import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  animation: "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scale" | "pulse" | "float" | "glow" | "none"
  delay?: number
  duration?: number
  once?: boolean
  children: React.ReactNode
}

const Animated = React.forwardRef<HTMLDivElement, AnimatedProps>(
  ({ className, animation = "none", delay = 0, duration = 1, once = true, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(!once)
    const divRef = React.useRef<HTMLDivElement>(null)
    
    React.useEffect(() => {
      if (once) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              observer.disconnect()
            }
          },
          { threshold: 0.1 }
        )
        
        if (divRef.current) {
          observer.observe(divRef.current)
        }
        
        return () => {
          observer.disconnect()
        }
      }
    }, [once])
    
    const getAnimationClasses = () => {
      if (!isVisible && once) return "opacity-0"
      
      const baseClasses = "transition-all"
      const delayClass = `delay-${delay * 100}`
      const durationClass = `duration-${duration * 100}`
      
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100" : "opacity-0"}`
        case "fadeInUp":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`
        case "fadeInDown":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`
        case "fadeInLeft":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`
        case "fadeInRight":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`
        case "scale":
          return `${baseClasses} ${delayClass} ${durationClass} ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`
        case "pulse":
          return `${baseClasses} animate-pulse-light`
        case "float":
          return `${baseClasses} animate-float`
        case "glow":
          return `${baseClasses} animate-glow`
        default:
          return ""
      }
    }
    
    const animationClasses = getAnimationClasses()
    
    return (
      <div
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
          divRef.current = node
        }}
        className={cn(animationClasses, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Animated.displayName = "Animated"

export { Animated }
