'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from 'ui'

interface MermaidProps {
  chart: string
  className?: string
}

export function Mermaid({ chart, className }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Dynamically import mermaid to avoid SSR issues
    let cancelled = false

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default

        // Initialize mermaid with minimal high-contrast theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            // Minimal color palette - only 3 main colors
            
            // Primary: Site orange for emphasis
            primaryColor: '#FF7300',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#FF7300',
            
            // Secondary: Dark gray for neutral elements
            secondaryColor: '#18181b',
            secondaryTextColor: '#ffffff',
            secondaryBorderColor: '#52525b',
            
            // Tertiary: Medium gray for subtle elements
            tertiaryColor: '#27272a',
            tertiaryTextColor: '#ffffff',
            tertiaryBorderColor: '#52525b',
            
            // Background: Pure dark for maximum contrast
            background: '#000000',
            mainBkg: '#18181b',
            secondBkg: '#27272a',
            tertiaryBkg: '#27272a',
            
            // Borders: Single gray tone
            border1: '#52525b',
            border2: '#52525b',
            
            // Lines: Lighter orange for visibility
            lineColor: '#ff9340',
            
            // Text: White for maximum contrast
            textColor: '#ffffff',
            text: '#ffffff',
            
            // Active states: Pure white
            activeTextColor: '#ffffff',
            activeBorderColor: '#ff9340',
            
            // Special states (only when explicitly styled)
            doneColor: '#18181b',
            doneText: '#ffffff',
            criticalColor: '#18181b',
            criticalTextColor: '#ffffff',
            criticalBorderColor: '#52525b',
            warningColor: '#18181b',
            warningTextColor: '#ffffff',
            warningBorderColor: '#52525b',
            
            // Notes: Subtle differentiation
            noteBkgColor: '#27272a',
            noteTextColor: '#ffffff',
            noteBorderColor: '#52525b',
            
            // Actors (sequence diagrams)
            actorBorder: '#52525b',
            actorBkg: '#18181b',
            actorTextColor: '#ffffff',
            actorLineColor: '#ff9340',
            
            // Labels: Clean and minimal
            labelColor: '#ffffff',
            labelTextColor: '#ffffff',
            labelBoxBkgColor: '#18181b',
            labelBoxBorderColor: '#52525b',
            
            // Nodes: Consistent styling
            nodeBorder: '#52525b',
            nodeTextColor: '#ffffff',
            
            // Clusters: Subtle grouping
            clusterBkg: '#18181b',
            clusterBorder: '#52525b',
            
            // Edge labels
            edgeLabelBackground: '#000000',
            
            // Typography
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '14px'
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
            nodeSpacing: 50,
            rankSpacing: 50,
            diagramPadding: 8,
            useMaxWidth: true
          },
          sequence: {
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            useMaxWidth: true
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            gridLineStartPadding: 35,
            fontSize: 11,
            numberSectionStyles: 4,
            axisFormat: '%Y-%m-%d',
            useMaxWidth: true
          },
          securityLevel: 'loose',
          deterministicIds: true,
          deterministicIDSeed: 'mermaid-diagram'
        })

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        
        if (!cancelled) {
          setSvg(renderedSvg)
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error)
        if (!cancelled) {
          setError(`Error rendering diagram: ${error}`)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <div className={cn('not-prose my-6 rounded-lg border border-red-500 bg-red-950/20 p-4', className)}>
        <pre className="text-red-400 text-sm overflow-x-auto">{error}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={cn(
          'not-prose my-6 flex items-center justify-center rounded-lg border border-zinc-800 bg-black p-8',
          className
        )}
      >
        <div className="text-zinc-400 text-sm">Loading diagram...</div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'not-prose my-6 flex items-center justify-center rounded-lg border border-zinc-800 bg-black p-8 overflow-x-auto',
        '[&_svg]:max-w-full [&_svg]:h-auto',
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
