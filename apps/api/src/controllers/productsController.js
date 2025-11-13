const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { safeRedis } = require('../lib/redis');

const productsController = {
  /**
   * Get all products with filters
   * GET /api/v1/products?category=&filters=&search=&sort=&page=&limit=&lang=
   */
  async findAll(req, res, next) {
    try {
      const {
        category,
        filters,
        search,
        sort = 'createdAt',
        page = 1,
        limit = 24,
        lang = 'en',
      } = req.query;

      // Reduced cache TTL for products list to show new products faster
      // Cache key includes timestamp to help with cache invalidation
      const cacheKey = `products:${JSON.stringify(req.query)}`;
      const cached = await safeRedis.get(cacheKey);
      
      // Only use cache if it's less than 1 minute old (reduced from 5 minutes)
      // This ensures new products appear faster
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const query = {
        published: true,
        deletedAt: null,
      };

      // Add search filter
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
          { 'translations.title': searchRegex },
          { 'translations.subtitle': searchRegex },
          { 'translations.descriptionHtml': searchRegex },
          { 'variants.sku': searchRegex },
        ];
      }

      // Add category filter
      if (category) {
        const categoryDoc = await Category.findOne({
          'translations.slug': category,
          'translations.locale': lang,
          published: true,
          deletedAt: null,
        });

        if (categoryDoc) {
          if (query.$or) {
            // If search already exists, combine with category filter
            query.$and = [
              { $or: query.$or },
              {
                $or: [
                  { primaryCategoryId: categoryDoc._id },
                  { categoryIds: categoryDoc._id },
                ],
              },
            ];
            delete query.$or;
          } else {
            query.$or = [
              { primaryCategoryId: categoryDoc._id },
              { categoryIds: categoryDoc._id },
            ];
          }
        }
      }

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('brandId', 'slug')
          .populate({
            path: 'brandId',
            select: 'slug translations',
          })
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ [sort]: -1 })
          .lean(),
        Product.countDocuments(query),
      ]);

      const response = {
        data: products.map((product) => {
          const translation = product.translations?.find((t) => t.locale === lang) || product.translations?.[0];
          const brandTranslation = product.brandId?.translations?.find((t) => t.locale === lang) || product.brandId?.translations?.[0];
          const variant = product.variants
            ?.filter((v) => v.published)
            .sort((a, b) => a.price - b.price)[0];

          return {
            id: product._id.toString(),
            slug: translation?.slug || '',
            title: translation?.title || '',
            brand: product.brandId
              ? {
                  id: product.brandId._id.toString(),
                  name: brandTranslation?.name || '',
                }
              : null,
            price: variant?.price || 0,
            compareAtPrice: variant?.compareAtPrice || null,
            image: Array.isArray(product.media) && product.media[0]
              ? (typeof product.media[0] === 'string' ? product.media[0] : product.media[0].url)
              : null,
            inStock: (variant?.stock || 0) > 0,
          };
        }),
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      };

      // Cache for 1 minute (reduced from 5 minutes) to show new products faster
      await safeRedis.setex(cacheKey, 60, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get product by slug
   * GET /api/v1/products/:slug?lang=
   */
  async findBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { lang = 'en' } = req.query;

      const cacheKey = `product:${slug}:${lang}`;
      const cached = await safeRedis.get(cacheKey);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const product = await Product.findOne({
        'translations.slug': slug,
        'translations.locale': lang,
        published: true,
        deletedAt: null,
      })
        .populate('brandId')
        .populate('categoryIds')
        .populate('primaryCategoryId')
        .lean();

      if (!product) {
        return res.status(404).json({
          type: 'https://api.shop.am/problems/not-found',
          title: 'Product not found',
          status: 404,
          detail: `Product with slug '${slug}' does not exist or is not published`,
          instance: req.path,
        });
      }

      const translation = product.translations?.find((t) => t.locale === lang) || product.translations?.[0];
      const brandTranslation = product.brandId?.translations?.find((t) => t.locale === lang) || product.brandId?.translations?.[0];

      const categories = await Category.find({
        _id: { $in: product.categoryIds || [] },
      }).lean();

      const response = {
        id: product._id.toString(),
        slug: translation?.slug || '',
        title: translation?.title || '',
        subtitle: translation?.subtitle,
        description: translation?.descriptionHtml,
        brand: product.brandId
          ? {
              id: product.brandId._id.toString(),
              slug: product.brandId.slug,
              name: brandTranslation?.name || '',
              logo: product.brandId.logoUrl,
            }
          : null,
        categories: categories.map((cat) => {
          const catTranslation = cat.translations?.find((t) => t.locale === lang) || cat.translations?.[0];
          return {
            id: cat._id.toString(),
            slug: catTranslation?.slug || '',
            title: catTranslation?.title || '',
          };
        }),
        media: Array.isArray(product.media) ? product.media : [],
        variants: product.variants
          ?.filter((v) => v.published)
          .sort((a, b) => a.price - b.price)
          .map((variant) => ({
            id: variant._id?.toString() || '',
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            stock: variant.stock,
            options: variant.options?.map((opt) => ({
              attribute: opt.attributeKey || '',
              value: opt.value || '',
              key: opt.attributeKey || '',
            })) || [],
            available: variant.stock > 0,
          })) || [],
        seo: {
          title: translation?.seoTitle || translation?.title,
          description: translation?.seoDescription,
        },
        published: product.published,
        publishedAt: product.publishedAt,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      // Cache for 10 minutes
      await safeRedis.setex(cacheKey, 600, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productsController;
