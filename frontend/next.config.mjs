/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 👈 This is the key line for Netlify/Render-style deploys

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

export default nextConfig
