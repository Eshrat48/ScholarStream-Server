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

  /**
   * @desc    Get Applications Series Data (time-based)
   * @route   GET /api/v1/analytics/applications-series
   * @access  Private - Admin
   */
  const getApplicationsSeries = async (req, res) => {
    try {
      const range = req.query.range || '7days';
      const now = new Date();
      let labels = [], format, groupStage, matchStage = {}, sortStage, limitStage, labelMap = {};
      if (range === '30days') {
        // Last 7 weeks (approx 30 days)
        format = '%G-%V'; // ISO week format
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i * 7);
          const week = d.toLocaleDateString('en-CA', { year: 'numeric' }) + '-W' + (('0' + (getWeekNumber(d))).slice(-2));
          labels.push(week);
        }
        groupStage = {
          $group: {
            _id: { $dateToString: { format, date: '$appliedDate' } },
            count: { $sum: 1 }
          }
        };
        sortStage = { $sort: { _id: 1 } };
        limitStage = null;
      } else if (range === '3months') {
        // Last 6 months
        format = '%Y-%m';
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(d.toISOString().slice(0, 7));
        }
        groupStage = {
          $group: {
            _id: { $dateToString: { format, date: '$appliedDate' } },
            count: { $sum: 1 }
          }
        };
        sortStage = { $sort: { _id: 1 } };
        limitStage = null;
      } else {
        // Last 7 days
        format = '%Y-%m-%d';
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          labels.push(d.toISOString().slice(0, 10));
        }
        groupStage = {
          $group: {
            _id: { $dateToString: { format, date: '$appliedDate' } },
            count: { $sum: 1 }
          }
        };
        sortStage = { $sort: { _id: 1 } };
        limitStage = null;
      }
      const pipeline = [groupStage, sortStage].filter(Boolean);
      const series = await applicationsCollection.aggregate(pipeline).toArray();
      // Map results to label:count
      for (const s of series) {
        labelMap[s._id] = s.count;
      }
      // Fill missing with 0
      const counts = labels.map(l => labelMap[l] || 0);
      res.json(counts);

      // Helper for ISO week number
      function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
        return weekNo;
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching applications series', error: error.message });
    }
  };

  /**
   * @desc    Get Top Scholarships by Application Count
   * @route   GET /api/v1/analytics/top-scholarships
   * @access  Private - Admin
   */
  const getTopScholarships = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      
      const topScholarships = await applicationsCollection.aggregate([
        {
          $group: {
            _id: '$scholarshipName',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: 1
          }
        }
      ]).toArray();
      
      res.json(topScholarships);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching top scholarships', error: error.message });
    }
  };
  
  return {
    getDashboardStats,
    getApplicationsByUniversity,
    getApplicationsByCategory,
    getApplicationsSeries,
    getTopScholarships,
  };
};

module.exports = getAnalyticsController;
