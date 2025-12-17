# 🎓 ScholarStream Server - Backend API

[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.18.2-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.3.0-brightgreen)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/stripe-14.14.0-purple)](https://stripe.com/)

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Live URL](#-live-url)
- [Key Features](#-key-features)  
- [Technology Stack](#-technology-stack)
- [NPM Packages](#-npm-packages)
- [Database Collections](#-database-collections)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Scripts](#-scripts)

## 📚 Project Overview

**ScholarStream Server** is the backend API for the ScholarStream scholarship management platform. Built with Node.js, Express, and MongoDB, it provides RESTful endpoints for user authentication, scholarship management, application processing, payment integration, and analytics.

### Purpose
- Provide secure, scalable API for scholarship management
- Handle user authentication with JWT
- Process payments via Stripe
- Manage applications with role-based permissions
- Deliver analytics data for admin dashboard

### Architecture
- **RESTful API** design with Express.js
- **MongoDB** for flexible, schema-less data storage
- **JWT** for stateless authentication
- **Role-Based Access Control** (RBAC) with middleware
- **Stripe** integration for payment processing
- **Server-side** search, filter, sort, and pagination

## 🌐 Live URL

- **Server**: [YOUR_DEPLOYED_SERVER_URL_HERE]
- **Client**: [YOUR_DEPLOYED_CLIENT_URL_HERE]
- **GitHub Repository**: [YOUR_SERVER_REPO_URL_HERE]

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT Token Generation**: Secure token-based authentication
- **Role-Based Middleware**:
  - `verifyToken` - Validates JWT for all protected routes
  - `verifyAdmin` - Restricts access to Admin-only endpoints
  - `verifyModerator` - Restricts access to Moderator and Admin endpoints
- **Token Validation**: Automatic expiry and refresh handling

### 🎓 Scholarship Management
- **CRUD Operations**: Create, Read, Update, Delete scholarships
- **Server-Side Search**: By scholarship name, university name, degree
- **Advanced Filtering**: By category, subject, country, degree
- **Sorting**: By application fees, post date, deadline
- **Pagination**: Efficient data loading with page size control
- **Top Scholarships**: Fetch top 6 by lowest application fees

### 📝 Application System
- **Application Tracking**: Store and manage student applications
- **Status Management**: Pending → Processing → Completed / Rejected
- **Feedback System**: Moderators can add feedback to applications
- **Payment Status**: Track paid/unpaid applications
- **Edit & Delete**: Students can modify pending applications

### 💳 Payment Processing
- **Stripe Integration**: Secure payment intent creation
- **Payment Verification**: Server-side validation of payments
- **Failure Handling**: Save applications even on payment failure
- **Retry Mechanism**: Support for payment retry from dashboard

### ⭐ Review System
- **CRUD Operations**: Create, Read, Update, Delete reviews
- **Scholarship Association**: Link reviews to specific scholarships
- **User Association**: Track reviews by student email
- **Moderation**: Moderators can delete inappropriate reviews

### 👥 User Management
- **User CRUD**: Create, read, update, delete users
- **Role Management**: Admin can change user roles
- **User Filtering**: Filter users by role (Student/Moderator/Admin)
- **Profile Management**: Fetch and update user profiles

### 📊 Analytics
- **Platform Statistics**:
  - Total users count
  - Total scholarships count
  - Total fees collected (sum of paid applications)
- **Application Distribution**:
  - Applications by university (for bar chart)
  - Applications by scholarship category (for pie chart)

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | 6.3.0 | NoSQL database with MongoDB driver |
| **JWT** | 9.0.2 | JSON Web Token for authentication |
| **Stripe** | 14.14.0 | Payment processing |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.4.5 | Environment variable management |
| **Nodemon** | 3.0.2 | Development server with auto-restart |

## 📦 NPM Packages

### Dependencies
```json
{
  "express": "^4.18.2",           // Web framework for Node.js
  "mongodb": "^6.3.0",            // MongoDB driver for Node.js
  "cors": "^2.8.5",               // Enable CORS for cross-origin requests
  "dotenv": "^16.4.5",            // Load environment variables from .env
  "jsonwebtoken": "^9.0.2",       // JWT token generation and verification
  "stripe": "^14.14.0"            // Stripe payment processing SDK
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.2"             // Auto-restart server on file changes (development)
}
```

## 🗄️ Database Collections

The ScholarStream database uses **MongoDB Atlas** with the following collections:

### 1. Users Collection
Stores registered user information and roles.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,              // User's full name
  email: String,             // Unique email address (indexed)
  photoURL: String,          // Profile photo URL
  role: String,              // "Student" | "Moderator" | "Admin"
  createdAt: Date            // Registration timestamp
}
```

**Indexes:**
- `email` (unique)

### 2. Scholarships Collection
Stores scholarship listings posted by admins.

**Schema:**
```javascript
{
  _id: ObjectId,
  scholarshipName: String,        // Name of the scholarship
  universityName: String,         // University offering scholarship
  universityImage: String,        // University logo/image URL
  universityCountry: String,      // Country
  universityCity: String,         // City
  universityWorldRank: Number,    // World ranking
  subjectCategory: String,        // e.g., "Engineering", "Business"
  scholarshipCategory: String,    // "Full fund" | "Partial" | "Self-fund"
  degree: String,                 // "Diploma" | "Bachelor" | "Masters"
  tuitionFees: Number,            // Optional tuition fees
  applicationFees: Number,        // Application fee amount
  serviceCharge: Number,          // Service charge amount
  applicationDeadline: Date,      // Deadline for applications
  scholarshipPostDate: Date,      // Date scholarship was posted
  postedUserEmail: String,        // Email of admin who posted
  description: String             // Detailed scholarship description
}
```

**Indexes:**
- `scholarshipName` (text search)
- `universityName` (text search)
- `degree` (filter)
- `scholarshipCategory` (filter)

### 3. Applications Collection
Stores student scholarship applications.

**Schema:**
```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,        // Reference to scholarship
  userId: ObjectId,               // Reference to user
  userName: String,               // Applicant name
  userEmail: String,              // Applicant email (indexed)
  userPhoto: String,              // Applicant photo
  universityName: String,         // University name (denormalized)
  scholarshipCategory: String,    // Category (denormalized)
  degree: String,                 // Degree (denormalized)
  applicationFees: Number,        // Application fee
  serviceCharge: Number,          // Service charge
  applicationStatus: String,      // "pending" | "processing" | "completed" | "rejected"
  paymentStatus: String,          // "paid" | "unpaid"
  applicationDate: Date,          // Application submission date
  feedback: String                // Moderator feedback (optional)
}
```

**Indexes:**
- `userEmail` (for user's applications)
- `scholarshipId` (for scholarship applications)
- `applicationStatus` (for filtering)

### 4. Reviews Collection
Stores student reviews for completed applications.

**Schema:**
```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,        // Reference to scholarship
  universityName: String,         // University name (denormalized)
  userName: String,               // Reviewer name
  userEmail: String,              // Reviewer email (indexed)
  userImage: String,              // Reviewer photo
  ratingPoint: Number,            // Rating (1-5)
  reviewComment: String,          // Review text
  reviewDate: Date                // Review submission date
}
```

**Indexes:**
- `scholarshipId` (for scholarship reviews)
- `userEmail` (for user's reviews)

## 🚀 API Endpoints

### Base URL
```
Production: https://your-server.onrender.com/api/v1
Development: http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Generate JWT Token
```http
POST /auth/jwt
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Endpoints

#### Create New User (Registration)
```http
POST /users
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/photo.jpg",
  "role": "Student"
}
```
**Response:** `201 Created`

#### Get User by Email
```http
GET /users/:email
```
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://...",
  "role": "Student",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### Get All Users (Admin Only)
```http
GET /users
```
**Headers:** `Authorization: Bearer <token>`  
**Query Params:** `?role=Student` (optional filter)  
**Response:** Array of user objects

#### Update User Role (Admin Only)
```http
PATCH /users/:id/role
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "role": "Moderator"
}
```
**Response:** `200 OK`

#### Delete User (Admin Only)
```http
DELETE /users/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** `200 OK`

