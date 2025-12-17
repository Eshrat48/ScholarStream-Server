require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import Controllers
const getAuthController = require('./controllers/authController');
const getUserController = require('./controllers/userController');
const getScholarshipController = require('./controllers/scholarshipController');
const getApplicationController = require('./controllers/applicationController');
const getReviewController = require('./controllers/reviewController');
const getPaymentController = require('./controllers/paymentController');
const getAnalyticsController = require('./controllers/analyticsController');

// Import Middleware
const verifyToken = require('./middleware/verifyToken');
const verifyAdmin = require('./middleware/verifyAdmin');
const verifyModerator = require('./middleware/verifyModerator');

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

// Health Check Routes
app.get('/', (req, res) => {
  res.send('ScholarStream Server is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Main Server Initialization
async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const db = client.db('scholarStreamDB');

    // Collections
    const usersCollection = db.collection('users');
    const scholarshipsCollection = db.collection('scholarships');
    const applicationsCollection = db.collection('applications');
    const reviewsCollection = db.collection('reviews');

    // Initialize Controllers with Collections
    const authController = getAuthController(usersCollection);
    const userController = getUserController(usersCollection);
    const scholarshipController = getScholarshipController(scholarshipsCollection);
    const applicationController = getApplicationController(applicationsCollection);
    const reviewController = getReviewController(reviewsCollection, usersCollection);
    const paymentController = getPaymentController();
    const analyticsController = getAnalyticsController(usersCollection, scholarshipsCollection, applicationsCollection);

    // Initialize Role Middlewares
    const adminOnly = verifyAdmin(usersCollection);
    const moderatorOrAdmin = verifyModerator(usersCollection);

    // Auth Routes
    authRoutes.post('/jwt', authController.generateToken);
    app.use('/api/v1/auth', authRoutes);

    // User Routes
    userRoutes.post('/', userController.createUser);
    userRoutes.get('/:email', verifyToken, userController.getUserByEmail);
    userRoutes.get('/', verifyToken, adminOnly, userController.getAllUsers);
    userRoutes.patch('/:id/role', verifyToken, adminOnly, userController.updateUserRole);
    userRoutes.patch('/:id', verifyToken, userController.updateUser);
    userRoutes.delete('/:id', verifyToken, adminOnly, userController.deleteUser);
    app.use('/api/v1/users', userRoutes);

    // Scholarship Routes
    scholarshipRoutes.get('/top', scholarshipController.getTopScholarships);
    scholarshipRoutes.get('/category/:category', scholarshipController.getByCategory);
    scholarshipRoutes.get('/', scholarshipController.getAllScholarships);
    scholarshipRoutes.get('/:id', scholarshipController.getScholarshipById);
    scholarshipRoutes.post('/', verifyToken, adminOnly, scholarshipController.addScholarship);
    scholarshipRoutes.patch('/:id', verifyToken, adminOnly, scholarshipController.updateScholarship);
    scholarshipRoutes.delete('/:id', verifyToken, adminOnly, scholarshipController.deleteScholarship);
    app.use('/api/v1/scholarships', scholarshipRoutes);

    // Application Routes
    applicationRoutes.post('/', verifyToken, applicationController.createApplication);
    applicationRoutes.get('/user/:email', verifyToken, applicationController.getMyApplications);
    applicationRoutes.get('/', verifyToken, moderatorOrAdmin, applicationController.getAllApplications);
    applicationRoutes.patch('/:id/status', verifyToken, moderatorOrAdmin, applicationController.updateApplicationStatus);
    applicationRoutes.patch('/:id/feedback', verifyToken, moderatorOrAdmin, applicationController.addFeedback);
    applicationRoutes.patch('/:id/payment', verifyToken, applicationController.updatePaymentStatus);
    applicationRoutes.patch('/:id', verifyToken, applicationController.updateApplication);
    applicationRoutes.delete('/:id', verifyToken, applicationController.deleteApplication);
    app.use('/api/v1/applications', applicationRoutes);

    // Review Routes
    reviewRoutes.get('/scholarship/:scholarshipId', reviewController.getReviewsByScholarship);
    reviewRoutes.get('/user/:email', verifyToken, reviewController.getMyReviews);
    reviewRoutes.get('/', verifyToken, moderatorOrAdmin, reviewController.getAllReviews);
    reviewRoutes.post('/', verifyToken, reviewController.addReview);
    reviewRoutes.patch('/:id', verifyToken, reviewController.updateReview);
    reviewRoutes.delete('/:id', verifyToken, reviewController.deleteReview);
    app.use('/api/v1/reviews', reviewRoutes);

    // Payment Routes
    paymentRoutes.post('/create-payment-intent', verifyToken, paymentController.createPaymentIntent);
    app.use('/api/v1/payments', paymentRoutes);

    // Analytics Routes
    analyticsRoutes.get('/stats', verifyToken, adminOnly, analyticsController.getDashboardStats);
    analyticsRoutes.get('/applications-series', verifyToken, adminOnly, analyticsController.getApplicationsSeries);
    analyticsRoutes.get('/top-scholarships', verifyToken, adminOnly, analyticsController.getTopScholarships);
    analyticsRoutes.get('/applications-by-university', verifyToken, adminOnly, analyticsController.getApplicationsByUniversity);
    analyticsRoutes.get('/applications-by-category', verifyToken, adminOnly, analyticsController.getApplicationsByCategory);
    app.use('/api/v1/analytics', analyticsRoutes);

    // Verify MongoDB connection
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB connection verified!');
    console.log('✅ All routes initialized successfully!');

    let server;
    const startServer = (startPort) => {
      server = app.listen(startPort, () => {
        console.log(`🚀 ScholarStream Server running on port ${startPort}`);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          const nextPort = (parseInt(startPort, 10) || 5000) + 1;
          console.warn(`⚠️ Port ${startPort} in use, retrying on ${nextPort}...`);
          startServer(nextPort);
        } else {
          console.error('❌ Server error:', err);
          process.exit(1);
        }
      });
    };
    startServer(port);

    // Keep server alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        client.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    let server;
    const startServer = (startPort) => {
      server = app.listen(startPort, () => {
        console.log(`⚠️ Server started on port ${startPort} (MongoDB connection failed)`);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          const nextPort = (parseInt(startPort, 10) || 5000) + 1;
          console.warn(`⚠️ Port ${startPort} in use, retrying on ${nextPort}...`);
          startServer(nextPort);
        } else {
          console.error('❌ Server error:', err);
          process.exit(1);
        }
      });
    };
    startServer(port);
  }
}

run().catch(console.error);
