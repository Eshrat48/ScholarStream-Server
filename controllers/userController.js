// controllers/userController.js

const getUserController = (usersCollection) => {
  
  /**
   * @desc    Create or Update User
   * @route   POST /api/v1/users
   * @access  Public
   */
  const createUser = async (req, res) => {
    try {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      
      if (existingUser) {
        return res.json({ success: true, message: 'User already exists', insertedId: null });
      }
      
      // Set default role as Student
      user.role = 'Student';
      user.createdAt = new Date();
      
      const result = await usersCollection.insertOne(user);
      res.json({ success: true, message: 'User created successfully', insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
    }
  };

  /**
   * @desc    Get User by Email
   * @route   GET /api/v1/users/:email
   * @access  Private
   */
  const getUserByEmail = async (req, res) => {
    try {
      const email = req.params.email;
      
      if (email !== req.decoded.email) {
        return res.status(403).json({ success: false, message: 'Forbidden access' });
      }
      
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
  };

  /**
   * @desc    Get All Users (Admin only)
   * @route   GET /api/v1/users
   * @access  Private - Admin
   */
  const getAllUsers = async (req, res) => {
    try {
      const role = req.query.role;
      let query = {};
      
      if (role) {
        query.role = role;
      }
      
      const users = await usersCollection.find(query).toArray();
      res.json({ success: true, count: users.length, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
  };

  /**
   * @desc    Update User Role (Admin only)
   * @route   PATCH /api/v1/users/:id/role
   * @access  Private - Admin
   */
  const updateUserRole = async (req, res) => {
    try {
      const id = req.params.id;
      const { role } = req.body;
      const { ObjectId } = require('mongodb');
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { role: role }
      };
      
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json({ success: true, message: 'User role updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating user role', error: error.message });
    }
  };

  /**
   * @desc    Delete User (Admin only)
   * @route   DELETE /api/v1/users/:id
   * @access  Private - Admin
   */
  const deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { ObjectId } = require('mongodb');
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
  };
  
  return {
    createUser,
    getUserByEmail,
    getAllUsers,
    updateUserRole,
    deleteUser,
  };
};

module.exports = getUserController;
