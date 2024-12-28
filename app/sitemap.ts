import { type Docs, docs } from '@/.velite'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://lla.chaqchase.com/',
      lastModified: new Date()
    },
    ...docs.map((doc: Docs) => ({
      url: `https://lla.chaqchase.com/${doc.slug}`,
      lastModified: new Date()
    }))
  ]
}
