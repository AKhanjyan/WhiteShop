#!/bin/bash

# Complete setup script for monorepo on server
# Run this on the server: bash setup-server-monorepo.sh

PROJECT_ROOT="/var/www/WhiteShop"
cd "$PROJECT_ROOT"

echo "🔧 Setting up monorepo structure on server..."

# 1. Create root package.json
echo "📝 Creating root package.json..."
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
echo "✅ Created root package.json"

# 2. Create packages directory if it doesn't exist
if [ ! -d "packages" ]; then
    echo "📁 Creating packages directory..."
    mkdir -p packages
    echo "✅ Created packages directory"
else
    echo "✅ packages directory already exists"
fi

# 3. Create packages/design-tokens if it doesn't exist
if [ ! -d "packages/design-tokens" ]; then
    echo "📁 Creating packages/design-tokens..."
    mkdir -p packages/design-tokens
    echo "✅ Created packages/design-tokens directory"
else
    echo "✅ packages/design-tokens directory already exists"
fi

# 4. Create packages/design-tokens/package.json
echo "📝 Creating packages/design-tokens/package.json..."
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
echo "✅ Created packages/design-tokens/package.json"

# 5. Create packages/design-tokens/index.ts (minimal version)
if [ ! -f "packages/design-tokens/index.ts" ]; then
    echo "📝 Creating packages/design-tokens/index.ts..."
    cat > packages/design-tokens/index.ts << 'EOF'
/**
 * Design Tokens
 * 
 * Centralized design system values.
 * DO NOT MODIFY - these are system-wide constants.
 */

// Colors - Pure colors only (NO GRADIENTS)
export const colors = {
  // Brand colors
  primary: '#000000',
  secondary: '#FFFFFF',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  
  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

// Spacing - Standard Tailwind values only
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'sans-serif'],
    heading: ['system-ui', '-apple-system', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// Breakpoints (for reference)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
EOF
    echo "✅ Created packages/design-tokens/index.ts"
else
    echo "✅ packages/design-tokens/index.ts already exists"
fi

# 6. Create packages/ui if it doesn't exist
if [ ! -d "packages/ui" ]; then
    echo "📁 Creating packages/ui..."
    mkdir -p packages/ui
    echo "✅ Created packages/ui directory"
else
    echo "✅ packages/ui directory already exists"
fi

# 7. Create packages/ui/package.json
echo "📝 Creating packages/ui/package.json..."
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
echo "✅ Created packages/ui/package.json"

# 8. Create minimal packages/ui/index.ts
if [ ! -f "packages/ui/index.ts" ]; then
    echo "📝 Creating packages/ui/index.ts..."
    cat > packages/ui/index.ts << 'EOF'
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
EOF
    echo "✅ Created packages/ui/index.ts"
else
    echo "✅ packages/ui/index.ts already exists"
fi

echo ""
echo "✅ Monorepo structure setup complete!"
echo ""
echo "🚀 Now run: npm install"
echo ""

