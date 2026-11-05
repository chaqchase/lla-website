import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" />
  </Icon>
)

export const ArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 8H3.5M7.25 4.25 3.5 8l3.75 3.75" />
  </Icon>
)

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Icon>
)

export const Chevron = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 4 4 4-4 4" />
  </Icon>
)

export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.75" />
    <path d="M10.5 3.5v-.25A1.75 1.75 0 0 0 8.75 1.5h-5.5A1.75 1.75 0 0 0 1.5 3.25v5.5c0 .97.78 1.75 1.75 1.75h.25" />
  </Icon>
)

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 8.5 3.25 3.25L13 4.75" />
  </Icon>
)

export const Search = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </Icon>
)

export const Menu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 5.5h11M2.5 10.5h11" />
  </Icon>
)

export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </Icon>
)

export const Pencil = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.75 2.75 13.25 5.25 5.5 13H3v-2.5l7.75-7.75Z" />
  </Icon>
)

export const Github = (p: IconProps) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
)
