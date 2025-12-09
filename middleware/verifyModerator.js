// middleware/verifyModerator.js

const verifyModerator = (usersCollection) => {
  return async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    
    if (user?.role !== 'Moderator' && user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden access - Moderator or Admin role required' });
    }
    next();
  };
};

module.exports = verifyModerator;
