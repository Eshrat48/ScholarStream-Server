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
        // If user already exists, opportunistically update missing profile fields (non-destructive)
        const updateFields = {};
        if (user.name && user.name.trim() && (!existingUser.name || existingUser.name !== user.name)) {
          updateFields.name = user.name.trim();
        }
        if (user.photoURL && user.photoURL.trim() && !existingUser.photoURL) {
          updateFields.photoURL = user.photoURL.trim();
        }
        if (Object.keys(updateFields).length) {
          await usersCollection.updateOne(query, { $set: updateFields });
          return res.json({ success: true, message: 'User exists, profile fields updated', updated: true });
        }
        return res.json({ success: true, message: 'User already exists', updated: false });
      }
      
      // Set default role as Student
      user.role = 'Student';
      user.createdAt = new Date();
      
      // Generate unique Student ID: Format SS-YYYYMMDD-XXXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      user.studentId = `SS-${dateStr}-${randomNum}`;
      
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
      
      // Generate Student ID for existing users who don't have one
      if (!user.studentId) {
        const { ObjectId } = require('mongodb');
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const studentId = `SS-${dateStr}-${randomNum}`;
        
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { studentId: studentId } }
        );
        
        user.studentId = studentId;
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
   * @desc    Update User Profile
   * @route   PATCH /api/v1/users/:id
   * @access  Private
   */
  const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const { ObjectId } = require('mongodb');
      
      // Remove fields that shouldn't be updated via this endpoint
      delete updateData._id;
      delete updateData.email;
      delete updateData.createdAt;
      delete updateData.studentId;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updateData
      };
      
      const result = await usersCollection.updateOne(filter, updateDoc);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, message: 'User profile updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating user profile', error: error.message });
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
    updateUser,
    deleteUser,
  };
};

module.exports = getUserController;
