require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Controllers & routes & middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const getAuthController = require('./controllers/authController');
const getUserController = require('./controllers/userController');
const getScholarshipController = require('./controllers/scholarshipController');
const getApplicationController = require('./controllers/applicationController');
const getReviewController = require('./controllers/reviewController');
const getPaymentController = require('./controllers/paymentController');
const getAnalyticsController = require('./controllers/analyticsController');

const verifyToken = require('./middleware/verifyToken');
const verifyAdmin = require('./middleware/verifyAdmin');
const verifyModerator = require('./middleware/verifyModerator');

// Global cache to persist across Vercel invocations when possible
const globalCache = globalThis.__scholarStreamCache || (globalThis.__scholarStreamCache = {});

const ensureMongo = async () => {
  if (globalCache.client && globalCache.db) return { client: globalCache.client, db: globalCache.db };

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  const db = client.db('scholarStreamDB');
  // Verify connection
  await client.db('admin').command({ ping: 1 });

  globalCache.client = client;
  globalCache.db = db;
  return { client, db };
};

const buildAppOnce = async () => {
  if (globalCache.app) return globalCache.app;

  const app = express();

  // CORS
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.CLIENT_URL,
      ].filter(Boolean),
      credentials: true,
    })
  );
  app.use(express.json());

  // Health routes (work even before DB initialized)
  app.get('/', (req, res) => {
    res.send('ScholarStream Server (Vercel) is running!');
  });
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running (Vercel)' });
  });

  // Ensure Mongo and initialize feature routes once
  const { db } = await ensureMongo();

  const usersCollection = db.collection('users');
  const scholarshipsCollection = db.collection('scholarships');
  const applicationsCollection = db.collection('applications');
  const reviewsCollection = db.collection('reviews');

  const authController = getAuthController(usersCollection);
  const userController = getUserController(usersCollection);
  const scholarshipController = getScholarshipController(scholarshipsCollection);
  const applicationController = getApplicationController(applicationsCollection);
  const reviewController = getReviewController(reviewsCollection, usersCollection);
  const paymentController = getPaymentController();
  const analyticsController = getAnalyticsController(
    usersCollection,
    scholarshipsCollection,
    applicationsCollection
  );

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

  globalCache.app = app;
  return app;
};

// Returns a request handler suitable for Vercel serverless
const getHandler = async () => {
  const app = await buildAppOnce();
  return (req, res) => {
    app(req, res);
  };
};

module.exports = { getHandler };
