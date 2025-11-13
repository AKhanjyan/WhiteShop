const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

const adminController = {
  /**
   * Get admin dashboard statistics
   * GET /api/v1/admin/stats
   */
  async getStats(req, res, next) {
    try {
      console.log('📊 [ADMIN] Fetching dashboard statistics...');
      console.log('📊 [ADMIN] User making request:', req.user?.id, req.user?.email);

      // Get total users (excluding deleted)
      let totalUsers = 0;
      try {
        totalUsers = await User.countDocuments({ deletedAt: null });
        console.log('✅ [ADMIN] Total users:', totalUsers);
      } catch (err) {
        console.error('❌ [ADMIN] Error counting users:', err);
        totalUsers = 0;
      }
      
      // Get total products (excluding deleted)
      let totalProducts = 0;
      let lowStockProducts = 0;
      try {
        totalProducts = await Product.countDocuments({ deletedAt: null });
        lowStockProducts = await Product.countDocuments({
          deletedAt: null,
          'variants.stock': { $lt: 10 },
        });
        console.log('✅ [ADMIN] Total products:', totalProducts, 'Low stock:', lowStockProducts);
      } catch (err) {
        console.error('❌ [ADMIN] Error counting products:', err);
        totalProducts = 0;
        lowStockProducts = 0;
      }
      
      // Get total orders
      let totalOrders = 0;
      let recentOrders = 0;
      let pendingOrders = 0;
      let totalRevenue = 0;
      try {
        totalOrders = await Order.countDocuments();
        
        // Get recent orders count (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        recentOrders = await Order.countDocuments({
          createdAt: { $gte: sevenDaysAgo },
        });

        // Get pending orders count
        pendingOrders = await Order.countDocuments({
          status: 'pending',
        });

        // Get total revenue (sum of all paid orders)
        const revenueResult = await Order.aggregate([
          {
            $match: {
              paymentStatus: 'paid',
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
            },
          },
        ]);
        totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        
        console.log('✅ [ADMIN] Orders stats:', { totalOrders, recentOrders, pendingOrders, totalRevenue });
      } catch (err) {
        console.error('❌ [ADMIN] Error counting orders:', err);
        totalOrders = 0;
        recentOrders = 0;
        pendingOrders = 0;
        totalRevenue = 0;
      }

      const stats = {
        users: {
          total: totalUsers,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        orders: {
          total: totalOrders,
          recent: recentOrders,
          pending: pendingOrders,
        },
        revenue: {
          total: Number(totalRevenue),
          currency: 'AMD',
        },
      };

      console.log('✅ [ADMIN] Statistics fetched successfully:', JSON.stringify(stats, null, 2));
      res.json(stats);
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching stats:', error);
      console.error('❌ [ADMIN] Error stack:', error.stack);
      
      // Return error response
      res.status(500).json({
        type: 'https://api.shop.am/problems/internal-server-error',
        title: 'Internal Server Error',
        status: 500,
        detail: error.message || 'Failed to fetch statistics',
        instance: req.path,
      });
    }
  },

  /**
   * Get all users (admin only)
   * GET /api/v1/admin/users?page=&limit=&search=
   */
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = { deletedAt: null };

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
          { email: searchRegex },
          { phone: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        User.countDocuments(query),
      ]);

      res.json({
        data: users.map((user) => ({
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles || ['customer'],
          blocked: user.blocked || false,
          createdAt: user.createdAt,
        })),
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all orders (admin only)
   * GET /api/v1/admin/orders?page=&limit=&status=
   */
  async getOrders(req, res, next) {
    try {
      const { page = 1, limit = 20, status = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (status) {
        query.status = status;
      }

      const [orders, total] = await Promise.all([
        Order.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Order.countDocuments(query),
      ]);

      res.json({
        data: orders.map((order) => ({
          id: order._id.toString(),
          number: order.number,
          status: order.status,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          total: Number(order.total),
          currency: order.currency,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          itemsCount: order.items?.length || 0,
          createdAt: order.createdAt,
        })),
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all products (admin only, including unpublished)
   * GET /api/v1/admin/products?page=&limit=&search=
   */
  async getProducts(req, res, next) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = { deletedAt: null };

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
          { 'translations.title': searchRegex },
          { 'translations.slug': searchRegex },
          { 'variants.sku': searchRegex },
        ];
      }

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('brandId', 'slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Product.countDocuments(query),
      ]);

      res.json({
        data: products.map((product) => {
          const translation = product.translations?.[0];
          const variant = product.variants
            ?.filter((v) => v.published)
            .sort((a, b) => a.price - b.price)[0];

          return {
            id: product._id.toString(),
            slug: translation?.slug || '',
            title: translation?.title || '',
            published: product.published || false,
            price: variant?.price || 0,
            stock: variant?.stock || 0,
            image: Array.isArray(product.media) && product.media[0]
              ? (typeof product.media[0] === 'string' ? product.media[0] : product.media[0].url)
              : null,
            createdAt: product.createdAt,
          };
        }),
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new product (admin only)
   * POST /api/v1/admin/products
   */
  async createProduct(req, res, next) {
    try {
      console.log('📝 [ADMIN] Creating new product...');
      console.log('📝 [ADMIN] Request body:', JSON.stringify(req.body, null, 2));

      const {
        title,
        slug,
        subtitle,
        descriptionHtml,
        brandId,
        categoryIds,
        primaryCategoryId,
        price,
        compareAtPrice,
        stock,
        sku,
        published = false,
        locale = 'en',
      } = req.body;

      // Validate required fields
      if (!title || !slug) {
        return res.status(400).json({
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          status: 400,
          detail: 'Title and slug are required',
          instance: req.path,
        });
      }

      // Check if product with same slug already exists
      const existingProduct = await Product.findOne({
        'translations.slug': slug,
        'translations.locale': locale,
        deletedAt: null,
      });

      if (existingProduct) {
        return res.status(409).json({
          type: 'https://api.shop.am/problems/conflict',
          title: 'Conflict',
          status: 409,
          detail: `Product with slug '${slug}' already exists`,
          instance: req.path,
        });
      }

      // Generate SKU if not provided
      let productSku = sku;
      if (!productSku) {
        const timestamp = Date.now();
        productSku = `PROD-${timestamp}`;
      }

      // Create product
      const productData = {
        translations: [
          {
            locale,
            title,
            slug,
            subtitle: subtitle || '',
            descriptionHtml: descriptionHtml || '',
          },
        ],
        variants: [
          {
            sku: productSku,
            price: parseFloat(price) || 0,
            compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
            stock: parseInt(stock) || 0,
            published: true,
          },
        ],
        published: published === true,
        publishedAt: published ? new Date() : null,
      };

      if (brandId) {
        productData.brandId = brandId;
      }

      if (categoryIds && Array.isArray(categoryIds)) {
        productData.categoryIds = categoryIds;
      }

      if (primaryCategoryId) {
        productData.primaryCategoryId = primaryCategoryId;
      }

      const product = await Product.create(productData);

      console.log('✅ [ADMIN] Product created successfully:', product._id.toString());

      const translation = product.translations?.[0];
      const variant = product.variants?.[0];

      res.status(201).json({
        id: product._id.toString(),
        slug: translation?.slug || '',
        title: translation?.title || '',
        subtitle: translation?.subtitle,
        description: translation?.descriptionHtml,
        price: variant?.price || 0,
        stock: variant?.stock || 0,
        sku: variant?.sku || '',
        published: product.published,
        createdAt: product.createdAt,
      });
    } catch (error) {
      console.error('❌ [ADMIN] Error creating product:', error);
      next(error);
    }
  },

  /**
   * Get all brands (admin only)
   * GET /api/v1/admin/brands
   */
  async getBrands(req, res, next) {
    try {
      const brands = await Brand.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .lean();

      res.json({
        data: brands.map((brand) => {
          const translation = brand.translations?.[0];
          return {
            id: brand._id.toString(),
            slug: brand.slug,
            name: translation?.name || '',
            logoUrl: brand.logoUrl,
            published: brand.published,
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all categories (admin only, flat list)
   * GET /api/v1/admin/categories
   */
  async getCategories(req, res, next) {
    try {
      const { lang = 'en' } = req.query;
      const categories = await Category.find({ deletedAt: null })
        .sort({ position: 1 })
        .lean();

      res.json({
        data: categories.map((category) => {
          const translation = category.translations?.find((t) => t.locale === lang) || category.translations?.[0];
          return {
            id: category._id.toString(),
            slug: translation?.slug || '',
            title: translation?.title || '',
            parentId: category.parentId?.toString() || null,
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get recent activity
   * GET /api/v1/admin/activity?limit=
   */
  async getActivity(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      // Get recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('number status total createdAt customerEmail')
        .lean();

      // Get recent users
      const recentUsers = await User.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('email phone firstName lastName createdAt')
        .lean();

      const activity = [
        ...recentOrders.map((order) => ({
          type: 'order',
          title: `New order #${order.number}`,
          description: `Order total: ${order.total} ${order.currency || 'AMD'}`,
          timestamp: order.createdAt,
        })),
        ...recentUsers.map((user) => ({
          type: 'user',
          title: `New user registered`,
          description: user.email || user.phone || 'User',
          timestamp: user.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, parseInt(limit));

      res.json({ data: activity });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;

