# 🚀 Սերվերի տեղադրում - WhiteShop

## 📋 Նախապայմաններ

Ստուգեք, որ սերվերի վրա տեղադրված են:
- Node.js 18.20.0+ 
- npm 10.0.0+
- MongoDB
- Redis
- PM2 (production-ի համար)

## 🔧 Քայլ առ քայլ տեղադրում

### 1. SSH միացում և նախագծի clone

```bash
# SSH միացում
ssh user@your-server-ip

# Նախագծի clone (եթե դեռ չեք արել)
cd /var/www
git clone <your-repo-url> WhiteShop
cd WhiteShop
```

### 2. Ստեղծել արմատային package.json (եթե չկա)

```bash
cd /var/www/WhiteShop

# Ստեղծել package.json
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

### 3. Ստեղծել packages թղթապանակներ

```bash
# Ստեղծել packages թղթապանակներ
mkdir -p packages/design-tokens packages/ui

# Ստեղծել packages/design-tokens/package.json
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

# Ստեղծել packages/ui/package.json
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

### 4. Վերբեռնել packages-ի ֆայլերը

Պետք է վերբեռնել `packages/design-tokens/index.ts` և `packages/ui/` թղթապանակի բոլոր ֆայլերը:

**Կամ օգտագործեք Git-ը:**
```bash
# Եթե packages-ները Git-ում են
git pull origin main
```

### 5. Տեղադրել dependencies

```bash
cd /var/www/WhiteShop
npm install
```

### 6. Ստեղծել .env ֆայլ

```bash
cd /var/www/WhiteShop

# Ստեղծել .env ֆայլ
cat > .env << 'EOF'
# App
NODE_ENV=production
APP_URL=http://your-domain.com
API_URL=http://your-domain.com/api

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/shop_prod

# Redis
REDIS_URL=redis://localhost:6379

# Meilisearch
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your-master-key-change-this

# JWT
JWT_SECRET=your-jwt-secret-min-32-characters-long-change-this
JWT_EXPIRES_IN=7d

# Payments (Idram)
IDRAM_MERCHANT_ID=your-merchant-id
IDRAM_SECRET_KEY=your-secret-key
IDRAM_PUBLIC_KEY=your-public-key

# Payments (ArCa)
ARCA_MERCHANT_ID=your-merchant-id
ARCA_API_KEY=your-api-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@shop.am
SMTP_PASSWORD=your-password

# Server Ports
PORT=3001
NEXT_PUBLIC_API_URL=http://your-domain.com/api
EOF

# Խմբագրել .env ֆայլը ձեր կարգավորումներով
nano .env
```

### 7. Build frontend

```bash
cd /var/www/WhiteShop
npm run build
```

### 8. PM2-ով աշխատացնել (Production)

#### Տեղադրել PM2

```bash
npm install -g pm2
```

#### Ստեղծել PM2 ecosystem file

```bash
cd /var/www/WhiteShop

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'whiteshop-api',
      script: './apps/api/src/server.js',
      cwd: '/var/www/WhiteShop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'whiteshop-web',
      script: 'npm',
      args: 'run start:web',
      cwd: '/var/www/WhiteShop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_file: './logs/web-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
EOF

# Ստեղծել logs թղթապանակ
mkdir -p logs
```

#### Գործարկել PM2-ով

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Գործարկեք հրամանը, որը ցույց կտա PM2-ը
```

### 9. Nginx Reverse Proxy (Կամավոր)

Եթե օգտագործում եք Nginx, ստեղծեք configuration:

```bash
sudo nano /etc/nginx/sites-available/whiteshop
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/whiteshop /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 10. Ստուգում

```bash
# Ստուգել PM2 status
pm2 status

# Ստուգել logs
pm2 logs

# Ստուգել API health
curl http://localhost:3001/health

# Ստուգել Frontend
curl http://localhost:3000
```

## 🔄 Օգտակար PM2 հրամաններ

```bash
# View status
pm2 status

# View logs
pm2 logs
pm2 logs whiteshop-api
pm2 logs whiteshop-web

# Restart
pm2 restart all
pm2 restart whiteshop-api
pm2 restart whiteshop-web

# Stop
pm2 stop all

# Delete
pm2 delete all
```

## 📝 Նշումներ

- MongoDB-ն պետք է աշխատի և հասանելի լինի
- Redis-ը պետք է աշխատի
- Meilisearch-ը պետք է աշխատի (եթե օգտագործում եք)
- .env ֆայլում փոխեք բոլոր `your-*` արժեքները
- CORS-ը արդեն կարգավորված է production-ի համար

## 🐛 Troubleshooting

### Եթե npm install-ը չի աշխատում:
```bash
# Ստուգել, որ packages թղթապանակները կան
ls -la packages/

# Եթե չկան, վերբեռնել Git-ից
git pull origin main
```

### Եթե PM2-ը չի գործարկում:
```bash
# Ստուգել logs
pm2 logs

# Ստուգել, որ Node.js-ը տեղադրված է
node -v
npm -v
```

### Եթե port-ները զբաղված են:
```bash
# Գտնել process-ը
sudo lsof -i :3000
sudo lsof -i :3001

# Կանգնեցնել
sudo kill -9 <PID>
```