---

### Scholarship Endpoints

#### Get All Scholarships (with Search, Filter, Sort, Pagination)
```http
GET /scholarships
```
**Query Parameters:**
- `search` - Search by name, university, degree
- `category` - Filter by scholarship category
- `subject` - Filter by subject category
- `country` - Filter by country
- `degree` - Filter by degree level
- `sortBy` - `fees` | `date`
- `order` - `asc` | `desc`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```http
GET /scholarships?search=engineering&category=Full%20fund&sortBy=fees&order=asc&page=1&limit=10
```

**Response:**
```json
{
  "scholarships": [ ... ],
  "totalCount": 45,
  "totalPages": 5,
  "currentPage": 1
}
```

#### Get Top 6 Scholarships (by lowest fees)
```http
GET /scholarships/top
```
**Response:** Array of 6 scholarship objects

#### Get Scholarship by ID
```http
GET /scholarships/:id
```
**Response:** Single scholarship object

#### Get Scholarships by Category
```http
GET /scholarships/category/:category
```
**Example:** `/scholarships/category/Full%20fund`  
**Response:** Array of scholarships

#### Add Scholarship (Admin Only)
```http
POST /scholarships
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Full scholarship object  
**Response:** `201 Created`

#### Update Scholarship (Admin Only)
```http
PUT /scholarships/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Partial scholarship updates allowed  
**Response:** `200 OK`

