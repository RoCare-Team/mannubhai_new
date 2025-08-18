/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, // Consider removing this in production for better image optimization
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
    minimumCacheTTL: 60, // Cache TTL for optimized images
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },

        ],
      },
    ];
  },
experimental: {
    legacyBrowsers: false, 
      browserslist: [
    ">0.5%",
    "last 2 versions",
    "not dead",
    "not IE 11",
    "not op_mini all",
  ]
  },

  // Permanent Redirects
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
        source: '/beauty-care',
        destination: '/beauty',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
