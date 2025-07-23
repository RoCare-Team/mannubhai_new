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
    minimumCacheTTL: 60, // Add cache TTL for images
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
    ];
  },

  // Redirects configuration
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

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add source maps in development
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map';
      config.output.devtoolModuleFilenameTemplate = function(info) {
        return `file:///${info.absoluteResourcePath.replace(/\\/g, '/')}`;
      };
    }

    // Add support for WASM if needed
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },

  // Enable source maps in production for debugging
  productionBrowserSourceMaps: true,

  // Performance configuration
  performance: {
    hints: false,
    maxAssetSize: 300000, // 300KB
    maxEntrypointSize: 300000, // 300KB
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'scheduler'
    ],
    swcMinify: true,
    // Enable if using Next.js 13+ features
    serverActions: true,
    optimizeCss: true,
  },

  // Security
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Internationalization if needed
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
};

export default nextConfig;