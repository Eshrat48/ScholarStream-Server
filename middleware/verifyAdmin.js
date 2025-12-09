// middleware/verifyAdmin.js

const verifyAdmin = (usersCollection) => {
  return async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    
    if (user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden access - Admin role required' });
    }
    next();
  };
};

module.exports = verifyAdmin;
