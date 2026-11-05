import type { SVGProps } from 'react'

/** One small drawing per view, built from the same dashes the terminal would use. */
function Glyph({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 36" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

const dash = 'fill-fg/30 transition-colors duration-200 group-hover:fill-fg/45'
const dashOn = 'fill-primary'
const line = 'stroke-fg/25 transition-colors duration-200 group-hover:stroke-fg/35'

const Bar = ({ x, y, w, on, h = 2.5 }: { x: number; y: number; w: number; on?: boolean; h?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} className={on ? dashOn : dash} />
)

export const viewGlyphs = {
  default: (
    <Glyph>
      <Bar x={8} y={5} w={18} />
      <Bar x={8} y={11} w={26} on />
      <Bar x={8} y={17} w={14} />
      <Bar x={8} y={23} w={22} />
      <Bar x={8} y={29} w={12} />
    </Glyph>
  ),
  long: (
    <Glyph>
      {[5, 11, 17, 23, 29].map((y, i) => (
        <g key={y}>
          <Bar x={3} y={y} w={10} />
          <Bar x={16} y={y} w={6} />
          <Bar x={25} y={y} w={7} />
          <Bar x={35} y={y} w={[10, 7, 11, 6, 9][i]} on={i === 1} />
        </g>
      ))}
    </Glyph>
  ),
  tree: (
    <Glyph>
      <path d="M12 8V28M12 15H19M12 28H19M23 19V26M23 26H30" className={line} />
      <Bar x={8} y={4} w={14} on />
      <Bar x={21} y={14} w={18} />
      <Bar x={32} y={25} w={12} />
      <Bar x={21} y={27} w={12} />
    </Glyph>
  ),
  table: (
    <Glyph>
      <rect x={4.5} y={4.5} width={39} height={27} rx={2.5} className={line} />
      <path d="M4.5 12H43.5M18 4.5V31.5M31 4.5V31.5" className={line} />
      <Bar x={8} y={7} w={7} on />
      <Bar x={21} y={7} w={7} />
      <Bar x={34} y={7} w={6} />
      <Bar x={8} y={17} w={6} />
      <Bar x={21} y={17} w={8} />
      <Bar x={34} y={17} w={5} />
      <Bar x={8} y={24} w={8} />
      <Bar x={21} y={24} w={5} />
      <Bar x={34} y={24} w={7} />
    </Glyph>
  ),
  grid: (
    <Glyph>
      {[8, 17, 26].flatMap((y, row) =>
        [4, 18, 32].map((x, col) => <Bar key={`${x}-${y}`} x={x} y={y} w={[11, 9, 12, 8, 12, 10, 9, 11, 7][row * 3 + col]} on={row === 1 && col === 1} />)
      )}
    </Glyph>
  ),
  git: (
    <Glyph>
      <path d="M11 6V30M11 20C11 14 20 14 20 8" className={line} />
      <circle cx={11} cy={30} r={2.25} className="fill-background stroke-fg/25" />
      <circle cx={11} cy={20} r={2.25} className="fill-background stroke-fg/25" />
      <circle cx={20} cy={8} r={2.25} className="fill-primary stroke-primary" />
      <Bar x={26} y={7} w={17} on />
      <Bar x={26} y={18.5} w={13} />
      <Bar x={26} y={28.5} w={16} />
    </Glyph>
  ),
  timeline: (
    <Glyph>
      <path d="M9 4V32" className={line} />
      <circle cx={9} cy={9} r={2.25} className="fill-primary" />
      <circle cx={9} cy={24} r={2.25} className="fill-background stroke-fg/25" />
      <Bar x={16} y={5} w={20} on />
      <Bar x={16} y={11} w={14} />
      <Bar x={16} y={20} w={24} />
      <Bar x={16} y={26} w={12} />
    </Glyph>
  ),
  sizemap: (
    <Glyph>
      <Bar x={5} y={5} w={38} h={4} on />
      <Bar x={5} y={12} w={24} h={4} />
      <Bar x={5} y={19} w={15} h={4} />
      <Bar x={5} y={26} w={8} h={4} />
    </Glyph>
  ),
  recursive: (
    <Glyph>
      <Bar x={5} y={5} w={16} on />
      <path d="M5 11H43" className={line} />
      <Bar x={5} y={14} w={26} />
      <Bar x={5} y={19} w={20} />
      <Bar x={11} y={25} w={14} on />
      <path d="M11 30.5H43" className={line} />
    </Glyph>
  ),
  fuzzy: (
    <Glyph>
      <rect x={4.5} y={3.5} width={39} height={9} rx={2.5} className={line} />
      <path d="M9 7V9" strokeLinecap="round" className="stroke-primary" />
      <Bar x={12} y={6.75} w={12} />
      <rect x={4} y={16} width={40} height={6} rx={2} className="fill-primary/15" />
      <Bar x={8} y={17.75} w={22} on />
      <Bar x={8} y={25} w={16} />
      <Bar x={8} y={30.5} w={26} />
    </Glyph>
  )
} as const

export type ViewGlyphName = keyof typeof viewGlyphs
