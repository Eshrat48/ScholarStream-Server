require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  
  const token = authorization.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    req.decoded = decoded;
    next();
  });
};

// Verify Admin Middleware
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  
  if (user?.role !== 'Admin') {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
};

// Verify Moderator Middleware
const verifyModerator = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  
  if (user?.role !== 'Moderator' && user?.role !== 'Admin') {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
};

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');

    // Collections
    const database = client.db('scholarStreamDB');
    const usersCollection = database.collection('users');
    const scholarshipsCollection = database.collection('scholarships');
    const applicationsCollection = database.collection('applications');
    const reviewsCollection = database.collection('reviews');

    // Make collections available globally for middleware
    global.usersCollection = usersCollection;

    // ============================================
    // JWT Token Routes
    // ============================================
    
    // Generate JWT Token
    app.post('/api/auth/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    });

    // ============================================
    // User Routes
    // ============================================
    
    // Create or Update User
    app.post('/api/users', async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        
        if (existingUser) {
          return res.send({ message: 'User already exists', insertedId: null });
        }
        
        // Set default role as Student
        user.role = 'Student';
        user.createdAt = new Date();
        
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error creating user', error: error.message });
      }
    });

    // Get User by Email
    app.get('/api/users/:email', verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: 'Forbidden access' });
        }
        
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching user', error: error.message });
      }
    });

    // Get All Users (Admin only)
    app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const role = req.query.role;
        let query = {};
        
        if (role) {
          query.role = role;
        }
        
        const users = await usersCollection.find(query).toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching users', error: error.message });
      }
    });

    // Update User Role (Admin only)
    app.patch('/api/users/:id/role', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const { role } = req.body;
        
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { role: role }
        };
        
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating user role', error: error.message });
      }
    });

    // Delete User (Admin only)
    app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error: error.message });
      }
    });

    // ============================================
    // Scholarship Routes
    // ============================================
    
    // Get All Scholarships (with pagination, search, filter, sort)
    app.get('/api/scholarships', async (req, res) => {
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
        
        res.send({
          scholarships,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalScholarships: total
        });
      } catch (error) {
        res.status(500).send({ message: 'Error fetching scholarships', error: error.message });
      }
    });

    // Get Top Scholarships (for home page)
    app.get('/api/scholarships/top', async (req, res) => {
      try {
        const scholarships = await scholarshipsCollection
          .find()
          .sort({ applicationFees: 1 })
          .limit(6)
          .toArray();
        res.send(scholarships);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching top scholarships', error: error.message });
      }
    });

    // Get Scholarship by ID
    app.get('/api/scholarships/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const scholarship = await scholarshipsCollection.findOne(query);
        res.send(scholarship);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching scholarship', error: error.message });
      }
    });

    // Get Scholarships by Category (for recommendations)
    app.get('/api/scholarships/category/:category', async (req, res) => {
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
        res.send(scholarships);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching scholarships by category', error: error.message });
      }
    });

    // Add Scholarship (Admin only)
    app.post('/api/scholarships', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const scholarship = req.body;
        scholarship.scholarshipPostDate = new Date();
        const result = await scholarshipsCollection.insertOne(scholarship);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error adding scholarship', error: error.message });
      }
    });

    // Update Scholarship (Admin only)
    app.put('/api/scholarships/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const scholarship = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: scholarship
        };
        const result = await scholarshipsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating scholarship', error: error.message });
      }
    });

    // Delete Scholarship (Admin only)
    app.delete('/api/scholarships/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await scholarshipsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error deleting scholarship', error: error.message });
      }
    });

    // ============================================
    // Application Routes
    // ============================================
    
    // Create Application
    app.post('/api/applications', verifyToken, async (req, res) => {
      try {
        const application = req.body;
        application.applicationDate = new Date();
        application.applicationStatus = 'pending';
        application.feedback = '';
        
        const result = await applicationsCollection.insertOne(application);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error creating application', error: error.message });
      }
    });

    // Get Applications by User Email
    app.get('/api/applications/user/:email', verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: 'Forbidden access' });
        }
        
        const query = { userEmail: email };
        const applications = await applicationsCollection.find(query).toArray();
        res.send(applications);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching applications', error: error.message });
      }
    });

    // Get All Applications (Moderator/Admin only)
    app.get('/api/applications', verifyToken, verifyModerator, async (req, res) => {
      try {
        const applications = await applicationsCollection.find().toArray();
        res.send(applications);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching applications', error: error.message });
      }
    });

    // Update Application Status (Moderator/Admin only)
    app.patch('/api/applications/:id/status', verifyToken, verifyModerator, async (req, res) => {
      try {
        const id = req.params.id;
        const { applicationStatus } = req.body;
        
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { applicationStatus: applicationStatus }
        };
        
        const result = await applicationsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating application status', error: error.message });
      }
    });

    // Add Feedback to Application (Moderator/Admin only)
    app.patch('/api/applications/:id/feedback', verifyToken, verifyModerator, async (req, res) => {
      try {
        const id = req.params.id;
        const { feedback } = req.body;
        
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { feedback: feedback }
        };
        
        const result = await applicationsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error adding feedback', error: error.message });
      }
    });

    // Update Application (Student only - pending status)
    app.put('/api/applications/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const application = req.body;
        
        const filter = { _id: new ObjectId(id), userEmail: req.decoded.email, applicationStatus: 'pending' };
        const updateDoc = {
          $set: application
        };
        
        const result = await applicationsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating application', error: error.message });
      }
    });

    // Delete Application (Student only - pending status)
    app.delete('/api/applications/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { 
          _id: new ObjectId(id), 
          userEmail: req.decoded.email, 
          applicationStatus: 'pending' 
        };
        const result = await applicationsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error deleting application', error: error.message });
      }
    });

    // Update Payment Status
    app.patch('/api/applications/:id/payment', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const { paymentStatus } = req.body;
        
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { paymentStatus: paymentStatus }
        };
        
        const result = await applicationsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating payment status', error: error.message });
      }
    });

    // ============================================
    // Review Routes
    // ============================================
    
    // Get Reviews by Scholarship ID
    app.get('/api/reviews/scholarship/:scholarshipId', async (req, res) => {
      try {
        const scholarshipId = req.params.scholarshipId;
        const query = { scholarshipId: scholarshipId };
        const reviews = await reviewsCollection.find(query).sort({ reviewDate: -1 }).toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching reviews', error: error.message });
      }
    });

    // Get Reviews by User Email
    app.get('/api/reviews/user/:email', verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: 'Forbidden access' });
        }
        
        const query = { userEmail: email };
        const reviews = await reviewsCollection.find(query).toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching reviews', error: error.message });
      }
    });

    // Get All Reviews (Moderator/Admin)
    app.get('/api/reviews', verifyToken, verifyModerator, async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching reviews', error: error.message });
      }
    });

    // Add Review
    app.post('/api/reviews', verifyToken, async (req, res) => {
      try {
        const review = req.body;
        review.reviewDate = new Date();
        
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error adding review', error: error.message });
      }
    });

    // Update Review
    app.put('/api/reviews/:id', verifyToken, async (req, res) => {
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
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error updating review', error: error.message });
      }
    });

    // Delete Review
    app.delete('/api/reviews/:id', verifyToken, async (req, res) => {
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
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error deleting review', error: error.message });
      }
    });

    // ============================================
    // Payment Routes (Stripe)
    // ============================================
    
    // Create Payment Intent
    app.post('/api/create-payment-intent', verifyToken, async (req, res) => {
      try {
        const { amount } = req.body;
        const amountInCents = parseInt(amount * 100);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          payment_method_types: ['card']
        });
        
        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        res.status(500).send({ message: 'Error creating payment intent', error: error.message });
      }
    });

    // ============================================
    // Analytics Routes (Admin only)
    // ============================================
    
    // Get Dashboard Statistics
    app.get('/api/analytics/stats', verifyToken, verifyAdmin, async (req, res) => {
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
        
        res.send({
          totalUsers,
          totalScholarships,
          totalApplications,
          totalFeesCollected: totalFeesCollected.toFixed(2)
        });
      } catch (error) {
        res.status(500).send({ message: 'Error fetching statistics', error: error.message });
      }
    });

    // Get Application Stats by University
    app.get('/api/analytics/applications-by-university', verifyToken, verifyAdmin, async (req, res) => {
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
        
        res.send(stats);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching application stats', error: error.message });
      }
    });

    // Get Application Stats by Scholarship Category
    app.get('/api/analytics/applications-by-category', verifyToken, verifyAdmin, async (req, res) => {
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
        
        res.send(stats);
      } catch (error) {
        res.status(500).send({ message: 'Error fetching category stats', error: error.message });
      }
    });

    // ============================================
    // Health Check Route
    // ============================================
    
    app.get('/', (req, res) => {
      res.send('ScholarStream Server is running!');
    });

    console.log('All routes initialized successfully!');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`ScholarStream Server is running on port ${port}`);
});
