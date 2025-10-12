import { visit } from 'unist-util-visit'
import type { Root, Element, Text } from 'hast'

export function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: any, index: any, parent: any) => {
      // Check if this is a code block with mermaid language
      if (
        node.tagName === 'pre' &&
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0] as Element
        const className = codeNode.properties?.className as string[] | undefined
        
        // Check if it's a mermaid code block
        if (className && className.some((cls: string) => cls === 'language-mermaid')) {
          // Extract the mermaid code
          const codeContent = codeNode.children[0] as Text
          if (codeContent && codeContent.type === 'text' && codeContent.value) {
            // Replace the pre/code structure with our Mermaid component
            const mermaidNode: Element = {
              type: 'element',
              tagName: 'Mermaid',
              properties: {
                chart: codeContent.value
              },
              children: []
            }
            
            // Replace the node in the parent
            if (parent && typeof index === 'number' && Array.isArray(parent.children)) {
              parent.children[index] = mermaidNode
            }
          }
        }
      }
    })
  }
}
