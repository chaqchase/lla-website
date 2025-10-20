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
