/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/manifest.json', destination: '/api/manifest' }]
  },
}

module.exports = nextConfig
