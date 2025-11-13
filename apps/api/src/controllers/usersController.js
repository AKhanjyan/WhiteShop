const User = require('../models/User');

const usersController = {
  /**
   * Get user profile
   * GET /api/v1/users/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id)
        .select('-passwordHash')
        .lean();

      if (!user) {
        return res.status(404).json({
          type: 'https://api.shop.am/problems/not-found',
          title: 'User not found',
          status: 404,
          instance: req.path,
        });
      }

      const defaultAddress = user.addresses?.find((addr) => addr.isDefault) || null;

      res.json({
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultAddress,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user profile
   * PUT /api/v1/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, email, phone } = req.body;

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      // Check for duplicate email/phone
      if (email || phone) {
        const existing = await User.findOne({
          _id: { $ne: req.user.id },
          $or: [
            email ? { email } : {},
            phone ? { phone } : {},
          ],
        });

        if (existing) {
          return res.status(409).json({
            type: 'https://api.shop.am/problems/conflict',
            title: 'Conflict',
            status: 409,
            detail: 'Email or phone already in use',
            instance: req.path,
          });
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-passwordHash');

      res.json({
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
