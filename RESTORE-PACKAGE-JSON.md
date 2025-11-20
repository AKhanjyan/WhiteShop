# Վերականգնել package.json

## Սերվերի վրա գործարկեք:

```bash
cd /var/www/WhiteShop

# Ստեղծել package.json
cat > package.json << 'ENDOFFILE'
{
  "name": "shop-classic",
  "version": "1.0.0",
  "private": true,
  "description": "Professional e-commerce platform",
  "workspaces": [
    "api",
    "web",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=api\" \"npm run dev --workspace=web\" --names \"API,WEB\" --prefix-colors \"blue,green\"",
    "dev:api": "npm run dev --workspace=api",
    "dev:web": "npm run dev --workspace=web",
    "build": "npm run build --workspaces",
    "start:api": "npm run start --workspace=api",
    "start:web": "npm run start --workspace=web",
    "test": "npm run test --workspaces",
    "lint": "eslint . --ext .js",
    "format": "prettier --write \"**/*.{js,json,md}\"",
    "db:seed": "cd api && node src/seed.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "concurrently": "^8.2.2",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  },
  "engines": {
    "node": ">=18.20.0",
    "npm": ">=10.0.0"
  }
}
ENDOFFILE

# Ստուգել
ls -la package.json

# Build
npm run build --workspace=web
```

