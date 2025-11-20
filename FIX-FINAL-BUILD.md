# Վերջնական build ուղղում

## Սերվերի վրա գործարկեք:

```bash
cd /var/www/WhiteShop

# 1. Ստուգել config թղթապանակը
ls -la config/

# 2. Եթե չկա, ստեղծել
mkdir -p config

# 3. Ստեղծել config/contact.json
cat > config/contact.json << 'ENDOFFILE'
{
  "phone": "+374 XX XXX XXX",
  "email": "info@shop.am",
  "address": {
    "en": "Yerevan, Abovyan 10",
    "ru": "г. Ереван, ул. Абовяна 10",
    "am": "Երևան, Աբովյան 10"
  },
  "workingHours": {
    "en": "Mon-Fri 10:00-19:00",
    "ru": "Пн-Пт 10:00-19:00",
    "am": "Երկ-Ուրբ 10:00-19:00"
  }
}
ENDOFFILE

# 4. Ստեղծել config/shipping.json
cat > config/shipping.json << 'ENDOFFILE'
{
  "methods": [
    {
      "id": "standard",
      "name": {
        "en": "Standard Shipping",
        "ru": "Стандартная доставка",
        "am": "Ստանդարտ առաքում"
      },
      "price": 0,
      "duration": {
        "en": "3-5 business days",
        "ru": "3-5 рабочих дней",
        "am": "3-5 աշխատանքային օր"
      }
    },
    {
      "id": "express",
      "name": {
        "en": "Express Shipping",
        "ru": "Экспресс доставка",
        "am": "Արագ առաքում"
      },
      "price": 5000,
      "duration": {
        "en": "1-2 business days",
        "ru": "1-2 рабочих дня",
        "am": "1-2 աշխատանքային օր"
      }
    }
  ],
  "zones": [
    {
      "id": "yerevan",
      "name": {
        "en": "Yerevan",
        "ru": "Ереван",
        "am": "Երևան"
      },
      "freeShippingThreshold": 50000
    }
  ]
}
ENDOFFILE

# 5. Թարմացնել web/next.config.js (հեռացնել missingSuspenseWithCSRBailout)
cd web
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

# 6. Build
cd /var/www/WhiteShop
npm run build --workspace=web
```

