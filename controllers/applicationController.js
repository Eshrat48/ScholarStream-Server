// controllers/applicationController.js

const { ObjectId } = require('mongodb');

const getApplicationController = (applicationsCollection) => {
  
  /**
   * @desc    Create Application
   * @route   POST /api/v1/applications
   * @access  Private
   */
  const createApplication = async (req, res) => {
    try {
      const application = req.body;
      application.applicationDate = new Date();
      application.applicationStatus = 'pending';
      application.feedback = '';
      
      const result = await applicationsCollection.insertOne(application);
      res.json({ success: true, message: 'Application created successfully', insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating application', error: error.message });
    }
  };

  /**
   * @desc    Get Applications by User Email
   * @route   GET /api/v1/applications/user/:email
   * @access  Private
   */
  const getMyApplications = async (req, res) => {
    try {
      const email = req.params.email;
      
      if (email !== req.decoded.email) {
        return res.status(403).json({ success: false, message: 'Forbidden access' });
      }
      
      const query = { userEmail: email };
      const applications = await applicationsCollection.find(query).toArray();
      res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
    }
  };

  /**
   * @desc    Get All Applications (Moderator/Admin only)
   * @route   GET /api/v1/applications
   * @access  Private - Moderator/Admin
   */
  const getAllApplications = async (req, res) => {
    try {
      const applications = await applicationsCollection.find().toArray();
      res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
    }
  };

  /**
   * @desc    Update Application Status (Moderator/Admin only)
   * @route   PATCH /api/v1/applications/:id/status
   * @access  Private - Moderator/Admin
   */
  const updateApplicationStatus = async (req, res) => {
    try {
      const id = req.params.id;
      const { applicationStatus } = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { applicationStatus: applicationStatus }
      };
      
      const result = await applicationsCollection.updateOne(filter, updateDoc);
      res.json({ success: true, message: 'Application status updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating application status', error: error.message });
    }
  };

  /**
   * @desc    Add Feedback to Application (Moderator/Admin only)
   * @route   PATCH /api/v1/applications/:id/feedback
   * @access  Private - Moderator/Admin
   */
  const addFeedback = async (req, res) => {
    try {
      const id = req.params.id;
      const { feedback } = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { feedback: feedback }
      };
      
      const result = await applicationsCollection.updateOne(filter, updateDoc);
      res.json({ success: true, message: 'Feedback added successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error adding feedback', error: error.message });
    }
  };

  /**
   * @desc    Update Application (Student only - pending status)
   * @route   PATCH /api/v1/applications/:id
   * @access  Private
   */
  const updateApplication = async (req, res) => {
    try {
      const id = req.params.id;
      const application = req.body;
      
      const filter = { _id: new ObjectId(id), userEmail: req.decoded.email, applicationStatus: 'pending' };
      const updateDoc = {
        $set: application
      };
      
      const result = await applicationsCollection.updateOne(filter, updateDoc);
      
      if (result.matchedCount === 0) {
        return res.status(403).json({ success: false, message: 'Can only update pending applications' });
      }
      
      res.json({ success: true, message: 'Application updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating application', error: error.message });
    }
  };

  /**
   * @desc    Delete Application (Student only - pending status)
   * @route   DELETE /api/v1/applications/:id
   * @access  Private
   */
  const deleteApplication = async (req, res) => {
    try {
      const id = req.params.id;
      const query = { 
        _id: new ObjectId(id), 
        userEmail: req.decoded.email, 
        applicationStatus: 'pending' 
      };
      
      const result = await applicationsCollection.deleteOne(query);
      
      if (result.deletedCount === 0) {
        return res.status(403).json({ success: false, message: 'Can only delete pending applications' });
      }
      
      res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting application', error: error.message });
    }
  };

  /**
   * @desc    Update Payment Status
   * @route   PATCH /api/v1/applications/:id/payment
   * @access  Private
   */
  const updatePaymentStatus = async (req, res) => {
    try {
      const id = req.params.id;
      const { paymentStatus } = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { paymentStatus: paymentStatus }
      };
      
      const result = await applicationsCollection.updateOne(filter, updateDoc);
      res.json({ success: true, message: 'Payment status updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating payment status', error: error.message });
    }
  };
  
  return {
    createApplication,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus,
    addFeedback,
    updateApplication,
    deleteApplication,
    updatePaymentStatus,
  };
};

module.exports = getApplicationController;
