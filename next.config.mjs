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
};

// HTTPS configuration for local development
if (process.env.NODE_ENV === 'development') {
  import('fs').then(fs => {
    import('path').then(path => {
      const certPath = path.join(process.cwd(), 'localhost.crt');
      const keyPath = path.join(process.cwd(), 'localhost.key');

      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        nextConfig.server = {
          https: {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          },
        };
      } else {
        console.warn('⚠️ HTTPS certificates not found. Falling back to HTTP.');
        console.warn('Run this command to generate certificates:');
        console.warn('openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj \'/CN=localhost\' -extensions EXT -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")');
      }
    });
  });
}

export default nextConfig;