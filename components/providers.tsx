'use client'

import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Analytics mode="production" />
    </ThemeProvider>
  )
}
