/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
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
    minimumCacheTTL: 60,
  },

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
      },
      {
        source: '/:city/franchise/franchise-opportunities',
        destination: '/franchise/franchise-opportunities',
        permanent: true,
      },
    ];
  },
  
  experimental: { 
    scrollRestoration: true,
  },
};
  
export default nextConfig;