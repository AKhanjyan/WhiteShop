const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/v1/users/profile - Get user profile
router.get('/profile', authenticateToken, usersController.getProfile);

// PUT /api/v1/users/profile - Update user profile
router.put('/profile', authenticateToken, usersController.updateProfile);

module.exports = router;

