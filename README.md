# Shop Classic - Professional E-commerce Platform

A production-ready e-commerce platform built with Node.js, Express.js, and MongoDB.

## Features

- 🛍️ Product catalog with categories, brands, and variants
- 🔍 Full-text search (Meilisearch)
- 🛒 Shopping cart (guest and authenticated)
- 💳 Payment integration (Idram, ArCa)
- 📦 Order management system
- 👤 User accounts and authentication
- 🌍 Multi-language support (EN, RU, AM)
- ⚡ Redis caching
- 🔒 Security best practices

## Tech Stack

- **Backend**: Express.js (JavaScript)
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis 7
- **Search**: Meilisearch 1.6
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18.20.0+
- MongoDB (local or Atlas)
- Redis 7+
- npm 10+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shop-classic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp ../env.example.txt .env
# Edit .env with your configuration (MONGODB_URI, etc.)
```

4. Start MongoDB (if not running):
```bash
# Local MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Start the development server:
```bash
npm run dev:api
```

The API will be available at `http://localhost:3001`

## Project Structure

```
shop-classic/
├── apps/
│   ├── api/              # Express.js backend
│   └── web/              # Next.js frontend (future)
├── packages/
│   ├── domain/           # Business logic
│   ├── ui/               # UI components
│   └── design-tokens/    # Design system
├── config/               # Configuration files
└── Documentation/        # Project documentation
```

## API Endpoints

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:slug` - Get product by slug

### Categories
- `GET /api/v1/categories/tree` - Get category tree
- `GET /api/v1/categories/:slug` - Get category by slug

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add item to cart
- `PATCH /api/v1/cart/items/:id` - Update cart item
- `DELETE /api/v1/cart/items/:id` - Remove item from cart

### Orders
- `POST /api/v1/orders/checkout` - Create order
- `GET /api/v1/orders/:number` - Get order by number

## Configuration

All configuration files are in the `config/` directory:

- `brand.json` - Brand colors, logos, typography
- `contact.json` - Contact information
- `shipping.json` - Shipping methods and zones
- `payments.json` - Payment providers configuration

## Database

The database uses MongoDB with Mongoose ODM. Models are defined in `apps/api/src/models/`.

To connect to MongoDB:

```bash
# Using mongosh
mongosh "mongodb://localhost:27017/shop_dev"

# Or using MongoDB Compass
# Connect to: mongodb://localhost:27017/shop_dev
```

## Development

- `npm run dev:api` - Start API server in development mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

Private project

