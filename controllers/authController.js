// controllers/authController.js

const jwt = require('jsonwebtoken');

const getAuthController = (usersCollection) => {
  
  /**
   * @desc    Generate JWT Token
   * @route   POST /api/v1/auth/jwt
   * @access  Public
   */
  const generateToken = (req, res) => {
    try {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error generating token', error: error.message });
    }
  };
  
  return {
    generateToken,
  };
};

module.exports = getAuthController;
