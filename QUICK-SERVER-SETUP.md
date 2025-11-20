# 🚀 Արագ սերվերի տեղադրում

## Գործարկեք այս հրամանները սերվերի վրա `/var/www/WhiteShop` թղթապանակում:

### 1. Ստեղծել արմատային package.json

```bash
cd /var/www/WhiteShop

cat > package.json << 'EOF'
{
  "name": "shop-classic",
  "version": "1.0.0",
  "private": true,
  "description": "Professional e-commerce platform",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\" --names \"API,WEB\" --prefix-colors \"blue,green\"",
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:web": "npm run dev --workspace=apps/web",
    "build": "npm run build --workspaces",
    "start:api": "npm run start --workspace=apps/api",
    "start:web": "npm run start --workspace=apps/web",
    "test": "npm run test --workspaces",
    "lint": "eslint . --ext .js",
    "format": "prettier --write \"**/*.{js,json,md}\"",
    "db:seed": "cd apps/api && node src/seed.js"
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
EOF
```

### 2. Ստեղծել packages թղթապանակներ

```bash
mkdir -p packages/design-tokens packages/ui
```

### 3. Ստեղծել packages/design-tokens/package.json

```bash
cat > packages/design-tokens/package.json << 'EOF'
{
  "name": "@shop/design-tokens",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "types": "index.ts",
  "scripts": {
    "build": "echo 'No build step required for design-tokens package'"
  },
  "exports": {
    ".": "./index.ts"
  }
}
EOF
```

### 4. Ստեղծել packages/ui/package.json

```bash
cat > packages/ui/package.json << 'EOF'
{
  "name": "@shop/ui",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "types": "index.ts",
  "scripts": {
    "build": "echo 'No build step required for UI package'"
  },
  "exports": {
    ".": "./index.ts",
    "./Button": "./Button.tsx",
    "./Card": "./Card.tsx",
    "./Input": "./Input.tsx"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
EOF
```

### 5. Վերբեռնել packages-ի ֆայլերը Git-ից

```bash
# Եթե packages-ները Git-ում են
git pull origin main

# Կամ ստեղծել minimal versions
```

### 6. Տեղադրել dependencies

```bash
npm install
```

### 7. Build frontend

```bash
npm run build
```

## ⚠️ Կարևոր

Եթե `packages/design-tokens/index.ts` և `packages/ui/` ֆայլերը չկան, պետք է վերբեռնել դրանք Git-ից կամ ստեղծել minimal versions:

```bash
# Ստուգել, թե արդյոք packages-ները կան
ls -la packages/design-tokens/
ls -la packages/ui/
```

