'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

// An 8×8 Bayer matrix. Each wallpaper is a density field thresholded against it, one cell at a time.
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49,
  17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
].map((value) => (value + 0.5) / 64)

const smooth = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)))
  return t * t * (3 - 2 * t)
}

type Field = (x: number, y: number, w: number, h: number, seed: number) => number

/** Densities from 0 to 1, in CSS pixels. `ink` takes the element's color, `accent` the brand orange. */
const WALLPAPERS: Record<string, { ink: Field; accent?: Field }> = {
  // Either side of the page top, leaving the middle clear for the heading.
  wings: {
    ink: (x, y, w, h) => smooth(0.45, 1.2, Math.abs(x / w - 0.5) * 2) * (1 - smooth(0, h, y)) * 0.34
  },
  // A low sun coming up behind a window, over a floor of haze.
  sun: {
    accent: (x, y, w) => {
      const radius = Math.min(w * 0.3, 300)
      const distance = Math.hypot(x - w / 2, y - radius - 8)
      return y < radius && distance < radius ? 0.5 - 0.4 * smooth(8, 64, y) : 0
    },
    ink: (x, y, w, h) => smooth(h * 0.3, h, y) * 0.24
  },
  rings: {
    ink: (x, y, w, h, seed) => {
      const distance = Math.hypot(x - w * 0.92, y - h * 1.05)
      return (0.5 + 0.5 * Math.sin(distance * 0.075 + seed)) * (1 - smooth(0, Math.max(w, h) * 0.95, distance)) * 0.65
    }
  },
  contour: {
    ink: (x, y, w, h, seed) => (0.5 + 0.5 * Math.sin((y + 22 * Math.sin(x * 0.012 + seed)) * 0.06 + seed)) * (0.12 + 0.45 * smooth(0, h, y))
  },
  crate: {
    ink: (x, y, w, h, seed) => (0.5 + 0.5 * Math.sin(x * 0.055 + seed) * Math.sin(y * 0.055 + seed)) * (0.15 + 0.42 * smooth(0, w, x))
  },
  ramp: {
    ink: (x, y, w, h) => smooth(w * 0.05, w, x) * (0.5 - 0.22 * (y / h))
  },
  // Sits behind a page title: waves that fade out before they reach the words.
  header: {
    ink: (x, y, w, h, seed) => (0.5 + 0.5 * Math.sin((y + 14 * Math.sin(x * 0.02 + seed)) * 0.09 + seed)) * smooth(0, w, x) * 0.42
  },
  // A half sun on a line of its own, up in the corner, clear of the controls below it.
  horizon: {
    accent: (x, y, w) => {
      const radius = 62
      const line = 88
      const distance = Math.hypot(x - (w - radius - 40), y - line)
      return y < line && distance < radius ? 0.55 - 0.4 * smooth(line - radius, line, y) : 0
    },
    ink: (x, y, w, h) => smooth(w * 0.45, w, x) * (1 - smooth(0, h, Math.abs(y - 88) * 2.4)) * 0.3
  },
  // A strip of floor that the page ends on.
  floor: {
    ink: (x, y, w, h) => smooth(0, h, y) * 0.3
  }
}

export type WallpaperName = keyof typeof WALLPAPERS

/**
 * A 1-bit wallpaper drawn at low resolution and scaled up without smoothing, so the
 * pixels stay hard on any display. It fills its nearest positioned parent. With
 * `interactive`, the pattern grows denser under the pointer.
 */