#### Delete Scholarship (Admin Only)
```http
DELETE /scholarships/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** `200 OK`

---

### Application Endpoints

#### Create Application
```http
POST /applications
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Application object  
**Response:** `201 Created`

#### Get User Applications
```http
GET /applications/user/:email
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array of user's applications

#### Get All Applications (Moderator/Admin)
```http
GET /applications
```
**Headers:** `Authorization: Bearer <token>`  
**Query Params:** `?status=pending` (optional)  
**Response:** Array of all applications

#### Update Application Status (Moderator/Admin)
```http
PATCH /applications/:id/status
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "status": "processing"
}
```
**Response:** `200 OK`

#### Add Feedback (Moderator/Admin)
```http
PATCH /applications/:id/feedback
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "feedback": "Your application is under review..."
}
```
**Response:** `200 OK`

#### Update Payment Status
```http
PATCH /applications/:id/payment
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "paymentStatus": "paid"
}
```
**Response:** `200 OK`

#### Update Application (Student)
```http
PUT /applications/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Partial updates allowed  
**Response:** `200 OK`

#### Delete Application (Student)
```http
DELETE /applications/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** `200 OK`

---

### Review Endpoints

#### Get Reviews by Scholarship
```http
GET /reviews/scholarship/:scholarshipId
```
**Response:** Array of review objects

#### Get User Reviews
```http
GET /reviews/user/:email
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array of review objects

#### Get All Reviews (Moderator/Admin)
```http
GET /reviews
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array of all reviews

#### Add Review
```http
POST /reviews
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Review object  
**Response:** `201 Created`

#### Update Review
```http
PUT /reviews/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Updated review  
**Response:** `200 OK`

#### Delete Review
```http
DELETE /reviews/:id
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** `200 OK`

---

### Payment Endpoints

#### Create Stripe Payment Intent
```http
POST /payments/create-payment-intent
```
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "amount": 120,
  "scholarshipName": "Engineering Excellence",
  "userEmail": "john@example.com"
}
```
**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy"
}
```

---

### Analytics Endpoints (Admin Only)

#### Get Dashboard Statistics
```http
GET /analytics/stats
```
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "totalUsers": 150,
  "totalScholarships": 45,
  "totalFeesCollected": 12500
}
```

#### Get Applications by University
```http
GET /analytics/applications-by-university
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array with university names and application counts

