
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const EXTRA_SMALL_BREAKPOINT = 375
const TINY_BREAKPOINT = 320

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Set initial state based on window width if we're in a browser environment
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    // Default to false if we're in SSR
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    // Make sure state is correctly set on mount
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export function useIsExtraSmall() {
  const [isExtraSmall, setIsExtraSmall] = React.useState<boolean>(() => {
    // Set initial state based on window width if we're in a browser environment
    if (typeof window !== 'undefined') {
      return window.innerWidth < EXTRA_SMALL_BREAKPOINT
    }
    // Default to false if we're in SSR
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsExtraSmall(window.innerWidth < EXTRA_SMALL_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    // Make sure state is correctly set on mount
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isExtraSmall
}

export function useIsTiny() {
  const [isTiny, setIsTiny] = React.useState<boolean>(() => {
    // Set initial state based on window width if we're in a browser environment
    if (typeof window !== 'undefined') {
      return window.innerWidth <= TINY_BREAKPOINT
    }
    // Default to false if we're in SSR
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsTiny(window.innerWidth <= TINY_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    // Make sure state is correctly set on mount
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isTiny
}
