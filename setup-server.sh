#!/bin/bash

# WhiteShop Server Setup Script
# Գործարկեք այս script-ը սերվերի վրա: bash setup-server.sh

set -e  # Stop on error

PROJECT_ROOT="/var/www/WhiteShop"
cd "$PROJECT_ROOT"

echo "🚀 WhiteShop Server Setup"
echo "=========================="
echo ""

# 1. Ստուգել Node.js և npm
echo "📦 Ստուգում Node.js և npm..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js-ը չի գտնվել: Տեղադրեք Node.js 18.20.0+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm-ը չի գտնվել: Տեղադրեք npm 10.0.0+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version-ը պետք է լինի 18.20.0+: Հիմա $(node -v)"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo ""

# 2. Ստեղծել արմատային package.json (եթե չկա)
echo "📝 Ստուգում արմատային package.json..."
if [ ! -f "package.json" ]; then
    echo "📝 Ստեղծում արմատային package.json..."
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
    echo "✅ package.json ստեղծված է"
else
    echo "✅ package.json արդեն գոյություն ունի"
fi
echo ""

# 3. Ստեղծել packages թղթապանակներ
echo "📁 Ստեղծում packages թղթապանակներ..."
mkdir -p packages/design-tokens packages/ui
echo "✅ packages թղթապանակներ ստեղծված են"
echo ""

# 4. Ստեղծել packages/design-tokens/package.json (եթե չկա)
if [ ! -f "packages/design-tokens/package.json" ]; then
    echo "📝 Ստեղծում packages/design-tokens/package.json..."
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
    echo "✅ packages/design-tokens/package.json ստեղծված է"
else
    echo "✅ packages/design-tokens/package.json արդեն գոյություն ունի"
fi
echo ""

# 5. Ստեղծել packages/ui/package.json (եթե չկա)
if [ ! -f "packages/ui/package.json" ]; then
    echo "📝 Ստեղծում packages/ui/package.json..."
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
    echo "✅ packages/ui/package.json ստեղծված է"
else
    echo "✅ packages/ui/package.json արդեն գոյություն ունի"
fi
echo ""

# 6. Ստուգել, որ packages-ի ֆայլերը կան
echo "📦 Ստուգում packages-ի ֆայլեր..."
if [ ! -f "packages/design-tokens/index.ts" ]; then
    echo "⚠️  packages/design-tokens/index.ts չի գտնվել"
    echo "   Պետք է վերբեռնել Git-ից կամ ստեղծել ձեռքով"
fi

if [ ! -f "packages/ui/index.ts" ]; then
    echo "⚠️  packages/ui/index.ts չի գտնվել"
    echo "   Պետք է վերբեռնել Git-ից կամ ստեղծել ձեռքով"
fi
echo ""

# 7. Տեղադրել dependencies
echo "📦 Տեղադրում dependencies..."
npm install
echo "✅ Dependencies տեղադրված են"
echo ""

# 8. Ստուգել .env ֆայլ
echo "🔐 Ստուգում .env ֆայլ..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env ֆայլը չի գտնվել"
    echo "   Ստեղծեք .env ֆայլը ձեր կարգավորումներով"
    echo "   Տես SERVER-SETUP.md ֆայլը օրինակի համար"
else
    echo "✅ .env ֆայլը գոյություն ունի"
fi
echo ""

# 9. Build frontend (եթե production)
if [ "$1" == "production" ]; then
    echo "🏗️  Building frontend..."
    npm run build
    echo "✅ Frontend build ավարտված է"
    echo ""
fi

# 10. Ստեղծել logs թղթապանակ
echo "📁 Ստեղծում logs թղթապանակ..."
mkdir -p logs
echo "✅ logs թղթապանակ ստեղծված է"
echo ""

echo "✅ Setup ավարտված է!"
echo ""
echo "📋 Հաջորդ քայլեր:"
echo "1. Ստեղծեք .env ֆայլը (եթե չկա)"
echo "2. Կարգավորեք MongoDB, Redis, Meilisearch"
echo "3. Build frontend: npm run build"
echo "4. Գործարկեք PM2-ով (տես SERVER-SETUP.md)"
echo ""
echo "💡 Development mode-ի համար:"
echo "   npm run dev:api  # API-ի համար"
echo "   npm run dev:web  # Frontend-ի համար"
echo ""

