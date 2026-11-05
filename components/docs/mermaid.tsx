'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const PALETTES = {
  light: { node: '#ffffff', border: '#e5e5e5', text: '#171717', line: '#8c8c8c', accent: '#c24d00', edge: '#fafafa' },
  dark: { node: '#171717', border: '#262626', text: '#ededed', line: '#7a7a7a', accent: '#ff9340', edge: '#0a0a0a' }
}

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const palette = PALETTES[resolvedTheme === 'dark' ? 'dark' : 'light']

    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'strict',
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
          themeVariables: {
            background: 'transparent',
            fontSize: '13.5px',
            primaryColor: palette.node,
            primaryTextColor: palette.text,
            primaryBorderColor: palette.border,
            secondaryColor: palette.node,
            secondaryTextColor: palette.text,
            secondaryBorderColor: palette.border,
            tertiaryColor: palette.node,
            tertiaryTextColor: palette.text,
            tertiaryBorderColor: palette.border,
            lineColor: palette.line,
            textColor: palette.text,
            mainBkg: palette.node,
            nodeBorder: palette.border,
            nodeTextColor: palette.text,
            clusterBkg: 'transparent',
            clusterBorder: palette.border,
            edgeLabelBackground: palette.edge,
            actorBkg: palette.node,
            actorBorder: palette.border,
            actorTextColor: palette.text,
            actorLineColor: palette.line,
            signalColor: palette.line,
            signalTextColor: palette.text,
            labelBoxBkgColor: palette.node,
            labelBoxBorderColor: palette.border,
            labelTextColor: palette.text,
            loopTextColor: palette.text,
            noteBkgColor: palette.node,
            noteBorderColor: palette.accent,
            noteTextColor: palette.text
          },
          flowchart: { htmlLabels: true, curve: 'basis', padding: 14, nodeSpacing: 36, rankSpacing: 40, useMaxWidth: true },
          sequence: { useMaxWidth: true, actorMargin: 40, messageMargin: 32, mirrorActors: false }
        })
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
        const { svg: rendered } = await mermaid.render(id, chart)
        if (!cancelled) setSvg(rendered)
      })
      .catch((reason) => {
        if (!cancelled) setError(String(reason))
      })

    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme])

  if (error) {
    return <pre className="my-6 overflow-x-auto rounded-md border p-4 text-xs text-danger">{error}</pre>
  }

  return (
    <figure className="not-doc my-8">
      <div
        className="mermaid-figure min-h-32 overflow-x-auto rounded-lg border bg-[hsl(var(--code-bg))] p-5 transition-opacity duration-300"
        style={{ opacity: svg ? 1 : 0.4 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}
