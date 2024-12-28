import { cn } from '@/lib/utils'
import type { SVGProps } from 'react'

interface Props extends SVGProps<SVGSVGElement> {}

const Logo = (props: Props) => (
  <svg
    viewBox="0 0 275 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('w-10 fill-zinc-900 dark:fill-zinc-100', props.className)}
  >
    <defs>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="10" stitchTiles="stitch" result="noise" />
        <feComposite operator="in" in="noise" in2="SourceGraphic" />
        <feBlend mode="soft-light" in2="SourceGraphic" />
      </filter>
    </defs>

    <path
      filter="url(#grain)"
      d="M253.265 4.79813C238.731 -3.59393 219.473 -0.625441 200.056 10.9592C197.75 8.54142 195.146 6.47841 192.243 4.79813C177.708 -3.59393 158.45 -0.625441 139.034 10.9592C136.728 8.54142 134.124 6.47841 131.221 4.79813C102.03 -12.0513 53.7597 16.9055 23.4026 69.4889C-6.95443 122.072 -7.90659 178.352 21.2836 195.202C35.818 203.594 55.0759 200.625 74.4925 189.041C76.7982 191.459 79.4026 193.522 82.3058 195.202C96.8402 203.594 116.098 200.625 135.515 189.041C137.82 191.459 140.425 193.522 143.328 195.202C172.518 212.051 220.78 183.085 251.146 130.511C281.503 77.9276 282.455 21.6476 253.265 4.79813Z"
    />
  </svg>
)

export { Logo }
