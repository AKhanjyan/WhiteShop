const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);

// Users management
router.get('/users', adminController.getUsers);

// Orders management
router.get('/orders', adminController.getOrders);

// Products management
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);

// Brands and categories for dropdowns
router.get('/brands', adminController.getBrands);
router.get('/categories', adminController.getCategories);

// Recent activity
router.get('/activity', adminController.getActivity);

module.exports = router;

