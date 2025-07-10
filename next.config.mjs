/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

console.log("NEXTAUTH_SECRET in next.config.mjs:", process.env.NEXTAUTH_SECRET);


export default nextConfig
