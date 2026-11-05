import type { ReactNode } from 'react'

/** Lets a caption passed as a plain MDX string mark up commands with backticks. */
export function renderCaption(caption: ReactNode): ReactNode {
  if (typeof caption !== 'string') return caption
  return caption.split('`').map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-mono text-[0.92em] text-fg">
        {part}
      </code>
    ) : (
      part
    )
  )
}
