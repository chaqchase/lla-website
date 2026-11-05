'use client'

import * as React from 'react'

/**
 * Fades content in the first time it scrolls into view. Anything already on screen at
 * hydration stays put, and without JavaScript nothing is ever hidden.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div'
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'figure'
}) {
  const ref = React.useRef<HTMLElement>(null)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return

    element.dataset.reveal = 'hidden'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.reveal = 'shown'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
