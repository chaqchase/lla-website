import { CodeBlock } from '@/components/docs/code-block'
import { Callout, Card, Cards, Diagram, ViewIndex } from '@/components/docs/blocks'
import { Mermaid } from '@/components/docs/mermaid'
import { Shot } from '@/components/docs/shot'
import { ConfigLayers, FilterGates, JumpFlow, OutputPipeline, PluginPlatform } from '@/components/illustrations'
import { useMDXComponent } from '@/lib/hooks/use-mdx'
import Link from 'next/link'
import type { ComponentProps } from 'react'

function Anchor({ href = '', ...props }: ComponentProps<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} {...props} />
  }
  return <a href={href} {...props} />
}

const components = {
  a: Anchor,
  pre: CodeBlock,
  table: (props: ComponentProps<'table'>) => (
    <div className="doc-table">
      <table {...props} />
    </div>
  ),
  Callout,
  Card,
  Cards,
  ConfigLayers,
  Diagram,
  FilterGates,
  JumpFlow,
  Mermaid,
  OutputPipeline,
  PluginPlatform,
  Shot,
  ViewIndex
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
