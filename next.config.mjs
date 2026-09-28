/** @type {import('next').NextConfig} */
export default {
  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/about/introduction',
        permanent: true
      },
      // Restructured usage pages (matched to lla/docs layout)
      { source: '/docs/usage/basic-usage', destination: '/docs/usage/views', permanent: true },
      { source: '/docs/usage/view-formats', destination: '/docs/usage/views', permanent: true },
      {
        source: '/docs/usage/file-filtering',
        destination: '/docs/usage/filtering-search',
        permanent: true
      },
      {
        source: '/docs/usage/sorting-and-organizing',
        destination: '/docs/usage/filtering-search',
        permanent: true
      },
      { source: '/docs/usage/config', destination: '/docs/usage/configuration', permanent: true },
      {
        source: '/docs/usage/content-search',
        destination: '/docs/usage/filtering-search',
        permanent: true
      },
      { source: '/docs/usage/themes', destination: '/docs/usage/configuration', permanent: true },
      // Restructured plugin pages
      { source: '/docs/plugins/concepts', destination: '/docs/plugins/overview', permanent: true },
      {
        source: '/docs/plugins/stability',
        destination: '/docs/plugins/architecture',
        permanent: true
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}
