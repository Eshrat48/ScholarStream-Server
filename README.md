# 🎓 ScholarStream Server - Backend API

[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.18.2-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.3.0-brightgreen)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/stripe-14.14.0-purple)](https://stripe.com/)

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

- **Server**: [https://scholar-stream-server-beta-jet.vercel.app/]
- **Client**: [https://scholar-stream-client-five.vercel.app/]
- **Github Repository ( server )**: [https://github.com/Eshrat48/ScholarStream-Server.git]
- **Github Repository ( client )**: [https://github.com/Eshrat48/ScholarStream-Client.git]

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


## 👨‍💻 Developer

**Eshrat Kamal Nova**
- GitHub: [@Eshrat48](https://github.com/Eshrat48)
- Project: ScholarStream - Scholarship Management Platform



**Made with ❤️ for students seeking educational opportunities worldwide**
