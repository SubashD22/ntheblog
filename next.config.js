/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  httpAgentOptions: {
    keepAlive: false,
  },
  reactStrictMode: true,
  images:{
    domains:['res.cloudinary.com']
  }
}

module.exports = nextConfig
