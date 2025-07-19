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
  // Webpack configuration to handle internal references
  webpack: (config, { isServer }) => {
    // Modify webpack internal paths in development
    if (process.env.NODE_ENV === 'development') {
      config.output.devtoolModuleFilenameTemplate = function(info) {
        return `file:///${info.absoluteResourcePath.replace(/\\/g, '/')}`;
      };
    }

    return config;
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable performance hints
  performance: {
    hints: false,
  },
  // Optional: Optimize large package imports
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'scheduler'
    ],
    // Enable if you're using SWC minification
    swcMinify: true,
  },
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;