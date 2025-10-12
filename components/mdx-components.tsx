import { DefaultInstallation } from '@/components/default-installation'
import { Mermaid } from '@/components/docs/rehype/mermaid'
import { PlainCode } from '@/components/docs/rehype/plain-code'
import { ManualInstallation } from '@/components/manual-installation'
import { useMDXComponent } from '@/lib/hooks/use-mdx'
import Image from 'next/image'
import { Link, type LinkProps, Snippet, type SnippetProps } from 'ui'
import { Logo } from './logo'

interface MdxProps {
  code: string
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code)
  return (
    <Component
      components={{
        Image,
        Default: DefaultInstallation,
        ManualInstall: ManualInstallation,
        Mermaid: Mermaid,
        a: (props: LinkProps) => (
          <Link intent="primary" {...props} className="not-prose xd2432 font-medium hover:underline" />
        ),
        PlainCode: PlainCode,
        Snippet: (props: SnippetProps) => <Snippet {...props} className="bg-[#0e0e10] text-white" />,
        Banner: () => (
          <div className="h-56 mb-8 bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full flex items-center justify-center">
            <Logo className="w-48" />
          </div>
        )
      }}
    />
  )
}
