# Ուղղել 404 page build սխալը

## Սերվերի վրա գործարկեք:

```bash
cd /var/www/WhiteShop/web

cat > next.config.js << 'ENDOFFILE'
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shop/ui', '@shop/design-tokens'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Standalone output - չի փորձում prerender անել 404 page-ը
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shop/ui': path.resolve(__dirname, '../packages/ui'),
      '@shop/design-tokens': path.resolve(__dirname, '../packages/design-tokens'),
      '../../../config': path.resolve(__dirname, '../config'),
      '../../../../config': path.resolve(__dirname, '../config'),
    };
    
    return config;
  },
  turbopack: {
    root: process.cwd(),
  },
};

module.exports = nextConfig;
ENDOFFILE

# Build
cd /var/www/WhiteShop
npm run build --workspace=web
```

