# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

Create `.env` file in the root directory with the following content:

```env
# App
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/shop_dev

# Redis
REDIS_URL=redis://localhost:6379

# Meilisearch
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=master-key-change-in-production

# JWT
JWT_SECRET=your-jwt-secret-min-32-characters-long-change-in-production
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
```

### 3. Start MongoDB

Start MongoDB (if not already running):

```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option 3: MongoDB Atlas (cloud)
# Use connection string in MONGODB_URI
```

### 4. Verify MongoDB Connection

```bash
# Test connection
mongosh "mongodb://localhost:27017/shop_dev"
# Or use MongoDB Compass GUI
```

### 5. Start the Server

```bash
npm run dev:api
```

The API will be available at `http://localhost:3001`

## Verify Installation

Check health endpoint:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-07T..."
}
```

## API Testing

### Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the token from response for authenticated requests.

### Get Products

```bash
curl http://localhost:3001/api/v1/products?lang=en
```

### Get Categories

```bash
curl http://localhost:3001/api/v1/categories/tree?lang=en
```

## Notes

- All API responses are in English by default (lang=en)
- All error messages are in English
- All configuration files use English labels
- Default locale is "en" for all new users

