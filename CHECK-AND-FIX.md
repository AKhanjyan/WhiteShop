# Ստուգում և ուղղում

## Ստուգեք, թե ինչ կա:

```bash
cd /var/www/WhiteShop

# Ստուգել packages թղթապանակները
ls -la packages/
ls -la packages/design-tokens/
ls -la packages/ui/

# Ստուգել package.json-ները
ls -la packages/design-tokens/package.json
ls -la packages/ui/package.json
```

## Եթե packages թղթապանակները չկան:

```bash
mkdir -p packages/design-tokens packages/ui
```

## Եթե package.json-ները չկան, ստեղծեք դրանք:

### 1. packages/design-tokens/package.json

```bash
cat > packages/design-tokens/package.json << 'ENDOFFILE'
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
ENDOFFILE
```

### 2. packages/ui/package.json

```bash
cat > packages/ui/package.json << 'ENDOFFILE'
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
ENDOFFILE
```

### 3. Ստեղծել minimal index.ts ֆայլերը (եթե չկան)

```bash
# packages/design-tokens/index.ts
cat > packages/design-tokens/index.ts << 'ENDOFFILE'
export const colors = { primary: '#000000', secondary: '#FFFFFF' } as const;
export const spacing = { 0: '0', 1: '0.25rem', 2: '0.5rem' } as const;
ENDOFFILE

# packages/ui/index.ts
cat > packages/ui/index.ts << 'ENDOFFILE'
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
ENDOFFILE
```

### 4. Ստուգել workspaces

```bash
npm ls --workspaces
```

### 5. Նորից տեղադրել

```bash
npm install
```

### 6. Build

```bash
npm run build
```

