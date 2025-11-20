# Ուղղել workspaces կարգավորումը

## Խնդիր
Նախագծի կառուցվածքը տարբեր է - `api` և `web` թղթապանակները գտնվում են արմատում, ոչ թե `apps/`-ում:

## Լուծում

### 1. Ստուգել կառուցվածքը

```bash
cd /var/www/WhiteShop

# Ստուգել api և web թղթապանակները
ls -la api/
ls -la web/
ls -la api/package.json
ls -la web/package.json
```

### 2. Եթե package.json-ները չկան, ստեղծել դրանք

#### api/package.json
```bash
cat > api/package.json << 'ENDOFFILE'
{
  "name": "@shop/api",
  "version": "1.0.0",
  "private": true,
  "main": "src/server.js",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "build": "echo 'No build step required for API'",
    "lint": "eslint src",
    "create-admin": "node src/scripts/createAdmin.js",
    "seed": "node src/seed.js",
    "publish-all-products": "node src/scripts/publishAllProducts.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "ioredis": "^5.3.2",
    "meilisearch": "^0.38.0",
    "date-fns": "^3.0.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "uuid": "^9.0.1"
  }
}
ENDOFFILE
```

#### web/package.json
```bash
cat > web/package.json << 'ENDOFFILE'
{
  "name": "@shop/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:webpack": "next dev --no-turbo",
    "dev:clean": "rm -rf .next && next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@shop/design-tokens": "*",
    "@shop/ui": "*",
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.66.0",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
ENDOFFILE
```

### 3. Թարմացնել արմատային package.json-ի workspaces

```bash
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
```

### 4. Նորից տեղադրել

```bash
npm install
```

### 5. Ստուգել workspaces

```bash
npm ls --workspaces
```

### 6. Build

```bash
npm run build --workspace=web
```

