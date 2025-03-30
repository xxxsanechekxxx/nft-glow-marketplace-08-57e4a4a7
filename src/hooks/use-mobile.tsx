
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const EXTRA_SMALL_BREAKPOINT = 375

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
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Make sure state is correctly set on mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
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
    const mql = window.matchMedia(`(max-width: ${EXTRA_SMALL_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsExtraSmall(window.innerWidth < EXTRA_SMALL_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Make sure state is correctly set on mount
    setIsExtraSmall(window.innerWidth < EXTRA_SMALL_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isExtraSmall
}