export function Dither({
  pattern,
  cell = 2,
  seed = 0,
  interactive,
  className
}: {
  pattern: WallpaperName
  cell?: number
  seed?: number
  interactive?: boolean
  className?: string
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = ref.current
    const parent = canvas?.parentElement
    const context = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !parent || !context) return

    const wallpaper = WALLPAPERS[pattern]
    let columns = 0
    let rows = 0
    let ink = new Float32Array(0)
    let accent = new Float32Array(0)
    let image: ImageData | null = null
    let inkColor = new Uint8ClampedArray(4)
    let accentColor = new Uint8ClampedArray(4)

    // Letting the canvas parse the color handles any syntax the browser computes.
    const readColor = (css: string) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = css
      context.fillRect(0, 0, 1, 1)
      return context.getImageData(0, 0, 1, 1).data
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, glow: 0, targetGlow: 0 }

    const paint = () => {
      if (!image) return
      const data = image.data
      for (let row = 0, index = 0; row < rows; row++) {
        const py = row * cell - pointer.y
        for (let column = 0; column < columns; column++, index++) {
          const threshold = BAYER[(row % 8) * 8 + (column % 8)]
          const offset = index * 4
          let color: Uint8ClampedArray | null = null
          if (accent[index] > threshold) {
            color = accentColor
          } else {
            let density = ink[index]
            if (pointer.glow > 0.01) {
              const px = column * cell - pointer.x
              density += pointer.glow * 0.3 * Math.exp(-(px * px + py * py) / 16000)
            }
            if (density > threshold) color = inkColor
          }
          if (color) {
            data[offset] = color[0]
            data[offset + 1] = color[1]
            data[offset + 2] = color[2]
            data[offset + 3] = color[3]
          } else {
            data[offset + 3] = 0
          }
        }
      }
      context.putImageData(image, 0, 0)
    }

    const readColors = () => {
      const style = getComputedStyle(canvas)
      inkColor = readColor(style.color)
      accentColor = readColor(`hsl(${style.getPropertyValue('--primary')} / 0.6)`)
    }

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = parent
      if (!width || !height) return
      columns = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      canvas.width = columns
      canvas.height = rows
      canvas.style.width = `${columns * cell}px`
      canvas.style.height = `${rows * cell}px`
      readColors()
      context.clearRect(0, 0, columns, rows)
      image = context.createImageData(columns, rows)
      ink = new Float32Array(columns * rows)
      accent = new Float32Array(columns * rows)
      for (let row = 0, index = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++, index++) {
          const x = column * cell
          const y = row * cell
          ink[index] = wallpaper.ink(x, y, width, height, seed)
          if (wallpaper.accent) accent[index] = wallpaper.accent(x, y, width, height, seed)
        }
      }
      paint()
    }

    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(parent)
    resize()

    // next-themes flips the class after child effects run, so watch the class itself.
    const themeObserver = new MutationObserver(() => {
      readColors()
      paint()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let frame = 0
    let removeListeners = () => {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (interactive && !reduced && window.matchMedia('(hover: hover)').matches) {
      const tick = () => {
        pointer.x += (pointer.targetX - pointer.x) * 0.16
        pointer.y += (pointer.targetY - pointer.y) * 0.16
        pointer.glow += (pointer.targetGlow - pointer.glow) * 0.1
        paint()
        const settled =
          Math.abs(pointer.targetX - pointer.x) < 0.5 && Math.abs(pointer.targetY - pointer.y) < 0.5 && Math.abs(pointer.targetGlow - pointer.glow) < 0.01
        frame = settled ? 0 : requestAnimationFrame(tick)
      }
      const wake = () => {
        if (!frame) frame = requestAnimationFrame(tick)
      }
      const onMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        pointer.targetX = event.clientX - rect.left
        pointer.targetY = event.clientY - rect.top
        const inside = pointer.targetY >= 0 && pointer.targetY <= rect.height
        // Start from the pointer rather than sliding in from wherever it last was.
        if (inside && pointer.glow <= 0.01) {
          pointer.x = pointer.targetX
          pointer.y = pointer.targetY
        }
        pointer.targetGlow = inside ? 1 : 0
        wake()
      }
      const onLeave = () => {
        pointer.targetGlow = 0
        wake()
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      removeListeners = () => {
        window.removeEventListener('pointermove', onMove)
        document.documentElement.removeEventListener('pointerleave', onLeave)
      }
    }

    return () => {
      sizeObserver.disconnect()
      themeObserver.disconnect()
      removeListeners()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pattern, cell, seed, interactive])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute left-0 top-0 [image-rendering:pixelated] animate-in fade-in-0 duration-500', className)}
    />
  )
}
