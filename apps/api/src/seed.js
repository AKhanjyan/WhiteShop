require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./lib/mongodb');

const User = require('./models/User');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Attribute = require('./models/Attribute');

async function main() {
  console.log('🌱 Starting MongoDB database seeding...\n');

  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Brand.deleteMany({});
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    // await Attribute.deleteMany({});

    // ============================================================
    // USERS
    // ============================================================
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@shop.am' },
      {
        email: 'admin@shop.am',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        emailVerified: true,
        locale: 'en',
        roles: ['admin'],
      },
      { upsert: true, new: true }
    );

    const testUser = await User.findOneAndUpdate(
      { email: 'user@example.com' },
      {
        email: 'user@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        locale: 'en',
        roles: ['customer'],
      },
      { upsert: true, new: true }
    );

    console.log('✅ Users created\n');

    // ============================================================
    // BRANDS
    // ============================================================
    console.log('🏷️ Creating brands...');

    const brands = [
      {
        slug: 'apple',
        published: true,
        translations: [
          { locale: 'en', name: 'Apple', description: 'Premium technology brand' },
          { locale: 'ru', name: 'Apple', description: 'Премиальный технологический бренд' },
          { locale: 'am', name: 'Apple', description: 'Պրեմիում տեխնոլոգիական ապրանքանիշ' },
        ],
      },
      {
        slug: 'samsung',
        published: true,
        translations: [
          { locale: 'en', name: 'Samsung', description: 'Innovative electronics brand' },
          { locale: 'ru', name: 'Samsung', description: 'Инновационный бренд электроники' },
          { locale: 'am', name: 'Samsung', description: 'Նորարարական էլեկտրոնիկայի ապրանքանիշ' },
        ],
      },
      {
        slug: 'nike',
        published: true,
        translations: [
          { locale: 'en', name: 'Nike', description: 'Just Do It' },
          { locale: 'ru', name: 'Nike', description: 'Just Do It' },
          { locale: 'am', name: 'Nike', description: 'Just Do It' },
        ],
      },
      {
        slug: 'adidas',
        published: true,
        translations: [
          { locale: 'en', name: 'Adidas', description: 'Impossible is Nothing' },
          { locale: 'ru', name: 'Adidas', description: 'Impossible is Nothing' },
          { locale: 'am', name: 'Adidas', description: 'Impossible is Nothing' },
        ],
      },
    ];

    const createdBrands = [];
    for (const brandData of brands) {
      const brand = await Brand.findOneAndUpdate(
        { slug: brandData.slug },
        brandData,
        { upsert: true, new: true }
      );
      createdBrands.push(brand);
    }

    console.log(`✅ Created ${createdBrands.length} brands\n`);

    // ============================================================
    // ATTRIBUTES
    // ============================================================
    console.log('🔧 Creating attributes...');

    const colorAttribute = await Attribute.findOneAndUpdate(
      { key: 'color' },
      {
        key: 'color',
        type: 'select',
        filterable: true,
        position: 0,
        translations: [
          { locale: 'en', name: 'Color' },
          { locale: 'ru', name: 'Цвет' },
          { locale: 'am', name: 'Գույն' },
        ],
        values: [
          {
            value: 'red',
            position: 0,
            translations: [
              { locale: 'en', label: 'Red' },
              { locale: 'ru', label: 'Красный' },
              { locale: 'am', label: 'Կարմիր' },
            ],
          },
          {
            value: 'blue',
            position: 1,
            translations: [
              { locale: 'en', label: 'Blue' },
              { locale: 'ru', label: 'Синий' },
              { locale: 'am', label: 'Կապույտ' },
            ],
          },
          {
            value: 'black',
            position: 2,
            translations: [
              { locale: 'en', label: 'Black' },
              { locale: 'ru', label: 'Черный' },
              { locale: 'am', label: 'Սև' },
            ],
          },
          {
            value: 'white',
            position: 3,
            translations: [
              { locale: 'en', label: 'White' },
              { locale: 'ru', label: 'Белый' },
              { locale: 'am', label: 'Սպիտակ' },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    const sizeAttribute = await Attribute.findOneAndUpdate(
      { key: 'size' },
      {
        key: 'size',
        type: 'select',
        filterable: true,
        position: 1,
        translations: [
          { locale: 'en', name: 'Size' },
          { locale: 'ru', name: 'Размер' },
          { locale: 'am', name: 'Չափ' },
        ],
        values: [
          {
            value: 's',
            position: 0,
            translations: [
              { locale: 'en', label: 'S' },
              { locale: 'ru', label: 'S' },
              { locale: 'am', label: 'S' },
            ],
          },
          {
            value: 'm',
            position: 1,
            translations: [
              { locale: 'en', label: 'M' },
              { locale: 'ru', label: 'M' },
              { locale: 'am', label: 'M' },
            ],
          },
          {
            value: 'l',
            position: 2,
            translations: [
              { locale: 'en', label: 'L' },
              { locale: 'ru', label: 'L' },
              { locale: 'am', label: 'L' },
            ],
          },
          {
            value: 'xl',
            position: 3,
            translations: [
              { locale: 'en', label: 'XL' },
              { locale: 'ru', label: 'XL' },
              { locale: 'am', label: 'XL' },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    console.log('✅ Attributes created\n');

    // ============================================================
    // CATEGORIES
    // ============================================================
    console.log('📁 Creating categories...');

    const electronicsCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'electronics', 'translations.locale': 'en' },
      {
        position: 0,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Electronics',
            slug: 'electronics',
            fullPath: '/electronics',
            description: 'Electronic devices and gadgets',
            seoTitle: 'Electronics - Shop Online',
            seoDescription: 'Browse our wide selection of electronics',
          },
          {
            locale: 'ru',
            title: 'Электроника',
            slug: 'elektronika',
            fullPath: '/elektronika',
            description: 'Электронные устройства и гаджеты',
            seoTitle: 'Электроника - Интернет магазин',
            seoDescription: 'Широкий выбор электроники',
          },
          {
            locale: 'am',
            title: 'Էլեկտրոնիկա',
            slug: 'elektronika',
            fullPath: '/elektronika',
            description: 'Էլեկտրոնային սարքեր և գաջեթներ',
            seoTitle: 'Էլեկտրոնիկա - Առցանց Խանութ',
            seoDescription: 'Էլեկտրոնիկայի լայն ընտրանի',
          },
        ],
      },
      { upsert: true, new: true }
    );

    const phonesCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'smartphones', 'translations.locale': 'en' },
      {
        parentId: electronicsCategory._id,
        position: 0,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Smartphones',
            slug: 'smartphones',
            fullPath: '/electronics/smartphones',
            description: 'Latest smartphones from top brands',
          },
          {
            locale: 'ru',
            title: 'Смартфоны',
            slug: 'smartfony',
            fullPath: '/elektronika/smartfony',
            description: 'Новейшие смартфоны от ведущих брендов',
          },
          {
            locale: 'am',
            title: 'Սմարթֆոններ',
            slug: 'smartfonner',
            fullPath: '/elektronika/smartfonner',
            description: 'Վերջին սմարթֆոններ առաջատար ապրանքանիշներից',
          },
        ],
      },
      { upsert: true, new: true }
    );

    const clothingCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'clothing', 'translations.locale': 'en' },
      {
        position: 1,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Clothing',
            slug: 'clothing',
            fullPath: '/clothing',
            description: 'Fashion clothing and accessories',
          },
          {
            locale: 'ru',
            title: 'Одежда',
            slug: 'odezhda',
            fullPath: '/odezhda',
            description: 'Модная одежда и аксессуары',
          },
          {
            locale: 'am',
            title: 'Հագուստ',
            slug: 'hagust',
            fullPath: '/hagust',
            description: 'Դիզայներական հագուստ և աքսեսուարներ',
          },
        ],
      },
      { upsert: true, new: true }
    );

    const shoesCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'shoes', 'translations.locale': 'en' },
      {
        parentId: clothingCategory._id,
        position: 0,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Shoes',
            slug: 'shoes',
            fullPath: '/clothing/shoes',
            description: 'Sports and casual shoes',
          },
          {
            locale: 'ru',
            title: 'Обувь',
            slug: 'obuv',
            fullPath: '/odezhda/obuv',
            description: 'Спортивная и повседневная обувь',
          },
          {
            locale: 'am',
            title: 'Կոշիկներ',
            slug: 'koshikner',
            fullPath: '/hagust/koshikner',
            description: 'Սպորտային և ամենօրյա կոշիկներ',
          },
        ],
      },
      { upsert: true, new: true }
    );

    const laptopsCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'laptops', 'translations.locale': 'en' },
      {
        parentId: electronicsCategory._id,
        position: 1,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Laptops',
            slug: 'laptops',
            fullPath: '/electronics/laptops',
            description: 'Premium laptops and notebooks',
          },
          {
            locale: 'ru',
            title: 'Ноутбуки',
            slug: 'noutbuki',
            fullPath: '/elektronika/noutbuki',
            description: 'Премиальные ноутбуки и ультрабуки',
          },
          {
            locale: 'am',
            title: 'Նոութբուքեր',
            slug: 'noutbukner',
            fullPath: '/elektronika/noutbukner',
            description: 'Պրեմիում նոութբուքեր և ուլտրաբուքեր',
          },
        ],
      },
      { upsert: true, new: true }
    );

    const accessoriesCategory = await Category.findOneAndUpdate(
      { 'translations.slug': 'accessories', 'translations.locale': 'en' },
      {
        parentId: electronicsCategory._id,
        position: 2,
        published: true,
        media: [],
        translations: [
          {
            locale: 'en',
            title: 'Accessories',
            slug: 'accessories',
            fullPath: '/electronics/accessories',
            description: 'Tech accessories and gadgets',
          },
          {
            locale: 'ru',
            title: 'Аксессуары',
            slug: 'aksessuary',
            fullPath: '/elektronika/aksessuary',
            description: 'Технические аксессуары и гаджеты',
          },
          {
            locale: 'am',
            title: 'Աքսեսուարներ',
            slug: 'aksesuarnner',
            fullPath: '/elektronika/aksesuarnner',
            description: 'Տեխնիկական աքսեսուարներ և գաջեթներ',
          },
        ],
      },
      { upsert: true, new: true }
    );

    console.log('✅ Categories created\n');

    // ============================================================
    // PRODUCTS
    // ============================================================
    console.log('📦 Creating products...');

    const appleBrand = createdBrands.find((b) => b.slug === 'apple');
    const samsungBrand = createdBrands.find((b) => b.slug === 'samsung');
    const nikeBrand = createdBrands.find((b) => b.slug === 'nike');
    const adidasBrand = createdBrands.find((b) => b.slug === 'adidas');

    // Product 1: iPhone 15
    const iphoneProduct = await Product.findOneAndUpdate(
      { 'translations.slug': 'iphone-15-pro', 'translations.locale': 'en' },
      {
        brandId: appleBrand._id,
        skuPrefix: 'IPH',
        published: true,
        featured: true,
        publishedAt: new Date(),
        media: [
          'https://images.unsplash.com/photo-1592750475338-74b7b8e79482?w=800',
        ],
        translations: [
          {
            locale: 'en',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            subtitle: 'The most advanced iPhone yet',
            descriptionHtml: '<p>Experience the power of A17 Pro chip with 6-core GPU. Titanium design for ultimate durability.</p>',
            seoTitle: 'iPhone 15 Pro - Buy Online',
            seoDescription: 'Latest iPhone 15 Pro with advanced features',
          },
          {
            locale: 'ru',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            subtitle: 'Самый продвинутый iPhone',
            descriptionHtml: '<p>Ощутите мощь чипа A17 Pro с 6-ядерным GPU. Титановый дизайн для максимальной прочности.</p>',
            seoTitle: 'iPhone 15 Pro - Купить онлайн',
            seoDescription: 'Новейший iPhone 15 Pro с передовыми функциями',
          },
          {
            locale: 'am',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            subtitle: 'Ամենաառաջադեմ iPhone-ը',
            descriptionHtml: '<p>Պատկերացրեք A17 Pro չիպի հզորությունը 6-միջուկ GPU-ով: Տիտանային դիզայն առավելագույն ամրության համար:</p>',
            seoTitle: 'iPhone 15 Pro - Գնել առցանց',
            seoDescription: 'Վերջին iPhone 15 Pro առաջավոր հատկություններով',
          },
        ],
        categoryIds: [phonesCategory._id, electronicsCategory._id],
        primaryCategoryId: phonesCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'IPH-15-PRO-128-BLACK',
            price: 899000,
            compareAtPrice: 999000,
            stock: 10,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
            ],
          },
          {
            sku: 'IPH-15-PRO-128-BLUE',
            price: 899000,
            compareAtPrice: 999000,
            stock: 8,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'blue')._id,
                value: 'blue',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 2: Samsung Galaxy S24
    const samsungProduct = await Product.findOneAndUpdate(
      { 'translations.slug': 'samsung-galaxy-s24-ultra', 'translations.locale': 'en' },
      {
        brandId: samsungBrand._id,
        skuPrefix: 'SGS',
        published: true,
        featured: true,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            subtitle: 'Next-level performance',
            descriptionHtml: '<p>Powerful Snapdragon 8 Gen 3 processor. 200MP camera system.</p>',
            seoTitle: 'Samsung Galaxy S24 Ultra - Buy Online',
            seoDescription: 'Latest Samsung Galaxy S24 Ultra smartphone',
          },
          {
            locale: 'ru',
            title: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            subtitle: 'Производительность нового уровня',
            descriptionHtml: '<p>Мощный процессор Snapdragon 8 Gen 3. Камера 200 МП.</p>',
            seoTitle: 'Samsung Galaxy S24 Ultra - Купить онлайн',
            seoDescription: 'Новейший смартфон Samsung Galaxy S24 Ultra',
          },
          {
            locale: 'am',
            title: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            subtitle: 'Հաջորդ մակարդակի արտադրողականություն',
            descriptionHtml: '<p>Հզոր Snapdragon 8 Gen 3 պրոցեսոր: 200MP տեսախցիկային համակարգ:</p>',
            seoTitle: 'Samsung Galaxy S24 Ultra - Գնել առցանց',
            seoDescription: 'Վերջին Samsung Galaxy S24 Ultra սմարթֆոն',
          },
        ],
        categoryIds: [phonesCategory._id, electronicsCategory._id],
        primaryCategoryId: phonesCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'SGS-24-ULTRA-256-BLACK',
            price: 899000,
            compareAtPrice: 949000,
            stock: 12,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 3: Nike Air Max
    const nikeProduct = await Product.findOneAndUpdate(
      { 'translations.slug': 'nike-air-max-90', 'translations.locale': 'en' },
      {
        brandId: nikeBrand._id,
        skuPrefix: 'NK',
        published: true,
        featured: false,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'Nike Air Max 90',
            slug: 'nike-air-max-90',
            subtitle: 'Classic comfort',
            descriptionHtml: '<p>Classic running shoes with Air Max cushioning.</p>',
            seoTitle: 'Nike Air Max 90 - Buy Online',
            seoDescription: 'Classic Nike Air Max 90 running shoes',
          },
          {
            locale: 'ru',
            title: 'Nike Air Max 90',
            slug: 'nike-air-max-90',
            subtitle: 'Классический комфорт',
            descriptionHtml: '<p>Классические беговые кроссовки с амортизацией Air Max.</p>',
            seoTitle: 'Nike Air Max 90 - Купить онлайн',
            seoDescription: 'Классические беговые кроссовки Nike Air Max 90',
          },
          {
            locale: 'am',
            title: 'Nike Air Max 90',
            slug: 'nike-air-max-90',
            subtitle: 'Դասական հարմարավետություն',
            descriptionHtml: '<p>Դասական վազքի կոշիկներ Air Max բարձիկով:</p>',
            seoTitle: 'Nike Air Max 90 - Գնել առցանց',
            seoDescription: 'Դասական Nike Air Max 90 վազքի կոշիկներ',
          },
        ],
        categoryIds: [shoesCategory._id, clothingCategory._id],
        primaryCategoryId: shoesCategory._id,
        attributeIds: [colorAttribute._id, sizeAttribute._id],
        variants: [
          {
            sku: 'NK-AIRMAX-90-BLACK-42',
            price: 89000,
            compareAtPrice: 99000,
            stock: 20,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
              {
                attributeId: sizeAttribute._id,
                attributeKey: 'size',
                valueId: sizeAttribute.values.find((v) => v.value === 'm')._id,
                value: 'm',
              },
            ],
          },
          {
            sku: 'NK-AIRMAX-90-WHITE-42',
            price: 89000,
            compareAtPrice: 99000,
            stock: 15,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'white')._id,
                value: 'white',
              },
              {
                attributeId: sizeAttribute._id,
                attributeKey: 'size',
                valueId: sizeAttribute.values.find((v) => v.value === 'm')._id,
                value: 'm',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 4: MacBook Pro 14"
    const macbookProduct = await Product.findOneAndUpdate(
      { 'translations.slug': 'macbook-pro-14', 'translations.locale': 'en' },
      {
        brandId: appleBrand._id,
        skuPrefix: 'MBP',
        published: true,
        featured: true,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'MacBook Pro 14"',
            slug: 'macbook-pro-14',
            subtitle: 'Supercharged by M3 Pro',
            descriptionHtml: '<p>Powerful M3 Pro chip with 11-core CPU and 14-core GPU. Liquid Retina XDR display.</p>',
            seoTitle: 'MacBook Pro 14" - Buy Online',
            seoDescription: 'Latest MacBook Pro 14" with M3 Pro chip',
          },
          {
            locale: 'ru',
            title: 'MacBook Pro 14"',
            slug: 'macbook-pro-14',
            subtitle: 'Усилен чипом M3 Pro',
            descriptionHtml: '<p>Мощный чип M3 Pro с 11-ядерным CPU и 14-ядерным GPU. Дисплей Liquid Retina XDR.</p>',
            seoTitle: 'MacBook Pro 14" - Купить онлайн',
            seoDescription: 'Новейший MacBook Pro 14" с чипом M3 Pro',
          },
          {
            locale: 'am',
            title: 'MacBook Pro 14"',
            slug: 'macbook-pro-14',
            subtitle: 'Ուժեղացված M3 Pro չիպով',
            descriptionHtml: '<p>Հզոր M3 Pro չիպ 11-միջուկ CPU և 14-միջուկ GPU-ով: Liquid Retina XDR էկրան:</p>',
            seoTitle: 'MacBook Pro 14" - Գնել առցանց',
            seoDescription: 'Վերջին MacBook Pro 14" M3 Pro չիպով',
          },
        ],
        categoryIds: [laptopsCategory._id, electronicsCategory._id],
        primaryCategoryId: laptopsCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'MBP-14-M3-SPACE-512',
            price: 1299000,
            compareAtPrice: 1399000,
            stock: 5,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
            ],
          },
          {
            sku: 'MBP-14-M3-SILVER-512',
            price: 1299000,
            compareAtPrice: 1399000,
            stock: 7,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'white')._id,
                value: 'white',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 5: Adidas Ultraboost 22
    const adidasUltraboost = await Product.findOneAndUpdate(
      { 'translations.slug': 'adidas-ultraboost-22', 'translations.locale': 'en' },
      {
        brandId: adidasBrand._id,
        skuPrefix: 'ADU',
        published: true,
        featured: true,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            subtitle: 'Energy return running shoes',
            descriptionHtml: '<p>Premium running shoes with Boost midsole technology for maximum energy return.</p>',
            seoTitle: 'Adidas Ultraboost 22 - Buy Online',
            seoDescription: 'Premium Adidas Ultraboost 22 running shoes',
          },
          {
            locale: 'ru',
            title: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            subtitle: 'Кроссовки с возвратом энергии',
            descriptionHtml: '<p>Премиальные беговые кроссовки с технологией Boost для максимального возврата энергии.</p>',
            seoTitle: 'Adidas Ultraboost 22 - Купить онлайн',
            seoDescription: 'Премиальные беговые кроссовки Adidas Ultraboost 22',
          },
          {
            locale: 'am',
            title: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            subtitle: 'Էներգիայի վերադարձով վազքի կոշիկներ',
            descriptionHtml: '<p>Պրեմիում վազքի կոշիկներ Boost միջնակ հատվածի տեխնոլոգիայով առավելագույն էներգիայի վերադարձի համար:</p>',
            seoTitle: 'Adidas Ultraboost 22 - Գնել առցանց',
            seoDescription: 'Պրեմիում Adidas Ultraboost 22 վազքի կոշիկներ',
          },
        ],
        categoryIds: [shoesCategory._id, clothingCategory._id],
        primaryCategoryId: shoesCategory._id,
        attributeIds: [colorAttribute._id, sizeAttribute._id],
        variants: [
          {
            sku: 'ADU-UB22-BLACK-42',
            price: 95000,
            compareAtPrice: 105000,
            stock: 15,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
              {
                attributeId: sizeAttribute._id,
                attributeKey: 'size',
                valueId: sizeAttribute.values.find((v) => v.value === 'm')._id,
                value: 'm',
              },
            ],
          },
          {
            sku: 'ADU-UB22-BLACK-44',
            price: 95000,
            compareAtPrice: 105000,
            stock: 12,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
              {
                attributeId: sizeAttribute._id,
                attributeKey: 'size',
                valueId: sizeAttribute.values.find((v) => v.value === 'l')._id,
                value: 'l',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 6: Samsung Galaxy Watch 6
    const samsungWatch = await Product.findOneAndUpdate(
      { 'translations.slug': 'samsung-galaxy-watch-6', 'translations.locale': 'en' },
      {
        brandId: samsungBrand._id,
        skuPrefix: 'SGW',
        published: true,
        featured: false,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'Samsung Galaxy Watch 6',
            slug: 'samsung-galaxy-watch-6',
            subtitle: 'Advanced health monitoring',
            descriptionHtml: '<p>Smartwatch with advanced health tracking, sleep monitoring, and fitness features.</p>',
            seoTitle: 'Samsung Galaxy Watch 6 - Buy Online',
            seoDescription: 'Advanced Samsung Galaxy Watch 6 smartwatch',
          },
          {
            locale: 'ru',
            title: 'Samsung Galaxy Watch 6',
            slug: 'samsung-galaxy-watch-6',
            subtitle: 'Продвинутый мониторинг здоровья',
            descriptionHtml: '<p>Умные часы с продвинутым отслеживанием здоровья, мониторингом сна и фитнес-функциями.</p>',
            seoTitle: 'Samsung Galaxy Watch 6 - Купить онлайн',
            seoDescription: 'Продвинутые умные часы Samsung Galaxy Watch 6',
          },
          {
            locale: 'am',
            title: 'Samsung Galaxy Watch 6',
            slug: 'samsung-galaxy-watch-6',
            subtitle: 'Առաջադեմ առողջության մոնիտորինգ',
            descriptionHtml: '<p>Խելացի ժամացույց առաջադեմ առողջության հետևում, քնի մոնիտորինգ և ֆիտնես հատկություններով:</p>',
            seoTitle: 'Samsung Galaxy Watch 6 - Գնել առցանց',
            seoDescription: 'Առաջադեմ Samsung Galaxy Watch 6 խելացի ժամացույց',
          },
        ],
        categoryIds: [accessoriesCategory._id, electronicsCategory._id],
        primaryCategoryId: accessoriesCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'SGW-6-BLACK-40',
            price: 249000,
            compareAtPrice: 279000,
            stock: 8,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
            ],
          },
          {
            sku: 'SGW-6-SILVER-44',
            price: 249000,
            compareAtPrice: 279000,
            stock: 6,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'white')._id,
                value: 'white',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 7: iPhone 14
    const iphone14 = await Product.findOneAndUpdate(
      { 'translations.slug': 'iphone-14', 'translations.locale': 'en' },
      {
        brandId: appleBrand._id,
        skuPrefix: 'IPH',
        published: true,
        featured: false,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1592750475338-74b7b8e79482?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'iPhone 14',
            slug: 'iphone-14',
            subtitle: 'Powerful and beautiful',
            descriptionHtml: '<p>iPhone 14 with A15 Bionic chip, dual camera system, and all-day battery life.</p>',
            seoTitle: 'iPhone 14 - Buy Online',
            seoDescription: 'Powerful iPhone 14 with advanced features',
          },
          {
            locale: 'ru',
            title: 'iPhone 14',
            slug: 'iphone-14',
            subtitle: 'Мощный и красивый',
            descriptionHtml: '<p>iPhone 14 с чипом A15 Bionic, двойной камерой и батареей на весь день.</p>',
            seoTitle: 'iPhone 14 - Купить онлайн',
            seoDescription: 'Мощный iPhone 14 с передовыми функциями',
          },
          {
            locale: 'am',
            title: 'iPhone 14',
            slug: 'iphone-14',
            subtitle: 'Հզոր և գեղեցիկ',
            descriptionHtml: '<p>iPhone 14 A15 Bionic չիպով, երկկողմանի տեսախցիկային համակարգով և ամբողջ օրվա մարտկոցով:</p>',
            seoTitle: 'iPhone 14 - Գնել առցանց',
            seoDescription: 'Հզոր iPhone 14 առաջավոր հատկություններով',
          },
        ],
        categoryIds: [phonesCategory._id, electronicsCategory._id],
        primaryCategoryId: phonesCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'IPH-14-128-BLUE',
            price: 699000,
            compareAtPrice: 749000,
            stock: 12,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'blue')._id,
                value: 'blue',
              },
            ],
          },
          {
            sku: 'IPH-14-128-RED',
            price: 699000,
            compareAtPrice: 749000,
            stock: 10,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'red')._id,
                value: 'red',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 8: Apple AirPods Pro 2
    const airpodsPro = await Product.findOneAndUpdate(
      { 'translations.slug': 'apple-airpods-pro-2', 'translations.locale': 'en' },
      {
        brandId: appleBrand._id,
        skuPrefix: 'APP',
        published: true,
        featured: true,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1606220945770-b5b8c2e8b3f3?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'Apple AirPods Pro 2',
            slug: 'apple-airpods-pro-2',
            subtitle: 'Active Noise Cancellation',
            descriptionHtml: '<p>Wireless earbuds with active noise cancellation, spatial audio, and adaptive EQ.</p>',
            seoTitle: 'Apple AirPods Pro 2 - Buy Online',
            seoDescription: 'Premium Apple AirPods Pro 2 with noise cancellation',
          },
          {
            locale: 'ru',
            title: 'Apple AirPods Pro 2',
            slug: 'apple-airpods-pro-2',
            subtitle: 'Активное шумоподавление',
            descriptionHtml: '<p>Беспроводные наушники с активным шумоподавлением, пространственным звуком и адаптивным эквалайзером.</p>',
            seoTitle: 'Apple AirPods Pro 2 - Купить онлайн',
            seoDescription: 'Премиальные Apple AirPods Pro 2 с шумоподавлением',
          },
          {
            locale: 'am',
            title: 'Apple AirPods Pro 2',
            slug: 'apple-airpods-pro-2',
            subtitle: 'Ակտիվ աղմուկի զսպում',
            descriptionHtml: '<p>Անլար ականջակալներ ակտիվ աղմուկի զսպում, տարածական աուդիո և ադապտիվ EQ-ով:</p>',
            seoTitle: 'Apple AirPods Pro 2 - Գնել առցանց',
            seoDescription: 'Պրեմիում Apple AirPods Pro 2 աղմուկի զսպումով',
          },
        ],
        categoryIds: [accessoriesCategory._id, electronicsCategory._id],
        primaryCategoryId: accessoriesCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'APP-PRO2-WHITE',
            price: 149000,
            compareAtPrice: 169000,
            stock: 20,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'white')._id,
                value: 'white',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Product 9: MacBook Air M2
    const macbookAir = await Product.findOneAndUpdate(
      { 'translations.slug': 'macbook-air-m2', 'translations.locale': 'en' },
      {
        brandId: appleBrand._id,
        skuPrefix: 'MBA',
        published: true,
        featured: false,
        publishedAt: new Date(),
        media: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'],
        translations: [
          {
            locale: 'en',
            title: 'MacBook Air M2',
            slug: 'macbook-air-m2',
            subtitle: 'Thin and powerful',
            descriptionHtml: '<p>MacBook Air with M2 chip, 13.6-inch Liquid Retina display, and all-day battery.</p>',
            seoTitle: 'MacBook Air M2 - Buy Online',
            seoDescription: 'Powerful and lightweight MacBook Air M2',
          },
          {
            locale: 'ru',
            title: 'MacBook Air M2',
            slug: 'macbook-air-m2',
            subtitle: 'Тонкий и мощный',
            descriptionHtml: '<p>MacBook Air с чипом M2, дисплеем Liquid Retina 13.6 дюймов и батареей на весь день.</p>',
            seoTitle: 'MacBook Air M2 - Купить онлайн',
            seoDescription: 'Мощный и легкий MacBook Air M2',
          },
          {
            locale: 'am',
            title: 'MacBook Air M2',
            slug: 'macbook-air-m2',
            subtitle: 'Բարակ և հզոր',
            descriptionHtml: '<p>MacBook Air M2 չիպով, 13.6 դյույմ Liquid Retina էկրանով և ամբողջ օրվա մարտկոցով:</p>',
            seoTitle: 'MacBook Air M2 - Գնել առցանց',
            seoDescription: 'Հզոր և թեթև MacBook Air M2',
          },
        ],
        categoryIds: [laptopsCategory._id, electronicsCategory._id],
        primaryCategoryId: laptopsCategory._id,
        attributeIds: [colorAttribute._id],
        variants: [
          {
            sku: 'MBA-M2-SPACE-256',
            price: 899000,
            compareAtPrice: 999000,
            stock: 8,
            position: 0,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'black')._id,
                value: 'black',
              },
            ],
          },
          {
            sku: 'MBA-M2-GOLD-256',
            price: 899000,
            compareAtPrice: 999000,
            stock: 6,
            position: 1,
            published: true,
            options: [
              {
                attributeId: colorAttribute._id,
                attributeKey: 'color',
                valueId: colorAttribute.values.find((v) => v.value === 'red')._id,
                value: 'red',
              },
            ],
          },
        ],
      },
      { upsert: true, new: true }
    );

    console.log('✅ Products created\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${createdBrands.length} brands`);
    console.log('   - 2 attributes (color, size)');
    console.log('   - 6 categories (electronics, smartphones, laptops, accessories, clothing, shoes)');
    console.log('   - 9 products with variants');
    console.log('   - 2 users (admin@shop.am, user@example.com)');
    console.log('\n🔑 Admin credentials:');
    console.log('   Email: admin@shop.am');
    console.log('   Password: admin123');
    console.log('\n👤 Test user credentials:');
    console.log('   Email: user@example.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

main()
  .then(() => {
    console.log('\n✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });

