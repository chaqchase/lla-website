'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'

/**
 * One half-filled disc that turns over with the theme. The turn runs through the Web
 * Animations API because the theme switch suppresses CSS transitions for a frame.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const discRef = React.useRef<SVGSVGElement>(null)

  const toggle = () => {
    const toDark = resolvedTheme !== 'dark'
    setTheme(toDark ? 'dark' : 'light')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    discRef.current?.animate([{ transform: `rotate(${toDark ? 0 : 180}deg)` }, { transform: `rotate(${toDark ? 180 : 360}deg)` }], {
      duration: 380,
      easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)'
    })
  }

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={toggle}
      className="pressable relative grid size-7 place-items-center rounded-md text-muted-fg hover:bg-secondary hover:text-fg"
    >
      <svg ref={discRef} viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true" className="dark:rotate-180">
        <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" />
      </svg>
    </button>
  )
}