#### Get Applications by Category
```http
GET /analytics/applications-by-category
```
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array with categories and application counts

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Stripe Account** - [Sign up](https://dashboard.stripe.com/register)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone YOUR_SERVER_REPO_URL_HERE
cd scholar-stream-server
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/scholarstream?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**How to Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click **Connect** → **Connect your application**
4. Copy connection string and replace `<username>`, `<password>`, and database name

**How to Get Stripe Secret Key:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API Keys**
3. Copy **Secret key** (sk_test_... for test mode)

#### 4. Start Development Server
```bash
npm run dev
```
Server will run at `http://localhost:5000`

#### 5. Start Production Server
```bash
npm start
```

#### 6. Create Admin User (Optional)
```bash
node scripts/createAdmin.js
```

## 🔧 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key_at_least_32_chars` | ✅ Yes |
| `JWT_EXPIRES_IN` | JWT token expiry duration | `7d` (7 days) | ❌ No |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` or `sk_live_...` | ✅ Yes |
| `PORT` | Server port number | `5000` | ❌ No |
| `NODE_ENV` | Environment mode | `development` or `production` | ❌ No |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` | ✅ Yes |

## 🔐 Authentication & Authorization

### JWT Token Flow
1. **User Login** → Frontend sends email to `/api/v1/auth/jwt`
2. **Token Generation** → Server creates JWT with email and role
3. **Token Storage** → Frontend stores in `localStorage`
4. **Token Verification** → Middleware validates on each protected route

### Middleware Architecture

```javascript
// verifyToken.js - Base authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  });
};

// verifyAdmin.js - Admin-only routes
const verifyAdmin = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.user.email });
  if (user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// verifyModerator.js - Moderator and Admin routes
const verifyModerator = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.user.email });
  if (!['Moderator', 'Admin'].includes(user?.role)) {
    return res.status(403).json({ message: 'Forbidden: Moderator access required' });
  }
  next();
};
```

## 🚀 Deployment

### Recommended Platforms
- **Render** - [https://render.com/](https://render.com/)
- **Railway** - [https://railway.app/](https://railway.app/)
- **Heroku** - [https://www.heroku.com/](https://www.heroku.com/)

### Deployment Steps (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables
6. Deploy

### Post-Deployment Checklist
- ✅ All environment variables set
- ✅ `CLIENT_URL` points to deployed frontend
- ✅ MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- ✅ Stripe keys updated (test or live mode)
- ✅ CORS configured for frontend domain
- ✅ Test all endpoints

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoNetworkError: failed to connect`

**Solutions:**
1. Check `MONGODB_URI` in `.env`
2. Verify MongoDB Atlas cluster is running
3. Add IP to Atlas Network Access (0.0.0.0/0 for production)
4. Ensure MongoDB user has correct permissions

### JWT Verification Error
**Error:** `JsonWebTokenError: invalid signature`

**Solutions:**
1. Verify `JWT_SECRET` is consistent
2. Check token format: `Authorization: Bearer <token>`
3. Ensure token hasn't expired
4. Clear localStorage and re-login

### Stripe Payment Error
**Error:** `StripeAuthenticationError: Invalid API Key`

**Solutions:**
1. Check `STRIPE_SECRET_KEY` in `.env`
2. Use secret key (sk_...) not publishable key (pk_...)
3. Verify Stripe account is active

### CORS Error
**Error:** `Access-Control-Allow-Origin header is missing`

**Solutions:**
1. Check `CLIENT_URL` matches frontend URL exactly
2. Verify CORS middleware is configured
3. Ensure server is running and accessible

## 📝 Scripts

```bash
# Development
npm run dev              # Start with nodemon (auto-restart)

# Production
npm start                # Start with node

# Database Scripts
node scripts/createAdmin.js       # Create admin user
node scripts/createModerator.js   # Create moderator user
node seed/seedData.js             # Seed sample data
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the **ISC License**.

## 👨‍💻 Developer

**Eshrat Jahan**
- GitHub: [@Eshrat48](https://github.com/Eshrat48)
- Project: ScholarStream - Scholarship Management Platform

## 🙏 Acknowledgments

- **MongoDB Atlas** - Cloud database hosting
- **Stripe** - Payment processing
- **JWT** - Secure authentication
- **Express.js** - Web framework
- **Programming Hero** - Project inspiration

## 📚 Related Documentation

- **Client Repository**: [ScholarStream-Client](https://github.com/Eshrat48/ScholarStream-Client)
- **MongoDB Docs**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Stripe API**: [https://stripe.com/docs/api](https://stripe.com/docs/api)
- **JWT**: [https://jwt.io/](https://jwt.io/)
- **Express**: [https://expressjs.com/](https://expressjs.com/)

---

**Made with ❤️ for students seeking educational opportunities worldwide**
