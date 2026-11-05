'use client'

import { renderCaption } from '@/components/docs/caption'
import { shots, type ShotName } from '@/lib/shots'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import * as React from 'react'
import { createPortal } from 'react-dom'

const SIZES = '(max-width: 640px) 640px, (max-width: 1280px) 80vw, 860px'
const spring = { type: 'spring', duration: 0.42, bounce: 0.08 } as const

/**
 * A terminal screenshot in its window. On a phone the window keeps a readable
 * width and scrolls sideways; on larger screens it opens from where it sits.
 */
export function Shot({
  name,
  alt,
  caption,
  priority,
  className
}: {
  name: ShotName
  alt: string
  caption?: React.ReactNode
  priority?: boolean
  className?: string
}) {
  const { w, h } = shots[name]
  const layoutId = React.useId()
  const [open, setOpen] = React.useState(false)
  const reduceMotion = useReducedMotion()

  const onOpen = () => {
    if (window.innerWidth >= 640) setOpen(true)
  }

  return (
    <figure className={cn('not-doc my-6', className)}>
      <div className="-mx-4 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:p-0">
        <div className="min-w-[640px] sm:min-w-0" style={{ aspectRatio: `${w} / ${h}` }}>
          {!open && (
            <motion.button
              type="button"
              layoutId={reduceMotion ? undefined : layoutId}
              transition={spring}
              onClick={onOpen}
              aria-label={`Enlarge: ${alt}`}
              className="window-shadow block size-full cursor-default overflow-hidden rounded-[8px] bg-terminal sm:cursor-zoom-in"
            >
              <Image
                src={`/shots/${name}.png`}
                alt={alt}
                width={w}
                height={h}
                sizes={SIZES}
                quality={90}
                priority={priority}
                draggable={false}
                className="block size-full"
              />
            </motion.button>
          )}
        </div>
      </div>

      {caption && <figcaption className="mt-2 text-[0.9375rem] leading-snug text-muted-fg">{renderCaption(caption)}</figcaption>}

      <Lightbox open={open} onClose={() => setOpen(false)} layoutId={layoutId} reduceMotion={Boolean(reduceMotion)}>
        <Image
          src={`/shots/${name}.png`}
          alt={alt}
          width={w}
          height={h}
          sizes="min(94vw, 1400px)"
          quality={92}
          draggable={false}
          className="block size-full"
        />
      </Lightbox>
    </figure>
  )
}

function Lightbox({
  open,
  onClose,
  layoutId,
  reduceMotion,
  children
}: {
  open: boolean
  onClose: () => void
  layoutId: string
  reduceMotion: boolean
  children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6" role="dialog" aria-modal="true" aria-label="Enlarged screenshot">
          <motion.div
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.button
            ref={closeRef}
            type="button"
            layoutId={reduceMotion ? undefined : layoutId}
            initial={reduceMotion ? { opacity: 0 } : false}
            animate={reduceMotion ? { opacity: 1 } : undefined}
            exit={reduceMotion ? { opacity: 0 } : undefined}
            transition={spring}
            onClick={onClose}
            aria-label="Close"
            className="window-shadow relative max-h-full w-[min(94vw,1400px,calc((100vh-3rem)*1.42))] cursor-zoom-out overflow-hidden rounded-[10px] bg-terminal"
          >
            {children}
          </motion.button>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
