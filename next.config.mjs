/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.waterpurifierservicecenter.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  // Add redirects configuration
  async redirects() {
    return [
      {
        source: '/franchise-opportunities',
        destination: '/franchise/franchise-opportunities',
        permanent: true,
      },
      {
        source: '/franchise',
        destination: '/franchise/franchise-opportunities',
        permanent: true,
      }
    ];
  },
  // Modern JavaScript optimizations
  compiler: {
    // Only include necessary polyfills
    polyfills: [
      'fetch',
      'url',
      'blob'
      // Removed Array.at, Array.flat, Object.fromEntries, etc. as they're in Baseline
    ],
  },
  experimental: {
    // Enable modern JavaScript output
    modern: true,
    // Optional: Enable SWC minification (more efficient than Terser)
    swcMinify: true,
  },
  // Enable React strict mode (good practice)
  reactStrictMode: true,
  // Environment variables if needed
  env: {
    // Add your environment variables here
  }
}

export default nextConfig;