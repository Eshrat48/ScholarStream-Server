// middleware/verifyToken.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    return res.status(401).json({ success: false, message: 'Unauthorized access - no token provided' });
  }
  
  const token = authorization.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized access - invalid token format' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized access - invalid or expired token' });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
