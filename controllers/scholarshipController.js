// controllers/scholarshipController.js

const { ObjectId } = require('mongodb');

const getScholarshipController = (scholarshipsCollection) => {
  
  /**
   * @desc    Get All Scholarships with pagination, search, filter, sort
   * @route   GET /api/v1/scholarships
   * @access  Public
   */
  const getAllScholarships = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const search = req.query.search || '';
      const country = req.query.country || '';
      const category = req.query.category || '';
      const sortBy = req.query.sortBy || '';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      
      // Build query
      let query = {};
      
      if (search) {
        query.$or = [
          { scholarshipName: { $regex: search, $options: 'i' } },
          { universityName: { $regex: search, $options: 'i' } },
          { degree: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (country) {
        query.universityCountry = country;
      }
      
      if (category) {
        query.scholarshipCategory = category;
      }
      
      // Build sort
      let sort = {};
      if (sortBy === 'applicationFees') {
        sort.applicationFees = sortOrder;
      } else if (sortBy === 'postDate') {
        sort.scholarshipPostDate = sortOrder;
      }
      
      const scholarships = await scholarshipsCollection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
        
      const total = await scholarshipsCollection.countDocuments(query);
      
      res.json({
        success: true,
        scholarships,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalScholarships: total
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching scholarships', error: error.message });
    }
  };

  /**
   * @desc    Get Top 6 Scholarships
   * @route   GET /api/v1/scholarships/top
   * @access  Public
   */
  const getTopScholarships = async (req, res) => {
    try {
      const scholarships = await scholarshipsCollection
        .find()
        .sort({ applicationFees: 1 })
        .limit(6)
        .toArray();
      res.json({ success: true, count: scholarships.length, data: scholarships });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching top scholarships', error: error.message });
    }
  };

  /**
   * @desc    Get Scholarship by ID
   * @route   GET /api/v1/scholarships/:id
   * @access  Public
   */
  const getScholarshipById = async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const scholarship = await scholarshipsCollection.findOne(query);
      
      if (!scholarship) {
        return res.status(404).json({ success: false, message: 'Scholarship not found' });
      }
      
      res.json({ success: true, data: scholarship });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching scholarship', error: error.message });
    }
  };

  /**
   * @desc    Get Scholarships by Category (for recommendations)
   * @route   GET /api/v1/scholarships/category/:category
   * @access  Public
   */
  const getByCategory = async (req, res) => {
    try {
      const category = req.params.category;
      const excludeId = req.query.excludeId;
      
      let query = { scholarshipCategory: category };
      
      if (excludeId) {
        query._id = { $ne: new ObjectId(excludeId) };
      }
      
      const scholarships = await scholarshipsCollection
        .find(query)
        .limit(4)
        .toArray();
      
      res.json({ success: true, count: scholarships.length, data: scholarships });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching scholarships by category', error: error.message });
    }
  };

  /**
   * @desc    Add Scholarship (Admin only)
   * @route   POST /api/v1/scholarships
   * @access  Private - Admin
   */
  const addScholarship = async (req, res) => {
    try {
      const scholarship = req.body;
      scholarship.scholarshipPostDate = new Date();
      
      const result = await scholarshipsCollection.insertOne(scholarship);
      res.json({ success: true, message: 'Scholarship added successfully', insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error adding scholarship', error: error.message });
    }
  };

  /**
   * @desc    Update Scholarship (Admin only)
   * @route   PATCH /api/v1/scholarships/:id
   * @access  Private - Admin
   */
  const updateScholarship = async (req, res) => {
    try {
      const id = req.params.id;
      const scholarship = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: scholarship
      };
      
      const result = await scholarshipsCollection.updateOne(filter, updateDoc);
      res.json({ success: true, message: 'Scholarship updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating scholarship', error: error.message });
    }
  };

  /**
   * @desc    Delete Scholarship (Admin only)
   * @route   DELETE /api/v1/scholarships/:id
   * @access  Private - Admin
   */
  const deleteScholarship = async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await scholarshipsCollection.deleteOne(query);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Scholarship not found' });
      }
      
      res.json({ success: true, message: 'Scholarship deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting scholarship', error: error.message });
    }
  };
  
  return {
    getAllScholarships,
    getTopScholarships,
    getScholarshipById,
    getByCategory,
    addScholarship,
    updateScholarship,
    deleteScholarship,
  };
};

module.exports = getScholarshipController;
