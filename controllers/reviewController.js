// controllers/reviewController.js

const { ObjectId } = require('mongodb');

const getReviewController = (reviewsCollection, usersCollection) => {
  
  /**
   * @desc    Get Reviews by Scholarship ID
   * @route   GET /api/v1/reviews/scholarship/:scholarshipId
   * @access  Public
   */
  const getReviewsByScholarship = async (req, res) => {
    try {
      const scholarshipId = req.params.scholarshipId;
      const query = { scholarshipId: scholarshipId };
      const reviews = await reviewsCollection.find(query).sort({ reviewDate: -1 }).toArray();
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
    }
  };

  /**
   * @desc    Get Reviews by User Email
   * @route   GET /api/v1/reviews/user/:email
   * @access  Private
   */
  const getMyReviews = async (req, res) => {
    try {
      const email = req.params.email;
      
      if (email !== req.decoded.email) {
        return res.status(403).json({ success: false, message: 'Forbidden access' });
      }
      
      const query = { userEmail: email };
      const reviews = await reviewsCollection.find(query).toArray();
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
    }
  };

  /**
   * @desc    Get All Reviews (Moderator/Admin)
   * @route   GET /api/v1/reviews
   * @access  Private - Moderator/Admin
   */
  const getAllReviews = async (req, res) => {
    try {
      const reviews = await reviewsCollection.find().toArray();
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
    }
  };

  /**
   * @desc    Add Review
   * @route   POST /api/v1/reviews
   * @access  Private
   */
  const addReview = async (req, res) => {
    try {
      const review = req.body;
      review.reviewDate = new Date();
      
      const result = await reviewsCollection.insertOne(review);
      res.json({ success: true, message: 'Review added successfully', insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error adding review', error: error.message });
    }
  };

  /**
   * @desc    Update Review
   * @route   PATCH /api/v1/reviews/:id
   * @access  Private
   */
  const updateReview = async (req, res) => {
    try {
      const id = req.params.id;
      const review = req.body;
      
      const filter = { _id: new ObjectId(id), userEmail: req.decoded.email };
      const updateDoc = {
        $set: {
          ratingPoint: review.ratingPoint,
          reviewComment: review.reviewComment,
          reviewDate: new Date()
        }
      };
      
      const result = await reviewsCollection.updateOne(filter, updateDoc);
      
      if (result.matchedCount === 0) {
        return res.status(403).json({ success: false, message: 'Can only update your own reviews' });
      }
      
      res.json({ success: true, message: 'Review updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating review', error: error.message });
    }
  };

  /**
   * @desc    Delete Review
   * @route   DELETE /api/v1/reviews/:id
   * @access  Private
   */
  const deleteReview = async (req, res) => {
    try {
      const id = req.params.id;
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email: email });
      
      let query;
      if (user?.role === 'Moderator' || user?.role === 'Admin') {
        query = { _id: new ObjectId(id) };
      } else {
        query = { _id: new ObjectId(id), userEmail: email };
      }
      
      const result = await reviewsCollection.deleteOne(query);
      
      if (result.deletedCount === 0) {
        return res.status(403).json({ success: false, message: 'Cannot delete this review' });
      }
      
      res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting review', error: error.message });
    }
  };
  
  return {
    getReviewsByScholarship,
    getMyReviews,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
  };
};

module.exports = getReviewController;
