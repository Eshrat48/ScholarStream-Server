// controllers/analyticsController.js

const getAnalyticsController = (usersCollection, scholarshipsCollection, applicationsCollection) => {
  
  /**
   * @desc    Get Dashboard Statistics
   * @route   GET /api/v1/analytics/stats
   * @access  Private - Admin
   */
  const getDashboardStats = async (req, res) => {
    try {
      const totalUsers = await usersCollection.countDocuments();
      const totalScholarships = await scholarshipsCollection.countDocuments();
      const totalApplications = await applicationsCollection.countDocuments();
      
      // Calculate total fees collected (only paid applications)
      const paidApplications = await applicationsCollection
        .find({ paymentStatus: 'paid' })
        .toArray();
      
      const totalFeesCollected = paidApplications.reduce((sum, app) => {
        return sum + (parseFloat(app.applicationFees) || 0) + (parseFloat(app.serviceCharge) || 0);
      }, 0);
      
      res.json({
        success: true,
        data: {
          totalUsers,
          totalScholarships,
          totalApplications,
          totalFeesCollected: totalFeesCollected.toFixed(2)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
    }
  };

  /**
   * @desc    Get Application Stats by University
   * @route   GET /api/v1/analytics/applications-by-university
   * @access  Private - Admin
   */
  const getApplicationsByUniversity = async (req, res) => {
    try {
      const stats = await applicationsCollection.aggregate([
        {
          $group: {
            _id: '$universityName',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]).toArray();
      
      res.json({ success: true, count: stats.length, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching application stats', error: error.message });
    }
  };

  /**
   * @desc    Get Application Stats by Scholarship Category
   * @route   GET /api/v1/analytics/applications-by-category
   * @access  Private - Admin
   */
  const getApplicationsByCategory = async (req, res) => {
    try {
      const stats = await applicationsCollection.aggregate([
        {
          $group: {
            _id: '$scholarshipCategory',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]).toArray();
      
      res.json({ success: true, count: stats.length, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching category stats', error: error.message });
    }
  };
  
  return {
    getDashboardStats,
    getApplicationsByUniversity,
    getApplicationsByCategory,
  };
};

module.exports = getAnalyticsController;
