/** @type {import('next').NextConfig} */

import { GONE_PATHS } from './gonePaths.js';

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
    // Create 410 redirects for gone paths
    const goneRedirects = Array.from(GONE_PATHS)
      .map(url => {
        const path = url.replace('https://www.mannubhai.com', '');
        // Ensure the path starts with '/' and is valid
        if (!path.startsWith('/') || path.trim() === '') {
          console.warn(`Skipping invalid path: ${path}`);
          return null;
        }
        return {
          source: path,
          destination: '/410',
          statusCode: 308, // Using 308 for permanent redirect
        };
      })
      .filter(redirect => redirect !== null); // Remove any null entries

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
      ...goneRedirects,
    ];
  },
  
  experimental: { 
    scrollRestoration: true,
  },
};
  
export default nextConfig;